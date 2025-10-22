const initStickyTitleScroll = () => {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');
  
  wraps.forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));
    const images = Array.from(wrap.querySelectorAll('.bg-shape img'));
    
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
    
    images.forEach((img, imgIndex) => {
      gsap.set(img, { autoAlpha: 0, scale: 1.1 });
    });
    
    headings.forEach((heading, index) => {
      const headingTl = gsap.timeline();
      
      heading.setAttribute("aria-label", heading.textContent);
      
      const split = new SplitText(heading, { type: "words,chars" });
      
      split.words.forEach(word => word.setAttribute("aria-hidden", "true"));
      
      gsap.set(heading, { visibility: "visible" });
      
      const currentImage = wrap.querySelector(`.bg-shape.is-${index + 1} img`);
      
      if (index === 0) {
        headingTl.fromTo(currentImage, {
          autoAlpha: 0,
          scale: 1.1
        }, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out"
        }, 0.2);
      } else {
        const prevImage = wrap.querySelector(`.bg-shape.is-${index} img`);
        
        headingTl.to(prevImage, {
          autoAlpha: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.out"
        }, 0);
        
        headingTl.fromTo(currentImage, {
          autoAlpha: 0,
          scale: 1.1
        }, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out"
        }, 0.4);
      }
      
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      }, index === 0 ? 0 : fadeOutDuration * 0.3);
      
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