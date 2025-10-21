import { initModalSlide } from '../../utils/modalInitSlide.js';

export function initEventsSection() {
  const modalControls = initModalSlide();
  let globalProgressBarTween = null;
  let currentActiveIndex = 0;

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
    
    globalProgressBarTween = progressBarTween;

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
      
      globalProgressBarTween = progressBarTween;
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
          currentActiveIndex = index;
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

    switchTab(0);
    
    modalControls.setOnClose(() => {
      if (autoplay && globalProgressBarTween) {
        globalProgressBarTween.resume();
      }
      if (window.lenis) window.lenis.start();
    });
    
    contentItems.forEach((item, i) => {
      item.addEventListener("click", () => {
        if (modalControls) {
          const modalTarget = item.getAttribute('data-modal-slide-target');
          
          if (modalTarget) {
            if (globalProgressBarTween) globalProgressBarTween.pause();
            if (window.lenis) window.lenis.stop();
            modalControls.openModal(modalTarget);
          }
        }
      });
      
      if (autoplay) {
        item.addEventListener("mouseenter", () => {
          if (item === activeContent && progressBarTween) progressBarTween.pause();
        });
        
        item.addEventListener("mouseleave", () => {
          if (item === activeContent && progressBarTween) progressBarTween.resume();
        });
      }
    });
    
  });
}