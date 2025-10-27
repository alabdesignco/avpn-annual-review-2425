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

          // Rich text reveal animation
          const richTextElements = wrap.querySelectorAll("#foreword > p");
          if (richTextElements.length) {
            gsap.set(richTextElements, { opacity: 0, y: 30 });
            
            gsap.to(richTextElements, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: wrap,
                start: "top 20%",
                end: "bottom -100%",
                scrub: 1,
                onUpdate: (self) => {
                  // console.log(`Rich text progress: ${Math.round(self.progress * 100)}%`);
                }
              }
            });
          }

          // Progress checker for debugging
          // ScrollTrigger.create({
          //   trigger: wrap,
          //   start: "top top",
          //   end: "bottom bottom",
          //   onUpdate: (self) => {
          //     // console.log(`Section progress: ${Math.round(self.progress * 100)}%`);
          //   }
          // });

          // Individual shape control
          shapes.forEach((shape, index) => {
            // Set initial state
            gsap.set(shape, { 
              scale: 0, 
              rotation: 0, 
              transformOrigin: "center" 
            });
            
            // Horizontal scroll timing - adjusted for extended rich text duration (-100%)
            const shapeTimings = [
              { start: "0%", end: "10%" },   // Shape 1: appears immediately
              { start: "10%", end: "25%" },  // Shape 2: appears at 10% progress
              { start: "25%", end: "40%" },  // Shape 3: appears at 25% progress
              { start: "40%", end: "55%" }   // Shape 4: appears at 40% progress
            ];
            
            const timing = shapeTimings[index] || shapeTimings[0];
            
            gsap.to(shape, {
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: wrap,
                start: `left+=${timing.start} left`,
                end: `left+=${timing.end} left`,
                scrub: 1,
              }
            });

            // Continuous looping rotation with random speed
            const randomDuration = 2 + Math.random() * 4; // Random duration between 2-6 seconds
            gsap.to(shape, {
              rotation: 360,
              duration: randomDuration,
              ease: "none",
              repeat: -1
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
