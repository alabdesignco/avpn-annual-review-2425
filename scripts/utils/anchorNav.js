export function initAnchorNav() {
  const dotsNav = document.querySelector('.dots-nav');
  if (!dotsNav) return;

  const mm = gsap.matchMedia();

  mm.add({
    isMobile: "(max-width: 767px)",
    isDesktop: "(min-width: 768px)"
  }, (context) => {
    const { isMobile } = context.conditions;

    if (isMobile) {
      gsap.set(dotsNav, { y: 100, opacity: 0, pointerEvents: 'none' });
    } else {
      gsap.set(dotsNav, { x: 100, opacity: 0, pointerEvents: 'none' });
    }

    const forewordSection = document.querySelector('[data-section="foreword"]');
    if (forewordSection) {
      ScrollTrigger.create({
        trigger: forewordSection,
        start: 'bottom top',
        onEnter: () => {
          if (isMobile) {
            gsap.to(dotsNav, { y: 0, opacity: 1, pointerEvents: 'auto', duration: 0.6, ease: 'power2.out' });
          } else {
            gsap.to(dotsNav, { x: 0, opacity: 1, pointerEvents: 'auto', duration: 0.6, ease: 'power2.out' });
          }
        },
        onLeaveBack: () => {
          if (isMobile) {
            gsap.to(dotsNav, { y: 100, opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' });
          } else {
            gsap.to(dotsNav, { x: 100, opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' });
          }
        }
      });
    }

    return () => {
      gsap.set(dotsNav, { clearProps: 'x,y,opacity,pointerEvents' });
    };
  });

  const links = document.querySelectorAll('.dots-nav [data-anchor-target]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const target = this.getAttribute('data-anchor-target');
      
      if (window.lenis) {
        window.lenis.scrollTo(target, {
          easing: (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
          duration: 1.2,
          offset: 0
        });
      }
      
      return false;
    }, true);

    const target = link.getAttribute('data-anchor-target');
    const customLabel = link.getAttribute('data-label');
    const id = target.startsWith('#') ? target.slice(1) : target;
    const label = customLabel || id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
    
    const tooltip = document.createElement('span');
    tooltip.className = 'dot-tooltip';
    tooltip.textContent = label;
    link.style.position = 'relative';
    link.appendChild(tooltip);
  });

  const sections = Array.from(links).map(link => {
    const target = link.getAttribute('data-anchor-target');
    const id = target.startsWith('#') ? target.slice(1) : target;
    return document.getElementById(id);
  }).filter(Boolean);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          const target = link.getAttribute('data-anchor-target');
          const linkId = target.startsWith('#') ? target.slice(1) : target;
          link.classList.toggle('is-active', linkId === id);
        });
      }
    });
  }, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '-20% 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const lastId = lastSection.id;
        links.forEach(link => {
          const target = link.getAttribute('data-anchor-target');
          const linkId = target.startsWith('#') ? target.slice(1) : target;
          link.classList.toggle('is-active', linkId === lastId);
        });
      }
    }
  });
}

