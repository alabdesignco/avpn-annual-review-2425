export function initModalSlide() {
  const modalGroup = document.querySelector('[data-modal-slide-group]');
  if (!modalGroup) return null;

  const modals = modalGroup.querySelectorAll('[data-modal-slide-name]');
  const modalTargets = modalGroup.querySelectorAll('[data-modal-slide-target]');
  const closeBtns = modalGroup.querySelectorAll('[data-modal-slide-close]');

  const openModal = (targetName) => {
    const modal = modalGroup.querySelector(`[data-modal-slide-name="${targetName}"]`);

    if (modal) {
      // Stop videos in all other modals before opening new one
      modals.forEach((m) => {
        if (m !== modal) {
          stopVideosInModal(m);
        }
        m.setAttribute('data-modal-slide-status', 'not-active');
      });

      modal.setAttribute('data-modal-slide-status', 'active');
      modalGroup.setAttribute('data-modal-slide-group', 'active');

      gsap.set(modal, { opacity: 1 });
      gsap.fromTo(modal, 
        { y: '100%' }, 
        { y: '0%', duration: 0.6, ease: 'power3.out' }
      );
    }
  };

  let onCloseCallback = null;

  const stopVideosInModal = (modal) => {
    const iframes = modal.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const originalSrc = iframe.dataset.src || iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = originalSrc;
      }, 100);
    });
  };

  const closeModals = () => {
    const activeModal = modalGroup.querySelector('[data-modal-slide-name][data-modal-slide-status="active"]');
    
    if (activeModal) {
      stopVideosInModal(activeModal);

      gsap.to(activeModal, {
        y: '100%',
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          modalTargets.forEach((t) => t.setAttribute('data-modal-slide-status', 'not-active'));
          modals.forEach((m) => m.setAttribute('data-modal-slide-status', 'not-active'));
          modalGroup.setAttribute('data-modal-slide-group', 'not-active');
          gsap.set(activeModal, { opacity: 0 });
          if (onCloseCallback) onCloseCallback();
        }
      });
    }
  };

  modalTargets.forEach((target) => {
    target.addEventListener('click', function () {
      openModal(this.getAttribute('data-modal-slide-target'));
    });
  });

  closeBtns.forEach((btn) => btn.addEventListener('click', closeModals));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalGroup.getAttribute('data-modal-slide-group') === 'active') {
      closeModals();
    }
  });

  const setOnClose = (callback) => {
    onCloseCallback = callback;
  };

  return { openModal, closeModals, setOnClose };
}

