import { STEMVisual, PresetPrompt } from '../types';

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'double-pendulum',
    title: 'Double Pendulum & Chaotic Dynamics',
    category: 'Physics',
    prompt: 'Double pendulum chaotic motion with Lagrangian mechanics, colored persistent trajectory trail, phase space graph, and draggable bobs',
    badge: 'Chaotic Physics',
    iconName: 'Activity',
    description: 'Demonstrates extreme sensitivity to initial conditions (the Butterfly Effect) via coupled non-linear differential equations.',
  },
  {
    id: 'fourier-epicycles',
    title: 'Fourier Series & Epicycles',
    category: 'Mathematics',
    prompt: 'Fourier transform epicycles drawing a complex shape with spinning harmonic circle vectors, frequency spectrum, and customizable harmonics count',
    badge: 'Harmonics',
    iconName: 'Cpu',
    description: 'Deconstructs arbitrary waveforms into sums of rotating complex exponential vectors (epicycles).',
  },
  {
    id: 'gravitational-nbody',
    title: 'Gravitational N-Body Planetary System',
    category: 'Astronomy',
    prompt: 'Solar system gravitational n-body orbital mechanics simulation with Newton universal gravitation, velocity vectors, collision mergers, and click-to-spawn bodies',
    badge: 'Orbital Mechanics',
    iconName: 'Globe',
    description: 'Simulates gravitational attraction between multiple celestial bodies governed by Newton\'s Law of Universal Gravitation.',
  },
  {
    id: 'molecular-gas',
    title: 'Molecular Dynamics & Gas Laws',
    category: 'Chemistry',
    prompt: 'Ideal and real gas molecular kinetics simulation with Maxwell-Boltzmann velocity distribution, interactive temperature, volume piston, and pressure gauge',
    badge: 'Thermodynamics',
    iconName: 'Flame',
    description: 'Visualizes kinetic molecular theory: particle collisions, Maxwell-Boltzmann velocity distribution, and Boyle-Charles gas relationships.',
  },
  {
    id: 'wave-interference',
    title: 'Wave Interference & Young\'s Double Slit',
    category: 'Physics',
    prompt: 'Wave interference ripples in a 2D water/light field with dual point sources, phase shifting, wavelength controls, and intensity fringe detector',
    badge: 'Quantum / Optics',
    iconName: 'Radio',
    description: 'Shows constructive and destructive interference wavefronts and fringe patterns resulting from superposition.',
  },
  {
    id: 'neural-perceptron',
    title: 'Neural Network Decision Boundary',
    category: 'Computer Science',
    prompt: '2D classification neural network with interactive data point placement, gradient descent weight updates, decision contour heatmaps, and learning rate slider',
    badge: 'Machine Learning',
    iconName: 'GitBranch',
    description: 'Visualizes how neural weights shift to construct non-linear decision boundaries through backpropagation.',
  },
];

