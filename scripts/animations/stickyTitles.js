const initStickyTitleScroll = () => {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');
  
  wraps.forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));
    
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      }
    });
    
    const revealDuration = 0.7,
          fadeOutDuration = 0.7,
          overlapOffset = 0.15;
    
    headings.forEach((heading, index) => {
      heading.setAttribute("aria-label", heading.textContent);
      
      const split = new SplitText(heading, { type: "words,chars" });
      
      split.words.forEach(word => word.setAttribute("aria-hidden", "true"));
      
      gsap.set(heading, { visibility: "visible" });
      
      const headingTl = gsap.timeline();
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });
      
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }
      
      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });
};

export { initStickyTitleScroll };