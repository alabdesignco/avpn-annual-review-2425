export const initRegionsSection = () => {
  const buttons = Array.from(document.querySelectorAll('.region_button'));
  const overlays = Array.from(document.querySelectorAll('.regions_base.is-overlay'));
  if (!buttons.length || !overlays.length) return;
  const getKeyFromClass = el => {
    const match = el.className.match(/is-(?!overlay)([a-z0-9-]+)/i);
    return match ? match[1] : '';
  };
  const keyFor = el => (el.getAttribute('data-region') || getKeyFromClass(el)).trim();
  const map = new Map();
  overlays.forEach(el => {
    const key = keyFor(el);
    if (key) map.set(key, el);
  });
  if (!map.size) return;
  gsap.set([...map.values()], { autoAlpha: 0, pointerEvents: 'none' });
  let active;
  let activeButton;
  const showOverlay = (target, button) => {
    if (active === target) return;
    const previous = active;
    if (previous) gsap.to(previous, { autoAlpha: 0, duration: 0.2, onComplete: () => gsap.set(previous, { display: 'none' }) });
    active = target;
    if (activeButton) activeButton.classList.remove('is-active');
    activeButton = button || null;
    if (activeButton) activeButton.classList.add('is-active');
    if (active) {
      gsap.set(active, { display: 'block' });
      gsap.fromTo(active, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    }
  };
  buttons.forEach(btn => {
    const key = keyFor(btn);
    const overlay = map.get(key);
    if (!overlay) return;
    btn.addEventListener('click', () => showOverlay(overlay, btn));
  });
};