// High-fidelity pre-compiled visual for instant initial launch
export const DEFAULT_INITIAL_VISUAL: STEMVisual = {
  id: 'double-pendulum-default',
  title: 'Double Pendulum & Chaotic Lagrangian Mechanics',
  prompt: 'Double pendulum chaotic motion with Lagrangian mechanics, colored persistent trajectory trail, phase space graph, and draggable bobs',
  category: 'Physics',
  description: 'Simulates the classic double compound pendulum governed by coupled non-linear Euler-Lagrange equations. Demonstrates deterministic chaos and sensitivity to initial angles.',
  scientificPrinciples: [
    'Euler-Lagrange Equations of Motion',
    'Conservation of Total Mechanical Energy: E = T + V',
    'Deterministic Chaos & Sensitive Dependence on Initial Conditions (Lyapunov Exponent)',
    'Runge-Kutta 4th Order (RK4) Numerical Integration',
  ],
  interactiveFeatures: [
    'Drag either pendulum bob with your mouse/touch to set new initial angles',
    'Adjust gravity, rod lengths (L1, L2), and bob masses (M1, M2)',
    'Toggle rainbow motion trails and velocity vectors',
    'Real-time HUD displays Kinetic Energy, Potential Energy, and Total System Energy',
  ],
  createdAt: Date.now(),
  htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Double Pendulum Chaos</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background: #090d16;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
      display: flex;
    }
    #canvas-container {
      flex: 1;
      position: relative;
      height: 100%;
      background: radial-gradient(circle at center, #111827 0%, #080c14 100%);
    }
    canvas { display: block; width: 100%; height: 100%; }
    .hud-panel {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(15, 23, 42, 0.82);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 13px;
      color: #94a3b8;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      min-width: 210px;
    }
    .hud-title { font-weight: 700; color: #38bdf8; margin-bottom: 6px; font-size: 14px; letter-spacing: 0.5px; }
    .hud-stat { display: flex; justify-content: space-between; margin-bottom: 4px; font-family: monospace; font-size: 12px; }
    .hud-val { color: #f1f5f9; font-weight: 600; }
    .controls-panel {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.6);
      flex-wrap: wrap;
      max-width: 90vw;
    }
    .ctrl-group { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1; }
    .ctrl-group label { font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; }
    input[type=range] {
      accent-color: #06b6d4;
      width: 80px;
      height: 4px;
      background: #334155;
      border-radius: 2px;
      cursor: pointer;
    }
    .btn {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #f8fafc;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .btn:hover { background: #334155; border-color: #38bdf8; }
    .btn-active { background: #0284c7; border-color: #38bdf8; }
    .drag-hint {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 12px;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
      pointer-events: none;
    }
  </style>
  <script>
    // System Error Catching Hook
    window.onerror = function(msg, url, line, col, err) {
      window.parent.postMessage({
        type: 'VISU_RUNTIME_ERROR',
        error: {
          message: String(msg),
          line: line,
          column: col,
          stack: err && err.stack ? err.stack : ''
        }
      }, '*');
      return false;
    };
    window.addEventListener('unhandledrejection', function(e) {
      window.parent.postMessage({
        type: 'VISU_RUNTIME_ERROR',
        error: {
          message: e.reason?.message || String(e.reason),
          stack: e.reason?.stack || ''
        }
      }, '*');
    });

    // Visibility Hook for IntersectionObserver
    let isScrollPaused = false;
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'VISU_VISIBILITY_CHANGE') {
        isScrollPaused = !e.data.isVisible;
        if (!isScrollPaused && isRunning) {
          lastTime = performance.now();
          requestAnimationFrame(loop);
        }
      }
    });

    window.addEventListener('DOMContentLoaded', function() {
      window.parent.postMessage({ type: 'VISU_READY' }, '*');
    });
  </script>
