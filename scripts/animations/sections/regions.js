export const initRegionsSection = () => {
  const buttons = Array.from(document.querySelectorAll('.region_button'));
  const overlays = Array.from(document.querySelectorAll('.regions_base.is-overlay'));
  const reflectionItems = Array.from(document.querySelectorAll('.regions-reflections_item'));
  
  if (!buttons.length || !overlays.length) return;

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

  if (reflectionMap.size) {
    gsap.set([...reflectionMap.values()], { autoAlpha: 0 });
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

  buttons.forEach(btn => {
    const key = keyFor(btn);
    const overlay = overlayMap.get(key);
    const reflection = reflectionMap.get(key);
    
    if (!overlay) return;
    
    btn.addEventListener('mouseenter', () => show(overlay, reflection, btn));
    btn.addEventListener('mouseleave', () => {
      if (activeOverlay === overlay) {
        hideTimeout = setTimeout(() => {
          show(null, null, null);
        }, 100);
      }
    });
  });
};
