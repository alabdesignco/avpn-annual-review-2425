const initHorizontalScroll = () => {
  document.querySelectorAll(".horizontal-scroll-section_wrapper").forEach((wrap) => {
    const track = wrap.querySelector(".horizontal-scroll-section_track");
    const accentItems = [1, 2, 3, 4].map(i => 
      wrap.querySelector(`.foreword-content-accent_wrapper.is-${i}`)
    ).filter(Boolean);

    const setScrollDistance = () => {
      wrap.style.height = `calc(${track.offsetWidth}px + 100vh)`;
    };

    setScrollDistance();
    ScrollTrigger.refresh();
    window.addEventListener("resize", setScrollDistance);

    gsap.set(accentItems, { scale: 0, transformOrigin: "center" });

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
      const progress = index / (accentItems.length - 1 || 1);
      tl.to(item, { scale: 1, duration: 0.3 }, progress * 0.7);
    });
  });
};

export { initHorizontalScroll };