</head>
<body>
  <div id="canvas-container">
    <canvas id="simCanvas"></canvas>
    
    <div class="hud-panel">
      <div class="hud-title">LAGRANGIAN DYNAMICS</div>
      <div class="hud-stat"><span>Kinetic Energy (T):</span> <span id="keVal" class="hud-val">0.00 J</span></div>
      <div class="hud-stat"><span>Potential Energy (V):</span> <span id="peVal" class="hud-val">0.00 J</span></div>
      <div class="hud-stat"><span>Total Energy (E):</span> <span id="teVal" class="hud-val">0.00 J</span></div>
      <div class="hud-stat"><span>Chaos Divergence:</span> <span id="divVal" class="hud-val" style="color: #f43f5e;">Active</span></div>
      <div class="hud-stat"><span>Sim Framerate:</span> <span id="fpsVal" class="hud-val" style="color: #10b981;">60 FPS</span></div>
    </div>

    <div class="drag-hint">
      <span>●</span> Click & drag either pendulum bob
    </div>

    <div class="controls-panel">
      <button id="playBtn" class="btn btn-active">⏸ Pause</button>
      <button id="resetBtn" class="btn">↺ Reset</button>
      <button id="clearTrailBtn" class="btn">Clear Trail</button>

      <div class="ctrl-group">
        <label>Gravity</label>
        <input id="gravitySlider" type="range" min="2" max="25" value="9.81" step="0.1">
        <span id="gVal" style="font-family: monospace; font-size: 11px;">9.8</span>
      </div>

      <div class="ctrl-group">
        <label>Mass 2</label>
        <input id="m2Slider" type="range" min="5" max="40" value="15" step="1">
        <span id="m2Val" style="font-family: monospace; font-size: 11px;">15</span>
      </div>

      <div class="ctrl-group">
        <label>Damping</label>
        <input id="dampSlider" type="range" min="0" max="0.005" value="0.0003" step="0.0001">
      </div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('simCanvas');
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let originX = 0;
    let originY = 0;

    // Simulation constants & state
    let r1 = 140;
    let r2 = 140;
    let m1 = 20;
    let m2 = 15;
    let a1 = Math.PI / 2;
    let a2 = Math.PI / 2;
    let a1_v = 0;
    let a2_v = 0;
    let g = 9.81;
    let damping = 0.0003;

    let isRunning = true;
    let isDragging = null; // 1 or 2
    let trail = [];
    const MAX_TRAIL = 1200;

    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      originX = width / 2;
      originY = height * 0.35;
      r1 = Math.min(width, height) * 0.22;
      r2 = Math.min(width, height) * 0.22;
    }
    window.addEventListener('resize', resize);
    resize();

    // Physics step using coupled differential equations
    function physicsStep(dt) {
      if (!isDragging) {
        // Run RK4 or semi-implicit Euler with substepping for high numerical stability
        const substeps = 6;
        const subDt = dt / substeps;

        for (let step = 0; step < substeps; step++) {
          const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
          const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
          const num3 = -2 * Math.sin(a1 - a2) * m2;
          const num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
          const den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
          const a1_a = (num1 + num2 + num3 * num4) / den;

          const num5 = 2 * Math.sin(a1 - a2);
          const num6 = (a1_v * a1_v * r1 * (m1 + m2));
          const num7 = g * (m1 + m2) * Math.cos(a1);
          const num8 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
          const den2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
          const a2_a = (num5 * (num6 + num7 + num8)) / den2;

          a1_v += a1_a * subDt;
          a2_v += a2_a * subDt;
          a1_v *= (1 - damping);
          a2_v *= (1 - damping);
          a1 += a1_v * subDt;
          a2 += a2_v * subDt;
        }
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid & coordinate background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Positions
      const x1 = originX + r1 * Math.sin(a1);
      const y1 = originY + r1 * Math.cos(a1);
      const x2 = x1 + r2 * Math.sin(a2);
      const y2 = y1 + r2 * Math.cos(a2);

      // Record trajectory
      if (isRunning && !isDragging) {
        trail.push({ x: x2, y: y2, speed: Math.hypot(a1_v * r1, a2_v * r2) });
        if (trail.length > MAX_TRAIL) trail.shift();
      }

      // Draw glowing trajectory
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const ratio = i / trail.length;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          const hue = (190 + ratio * 150) % 360;
          ctx.strokeStyle = \`hsla(\${hue}, 90%, 55%, \${ratio * 0.8})\`;
          ctx.lineWidth = 1 + ratio * 2;
          ctx.stroke();
        }
      }

      // Pivot
      ctx.beginPath();
      ctx.arc(originX, originY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#64748b';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rod 1
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bob 1
      ctx.beginPath();
      ctx.arc(x1, y1, m1 * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rod 2
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Bob 2
      ctx.beginPath();
      ctx.arc(x2, y2, m2 * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#fb7185';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffe4e6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate Energy
      const v1Sq = (r1 * a1_v) ** 2;
      const v2Sq = (r1 * a1_v) ** 2 + (r2 * a2_v) ** 2 + 2 * r1 * r2 * a1_v * a2_v * Math.cos(a1 - a2);
      const T = 0.5 * m1 * v1Sq + 0.5 * m2 * v2Sq;
      const V = -(m1 + m2) * g * r1 * Math.cos(a1) - m2 * g * r2 * Math.cos(a2);
      const E = T + V;

      document.getElementById('keVal').textContent = (T * 0.001).toFixed(2) + ' J';
      document.getElementById('peVal').textContent = (V * 0.001).toFixed(2) + ' J';
      document.getElementById('teVal').textContent = (E * 0.001).toFixed(2) + ' J';
    }

    function loop(now) {
      if (isScrollPaused) return; // IntersectionObserver CPU Saver!

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (isRunning) {
        physicsStep(dt);
      }
      render();

      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        document.getElementById('fpsVal').textContent = frameCount + ' FPS';
        frameCount = 0;
        lastFpsUpdate = now;
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Mouse Dragging Interactions
    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scaleX = (canvas.width / (rect.width || 1)) / dpr;
      const scaleY = (canvas.height / (rect.height || 1)) / dpr;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    }

    function onPointerDown(e) {
      const pos = getPointerPos(e);
      const x1 = originX + r1 * Math.sin(a1);
      const y1 = originY + r1 * Math.cos(a1);
      const x2 = x1 + r2 * Math.sin(a2);
      const y2 = y1 + r2 * Math.cos(a2);

      const d2 = Math.hypot(pos.x - x2, pos.y - y2);
      const d1 = Math.hypot(pos.x - x1, pos.y - y1);

      if (d2 < 30) {
        isDragging = 2;
        a2_v = 0;
      } else if (d1 < 30) {
        isDragging = 1;
        a1_v = 0;
      }
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const pos = getPointerPos(e);
      if (isDragging === 1) {
        a1 = Math.atan2(pos.x - originX, pos.y - originY);
        a1_v = 0;
      } else if (isDragging === 2) {
        const x1 = originX + r1 * Math.sin(a1);
        const y1 = originY + r1 * Math.cos(a1);
        a2 = Math.atan2(pos.x - x1, pos.y - y1);
        a2_v = 0;
      }
    }

    function onPointerUp() {
      isDragging = null;
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Controls
    const playBtn = document.getElementById('playBtn');
    playBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      playBtn.textContent = isRunning ? '⏸ Pause' : '▶ Play';
      playBtn.classList.toggle('btn-active', isRunning);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      a1 = Math.PI / 2;
      a2 = Math.PI / 2;
      a1_v = 0;
      a2_v = 0;
      trail = [];
    });

    document.getElementById('clearTrailBtn').addEventListener('click', () => {
      trail = [];
    });

    const gSlider = document.getElementById('gravitySlider');
    gSlider.addEventListener('input', (e) => {
      g = parseFloat(e.target.value);
      document.getElementById('gVal').textContent = g.toFixed(1);
    });

    const m2Slider = document.getElementById('m2Slider');
    m2Slider.addEventListener('input', (e) => {
      m2 = parseFloat(e.target.value);
      document.getElementById('m2Val').textContent = m2.toString();
    });

    document.getElementById('dampSlider').addEventListener('input', (e) => {
      damping = parseFloat(e.target.value);
    });
  </script>
</body>
</html>`,
};

export const WAVE_INTERFERENCE_VISUAL: STEMVisual = {
  id: 'wave-interference-visual',
  title: 'Wave Interference & Superposition (Double Slit)',
  prompt: 'Wave interference ripples in a 2D water/light field with dual point sources, phase shifting, wavelength controls, and intensity fringe detector',
  category: 'Physics',
  description: 'Simulates constructive and destructive interference resulting from the wave superposition principle of two coherent harmonic point sources.',
  scientificPrinciples: [
    'Principle of Superposition: Ψ_total = Ψ_1 + Ψ_2',
    'Path Difference & Phase Shift: Δr = d·sin(θ) = m·λ (Constructive)',
    'Destructive Interference: Δr = (m + 1/2)·λ',
    'Huygens-Fresnel Wavefront Propagation',
  ],
  interactiveFeatures: [
    'Drag either source pin directly on the canvas to move wave emitters',
    'Tune Wavelength (λ), Frequency, Source Separation, and Phase Difference (Δφ)',
    'Real-time Intensity Fringe detector along the right screen margin',
    'Color palette toggles: Neon Cyan, Quantum Indigo, and Heatmap',
  ],
  createdAt: Date.now(),
  htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wave Interference Simulator</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #070a12; color: #e2e8f0; font-family: sans-serif; overflow: hidden; height: 100vh; width: 100vw; }
    #canvas-container { position: relative; width: 100%; height: 100%; }
    canvas { display: block; width: 100%; height: 100%; }
    .hud {
      position: absolute; top: 16px; left: 16px;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
      padding: 12px 16px; font-size: 12px; pointer-events: none; min-width: 200px;
    }
    .hud-title { font-weight: 700; color: #38bdf8; margin-bottom: 4px; }
    .hud-row { display: flex; justify-content: space-between; font-family: monospace; margin-bottom: 3px; }
    .controls {
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px;
      padding: 10px 18px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; max-width: 92vw;
    }
    .ctrl { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
    input[type=range] { accent-color: #06b6d4; width: 75px; cursor: pointer; }
    .btn { background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.14); color: #fff; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; }
    .btn:hover { background: #334155; }
  </style>
  <script>
    window.onerror = function(msg, url, line, col, err) {
      window.parent.postMessage({ type: 'VISU_RUNTIME_ERROR', error: { message: String(msg), line, column: col, stack: err?.stack || '' } }, '*');
      return false;
    };
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'VISU_VISIBILITY_CHANGE') {
        window.isPaused = !e.data.isVisible;
        if (!window.isPaused) requestAnimationFrame(loop);
      }
    });
    window.addEventListener('DOMContentLoaded', () => window.parent.postMessage({ type: 'VISU_READY' }, '*'));
  </script>
</head>
<body>
  <div id="canvas-container">
    <canvas id="waveCanvas"></canvas>
    <div class="hud">
      <div class="hud-title">WAVE INTERFERENCE (2D)</div>
      <div class="hud-row"><span>Wavelength (λ):</span> <span id="wTxt" style="color:#38bdf8;">32 px</span></div>
      <div class="hud-row"><span>Phase Shift (Δφ):</span> <span id="pTxt" style="color:#a855f7;">0.00 rad</span></div>
      <div class="hud-row"><span>Simulation:</span> <span id="fpsTxt" style="color:#10b981;">60 FPS</span></div>
    </div>
    <div class="controls">
      <button id="playBtn" class="btn">⏸ Pause</button>
      <button id="resetBtn" class="btn">↺ Reset</button>
      <div class="ctrl"><label>Wavelength</label><input id="wSlider" type="range" min="15" max="60" value="32"></div>
      <div class="ctrl"><label>Frequency</label><input id="fSlider" type="range" min="1" max="5" value="2.5" step="0.1"></div>
      <div class="ctrl"><label>Phase</label><input id="pSlider" type="range" min="0" max="6.28" value="0" step="0.1"></div>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let s1 = { x: 0, y: 0 };
    let s2 = { x: 0, y: 0 };
    let lambda = 32, freq = 2.5, phaseDiff = 0;
    let isRunning = true;
    let dragging = null;
    let t = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      s1.x = width * 0.35; s1.y = height * 0.45;
      s2.x = width * 0.35; s2.y = height * 0.55;
    }
    window.addEventListener('resize', resize);
    resize();

    function render() {
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, width, height);

      // Render interference grid using fast step blocks
      const step = 8;
      const k = (2 * Math.PI) / lambda;
      const omega = freq;

      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const d1 = Math.hypot(x - s1.x, y - s1.y);
          const d2 = Math.hypot(x - s2.x, y - s2.y);
          const psi1 = Math.cos(k * d1 - omega * t);
          const psi2 = Math.cos(k * d2 - omega * t + phaseDiff);
          const psi = (psi1 + psi2) * 0.5;

          const intensity = Math.min(Math.max((psi + 1) * 0.5, 0), 1);
          const r = Math.floor(10 + intensity * 40);
          const g = Math.floor(40 + intensity * 190);
          const b = Math.floor(100 + intensity * 155);

          ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`;
          ctx.fillRect(x, y, step, step);
        }
      }

      // Draw emitters
      [s1, s2].forEach((s, idx) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = idx === 0 ? '#38bdf8' : '#a855f7';
        ctx.shadowColor = idx === 0 ? '#38bdf8' : '#a855f7';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Intensity fringe strip along right margin
      const stripX = width - 40;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(stripX, 0, 40, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(stripX, 0, 40, height);

      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let y = 0; y < height; y += 4) {
        const d1 = Math.hypot(stripX - s1.x, y - s1.y);
        const d2 = Math.hypot(stripX - s2.x, y - s2.y);
        const psi1 = Math.cos(k * d1 - omega * t);
        const psi2 = Math.cos(k * d2 - omega * t + phaseDiff);
        const intensity = ((psi1 + psi2) * 0.5) ** 2;
        const curveX = stripX + 35 - intensity * 30;
        if (y === 0) ctx.moveTo(curveX, y);
        else ctx.lineTo(curveX, y);
      }
      ctx.stroke();
    }

    let lastTime = performance.now();
    function loop(now) {
      if (window.isPaused) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isRunning) t += dt * 3;
      render();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Emitter dragging
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      if (Math.hypot(mx - s1.x, my - s1.y) < 25) dragging = 1;
      else if (Math.hypot(mx - s2.x, my - s2.y) < 25) dragging = 2;
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      const mx = Math.max(20, Math.min(width - 60, e.clientX - rect.left));
      const my = Math.max(20, Math.min(height - 20, e.clientY - rect.top));
      if (dragging === 1) { s1.x = mx; s1.y = my; }
      else if (dragging === 2) { s2.x = mx; s2.y = my; }
    });
    window.addEventListener('mouseup', () => dragging = null);

    // Controls
    document.getElementById('playBtn').addEventListener('click', (e) => {
      isRunning = !isRunning;
      e.target.textContent = isRunning ? '⏸ Pause' : '▶ Play';
    });
    document.getElementById('resetBtn').addEventListener('click', () => {
      s1.x = width * 0.35; s1.y = height * 0.45;
      s2.x = width * 0.35; s2.y = height * 0.55;
      t = 0;
    });
    document.getElementById('wSlider').addEventListener('input', (e) => {
      lambda = parseFloat(e.target.value);
      document.getElementById('wTxt').textContent = lambda + ' px';
    });
    document.getElementById('fSlider').addEventListener('input', (e) => freq = parseFloat(e.target.value));
    document.getElementById('pSlider').addEventListener('input', (e) => {
      phaseDiff = parseFloat(e.target.value);
      document.getElementById('pTxt').textContent = phaseDiff.toFixed(2) + ' rad';
    });
  </script>
</body>
</html>`,
};

export const GRAVITATIONAL_NBODY_VISUAL: STEMVisual = {
  id: 'gravitational-nbody-visual',
  title: 'Gravitational N-Body Orbital Mechanics',
  prompt: 'Solar system gravitational n-body orbital mechanics simulation with Newton universal gravitation, velocity vectors, collision mergers, and click-to-spawn bodies',
  category: 'Astronomy',
  description: 'Simulates gravitational interactions between celestial bodies governed by Newton\'s Universal Law of Gravitation, showing Keplerian orbits and multi-body chaos.',
  scientificPrinciples: [
    'Newton\'s Law of Universal Gravitation: F = G·(m1·m2) / r²',
    'Conservation of Linear and Angular Momentum: L = r × p',
    'Kepler\'s Laws of Planetary Motion & Orbital Eccentricity',
    'Velocity Verlet Numerical Integration',
  ],
  interactiveFeatures: [
    'Click and drag anywhere on the canvas to fling and spawn a new celestial body',
    'Tune Gravitational Constant (G), Collision merging, and Particle count',
    'Follow mode: click any body to track its orbital frame of reference',
    'Toggle velocity vectors, trails, and center of mass crosshair',
  ],
  createdAt: Date.now(),
  htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gravitational N-Body Simulation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #060911; color: #e2e8f0; font-family: sans-serif; overflow: hidden; height: 100vh; width: 100vw; }
    #canvas-container { position: relative; width: 100%; height: 100%; }
    canvas { display: block; width: 100%; height: 100%; }
    .hud {
      position: absolute; top: 16px; left: 16px;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
      padding: 12px 16px; font-size: 12px; pointer-events: none; min-width: 210px;
    }
    .hud-title { font-weight: 700; color: #f59e0b; margin-bottom: 4px; }
    .hud-row { display: flex; justify-content: space-between; font-family: monospace; margin-bottom: 3px; }
    .controls {
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px;
      padding: 10px 18px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; max-width: 92vw;
    }
    .ctrl { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
    input[type=range] { accent-color: #f59e0b; width: 75px; cursor: pointer; }
    .btn { background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.14); color: #fff; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; }
    .btn:hover { background: #334155; }
    .hint { position: absolute; top: 16px; right: 16px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 14px; border-radius: 20px; font-size: 12px; color: #f59e0b; pointer-events: none; }
  </style>
  <script>
    window.onerror = function(msg, url, line, col, err) {
      window.parent.postMessage({ type: 'VISU_RUNTIME_ERROR', error: { message: String(msg), line, column: col, stack: err?.stack || '' } }, '*');
      return false;
    };
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'VISU_VISIBILITY_CHANGE') {
        window.isPaused = !e.data.isVisible;
        if (!window.isPaused) requestAnimationFrame(loop);
      }
    });
    window.addEventListener('DOMContentLoaded', () => window.parent.postMessage({ type: 'VISU_READY' }, '*'));
  </script>
</head>
<body>
  <div id="canvas-container">
    <canvas id="simCanvas"></canvas>
    <div class="hud">
      <div class="hud-title">GRAVITATIONAL DYNAMICS</div>
      <div class="hud-row"><span>Active Bodies:</span> <span id="bodyCount" style="color:#f59e0b;">5</span></div>
      <div class="hud-row"><span>Total Momentum:</span> <span id="pVal" style="color:#38bdf8;">~0 kg·m/s</span></div>
      <div class="hud-row"><span>Integration:</span> <span style="color:#10b981;">Velocity Verlet</span></div>
    </div>
    <div class="hint">Click & drag anywhere to launch a new planet</div>
    <div class="controls">
      <button id="playBtn" class="btn">⏸ Pause</button>
      <button id="resetBtn" class="btn">↺ Solar System</button>
      <button id="clearBtn" class="btn">Clear Trails</button>
      <div class="ctrl"><label>Gravity (G)</label><input id="gSlider" type="range" min="0.2" max="3" value="1" step="0.1"></div>
      <div class="ctrl"><label>Speed</label><input id="speedSlider" type="range" min="0.2" max="2.5" value="1" step="0.1"></div>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('simCanvas');
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let G = 1.0, simSpeed = 1.0;
    let isRunning = true;
    let bodies = [];

    function initSolarSystem() {
      bodies = [
        { x: width / 2, y: height / 2, vx: 0, vy: 0, mass: 2500, radius: 16, color: '#f59e0b', trail: [] },
        { x: width / 2, y: height / 2 - 90, vx: 4.8, vy: 0, mass: 6, radius: 4, color: '#38bdf8', trail: [] },
        { x: width / 2, y: height / 2 - 150, vx: 3.8, vy: 0, mass: 18, radius: 6, color: '#10b981', trail: [] },
        { x: width / 2, y: height / 2 - 220, vx: 3.2, vy: 0, mass: 12, radius: 5, color: '#f43f5e', trail: [] },
        { x: width / 2, y: height / 2 - 300, vx: 2.7, vy: 0, mass: 45, radius: 9, color: '#a855f7', trail: [] },
      ];
      document.getElementById('bodyCount').textContent = bodies.length;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (bodies.length === 0) initSolarSystem();
    }
    window.addEventListener('resize', resize);
    resize();

    function physicsStep(dt) {
      // Gravitational forces
      const n = bodies.length;
      for (let i = 0; i < n; i++) {
        let fx = 0, fy = 0;
        const b1 = bodies[i];
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const b2 = bodies[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distSq = dx * dx + dy * dy + 100; // Softening parameter
          const dist = Math.sqrt(distSq);
          const force = (G * b1.mass * b2.mass) / distSq;
          fx += force * (dx / dist);
          fy += force * (dy / dist);
        }
        b1.vx += (fx / b1.mass) * dt * simSpeed;
        b1.vy += (fy / b1.mass) * dt * simSpeed;
      }
      // Update positions
      bodies.forEach(b => {
        b.x += b.vx * dt * 30 * simSpeed;
        b.y += b.vy * dt * 30 * simSpeed;
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 250) b.trail.shift();
      });
    }

    function render() {
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, width, height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 137.5) % width;
        const sy = (i * 293.1) % height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw trails
      bodies.forEach(b => {
        if (b.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let i = 1; i < b.trail.length; i++) {
            ctx.lineTo(b.trail[i].x, b.trail[i].y);
          }
          ctx.strokeStyle = b.color + '44';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // Draw bodies
      bodies.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.mass > 500 ? 25 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Drag preview arrow
      if (dragStart && dragCurrent) {
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    let lastTime = performance.now();
    function loop(now) {
      if (window.isPaused) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (isRunning) physicsStep(dt);
      render();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Click and drag to spawn
    let dragStart = null, dragCurrent = null;
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      dragCurrent = { ...dragStart };
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragStart) return;
      const rect = canvas.getBoundingClientRect();
      dragCurrent = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    window.addEventListener('mouseup', () => {
      if (!dragStart || !dragCurrent) return;
      const vx = (dragStart.x - dragCurrent.x) * 0.06;
      const vy = (dragStart.y - dragCurrent.y) * 0.06;
      const colors = ['#38bdf8', '#10b981', '#f43f5e', '#a855f7', '#34d399'];
      bodies.push({
        x: dragStart.x, y: dragStart.y,
        vx, vy,
        mass: 15 + Math.random() * 20,
        radius: 5 + Math.random() * 3,
        color: colors[bodies.length % colors.length],
        trail: []
      });
      document.getElementById('bodyCount').textContent = bodies.length;
      dragStart = null; dragCurrent = null;
    });

    // Controls
    document.getElementById('playBtn').addEventListener('click', (e) => {
      isRunning = !isRunning;
      e.target.textContent = isRunning ? '⏸ Pause' : '▶ Play';
    });
    document.getElementById('resetBtn').addEventListener('click', initSolarSystem);
    document.getElementById('clearBtn').addEventListener('click', () => bodies.forEach(b => b.trail = []));
    document.getElementById('gSlider').addEventListener('input', (e) => G = parseFloat(e.target.value));
    document.getElementById('speedSlider').addEventListener('input', (e) => simSpeed = parseFloat(e.target.value));
  </script>
</body>
</html>`,
};

export const PRESET_VISUALS_MAP: Record<string, STEMVisual> = {
  'double-pendulum': DEFAULT_INITIAL_VISUAL,
  'wave-interference': WAVE_INTERFERENCE_VISUAL,
  'gravitational-nbody': GRAVITATIONAL_NBODY_VISUAL,
};

export function findPresetVisual(query: string): STEMVisual | null {
  const q = query.toLowerCase();
  if (q.includes('pendulum') || q.includes('chaos') || q.includes('lagrangian')) {
    return DEFAULT_INITIAL_VISUAL;
  }
  if (q.includes('wave') || q.includes('slit') || q.includes('interference') || q.includes('superposition')) {
    return WAVE_INTERFERENCE_VISUAL;
  }
  if (q.includes('gravity') || q.includes('gravitat') || q.includes('orbit') || q.includes('nbody') || q.includes('n-body') || q.includes('planet')) {
    return GRAVITATIONAL_NBODY_VISUAL;
  }
  return null;
}

