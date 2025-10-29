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
            gsap.set(richTextElements, { opacity: 0, y: 30 });
            richTextElements.forEach((p) => {
              const strongElements = p.querySelectorAll('strong');
              strongElements.forEach((strong) => {
                gsap.set(strong, { '--highlight-width': '0%' });
              });
            });
            richTextElements.forEach((p, index) => {
              p.classList.add(`foreword-paragraph-${index}`);
            });

            const initParagraphReveal = () => {
              gsap.to(richTextElements, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: wrap,
                  start: "top 40%",
                  end: "bottom -100%",
                  scrub: 1
                }
              });
            };

            const checkParagraphOpacity = (paragraph) => {
              const computedStyle = window.getComputedStyle(paragraph);
              const opacity = parseFloat(computedStyle.opacity);
              return opacity >= 0.90;
            };

            const triggerHighlights = (paragraph) => {
              const strongElements = paragraph.querySelectorAll('strong');
              strongElements.forEach((strong, sIndex) => {
                if (!strong.hasAttribute('data-highlighted')) {
                  strong.setAttribute('data-highlighted', 'true');
                  const staggerDelay = sIndex * 0.15;
                  gsap.to(strong, {
                    '--highlight-width': '100%',
                    duration: 0.6,
                    delay: staggerDelay,
                    ease: "power2.out"
                  });
                }
              });
            };

            const monitorParagraphOpacity = () => {
              richTextElements.forEach((paragraph) => {
                if (!paragraph.hasAttribute('data-highlighted') && checkParagraphOpacity(paragraph)) {
                  triggerHighlights(paragraph);
                }
              });
            };

            initParagraphReveal();

            ScrollTrigger.create({
              trigger: wrap,
              start: "top 20%",
              end: "bottom -100%",
              scrub: 1,
              onUpdate: (self) => {
                richTextElements.forEach((p) => {
                  if (!p.hasAttribute('data-highlighted') && self.progress > 0.2 && checkParagraphOpacity(p)) {
                    triggerHighlights(p);
                  }
                });
              }
            });
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
                console.log(`Foreword horizontal progress: ${Math.round(self.progress * 100)}%`);
              }
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