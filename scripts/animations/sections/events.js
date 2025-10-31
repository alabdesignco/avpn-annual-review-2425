import { initModalSlide } from '../../utils/modalInitSlide.js';

export const initEventsSection = () => {
  const modalControls = initModalSlide();
  const allProgressTweens = [];
  let isModalOpen = false;

  const mm = gsap.matchMedia();

      mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isTablet } = context.conditions;
      const isSmallScreen = isMobile || isTablet;
      const initEntranceAnimations = () => {
        const introParagraph = document.querySelector('.section_events .events_top .text-size-medium');
        const eventItems = document.querySelectorAll('.events_list-wrapper > *');
        const button = document.querySelector('.events_bottom .button');

        if (!introParagraph || !eventItems.length || !button) return;

        gsap.set([introParagraph, ...eventItems, button], { 
          opacity: 0, 
          y: 30 
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.section_events',
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        });

        tl.to(introParagraph, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out' 
        })
        .to(eventItems, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power2.out',
          stagger: 0.15
        }, '-=0.4')
        .to(button, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power2.out' 
        }, '-=0.2');
      };

      initEntranceAnimations();

      const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
      
      wrappers.forEach((wrapper) => {
        const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
        const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
        
        const autoplay = wrapper.dataset.tabsAutoplay === "true";
        const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
        
        let activeContent = null;
        let activeVisual = null;
        let isAnimating = false;
        let progressBarTween = null;
        
        const tweenRef = { current: null };

        function startProgressBar(index) {
          if (progressBarTween) progressBarTween.kill();
          const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
          if (!bar) return;
          
          gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
          progressBarTween = gsap.to(bar, {
            scaleX: 1,
            duration: autoplayDuration / 1000,
            ease: "power1.inOut",
            onComplete: () => {
              if (!isAnimating) {
                const nextIndex = (index + 1) % contentItems.length;
                switchTab(nextIndex);
              }
            },
          });
          
          tweenRef.current = progressBarTween;
        }

        function switchTab(index) {
          if (isAnimating || contentItems[index] === activeContent) return;
          
          isAnimating = true;
          if (progressBarTween) progressBarTween.kill();
          
          const outgoingContent = activeContent;
          const outgoingVisual = activeVisual;
          const outgoingBar = outgoingContent?.querySelector('[data-tabs="item-progress"]');
          
          const incomingContent = contentItems[index];
          const incomingVisual = visualItems[index];
          const incomingBar = incomingContent.querySelector('[data-tabs="item-progress"]');
          
          outgoingContent?.classList.remove("is-active");
          outgoingVisual?.classList.remove("is-active");
          incomingContent.classList.add("is-active");
          incomingVisual.classList.add("is-active");
          
          const tl = gsap.timeline({
            defaults: { duration: 0.65, ease: "power3" },
            onComplete: () => {
              activeContent = incomingContent;
              activeVisual = incomingVisual;
              isAnimating = false;
              if (autoplay) startProgressBar(index);
            },
          });
          
          if (outgoingContent) {
            outgoingContent.classList.remove("is-active");
            outgoingVisual?.classList.remove("is-active");
            tl.set(outgoingBar, { transformOrigin: "right center" })
              .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
              .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0);
          }

          incomingContent.classList.add("is-active");
          incomingVisual.classList.add("is-active");
          tl.fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, 0.3)
            .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
        }

        allProgressTweens.push(tweenRef);
        
        switchTab(0);
        
        contentItems.forEach((item, i) => {
          item.addEventListener("click", () => {
            if (modalControls) {
              const modalTarget = item.getAttribute('data-modal-slide-target');
              
              if (modalTarget) {
                isModalOpen = true;
                allProgressTweens.forEach(ref => {
                  if (ref.current) ref.current.pause();
                });
                if (window.lenis) window.lenis.stop();
                modalControls.openModal(modalTarget);
              }
            }
          });
          
          if (autoplay && !isSmallScreen) {
            let hoveredVisual = null;
            let originalVisual = null;
            
            item.addEventListener("mouseenter", () => {
              const visual = visualItems[i];
              if (visual && visual !== activeVisual) {
                originalVisual = activeVisual;
                hoveredVisual = visual;
                
                gsap.to(originalVisual, {
                  autoAlpha: 0,
                  xPercent: 3,
                  duration: 0.65,
                  ease: "power3"
                });
                
                gsap.fromTo(hoveredVisual, 
                  { autoAlpha: 0, xPercent: 3 },
                  { autoAlpha: 1, xPercent: 0, duration: 0.65, ease: "power3" }
                );
              }
              
              if (item === activeContent && progressBarTween && !isModalOpen) progressBarTween.pause();
            });
            
            item.addEventListener("mouseleave", () => {
              if (hoveredVisual && originalVisual && hoveredVisual !== activeVisual) {
                gsap.to(hoveredVisual, {
                  autoAlpha: 0,
                  xPercent: 3,
                  duration: 0.65,
                  ease: "power3"
                });
                
                gsap.fromTo(originalVisual,
                  { autoAlpha: 0, xPercent: 3 },
                  { autoAlpha: 1, xPercent: 0, duration: 0.65, ease: "power3" }
                );
                
                hoveredVisual = null;
                originalVisual = null;
              }
              
              if (item === activeContent && progressBarTween && !isModalOpen) progressBarTween.resume();
            });
          }
        });
      });
    }
  );

  modalControls.setOnClose(() => {
    isModalOpen = false;
    allProgressTweens.forEach(ref => {
      if (ref.current) ref.current.resume();
    });
    if (window.lenis) window.lenis.start();
  });
};