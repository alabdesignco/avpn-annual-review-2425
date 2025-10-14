const initTreeMapChart = () => {
  const data = {
    name: "Beneficiary Communities",
    children: [
      { name: "Children & youths", value: 433, percent: 68.48 },
      { name: "Women & girls", value: 413, percent: 65.35 },
      { name: "People in poverty", value: 397, percent: 62.82 },
      { name: "Environment", value: 306, percent: 48.42 },
      { name: "People without employment", value: 257, percent: 40.67 },
      { name: "People with disabilities", value: 208, percent: 32.91 },
      { name: "Elderly", value: 198, percent: 31.33 },
      { name: "People with medical needs", value: 198, percent: 31.33 },
      { name: "Ethnic minorities", value: 182, percent: 28.80 },
      { name: "Immigrants & asylum seekers & refugees", value: 112, percent: 17.72 },
      { name: "Offenders & re-offenders", value: 47, percent: 7.44 }
    ]
  };

  const container = document.querySelector(".beneficiary-treemap");
  const width = container.clientWidth || 1000;
  const height = container.clientHeight || 600;
  const gap = 8;

  container.innerHTML = "";

  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("width", "100%")
    .style("height", "100%");

  const colorMap = {
    "Children & youths": "#00B3AD",
    "Women & girls": "#F17C38",
    "People in poverty": "#FED452",
    "Environment": "#ADD5E0",
    "People without employment": "#4AC1BE",
    "People with disabilities": "#002943",
    "Elderly": "#F59D6A",
    "People with medical needs": "#FEE07E",
    "Ethnic minorities": "#86D1D1",
    "Immigrants & asylum seekers & refugees": "#80BDB4",
    "Offenders & re-offenders": "#F2948C",
  };

  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .paddingInner(gap)
    .round(true)(root);

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`)
    .style("cursor", "pointer")
    .style("opacity", 0);

  const getTextColor = (hex) => {
    const c = d3.color(hex);
    const lum = 0.2126*(c.r/255) + 0.7152*(c.g/255) + 0.0722*(c.b/255);
    return lum > 0.6 ? "#002943" : "#ffffff";
  };

  const wrap = (text, width) => {
    text.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word, line = [], lineNumber = 0;
      const lineHeight = 1.1;
      const y = text.attr("y");
      let tspan = text.text(null)
        .append("tspan")
        .attr("x", 16)
        .attr("y", y);
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", 16)
            .attr("y", y)
            .attr("dy", `${++lineNumber * lineHeight}em`)
            .text(word);
        }
      }
    });
  };

  leaf.each(function(d) {
    const g = d3.select(this);
    const fill = colorMap[d.data.name] || "#ccc";
    const textColor = getTextColor(fill);
    const boxW = d.x1 - d.x0;
    const boxH = d.y1 - d.y0;

    const rect = g.append("rect")
      .attr("fill", fill)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("width", boxW)
      .attr("height", boxH)
      .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.05))")
      .style("transform-origin", `${boxW / 2}px ${boxH / 2}px`);

    gsap.set(rect.node(), { scale: 1 });

    g.on("mouseenter", () => {
      g.raise();
      gsap.to(rect.node(), {
        scale: 1.05,
        duration: 0.25,
        ease: "power2.out"
      });
      gsap.to(rect.node(), {
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        duration: 0.25,
        ease: "power2.out"
      });
    }).on("mouseleave", () => {
      gsap.to(rect.node(), {
        scale: 1,
        duration: 0.25,
        ease: "power2.out"
      });
      gsap.to(rect.node(), {
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.05))",
        duration: 0.25,
        ease: "power2.out"
      });
    });

    const label = g.append("text")
      .attr("x", 16)
      .attr("y", 24)
      .attr("fill", textColor)
      .attr("font-size", "16px")
      .attr("font-weight", 600)
      .text(d.data.name)
      .call(wrap, boxW - 32);

    if (label.node().getBBox().height > boxH * 0.6) label.style("display","none");

    if (boxH > 40 && boxW > 80) {
      g.append("text")
        .attr("x", boxW - 16)
        .attr("y", boxH - 12)
        .attr("text-anchor", "end")
        .attr("fill", textColor)
        .attr("font-size", "12px")
        .text(`${d.data.percent.toFixed(2)}%`);
    }
  });

  gsap.to(leaf.nodes(), {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.08,
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
};

export { initTreeMapChart };