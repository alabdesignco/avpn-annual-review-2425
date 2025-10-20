const initCircularBarChart = () => {
  const data = [
    { cause: "Affordable Housing", count: 105, percent: 17 },
    { cause: "Ageing", count: 109, percent: 17 },
    { cause: "Agriculture", count: 226, percent: 36 },
    { cause: "Arts & Culture", count: 132, percent: 21 },
    { cause: "Climate Action & Environment", count: 385, percent: 61 },
    { cause: "Conservation", count: 129, percent: 20 },
    { cause: "Education", count: 396, percent: 63 },
    { cause: "Employability", count: 243, percent: 38 },
    { cause: "Energy", count: 193, percent: 31 },
    { cause: "Financial Inclusion", count: 232, percent: 37 },
    { cause: "Gender", count: 260, percent: 41 },
    { cause: "Governance", count: 130, percent: 21 },
    { cause: "Health", count: 333, percent: 53 },
    { cause: "Livelihood and Poverty Alleviation", count: 350, percent: 55 },
    { cause: "Nutrition", count: 143, percent: 23 },
    { cause: "Water & Sanitation & Hygiene", count: 185, percent: 29 }
  ];

  const getColor = (name) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

  const colorMap = {
    "Education": getColor("--color-education"),
    "Climate Action & Environment": getColor("--color-climate"),
    "Livelihood and Poverty Alleviation": getColor("--color-livelihood"),
    "Health": getColor("--color-health"),
    "Employability": getColor("--color-employability"),
    "Gender": getColor("--color-gender"),
    "Financial Inclusion": getColor("--color-financial-inclusion"),
    "Agriculture": getColor("--color-agriculture"),
    "Energy": getColor("--color-energy"),
    "Water & Sanitation & Hygiene": getColor("--color-water"),
    "Nutrition": getColor("--color-nutrition"),
    "Arts & Culture": getColor("--color-arts"),
    "Governance": getColor("--color-governance"),
    "Conservation": getColor("--color-conservation"),
    "Ageing": getColor("--color-aging"),
    "Affordable Housing": getColor("--color-affordable-housing"),
  };


  const drawChart = () => {
    const containerEl = document.querySelector(".supported-chart");
    const size = containerEl.offsetWidth;
    const width = size;
    const height = size;
    const innerRadius = size * 0.15;

    d3.select(".supported-chart svg").remove();

    const svg = d3.select(".supported-chart")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%")
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().sort(null).value(1);
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => innerRadius + (d.data.percent * size * 0.0045))
      .cornerRadius(10)
      .padAngle(0.03);

    const arcs = svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("fill", d => colorMap[d.data.cause] || "#ccc")
      .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(innerRadius))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    const animateBars = () => {
      arcs.transition()
        .delay((d, i) => i * 100)
        .duration(800)
        .ease(d3.easeCubicOut)
        .attrTween("d", function(d) {
          const i = d3.interpolate(innerRadius, innerRadius + (d.data.percent * size * 0.0045));
          return function(t) {
            return d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(i(t))
              .cornerRadius(10)
              .padAngle(0.03)(d);
          };
        });
    };

    gsap.timeline({
      scrollTrigger: {
        trigger: ".supported-chart",
        start: "top 80%",
        once: true
      }
    }).add(() => animateBars());

    const wrapText = (text, maxWidth) => {
      const words = text.split(/\s+/);
      
      if (words.length <= 2) {
        return [text];
      }
      
      const metrics = document.createElement("canvas").getContext("2d");
      metrics.font = `700 ${size * 0.020}px sans-serif`;
      
      let midPoint = Math.ceil(words.length / 2);
      let line1 = words.slice(0, midPoint).join(" ");
      let line2 = words.slice(midPoint).join(" ");
      
      while (midPoint > 1 && (metrics.measureText(line1).width > maxWidth || metrics.measureText(line2).width > maxWidth)) {
        midPoint--;
        line1 = words.slice(0, midPoint).join(" ");
        line2 = words.slice(midPoint).join(" ");
      }
      
      return [line1, line2];
    };

    const centerGroup = svg.append("g")
      .attr("class", "supported-chart_center-text")
      .style("pointer-events", "none");

    const centerCause = centerGroup.append("text")
      .attr("class", "center-cause")
      .attr("opacity", 0)
      .style("font-size", `${size * 0.020}px`)
      .style("font-weight", "700")
      .style("fill", "var(--color-scheme-1--text)")
      .style("text-anchor", "middle");

    centerGroup.append("text")
      .attr("class", "center-percent")
      .attr("y", size * 0.025)
      .attr("opacity", 0)
      .style("font-size", `${size * 0.018}px`)
      .style("font-weight", "700")
      .style("fill", "var(--_primitives---brand--primary--navy-medium)")
      .style("text-anchor", "middle");

    arcs
      .on("mouseover", function(event, d) {
        svg.selectAll("path").transition().duration(200).style("opacity", 0.3);
        d3.select(this).transition().duration(200).style("opacity", 1);

        const lines = wrapText(d.data.cause, innerRadius * 1.8);
        const lineHeight = size * 0.02;
        const bottomMargin = lines.length > 1 ? size * 0.008 : 0;
        const startY = -(lines.length - 1) * lineHeight / 2 - size * 0.01 - bottomMargin;

        centerCause.selectAll("*").remove();
        lines.forEach((line, i) => {
          centerCause.append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? 0 : lineHeight)
            .text(line);
        });
        centerCause.attr("y", startY).transition().duration(200).style("opacity", 1);

        centerGroup.select(".center-percent")
          .text(`${d.data.percent}%`)
          .transition().duration(200).style("opacity", 1);
      })
      .on("mouseout", function() {
        svg.selectAll("path").transition().duration(200).style("opacity", 1);
        centerGroup.selectAll("text").transition().duration(200).style("opacity", 0);
      });

    document.querySelectorAll(".supported-chart_legend-color").forEach((el) => {
      const index = parseInt(el.dataset.index);
      const cause = data[index]?.cause;
      if (!cause) return;

      const color = colorMap[cause];
      if (color) {
        el.style.backgroundColor = color;
      }
    });

    const slices = svg.selectAll("path");

    document.querySelectorAll(".supported-chart_legend-item").forEach((item) => {
      const index = parseInt(
        item.querySelector(".supported-chart_legend-color").dataset.index
      );

      item.addEventListener("mouseenter", () => {
        slices.transition().duration(200).style("opacity", 0.3);
        d3.select(slices.nodes()[index]).transition().duration(200).style("opacity", 1);

        const d = data[index];
        const lines = wrapText(d.cause, innerRadius * 1.8);
        const lineHeight = size * 0.02;
        const bottomMargin = lines.length > 1 ? size * 0.008 : 0;
        const startY = -(lines.length - 1) * lineHeight / 2 - size * 0.01 - bottomMargin;

        centerCause.selectAll("*").remove();
        lines.forEach((line, i) => {
          centerCause.append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? 0 : lineHeight)
            .text(line);
        });
        centerCause.attr("y", startY).transition().duration(200).style("opacity", 1);

        centerGroup.select(".center-percent").text(`${d.percent}%`)
          .transition().duration(200).style("opacity", 1);
      });

      item.addEventListener("mouseleave", () => {
        slices.transition().duration(200).style("opacity", 1);
        centerGroup.selectAll("text").transition().duration(200).style("opacity", 0);
      });
    });
  };

  drawChart();
  window.addEventListener("resize", drawChart);
};

export { initCircularBarChart };