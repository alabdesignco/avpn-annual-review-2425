export const initSectionBgTransition = () => {
  const sections = gsap.utils.toArray("[data-bg-transition]");
  if (!sections.length) return;

  sections.forEach((section, index) => {
    const nextSection = sections[index + 1];
    if (!nextSection) return;

    const currentBg = window.getComputedStyle(section).backgroundColor;
    const nextBg = window.getComputedStyle(nextSection).backgroundColor;

    gsap.set(nextSection, { backgroundColor: currentBg });

    gsap.to(nextSection, {
      backgroundColor: nextBg,
      duration: 0.4,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: nextSection,
        start: "top 50%",
        toggleActions: "play complete none reverse",
      },
    });
  });
};

