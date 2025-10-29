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
          if (ceoAccent1) entranceTl.to(ceoAccent1, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.6);
          if (ceoAccent2) entranceTl.to(ceoAccent2, { scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.6);
          if (ceoLabelWrapper) entranceTl.to(ceoLabelWrapper, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.6);
          const richTextElements = wrap.querySelectorAll("#foreword > p");
          if (richTextElements.length) {
            gsap.set(richTextElements, { 
              opacity: 0,
              clipPath: "circle(0% at 100% 0%)"
            });
            richTextElements.forEach((p) => {
              const strongElements = p.querySelectorAll('strong');
              strongElements.forEach((strong) => {
                gsap.set(strong, { '--highlight-width': '0%' });
              });
            });
            richTextElements.forEach((p, index) => {
              p.classList.add(`foreword-paragraph-${index}`);
            });

            const triggerHighlights = (paragraph) => {
              const strongElements = paragraph.querySelectorAll('strong');
              strongElements.forEach((strong, sIndex) => {
                if (!strong.hasAttribute('data-highlighted')) {
                  strong.setAttribute('data-highlighted', 'true');
                  const textLength = strong.textContent.trim().length;
                  const baseDuration = 0.4;
                  const durationPerChar = 0.02;
                  const duration = Math.min(baseDuration + (textLength * durationPerChar), 2.5);
                  const staggerDelay = sIndex * 0.15;
                  gsap.to(strong, {
                    '--highlight-width': '100%',
                    duration: duration,
                    delay: staggerDelay,
                    ease: "power2.out"
                  });
                }
              });
            };
          }

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

          const richTextElements = wrap.querySelectorAll("#foreword > p");
          const paragraphCount = richTextElements.length;
          const triggeredIndexes = new Set();

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
                const progress = Math.min(Math.max(self.progress, 0), 1);
                const activeIndex = Math.min(Math.floor(progress * paragraphCount), paragraphCount - 1);
                
                richTextElements.forEach((paragraph, index) => {
                  if (index <= activeIndex) {
                    gsap.to(paragraph, {
                      opacity: 1,
                      clipPath: "circle(150% at 100% 0%)",
                      duration: 0.8
                    });
                    
                    if (!triggeredIndexes.has(index)) {
                      triggeredIndexes.add(index);
                      const strongElements = paragraph.querySelectorAll('strong');
                      strongElements.forEach((strong, sIndex) => {
                        if (!strong.hasAttribute('data-highlighted')) {
                          strong.setAttribute('data-highlighted', 'true');
                          const textLength = strong.textContent.trim().length;
                          const baseDuration = 0.4;
                          const durationPerChar = 0.02;
                          const duration = Math.min(baseDuration + (textLength * durationPerChar), 2.5);
                          const staggerDelay = sIndex * 0.15;
                          gsap.to(strong, {
                            '--highlight-width': '100%',
                            duration: duration,
                            delay: staggerDelay,
                            ease: "power2.out"
                          });
                        }
                      });
                    }
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