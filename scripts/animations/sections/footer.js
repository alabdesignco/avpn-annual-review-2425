export const initFalling2DMatterJS = () => {
  const canvas = document.querySelector("#canvas-target");
  if (!canvas) return;

  const canvasWidth = canvas.clientWidth + 2;
  const canvasHeight = canvas.clientHeight + 2;
  const canvasWallDepth = canvasWidth / 4;
  const objectAmount = 25;
  const objectSize = canvasWidth / 15;
  const objectRestitution = 0.75;
  const worldGravity = 2;

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    Events = Matter.Events;

  const engine = Engine.create();
  engine.world.gravity.y = worldGravity;

  const render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      background: "transparent",
      wireframes: false,
      width: canvasWidth,
      height: canvasHeight,
      pixelRatio: 2,
      border: "none",
    }
  });

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  const min = objectSize / 2;
  const max = canvasWidth - (objectSize / 2);
  const COLORS = ["#e42919", "#00b4ae", "#007b69", "#f27c38", "#ffd552", "#91c7d6"];

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
      render: { fillStyle: color, strokeStyle: color }
    });
  };

  const createObject = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shapeType = Math.random();

    if (shapeType < 0.25) {
      const radius = objectSize * (0.3 + Math.random() * 0.95);
      const circle = Bodies.circle(getRandomNumber(min, max), -objectSize, radius, {
        restitution: objectRestitution,
        render: { fillStyle: color, strokeStyle: color }
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
        render: { fillStyle: color, strokeStyle: color }
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

      const variedRectangle = Bodies.rectangle(getRandomNumber(min, max), -objectSize, size, size, {
        chamfer: { radius: radiusArray },
        restitution: objectRestitution,
        render: { fillStyle: color, strokeStyle: color }
      });
      Composite.add(engine.world, variedRectangle);
    }
  };

  // Walls
  const boxTop = Bodies.rectangle(canvasWidth / 2, canvasHeight + canvasWallDepth, canvasWidth * 2, canvasWallDepth * 2, { isStatic: true });
  const boxLeft = Bodies.rectangle(-canvasWallDepth, canvasHeight / 2, canvasWallDepth * 2, canvasHeight, { isStatic: true });
  const boxRight = Bodies.rectangle(canvasWidth + canvasWallDepth, canvasHeight / 2, canvasWallDepth * 2, canvasHeight, { isStatic: true });
  const boxBottom = Bodies.rectangle(canvasWidth / 2, -canvasWallDepth, canvasWidth * 2, canvasWallDepth * 2, { isStatic: true });
  Composite.add(engine.world, [boxTop, boxLeft, boxRight, boxBottom]);

  const runner = Runner.create();
  let objectsCreated = 0;

  const repeatedFunction = () => {
    if (objectsCreated < objectAmount) {
      createObject();
      objectsCreated++;
      setTimeout(repeatedFunction, 100);
    }
  };

  // Start Matter.js engine immediately
  Render.run(render);
  Runner.run(runner, engine);
  setTimeout(repeatedFunction, 100);
  // Mouse interaction using native DOM events (canvas-specific)
  let mouseX = 0;
  let mouseY = 0;
  let isMouseOverCanvas = false;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isMouseOverCanvas = true;
  });

  canvas.addEventListener('mouseleave', () => {
    isMouseOverCanvas = false;
  });

  Events.on(engine, "afterUpdate", () => {
    if (!isMouseOverCanvas) return;
    
    const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);
    const hoverRadius = 150;
    
    bodies.forEach(body => {
      const dx = body.position.x - mouseX;
      const dy = body.position.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < hoverRadius) {
        const forceStrength = (1 - distance / hoverRadius) * 0.2;
        Matter.Body.setVelocity(body, {
          x: body.velocity.x,
          y: Math.min(body.velocity.y - forceStrength, -15)
        });
      }
    });
  });
};