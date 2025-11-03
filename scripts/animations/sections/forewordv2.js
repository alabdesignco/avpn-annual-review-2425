export const initHorizontalScrolling = () => {
  if (typeof document === 'undefined') return;
  
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

          if (ceoImageWrapper) gsap.set(ceoImageWrapper, { opacity: 0, scale: 0.8 });
          if (ceoAccent1) gsap.set(ceoAccent1, { scale: 0, transformOrigin: "center" });
          if (ceoAccent2) gsap.set(ceoAccent2, { scale: 0, transformOrigin: "center" });
          if (ceoLabelWrapper) gsap.set(ceoLabelWrapper, { opacity: 0, y: 20 });

          const entranceTl = gsap.timeline({
            scrollTrigger: {
              trigger: ceoImageWrapper || wrap,
              start: "top 40%"
            }
          });

          if (ceoImageWrapper) entranceTl.to(ceoImageWrapper, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 0);
          if (ceoAccent1) entranceTl.to(ceoAccent1, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.6);
          if (ceoAccent2) entranceTl.to(ceoAccent2, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.6);
          if (ceoLabelWrapper) entranceTl.to(ceoLabelWrapper, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 0.6);
          
          // Set initial scale for shapes
          const shapes = wrap.querySelectorAll('.shape.is-foreword-1, .shape.is-foreword-2, .shape.is-foreword-3, .shape.is-foreword-4');
          gsap.set(shapes, { scale: 0, rotation: 0 });
          
          const richTextElements = wrap.querySelectorAll("#foreword > p");
          if (richTextElements.length) {
            gsap.set(richTextElements, { 
              opacity: 0,
              clipPath: "circle(0% at 100% 0%)"
            });
            richTextElements.forEach((p) => {
            });
            richTextElements.forEach((p, index) => {
              p.classList.add(`foreword-paragraph-${index}`);
            });
          }

        });

        wrappers.forEach((wrap) => {
          const disable = wrap.getAttribute("data-horizontal-scroll-disable");
          const shouldDisable = 
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet);

          if (shouldDisable) {
            const richTextElements = wrap.querySelectorAll("#foreword > p");
            if (richTextElements.length) {
              richTextElements.forEach((p, index) => {
                gsap.to(p, {
                  opacity: 1,
                  clipPath: "circle(150% at 100% 0%)",
                  duration: 1,
                  scrollTrigger: {
                    trigger: p,
                    start: "top 80%",
                    toggleActions: "play none none none"
                  },
                  delay: index * 0.15
                });
              });
            }
            
            return;
          }

          const panels = gsap.utils.toArray("[data-horizontal-scroll-panel]", wrap);
          if (panels.length < 2) return;

          const richTextElements = wrap.querySelectorAll("#foreword > p");
          const paragraphCount = richTextElements.length;

          const horizontalTween = gsap.to(panels, {
            x: () => -(wrap.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => "+=" + (wrap.scrollWidth - window.innerWidth),
              scrub: true,
              pin: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // console.log(`Foreword horizontal progress: ${Math.round(self.progress * 100)}%`);
                let progress = Math.min(Math.max(self.progress, 0), 1);
                
                if (isTablet && !isMobileLandscape) {
                  progress = Math.pow(progress, 0.6);
                }
                
                const activeIndex = Math.min(Math.floor(progress * paragraphCount), paragraphCount - 1);
                
                // Shape animations based on scroll progress
                const shape1 = wrap.querySelector('.shape.shape--rounded.is-foreword-1');
                const shape2 = wrap.querySelector('.shape.shape--circle.is-foreword-2');
                const shape3 = wrap.querySelector('.shape.shape--leaf.is-foreword-3');
                const shape4 = wrap.querySelector('.shape.shape--quarter.is-foreword-4');
                
                if (progress >= 0.2 && shape1 && !shape1.hasAttribute('data-rotating')) {
                  gsap.to(shape1, { scale: 1, duration: 0.6, ease: "back.out(1.7)" });
                  gsap.to(shape1, { rotation: "+=360", duration: 20, ease: "none", repeat: -1 });
                  shape1.setAttribute('data-rotating', 'true');
                }
                if (progress >= 0.5 && shape2 && !shape2.hasAttribute('data-rotating')) {
                  gsap.to(shape2, { scale: 1, duration: 0.6, ease: "back.out(1.7)" });
                  gsap.to(shape2, { rotation: "+=360", duration: 18, ease: "none", repeat: -1 });
                  shape2.setAttribute('data-rotating', 'true');
                }
                if (progress >= 0.8 && shape3 && !shape3.hasAttribute('data-rotating')) {
                  gsap.to(shape3, { scale: 1, duration: 0.6, ease: "back.out(1.7)" });
                  gsap.to(shape3, { rotation: "+=360", duration: 16, ease: "none", repeat: -1 });
                  shape3.setAttribute('data-rotating', 'true');
                }
                if (progress >= 0.99 && shape4 && !shape4.hasAttribute('data-rotating')) {
                  gsap.to(shape4, { scale: 1, duration: 0.6, ease: "back.out(1.7)" });
                  gsap.to(shape4, { rotation: "+=360", duration: 14, ease: "none", repeat: -1 });
                  shape4.setAttribute('data-rotating', 'true');
                }
                
                richTextElements.forEach((paragraph, index) => {
                  if (index <= activeIndex) {
                    const duration = (isTablet && !isMobileLandscape) ? 1.2 : 1.2;
                    gsap.to(paragraph, {
                      opacity: 1,
                      clipPath: "circle(150% at 100% 0%)",
                      duration: duration
                    });
                  }
                });
              }
            },
          });

        });
      });

      return () => ctx.revert();
    }
  );

};