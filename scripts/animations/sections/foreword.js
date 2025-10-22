const initForewordSection = () => {
  document.querySelectorAll(".horizontal-scroll-section_wrapper").forEach((wrap) => {
    const track = wrap.querySelector(".horizontal-scroll-section_track");
    const headerImageWrapper = wrap.querySelector(".foreword-header_image-wrapper");
    const headerImage = wrap.querySelector(".foreword-header_image");
    const headerAccent1 = wrap.querySelector(".foreword-header_accent.is-1");
    const headerAccent2 = wrap.querySelector(".foreword-header_accent.is-2");
    const accentItems = [1, 2, 3, 4, 5, 6].map(i => 
      wrap.querySelector(`.foreword-content-accent_wrapper.is-${i}`)
    ).filter(Boolean);

    const setScrollDistance = () => {
      wrap.style.height = `calc(${track.offsetWidth}px + 100vh)`;
    };

    setScrollDistance();
    ScrollTrigger.refresh();
    window.addEventListener("resize", setScrollDistance);

    if (headerImage) gsap.set(headerImage, { opacity: 0 });
    if (headerAccent1) gsap.set(headerAccent1, { scale: 0, transformOrigin: "center" });
    if (headerAccent2) gsap.set(headerAccent2, { scale: 0, transformOrigin: "center" });

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: headerImageWrapper || wrap,
        start: "top 60%",
      }
    });

    if (headerImage) headerTl.to(headerImage, { opacity: 1, duration: 0.6 }, 0);
    if (headerAccent1) headerTl.to(headerAccent1, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.6);
    if (headerAccent2) headerTl.to(headerAccent2, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.7);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      defaults: { ease: "power2.out" },
    });

    tl.to(track, { xPercent: -100, ease: "none" }, 0);

    accentItems.forEach((item, index) => {
      const randomRotation = Math.random() > 0.5 ? 180 : -180;
      gsap.set(item, { scale: 0, rotation: randomRotation, transformOrigin: "center" });
      const progress = index / (accentItems.length - 1 || 1);
      tl.to(item, { scale: 1, rotation: 0, duration: 0.3 }, progress * 0.7);
    });

    const foreword = wrap.querySelector("#foreword");
    if (foreword) {
      const paragraphs = Array.from(foreword.querySelectorAll("p"));
      const columns = 6;
      
      for (let col = 0; col < columns; col++) {
        const columnItems = paragraphs.filter((_, index) => index % columns === col);
        tl.from(columnItems, {
          xPercent: 100,
          autoAlpha: 0,
          duration: 0.1,
          ease: "power2.out"
        }, col * 0.01);
      }
    }
  });
};

export { initForewordSection };

