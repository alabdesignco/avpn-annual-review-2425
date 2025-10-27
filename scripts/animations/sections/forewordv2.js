export const initHorizontalScrolling = () => {
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

      const ctx = gsap.context(() => {
        const wrappers = document.querySelectorAll("[data-horizontal-scroll-wrap]");
        if (!wrappers.length) return;

        wrappers.forEach((wrap) => {
          const ceoImageWrapper = wrap.querySelector(".foreword-ceo_image-wrapper");
          const ceoAccent1 = wrap.querySelector(".foreword-header_accent.is-1");
          const ceoAccent2 = wrap.querySelector(".foreword-header_accent.is-2");
          const ceoLabelWrapper = wrap.querySelector(".foreword_ceo-label-wrapper");
          const shapes = [1, 2, 3, 4].map(i => wrap.querySelector(`.is-foreword-${i}`)).filter(Boolean);

          if (ceoImageWrapper) gsap.set(ceoImageWrapper, { opacity: 0 });
          if (ceoAccent1) gsap.set(ceoAccent1, { scale: 0, transformOrigin: "center" });
          if (ceoAccent2) gsap.set(ceoAccent2, { scale: 0, transformOrigin: "center" });
          if (ceoLabelWrapper) gsap.set(ceoLabelWrapper, { opacity: 0, y: 20 });

          const entranceTl = gsap.timeline({
            scrollTrigger: {
              trigger: ceoImageWrapper || wrap,
              start: "top 40%"
            }
          });

          if (ceoImageWrapper) entranceTl.to(ceoImageWrapper, { opacity: 1, duration: 0.6 }, 0);
          if (ceoAccent1) entranceTl.to(ceoAccent1, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.6, "<");
          if (ceoAccent2) entranceTl.to(ceoAccent2, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.7, "<");
          if (ceoLabelWrapper) entranceTl.to(ceoLabelWrapper, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.8, "<");

          shapes.forEach((shape, index) => {
            const baseDelay = 0.3; // Base delay for all shapes
            const shapeDelay = index * 0.2; // Delay between each shape
            const startOffset = baseDelay + shapeDelay;
            const endOffset = 0.2; // Fixed end offset for all shapes
            
            gsap.fromTo(shape, {
              scale: 0,
            }, {
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: wrap,
                start: `top+=${startOffset * 100}% top`,
                end: `bottom-=${endOffset * 100}% bottom`,
                scrub: 5,
              }
            });
          });
        });

        wrappers.forEach((wrap) => {
          const disable = wrap.getAttribute("data-horizontal-scroll-disable");
          if (
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet)
          ) {
            return;
          }

          const panels = gsap.utils.toArray("[data-horizontal-scroll-panel]", wrap);
          if (panels.length < 2) return;

          gsap.to(panels, {
            x: () => -(wrap.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => "+=" + (wrap.scrollWidth - window.innerWidth),
              scrub: true,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      return () => ctx.revert();
    }
  );

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
};
