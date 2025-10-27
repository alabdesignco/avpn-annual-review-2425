export function initWork() {
  const initEntranceAnimations = () => {
    const section = document.querySelector('.section_work');
    if (!section) return;

    const workListItems = section.querySelectorAll('.work_list > *');
    const button = section.querySelector('.button');

    if (!workListItems.length || !button) return;

    gsap.set([...workListItems, button], { 
      opacity: 0, 
      y: 30 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.to(workListItems, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power2.out',
      stagger: 0.15
    })
    .to(button, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power2.out' 
    }, '-=0.3');
  };

  initEntranceAnimations();

  const directionMap = {
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)',
      left: 'translateX(-100%)',
      right: 'translateX(100%)'
    };
  
    document.querySelectorAll('[data-directional-hover]').forEach(container => {
      const type = container.getAttribute('data-type') || 'all';
  
      container.querySelectorAll('[data-directional-hover-item]').forEach(item => {
        const tile = item.querySelector('[data-directional-hover-tile]');
        if (!tile) return;
  
        item.addEventListener('mouseenter', e => {
          const dir = getDirection(e, item, type);
          tile.style.transition = 'none';
          tile.style.transform = directionMap[dir] || 'translate(0, 0)';
          void tile.offsetHeight;
          tile.style.transition = '';
          tile.style.transform = 'translate(0%, 0%)';
          item.setAttribute('data-status', `enter-${dir}`);
        });
  
        item.addEventListener('mouseleave', e => {
          const dir = getDirection(e, item, type);
          item.setAttribute('data-status', `leave-${dir}`);
          tile.style.transform = directionMap[dir] || 'translate(0, 0)';
        });
      });
  
      function getDirection(event, el, type) {
        const { left, top, width: w, height: h } = el.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
  
        if (type === 'y') return y < h / 2 ? 'top' : 'bottom';
        if (type === 'x') return x < w / 2 ? 'left' : 'right';
  
        const distances = {
          top: y,
          right: w - x,
          bottom: h - y,
          left: x
        };
  
        return Object.entries(distances).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
      }
    });
  }