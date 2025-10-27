export const initFalling2DMatterJS = () => {
  const animateOnScroll = true;

  if (typeof Matter === 'undefined') {
    console.warn('Matter.js is not loaded. Falling2D animation will not initialize.');
    return;
  }

  // Fallback initialization that doesn't depend on ScrollTrigger
  const fallbackInit = () => {
    const container = document.querySelector("#canvas-target");
    if (container && !container.hasAttribute('data-matter-initialized')) {
      // Check if footer section is actually visible
      const footerSection = container.closest('.footer_component');
      if (footerSection) {
        const rect = footerSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          console.log('Fallback: Footer section is visible - initializing Matter.js physics');
          initPhysics(container);
          container.setAttribute('data-matter-initialized', 'true');
        } else {
          console.log('Fallback: Footer section not visible yet, retrying in 1 second');
          setTimeout(fallbackInit, 1000);
        }
      }
    }
  };

  // Set up fallback timer as backup (longer delay since footer is last)
  setTimeout(fallbackInit, 4000);

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events;

  let engine, render, runner;
  let boxTop, boxBottom, boxLeft, boxRight;
  let resizeHandler, mousemoveHandler, mouseleaveHandler;

  const COLORS = ["#e42919", "#00b4ae", "#007b69", "#f27c38", "#ffd552", "#91c7d6"];
  const gravity = 2;
  const objectAmount = 25;
  const objectRestitution = 0.65;

  const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

  const cleanup = () => {
    if (engine) {
      Engine.clear(engine);
    }
    if (render) {
      Render.stop(render);
    }
    if (runner) {
      Runner.stop(runner);
    }
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
    }
    if (mousemoveHandler && mouseleaveHandler) {
      const container = document.querySelector("#canvas-target");
      if (container) {
        container.removeEventListener("mousemove", mousemoveHandler);
        container.removeEventListener("mouseleave", mouseleaveHandler);
      }
    }
  };

  const createSemicircle = (x, y, radius, color) => {
    const vertices = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const angle = Math.PI * (i / segments);
      vertices.push({ x: Math.cos(angle) * radius, y: -Math.sin(angle) * radius });
    }
    vertices.push({ x: -radius, y: 0 });
    return Bodies.fromVertices(x, y, [vertices], {
      restitution: objectRestitution,
      render: { fillStyle: color, strokeStyle: color },
    });
  };

  const initPhysics = (container) => {
    cleanup();
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    const containerWallDepth = containerWidth / 4;

    const objectSize = containerWidth / 15;
    const min = objectSize / 2;
    const max = containerWidth - objectSize / 2;

    engine = Engine.create();
    engine.world.gravity.y = gravity;
    engine.timing.timeScale = 0.9;

    render = Render.create({
      element: container,
      engine: engine,
      options: {
        background: "transparent",
        wireframes: false,
        width: containerWidth,
        height: containerHeight,
        pixelRatio: window.devicePixelRatio || 2,
      },
    });

    render.canvas.width = containerWidth * (window.devicePixelRatio || 2);
    render.canvas.height = containerHeight * (window.devicePixelRatio || 2);
    render.canvas.style.width = `${containerWidth}px`;
    render.canvas.style.height = `${containerHeight}px`;

    // Build world walls
    boxTop = Bodies.rectangle(
      containerWidth / 2,
      -containerWallDepth,
      containerWidth * 2,
      containerWallDepth * 2,
      { isStatic: true }
    );
    boxBottom = Bodies.rectangle(
      containerWidth / 2,
      containerHeight + containerWallDepth,
      containerWidth * 2,
      containerWallDepth * 2,
      { isStatic: true }
    );
    boxLeft = Bodies.rectangle(
      -containerWallDepth,
      containerHeight / 2,
      containerWallDepth * 2,
      containerHeight * 2,
      { isStatic: true }
    );
    boxRight = Bodies.rectangle(
      containerWidth + containerWallDepth,
      containerHeight / 2,
      containerWallDepth * 2,
      containerHeight * 2,
      { isStatic: true }
    );

    Composite.add(engine.world, [boxTop, boxBottom, boxLeft, boxRight]);

    // Object creation
    const createObject = () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shapeType = Math.random();

      if (shapeType < 0.25) {
        const radius = objectSize * (0.3 + Math.random() * 0.95);
        const circle = Bodies.circle(getRandomNumber(min, max), -objectSize, radius, {
          restitution: objectRestitution,
          render: { fillStyle: color, strokeStyle: color },
        });
        Composite.add(engine.world, circle);
      } else if (shapeType < 0.5) {
        const radius = objectSize * (0.3 + Math.random() * 0.95);
        const semicircle = createSemicircle(getRandomNumber(min, max), -objectSize, radius, color);
        Composite.add(engine.world, semicircle);
      } else if (shapeType < 0.75) {
        const size = objectSize * (0.5 + Math.random() * 0.75);
        const rectangle = Bodies.rectangle(getRandomNumber(min, max), -objectSize, size, size, {
          chamfer: { radius: size * 0.15 },
          restitution: objectRestitution,
          render: { fillStyle: color, strokeStyle: color },
        });
        Composite.add(engine.world, rectangle);
      } else {
        const size = objectSize * (0.5 + Math.random() * 0.75);
        const baseRadius = size * 0.15;
        const cornerIndex = Math.floor(Math.random() * 4);
        const normalRadius = baseRadius * (0.5 + Math.random() * 0.5);
        const largeRadius = normalRadius * 3;
        const radiusArray = [normalRadius, normalRadius, normalRadius, normalRadius];
        radiusArray[cornerIndex] = largeRadius;

        const variedRectangle = Bodies.rectangle(
          getRandomNumber(min, max),
          -objectSize,
          size,
          size,
          {
            chamfer: { radius: radiusArray },
            restitution: objectRestitution,
            render: { fillStyle: color, strokeStyle: color },
          }
        );
        Composite.add(engine.world, variedRectangle);
      }
    };

    runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);

    let objectsCreated = 0;
    const spawnLoop = () => {
      if (objectsCreated < objectAmount) {
        createObject();
        objectsCreated++;
        setTimeout(spawnLoop, 100);
      }
    };
    setTimeout(spawnLoop, 100);

    // Hover lift effect
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOverCanvas = false;

    mousemoveHandler = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOverCanvas = true;
    };

    mouseleaveHandler = () => {
      isMouseOverCanvas = false;
    };

    container.addEventListener("mousemove", mousemoveHandler);
    container.addEventListener("mouseleave", mouseleaveHandler);

    Events.on(engine, "afterUpdate", () => {
      if (!isMouseOverCanvas) return;
      const bodies = Composite.allBodies(engine.world).filter((b) => !b.isStatic);
      const hoverRadius = 150;
      bodies.forEach((body) => {
        const dx = body.position.x - mouseX;
        const dy = body.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < hoverRadius) {
          const forceStrength = (1 - distance / hoverRadius) * 0.2;
          Matter.Body.setVelocity(body, {
            x: body.velocity.x,
            y: Math.min(body.velocity.y - forceStrength, -15),
          });
        }
      });
    });

    // Responsive resize — updates canvas and walls
    let resizeTimeout;
    resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Pause physics during resize
        Runner.stop(runner);
        
        const rect = container.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height;

        // Update canvas dimensions
        render.canvas.width = newWidth * (window.devicePixelRatio || 2);
        render.canvas.height = newHeight * (window.devicePixelRatio || 2);
        render.canvas.style.width = `${newWidth}px`;
        render.canvas.style.height = `${newHeight}px`;

        // Get all non-static bodies (falling objects)
        const bodies = Composite.allBodies(engine.world).filter(body => !body.isStatic);
        
        // Reposition objects that are outside new boundaries
        bodies.forEach(body => {
          const x = Math.max(50, Math.min(body.position.x, newWidth - 50));
          const y = Math.max(50, Math.min(body.position.y, newHeight - 50));
          Matter.Body.setPosition(body, { x, y });
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
        });

        // Remove old walls
        Composite.remove(engine.world, [boxTop, boxBottom, boxLeft, boxRight]);

        // Create new walls
        const wallDepth = newWidth / 4;
        boxTop = Bodies.rectangle(newWidth / 2, -wallDepth, newWidth * 2, wallDepth * 2, { isStatic: true });
        boxBottom = Bodies.rectangle(newWidth / 2, newHeight + wallDepth, newWidth * 2, wallDepth * 2, { isStatic: true });
        boxLeft = Bodies.rectangle(-wallDepth, newHeight / 2, wallDepth * 2, newHeight * 2, { isStatic: true });
        boxRight = Bodies.rectangle(newWidth + wallDepth, newHeight / 2, wallDepth * 2, newHeight * 2, { isStatic: true });

        Composite.add(engine.world, [boxTop, boxBottom, boxLeft, boxRight]);

        // Resume physics
        Runner.run(runner, engine);
      }, 200);
    };
    window.addEventListener("resize", resizeHandler);
  };

  // Scroll-triggered init
  if (animateOnScroll) {
    if (typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollTrigger is not loaded. Falling back to load event initialization.');
      window.addEventListener("load", () => {
        const container = document.querySelector("#canvas-target");
        if (container) initPhysics(container);
      });
      return;
    }

    // Wait for other ScrollTriggers to initialize first
    const initFooterScrollTriggers = () => {
      document.querySelectorAll(".footer_component").forEach((section) => {
        if (section.querySelector("#canvas-target")) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%", // Start when footer is 80% in view
            end: "bottom 20%", // End when footer is 20% out of view
            once: true,
            refreshPriority: 1, // Lower priority than partners.js (-1)
            onEnter: () => {
              const container = section.querySelector("#canvas-target");
              if (container && !container.hasAttribute('data-matter-initialized')) {
                console.log('Footer ScrollTrigger activated - initializing Matter.js');
                initPhysics(container);
                container.setAttribute('data-matter-initialized', 'true');
              }
            },
            onLeave: () => {
              console.log('Footer section left view');
            },
            onEnterBack: () => {
              console.log('Footer section entered back');
            }
          });
        }
      });
    };

    // Initialize after other sections have had time to set up their ScrollTriggers
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Wait longer since footer is last in the sequence
        setTimeout(initFooterScrollTriggers, 1000);
      });
    } else {
      setTimeout(initFooterScrollTriggers, 1000);
    }
  } else {
    window.addEventListener("load", () => {
      const container = document.querySelector("#canvas-target");
      if (container && !container.hasAttribute('data-matter-initialized')) {
        initPhysics(container);
        container.setAttribute('data-matter-initialized', 'true');
      }
    });
  }

  return { cleanup };
};