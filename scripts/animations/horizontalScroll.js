const initHorizontalScroll = () => {
  document.querySelectorAll(".horizontal-scroll-section_wrapper").forEach((wrap) => {
    const track = wrap.querySelector(".horizontal-scroll-section_track");

    const setScrollDistance = () => {
      wrap.style.height = `calc(${track.offsetWidth}px + 100vh)`;
    };

    setScrollDistance();
    ScrollTrigger.refresh();
    window.addEventListener("resize", setScrollDistance);

    gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      defaults: { ease: "none" },
    }).to(track, { xPercent: -100 });
  });
};

export { initHorizontalScroll };