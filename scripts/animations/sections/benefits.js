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
