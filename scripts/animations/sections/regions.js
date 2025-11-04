export const initRegionsSection = () => {
  const wrapper = document.querySelector('.regions_wrapper');
  const buttonWrapper = document.querySelector('.region_button-wrapper');
  const buttons = Array.from(document.querySelectorAll('.region_button'));
  const overlays = Array.from(document.querySelectorAll('.regions_base.is-overlay'));
  const reflectionItems = Array.from(document.querySelectorAll('.regions-reflections_item'));
  const reflectionsList = document.querySelector('.regions-reflections_list');
  
  if (!buttons.length || !overlays.length) return;

  if (wrapper && buttonWrapper) {
    const children = Array.from(buttonWrapper.children);
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile) {
      gsap.set(wrapper, { clearProps: 'transform' });
    }
    
    const tl = gsap.timeline();
    
    tl.from(wrapper, {
      scale: 0.8,
      autoAlpha: 0,
      duration: 1.5,
      ease: 'back.out(1.7)',
      clearProps: isMobile ? 'transform' : ''
    })
    .from(children, {
      autoAlpha: 0,
      y: 20,
      duration: 1.2,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      clearProps: isMobile ? 'transform' : ''
    },"+=0.05");
  }

  const getKeyFromClass = el => {
    const match = el.className.match(/is-(?!overlay)([a-z0-9-]+)/i);
    return match ? match[1] : '';
  };

  const keyFor = el => (el.getAttribute('data-region') || getKeyFromClass(el)).trim();

  const overlayMap = new Map();
  const reflectionMap = new Map();

  overlays.forEach(el => {
    const key = keyFor(el);
    if (key) overlayMap.set(key, el);
  });

  reflectionItems.forEach(el => {
    const key = keyFor(el);
    if (key) reflectionMap.set(key, el);
  });

  if (!overlayMap.size) return;

  gsap.set([...overlayMap.values()], { 
    autoAlpha: 0, 
    pointerEvents: 'none' 
  });

  const isMobileView = window.innerWidth <= 767;

  if (reflectionMap.size) {
    if (isMobileView) {
      gsap.set([...reflectionMap.values()], { autoAlpha: 0, y: '100%', display: 'none' });
      if (reflectionsList) {
        reflectionsList.style.visibility = 'hidden';
      }
    } else {
      gsap.set([...reflectionMap.values()], { autoAlpha: 0 });
    }
  }

  let activeOverlay;
  let activeReflection;
  let activeButton;
  let hideTimeout;

  const show = (overlay, reflection, button) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    if (activeOverlay === overlay && activeReflection === reflection) return;

    const prevOverlay = activeOverlay;
    const prevReflection = activeReflection;

    if (prevOverlay) {
      gsap.killTweensOf(prevOverlay);
      gsap.to(prevOverlay, { 
        autoAlpha: 0, 
        duration: 0.2, 
        onComplete: () => gsap.set(prevOverlay, { display: 'none' }) 
      });
    }

    if (prevReflection) {
      gsap.killTweensOf(prevReflection);
      gsap.to(prevReflection, { 
        autoAlpha: 0, 
        duration: 0.2 
      });
    }

    activeOverlay = overlay;
    activeReflection = reflection;

    if (activeButton) activeButton.classList.remove('is-active');
    activeButton = button || null;
    if (activeButton) activeButton.classList.add('is-active');

    if (activeOverlay) {
      gsap.killTweensOf(activeOverlay);
      gsap.set(activeOverlay, { display: 'block' });
      gsap.fromTo(
        activeOverlay, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1, duration: 0.3 }
      );
    }

    if (activeReflection) {
      gsap.killTweensOf(activeReflection);
      gsap.fromTo(
        activeReflection, 
        { autoAlpha: 0, scale: 0.8 }, 
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  };

  const isMobile = () => window.innerWidth <= 767;

  const showMobileModal = (reflection, overlay) => {
    if (!reflection || !reflectionsList) return;

    if (window.lenis) window.lenis.stop();

    const closeBtn = reflectionsList.querySelector('[data-modal-region-close]');
    if (closeBtn) {
      gsap.set(closeBtn, { autoAlpha: 0 });
    }

    overlays.forEach(item => {
      gsap.set(item, { autoAlpha: 0, pointerEvents: 'none' });
    });

    reflectionItems.forEach(item => {
      if (item !== reflection) {
        gsap.set(item, { autoAlpha: 0, y: '100%', display: 'none' });
      } else {
        gsap.set(item, { display: 'flex' });
      }
    });

    if (overlay) {
      gsap.set(overlay, { display: 'block' });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.3 });
    }

    reflectionsList.style.visibility = 'visible';
    gsap.killTweensOf(reflection);
    gsap.fromTo(
      reflection,
      { autoAlpha: 0, y: '100%' },
      { 
        autoAlpha: 1, 
        y: '0%', 
        duration: 0.4, 
        ease: 'power2.out',
        onComplete: () => {
          if (closeBtn) {
            gsap.to(closeBtn, { autoAlpha: 1, duration: 0.2 });
          }
        }
      }
    );
  };

  const hideMobileModal = () => {
    if (!reflectionsList) return;

    const visibleItem = reflectionItems.find(item => gsap.getProperty(item, 'opacity') > 0);
    if (!visibleItem) return;

    const closeBtn = reflectionsList.querySelector('[data-modal-region-close]');
    
    if (closeBtn) {
      gsap.to(closeBtn, { 
        autoAlpha: 0, 
        duration: 0.2,
        onComplete: () => {
          overlays.forEach(overlay => {
            gsap.killTweensOf(overlay);
            gsap.to(overlay, { 
              autoAlpha: 0, 
              duration: 0.2,
              onComplete: () => gsap.set(overlay, { display: 'none' })
            });
          });

          gsap.killTweensOf(visibleItem);
          gsap.to(visibleItem, {
            autoAlpha: 0,
            y: '100%',
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              gsap.set(visibleItem, { display: 'none' });
              reflectionsList.style.visibility = 'hidden';
              if (window.lenis) window.lenis.start();
            }
          });
        }
      });
    } else {
      overlays.forEach(overlay => {
        gsap.killTweensOf(overlay);
        gsap.to(overlay, { 
          autoAlpha: 0, 
          duration: 0.2,
          onComplete: () => gsap.set(overlay, { display: 'none' })
        });
      });

      gsap.killTweensOf(visibleItem);
      gsap.to(visibleItem, {
        autoAlpha: 0,
        y: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(visibleItem, { display: 'none' });
          reflectionsList.style.visibility = 'hidden';
          if (window.lenis) window.lenis.start();
        }
      });
    }
  };

  buttons.forEach(btn => {
    const key = keyFor(btn);
    const overlay = overlayMap.get(key);
    const reflection = reflectionMap.get(key);
    
    if (!overlay) return;

    btn.addEventListener('click', () => {
      if (isMobile() && reflection) {
        showMobileModal(reflection, overlay);
      }
    });
    
    btn.addEventListener('mouseenter', () => {
      if (!isMobile()) {
        show(overlay, reflection, btn);
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (!isMobile() && activeOverlay === overlay) {
        hideTimeout = setTimeout(() => {
          show(null, null, null);
        }, 100);
      }
    });
  });

  if (reflectionsList) {
    const closeBtn = reflectionsList.querySelector('[data-modal-region-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        hideMobileModal();
      });
    }

    reflectionsList.addEventListener('click', e => {
      if (e.target === reflectionsList) {
        hideMobileModal();
      }
    });
  }
};
