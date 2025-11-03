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
          initPhysics(container);
          container.setAttribute('data-matter-initialized', 'true');
        } else {
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
  let resizeHandler, mousemoveHandler, mouseleaveHandler, touchStartHandler, touchMoveHandler, touchEndHandler;

  const COLORS = [ "#00b4ae", "#007b69", "#f27c38", "#ffd552", "#91c7d6"];
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
        container.removeEventListener("touchstart", touchStartHandler);
        container.removeEventListener("touchmove", touchMoveHandler);
        container.removeEventListener("touchend", touchEndHandler);
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

    const isMobile = window.matchMedia("(max-width:479px)").matches;
    const isTablet = window.matchMedia("(max-width:991px)").matches;
    const sizeMultiplier = isMobile ? 2 : isTablet ? 1.2 : 1;
    const spawnAmount = isMobile ? Math.round(objectAmount * 0.6) : isTablet ? Math.round(objectAmount * 1) : objectAmount;

    const objectSize = (containerWidth / 15) * sizeMultiplier;
    const min = objectSize / 2;
    const max = containerWidth - objectSize / 2;

    engine = Engine.create();
    
    const baseHeight = 900;
    const heightScale = Math.min(Math.max(containerHeight / baseHeight, 0.4), 1.2);
    engine.world.gravity.y = gravity * heightScale;
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
      if (objectsCreated < spawnAmount) {
        createObject();
        objectsCreated++;
        setTimeout(spawnLoop, 100);
      }
    };
    setTimeout(spawnLoop, 100);

    // Touch and mouse interaction effect
    let interactionX = 0;
    let interactionY = 0;
    let isInteracting = false;
    let isTouchDevice = 'ontouchstart' in window;

    const updateInteractionPosition = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      interactionX = clientX - rect.left;
      interactionY = clientY - rect.top;
      isInteracting = true;
    };

    const stopInteraction = () => {
      isInteracting = false;
    };

    // Mouse events
    mousemoveHandler = (e) => {
      if (!isTouchDevice) {
        updateInteractionPosition(e);
      }
    };

    mouseleaveHandler = () => {
      if (!isTouchDevice) {
        stopInteraction();
      }
    };

    // Touch events
    const touchStartHandler = (e) => {
      e.preventDefault();
      updateInteractionPosition(e);
    };

    const touchMoveHandler = (e) => {
      e.preventDefault();
      updateInteractionPosition(e);
    };

    const touchEndHandler = (e) => {
      e.preventDefault();
      stopInteraction();
    };

    // Add event listeners
    container.addEventListener("mousemove", mousemoveHandler);
    container.addEventListener("mouseleave", mouseleaveHandler);
    container.addEventListener("touchstart", touchStartHandler, { passive: false });
    container.addEventListener("touchmove", touchMoveHandler, { passive: false });
    container.addEventListener("touchend", touchEndHandler, { passive: false });

    Events.on(engine, "afterUpdate", () => {
      if (!isInteracting) return;
      const bodies = Composite.allBodies(engine.world).filter((b) => !b.isStatic);
      const interactionRadius = isTouchDevice ? 200 : 150; // Larger radius for touch
      const forceMultiplier = isTouchDevice ? 0.15 : 0.2; // Gentler force for touch
      
      bodies.forEach((body) => {
        const dx = body.position.x - interactionX;
        const dy = body.position.y - interactionY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < interactionRadius) {
          const forceStrength = (1 - distance / interactionRadius) * forceMultiplier;
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

  // Intersection Observer init
  if (animateOnScroll) {
    const initFooterIntersectionObserver = () => {
      const footerSection = document.querySelector(".footer_component");
      const container = document.querySelector("#canvas-target");
      
      if (!footerSection || !container) {
        console.warn('Footer section or canvas target not found. Falling back to load event initialization.');
        window.addEventListener("load", () => {
          if (container) initPhysics(container);
        });
        return;
      }

      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (container && !container.hasAttribute('data-matter-initialized')) {
              initPhysics(container);
              container.setAttribute('data-matter-initialized', 'true');
            }
            // Disconnect observer after first intersection (once: true equivalent)
            observer.disconnect();
          }
        });
      }, {
        root: null, // Use viewport as root
        rootMargin: '0px 0px -20% 0px', // Trigger when 80% of footer is visible (equivalent to "top 80%")
        threshold: 0.1 // Trigger when 10% of the element is visible
      });

      observer.observe(footerSection);
    };

    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initFooterIntersectionObserver, 1000);
      });
    } else {
      setTimeout(initFooterIntersectionObserver, 1000);
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