const initSectionTitleScroll = () => {
  const sectionTitles = document.querySelectorAll('.section-title_component');
  
  sectionTitles.forEach(title => {
    const accentShape1 = title.querySelector('.section-title_accent-shape.is-1');
    const accentShape2 = title.querySelector('.section-title_accent-shape.is-2');
    const titleText = title.querySelector('.section-title_inner > h2');
    
    if (!accentShape1 || !accentShape2 || !titleText) return;
    
    const split = new SplitText(titleText, { type: "words", mask:'words' });
    
    gsap.set([accentShape1, accentShape2], { 
      scale: 0,
      rotation: -45,
      transformOrigin: "center center"
    });
    
    gsap.set(split.words, { 
      autoAlpha: 0,
      y: 30
    });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        end: "bottom 20%"
      }
    });
    
    tl.to(accentShape1, {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    .to(accentShape2, {
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.4)"
    }, "-=0.3")
    .to(split.words, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.2");
  });
};

export { initSectionTitleScroll };
