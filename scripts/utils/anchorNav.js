export function initAnchorNav() {
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
    const id = target.startsWith('#') ? target.slice(1) : target;
    const label = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
    
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

  const style = document.createElement('style');
  style.textContent = `
    .dot-tooltip {
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 1rem;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 1000;
    }
    
    .dots-nav [data-anchor-target]:hover .dot-tooltip {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

