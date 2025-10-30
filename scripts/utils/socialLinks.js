export function initSocialLinks() {
  const socialLinks = document.querySelectorAll('.footer-social-link');
  
  if (!socialLinks.length) return;

  const colorMap = {
    facebook: 'var(--_primitives---brand--secondary--teal-main)',
    instagram: 'var(--_primitives---brand--secondary--orange-main)',
    x: 'var(--_primitives---brand--secondary--yellow-main)',
    linkedin: 'var(--_primitives---brand--secondary--emerald-main)',
    youtube: 'var(--_primitives---brand--primary--aqua-main)',
    buzzsprout: 'var(--_primitives---brand--primary--red-main)'
  };

  socialLinks.forEach(link => {
    const originalColor = window.getComputedStyle(link).color;
    
    link.addEventListener('mouseenter', () => {
      const platform = getPlatformFromLink(link);
      const hoverColor = colorMap[platform] || window.getComputedStyle(link).color;
      
      gsap.to(link, {
        color: hoverColor,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        color: originalColor,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

function getPlatformFromLink(link) {
  const dataLink = link.getAttribute('data-link');
  if (dataLink) return dataLink.toLowerCase();
  return 'default';
}
