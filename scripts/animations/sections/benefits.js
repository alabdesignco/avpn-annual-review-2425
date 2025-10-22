export const initBenefitsSection = () => {
  const buttons = document.querySelectorAll('.button[data-tier]');
  
  buttons.forEach(button => {
    const tierValue = button.getAttribute('data-tier');
    if (!tierValue) return;
    
    button.addEventListener('click', () => {
      const lightbox = document.querySelector(`.benefits_lightbox[data-tier="${tierValue}"]`);
      if (lightbox) lightbox.click();
    });
  });
};

if (typeof Webflow !== 'undefined') {
  Webflow.push(() => initBenefitsTierClick());
} else {
  document.addEventListener('DOMContentLoaded', initBenefitsTierClick);
}

