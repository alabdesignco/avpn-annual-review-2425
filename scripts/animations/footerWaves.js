const waveColors = [
  '#FFD552', '#F27C38', '#E42919', 
  '#91C7D6', '#00B4AE', '#007B69'
];

const initFooterWaves = () => {
  let canvas = document.getElementById('wave-canvas');
  
  if (!canvas) {
    const container = document.getElementById('wave-container') || document.body;
    canvas = document.createElement('canvas');
    canvas.id = 'wave-canvas';
    container.appendChild(canvas);
  }

  if (canvas.tagName !== 'CANVAS') {
    const containerEl = canvas; // existing div#wave-canvas
    const c = document.createElement('canvas');
    c.style.position = 'absolute';
    c.style.left = '0';
    c.style.bottom = '0';
    c.style.width = '100%';
    c.style.height = '400px';
    c.style.pointerEvents = 'none';
    containerEl.style.position = containerEl.style.position || 'absolute';
    containerEl.appendChild(c);
    canvas = c;
  } else {
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.bottom = '0';
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    canvas.style.pointerEvents = 'none';
  }

  // Use built-in Math functions for wave generation
  const generateWave = (x, time, index) => {
    // Gentle rolling hills - smooth and calm
    return Math.sin(x * 0.005 + time * 0.01 + index * 0.3) * 0.6;
  };
  const ctx = canvas.getContext('2d');
  let w, h;
  let gradient;
  let time = 0;

  const resizeCanvas = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = 400;
    ctx.filter = 'blur(30px)';
    gradient = ctx.createLinearGradient(0, 0, w, 0);
    const stops = [0, 0.2, 0.4, 0.6, 0.8, 1];
    for (let i = 0; i < waveColors.length; i++) {
      gradient.addColorStop(stops[i], waveColors[i]);
    }
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const drawWave = (index) => {
    ctx.beginPath();
    ctx.globalAlpha = 0.35;

    const amplitude = 80;
    const speed = 0.01 + index * 0.002;
    const yOffset = h - 80 - index * 40;

    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 2) {
      const xOffset = time * 120 * (1 + index * 0.15);
      const y = yOffset + amplitude * generateWave(x + xOffset, time * speed, index);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const animate = () => {
    ctx.clearRect(0, 0, w, h);
    time += 0.01;

    for (let i = 0; i < 6; i++) {
      drawWave(i);
    }

    requestAnimationFrame(animate);
  };

  animate();
};

export { initFooterWaves };
