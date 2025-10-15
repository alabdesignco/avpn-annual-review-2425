export function initOdometerCounter() {
  document.querySelectorAll('.members-content_wrapper').forEach(wrapper => {
    const numberContainer = wrapper.querySelector('.members-number');
    const h2 = wrapper.querySelector('.heading-style-h2');
    const buttonGroup = wrapper.querySelector('.button-group');
    
    if (!numberContainer || !h2 || !buttonGroup) return;

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
        once: true
      }
    });

    tl.call(() => {
      odometer.update(endValue);
    })
    .fromTo([h2, buttonGroup], {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.4');
  });
}
