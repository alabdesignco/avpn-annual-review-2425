export function initTeam() {
  const initEntranceAnimations = () => {
    const section = document.querySelector('.section_team');
    if (!section) return;

    const introText = section.querySelector('.team_top .text-size-large');
    const filterGroup = section.querySelector('.filter-group');

    if (!introText || !filterGroup) return;

    gsap.set([introText, filterGroup], { 
      opacity: 0, 
      y: 30 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to(introText, { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: 'power3.out' 
    })
    .to(filterGroup, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power2.out' 
    }, '-=0.4');
  };

  initEntranceAnimations();

  const groups = document.querySelectorAll('[data-filter-group]');

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-target]');
    const items = group.querySelectorAll('[data-filter-name]');
    const transitionDelay = 300;

    const handleTabSwitch = (target) => {
      items.forEach((item) => {
        const itemCategory = item.getAttribute('data-filter-name');
        const shouldBeActive = itemCategory === target;
        const currentStatus = item.getAttribute('data-filter-status');

        if (currentStatus === 'active' && !shouldBeActive) {
          item.setAttribute('data-filter-status', 'transition-out');
          setTimeout(() => {
            item.setAttribute('data-filter-status', 'not-active');
            item.setAttribute('aria-hidden', 'true');
          }, transitionDelay);
        } else if (shouldBeActive) {
          setTimeout(() => {
            item.setAttribute('data-filter-status', 'active');
            item.setAttribute('aria-hidden', 'false');
          }, transitionDelay);
        }
      });

      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-filter-target');
        if (button.getAttribute('data-filter-status') === 'active') return;
        handleTabSwitch(target);
      });
    });

    const firstButton = buttons[0];
    if (firstButton) {
      handleTabSwitch(firstButton.getAttribute('data-filter-target'));
    }
  });
}
