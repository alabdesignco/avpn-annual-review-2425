const initTreeMapChart = () => {
  const data = {
    name: "Beneficiary Communities",
    children: [
      { name: "Children & Youths", value: 436, percent: 69 },
      { name: "Women & Girls", value: 411, percent: 65 },
      { name: "People in Poverty", value: 398, percent: 63 },
      { name: "Environment", value: 303, percent: 48 },
      { name: "People without Employment", value: 259, percent: 41 },
      { name: "People with Disabilities", value: 208, percent: 33 },
      { name: "Elderly", value: 196, percent: 31 },
      { name: "People with Medical Needs", value: 196, percent: 31 },
      { name: "Ethnic Minorities", value: 183, percent: 29 },
      { name: "Immigrants, Asylum Seekers & Refugees", value: 114, percent: 18 },
      { name: "Offenders & Re-Offenders", value: 44, percent: 7 }
    ]
  };

  const container = document.querySelector(".beneficiary-treemap");
  if (!container) return;

  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions;

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
    "Children & Youths": "#00B3AD",
    "Women & Girls": "#F17C38",
    "People in Poverty": "#FED452",
    "Environment": "#ADD5E0",
    "People without Employment": "#4AC1BE",
    "People with Disabilities": "#002943",
    "Elderly": "#F59D6A",
    "People with Medical Needs": "#FEE07E",
    "Ethnic Minorities": "#86D1D1",
    "Immigrants, Asylum Seekers & Refugees": "#80BDB4",
    "Offenders & Re-Offenders": "#F2948C",
  };

      const isSmallScreen = isMobile || isTablet || isMobileLandscape;
      const minLayoutValue = 200;
      const layoutData = isSmallScreen
        ? {
            ...data,
            children: data.children.map((c) => ({ ...c, layoutValue: Math.max(c.value, minLayoutValue) }))
          }
        : {
            ...data,
            children: data.children.map((c) => ({ ...c, layoutValue: c.value }))
          };

      const root = d3.hierarchy(layoutData)
        .sum(d => d.layoutValue)
        .sort((a, b) => b.layoutValue - a.layoutValue);

      const tile = (isMobile || isTablet) ? d3.treemapSlice : d3.treemapBinary;

      d3.treemap()
        .tile(tile)
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

    const labelFontSize = isMobile ? "0.875rem" : "1rem";
    const isSmallBox = isMobile && boxH < 50;
    const labelY = isSmallBox ? boxH / 2 + 4 : 24;
    const label = g.append("text")
      .attr("x", 16)
      .attr("y", labelY)
      .attr("fill", textColor)
      .attr("font-size", labelFontSize)
      .attr("font-weight", 600)
      .text(d.data.name)
      .call(wrap, boxW - 32);

    if (label.node().getBBox().height > boxH * 0.6) label.style("display","none");

    let percentText = null;
    const minHeight = isMobile ? 30 : 40;
    const minWidth = isMobile ? 60 : 80;
    if (boxH > minHeight && boxW > minWidth) {
      const percentFontSize = isMobile ? "0.875rem" : "1.25rem";
      percentText = g.append("text")
        .attr("x", boxW - 16)
        .attr("y", boxH - 12)
        .attr("text-anchor", "end")
        .attr("fill", textColor)
        .attr("font-size", percentFontSize)
        .attr("opacity", 0)
        .text(`${Math.round(d.data.percent)}%`);
    }

        const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        
        if (hasHover) {
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
            gsap.to(leaf.nodes().filter(n => n !== g.node()), {
              opacity: 0.3,
              duration: 0.25,
              ease: "power2.out"
            });
            if (percentText) {
              gsap.to(percentText.node(), {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out"
              });
            }
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
            gsap.to(leaf.nodes(), {
              opacity: 1,
              duration: 0.25,
              ease: "power2.out"
            });
            if (percentText) {
              gsap.to(percentText.node(), {
                opacity: 0,
                duration: 0.25,
                ease: "power2.out"
              });
            }
          });
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
    }
  );
};

export { initTreeMapChart };