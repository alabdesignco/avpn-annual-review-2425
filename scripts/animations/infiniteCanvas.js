const initInfiniteCanvas = () => {
  const container = document.querySelector(".section_home-header .home-header_wrapper");

  const halfX = container.clientWidth / 2;
  const wrapX = gsap.utils.wrap(-halfX, 0);
  const xTo = gsap.quickTo(container, "x", {
    duration: 1.5,
    ease: "power4",
    modifiers: {
      x: gsap.utils.unitize(wrapX),
    },
  });

  const halfY = container.clientHeight / 2;
  const wrapY = gsap.utils.wrap(-halfY, 0);
  const yTo = gsap.quickTo(container, "y", {
    duration: 1.5,
    ease: "power4",
    modifiers: {
      y: gsap.utils.unitize(wrapY),
    },
  });

  let incrX = 0,
    incrY = 0;

  Observer.create({
    target: window,
    type: "touch,pointer",
    onChangeX: (self) => {
      incrX += self.deltaX * 2;
      xTo(incrX);
    },
    onChangeY: (self) => {
      incrY += self.deltaY * 2;
      yTo(incrY);
    },
  });
};

export { initInfiniteCanvas };