export function initPartners() {
  const loopDelay = 1;
  const duration  = 0.9;

  let entranceComplete = false;
  const cycleTriggers = [];

  const initEntranceAnimations = () => {
    const section = document.querySelector('.section_partners');
    if (!section) {
      return;
    }

    const introText = section.querySelector('.partners_top .text-size-large');
    const subText = section.querySelector('.partners_bottom .text-size-large');
    const button = section.querySelector('.partners_bottom .button');
    const logoWallComponent = section.querySelector('.partners-logo-wall_component');

    if (!introText || !subText || !button || !logoWallComponent) {
      return;
    }

    gsap.set([introText, subText, button, logoWallComponent], { 
      opacity: 0, 
      y: 30 
    });

    gsap.to(introText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: introText,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.to(logoWallComponent, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: logoWallComponent,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        refreshPriority: -1
      },
      onComplete: () => {
        entranceComplete = true;
        cycleTriggers.forEach(trigger => trigger());
      }
    });

    gsap.to(subText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subText,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.to(button, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: button,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });
  };

  initEntranceAnimations();

  const cycleRoots = document.querySelectorAll('[data-logo-wall-cycle-init]');
  cycleRoots.forEach(root => {
    const list   = root.querySelector('[data-logo-wall-list]');
    const items  = Array.from(list.querySelectorAll('[data-logo-wall-item]'));

    const shuffleFront = root.getAttribute('data-logo-wall-shuffle') !== 'false';
    
    // Look for both data-logo-wall-target and data-logo-wall-target-parent
    let originalTargets = items
      .map(item => item.querySelector('[data-logo-wall-target]'))
      .filter(Boolean);
    
    // If no targets found, look for target parents and create targets
    if (originalTargets.length === 0) {
      const targetParents = items
        .map(item => item.querySelector('[data-logo-wall-target-parent]'))
        .filter(Boolean);
      
      // Create target elements inside each target parent
      targetParents.forEach(parent => {
        if (!parent.querySelector('[data-logo-wall-target]')) {
          const target = document.createElement('div');
          target.setAttribute('data-logo-wall-target', '');
          parent.appendChild(target);
        }
      });
      
      // Now get the targets again
      originalTargets = items
        .map(item => item.querySelector('[data-logo-wall-target]'))
        .filter(Boolean);
    }

    // If still no targets, exit early
    if (originalTargets.length === 0) {
      return;
    }

    let visibleItems   = [];
    let visibleCount   = 0;
    let pool           = [];
    let pattern        = [];
    let patternIndex   = 0;
    let tl;

    function isVisible(el) {
      return window.getComputedStyle(el).display !== 'none';
    }

    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function setup() {
      if (tl) {
        tl.kill();
      }
      visibleItems = items.filter(isVisible);
      visibleCount = visibleItems.length;
      

      pattern = shuffleArray(
        Array.from({ length: visibleCount }, (_, i) => i)
      );
      patternIndex = 0;
      

      items.forEach(item => {
        item.querySelectorAll('[data-logo-wall-target]').forEach(old => old.remove());
      });

      pool = originalTargets.map(n => n.cloneNode(true));

      let front, rest;
      if (shuffleFront) {
        const shuffledAll = shuffleArray(pool);
        front = shuffledAll.slice(0, visibleCount);
        rest  = shuffleArray(shuffledAll.slice(visibleCount));
      } else {
        front = pool.slice(0, visibleCount);
        rest  = shuffleArray(pool.slice(visibleCount));
      }
      pool = front.concat(rest);

      for (let i = 0; i < visibleCount; i++) {
        const parent =
          visibleItems[i].querySelector('[data-logo-wall-target-parent]') ||
          visibleItems[i];
        parent.appendChild(pool.shift());
      }

      tl = gsap.timeline({ repeat: -1, paused: true });
      tl.call(swapNext);
      tl.to({}, { duration: duration + loopDelay });
      
    }

    function swapNext() {
      const nowCount = items.filter(isVisible).length;
      if (nowCount !== visibleCount) {
        
        setup();
        return;
      }
      if (!pool.length) return;

      const idx = pattern[patternIndex % visibleCount];
      patternIndex++;
      

      const container = visibleItems[idx];
      const parent =
        container.querySelector('[data-logo-wall-target-parent]') ||
        container.querySelector('*:has(> [data-logo-wall-target])') ||
        container;
      const existing = parent.querySelectorAll('[data-logo-wall-target]');
      if (existing.length > 1) return;

      const current  = parent.querySelector('[data-logo-wall-target]');
      const incoming = pool.shift();

      gsap.set(incoming, { yPercent: 50, autoAlpha: 0 });
      parent.appendChild(incoming);

      if (current) {
        gsap.to(current, {
          yPercent: -50,
          autoAlpha: 0,
          duration,
          ease: "expo.inOut",
          onComplete: () => {
            current.remove();
            pool.push(current);
          }
        });
      }

      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        delay: 0.1,
        ease: "expo.inOut"
      });
    }

    setup();

    let st;

    ScrollTrigger.addEventListener('refreshInit', () => {
      if (st) st.kill();
    });

    const initScrollTrigger = () => {
      if (!entranceComplete) {
        cycleTriggers.push(initScrollTrigger);
        return;
      }

      st = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onEnter:     () => { tl.play(); },
        onLeave:     () => { tl.pause(); },
        onEnterBack: () => { tl.play(); },
        onLeaveBack: () => { tl.pause(); }
      });

      if (st.isActive) {
        tl.play();
      }
    };

    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
      gsap.delayedCall(0.3, initScrollTrigger);
    } else {
      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
        gsap.delayedCall(0.3, initScrollTrigger);
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        tl.pause();
      } else if (st && st.isActive) {
        tl.play();
      }
    });
  });
}