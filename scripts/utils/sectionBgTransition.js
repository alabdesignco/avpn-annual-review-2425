export const initSectionBgTransition = () => {
  const sections = gsap.utils.toArray("[data-bg-transition]");
  if (!sections.length) return;

  const targetColors = sections.map(section => 
    section.style.backgroundColor || window.getComputedStyle(section).backgroundColor
  );

  sections.forEach((section, index) => {
    const nextSection = sections[index + 1];
    if (!nextSection) return;

    const initialBg = index === 0 ? targetColors[0] : targetColors[index];
    const targetBg = targetColors[index + 1];

    nextSection.style.backgroundColor = initialBg;
    gsap.set(nextSection, { backgroundColor: initialBg });

    gsap.to(nextSection, {
      backgroundColor: targetBg,
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

