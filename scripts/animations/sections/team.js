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
    const loadMoreBtn = document.querySelector('[data-team-load-more]');
    const transitionDelay = 300;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const itemsPerLoad = loadMoreBtn 
      ? parseInt(loadMoreBtn.getAttribute(isMobile ? 'data-items-per-load-mobile' : 'data-items-per-load')) || 10 
      : 10;
    let currentlyShown = {};

    if (loadMoreBtn) {
      gsap.set(loadMoreBtn, { opacity: 0, y: 20 });
    }

    const updateLoadMoreButton = (target) => {
      if (!loadMoreBtn) return;
      
      const categoryItems = Array.from(items).filter(
        item => item.getAttribute('data-filter-name') === target
      );
      
      if (categoryItems.length <= itemsPerLoad) {
        gsap.set(loadMoreBtn, { display: 'none', opacity: 0 });
        return;
      }
      
      const shown = currentlyShown[target] || itemsPerLoad;
      const shouldShow = shown < categoryItems.length;
      
      if (shouldShow) {
        gsap.set(loadMoreBtn, { display: 'flex' });
        gsap.to(loadMoreBtn, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: transitionDelay / 1000 + 0.2,
          ease: 'power2.out'
        });
      } else {
        gsap.set(loadMoreBtn, { display: 'none', opacity: 0 });
      }
    };

    const handleTabSwitch = (target) => {
      if (!currentlyShown[target]) {
        currentlyShown[target] = itemsPerLoad;
      }

      const categoryItems = Array.from(items).filter(
        item => item.getAttribute('data-filter-name') === target
      );

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
          const itemIndex = categoryItems.indexOf(item);
          if (itemIndex < currentlyShown[target]) {
            setTimeout(() => {
              item.setAttribute('data-filter-status', 'active');
              item.setAttribute('aria-hidden', 'false');
            }, transitionDelay);
          } else {
            item.setAttribute('data-filter-status', 'not-active');
            item.setAttribute('aria-hidden', 'true');
          }
        }
      });

      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      
      updateLoadMoreButton(target);
    };

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadMoreBtn.blur();
        loadMoreBtn.style.pointerEvents = 'none';
        
        const activeButton = group.querySelector('[data-filter-status="active"]');
        if (!activeButton) return;
        
        const target = activeButton.getAttribute('data-filter-target');
        const categoryItems = Array.from(items).filter(
          item => item.getAttribute('data-filter-name') === target
        );
        
        const currentShown = currentlyShown[target] || itemsPerLoad;
        const nextBatch = categoryItems.slice(currentShown, currentShown + itemsPerLoad);
        
        nextBatch.forEach((item, index) => {
          setTimeout(() => {
            item.setAttribute('data-filter-status', 'active');
            item.setAttribute('aria-hidden', 'false');
          }, transitionDelay + (index * 50));
        });
        
        currentlyShown[target] = currentShown + nextBatch.length;
        
        setTimeout(() => {
          loadMoreBtn.style.pointerEvents = 'auto';
        }, 500);
        
        if (currentlyShown[target] >= categoryItems.length) {
          gsap.to(loadMoreBtn, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            onComplete: () => loadMoreBtn.style.display = 'none'
          });
        }
      });
    }

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
