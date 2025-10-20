export function initOdometerCounter() {
  document.querySelectorAll('.members-content_wrapper').forEach(wrapper => {
    const numberContainer = wrapper.querySelector('.members-number');
    if (!numberContainer) return;

    const target = numberContainer.querySelector('span:first-child');
    if (!target) return;

    const startValue = parseFloat(numberContainer.getAttribute('data-count-start')) || 0;
    const endValue = parseFloat(numberContainer.getAttribute('data-count-end')) || parseFloat(target.textContent.replace(/,/g, ''));
    
    target.textContent = startValue;
    target.classList.add('odometer');

    const odometer = new Odometer({
      el: target,
      value: startValue,
      format: '(,ddd)',
      duration: 2000
    });

    wrapper.odometerInstance = { odometer, endValue };
  });
}
