// ASTRA MEDVIS — Pulmonary Simulation Interactive Visual Engine
class PulmonarySimulation {
  constructor() {
    this.canvas = document.getElementById('flowCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.state = {
      playing: true,
      mode: 'airflow',
      bpm: 14,
      particles: true,
      grid: true,
      labels: true,
      elapsed: 0,
      last: 0
    };

    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.particles = [];

    this.init();
  }

  init() {
    this.seed();
    this.bindEvents();
    this.makeWave();
    this.resize();

    const viewport = document.getElementById('viewport-lungs');
    if (viewport && window.ResizeObserver) {
      new ResizeObserver(() => this.resize()).observe(viewport);
    }
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const r = this.canvas.getBoundingClientRect();
    this.width = r.width || 480;
    this.height = r.height || 360;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.seed();
  }

  seed() {
    this.particles = Array.from({ length: 120 }, () => ({
      branch: Math.random() < 0.5 ? -1 : 1,
      t: Math.random(),
      lane: Math.random(),
      radius: Math.random() * 1.8 + 0.6,
      offset: Math.random() * 6.28
    }));
  }

  point(p) {
    const sign = p.branch;
    const t = p.t;
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.20;
    const branchY = this.height * 0.38;
    let x, y;

    if (t < 0.34) {
      const f = t / 0.34;
      x = centerX + sign * (2 + f * this.width * 0.075);
      y = centerY + f * (branchY - centerY);
    } else {
      const f = (t - 0.34) / 0.66;
      const spread = (0.08 + f * 0.15) * this.width;
      const w = Math.sin(f * Math.PI * 0.95) * this.width * 0.055;
      x = centerX + sign * (spread + w * (p.lane - 0.5) * 1.6);
      y = branchY + f * this.height * 0.38 + Math.sin(f * 9 + p.offset) * this.height * 0.012;
    }
    return { x, y };
  }

  drawParticles(dt, phase) {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.state.particles) return;

    const rgb = this.state.mode === 'oxygen' ? '92, 150, 255' :
                this.state.mode === 'bronchial' ? '87, 255, 229' : '190, 255, 255';
    const direction = Math.cos(phase) >= 0 ? 1 : -1;

    this.ctx.globalCompositeOperation = 'screen';
    for (const p of this.particles) {
      if (this.state.playing) {
        p.t = (p.t + dt * (0.12 + this.state.bpm / 160) * direction + 1) % 1;
      }
      const q = this.point(p);
      const a = 0.3 + 0.6 * Math.sin(Math.PI * p.t);

      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(${rgb}, ${a})`;
      this.ctx.shadowColor = `rgba(${rgb}, 0.95)`;
      this.ctx.shadowBlur = 9;
      this.ctx.arc(q.x, q.y, p.radius * (this.state.mode === 'oxygen' ? 1.25 : 1), 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;
    this.ctx.globalCompositeOperation = 'source-over';
  }

  updateTelemetry(phase) {
    const breath = (1 - Math.cos(phase)) / 2;
    const flow = Math.abs(Math.sin(phase));

    const rrEl = document.getElementById('rr');
    if (rrEl) rrEl.textContent = this.state.bpm;

    const spo2El = document.getElementById('pulm-spo2');
    if (spo2El) spo2El.textContent = (97.5 + breath * 0.8).toFixed(1);

    const volEl = document.getElementById('pulm-volume');
    if (volEl) volEl.textContent = (0.3 + breath * 0.4).toFixed(2);

    const velEl = document.getElementById('pulm-velocity');
    if (velEl) velEl.textContent = (flow * 0.62).toFixed(2);

    const volBar = document.getElementById('volumeBar');
    if (volBar) volBar.style.width = (30 + breath * 55) + '%';

    const velBar = document.getElementById('velocityBar');
    if (velBar) velBar.style.width = (8 + flow * 84) + '%';

    const phaseLabel = document.getElementById('phaseLabel');
    if (phaseLabel) {
      phaseLabel.textContent = Math.sin(phase) >= 0 ? 'INHALATION' : 'EXHALATION';
      phaseLabel.style.color = Math.sin(phase) >= 0 ? 'var(--neon-cyan)' : 'var(--neon-blue)';
    }

    const wavecursor = document.getElementById('wavecursor');
    if (wavecursor) {
      wavecursor.style.left = ((this.state.elapsed * this.state.bpm / 60) % 1 * 100) + '%';
    }
  }

  makeWave() {
    const wavePath = document.getElementById('wavePath');
    if (!wavePath) return;
    const points = [];
    for (let i = 0; i <= 280; i++) {
      const x = i / 280 * 700;
      const y = 28 - 17 * Math.sin(i / 280 * Math.PI * 8);
      points.push((i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2));
    }
    wavePath.setAttribute('d', points.join(' '));
  }

  bindEvents() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.pulm-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.state.mode = mode;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const modeCaption = document.getElementById('modeCaption');
        if (modeCaption) {
          modeCaption.textContent = ({
            airflow: 'AIRFLOW DYNAMICS',
            oxygen: 'OXYGEN DIFFUSION',
            bronchial: 'BRONCHIAL MAPPING'
          })[mode] || 'AIRFLOW DYNAMICS';
        }
      });
    });

    // Layer Toggles
    const particlesToggle = document.getElementById('particlesToggle');
    if (particlesToggle) {
      particlesToggle.addEventListener('change', e => {
        this.state.particles = e.target.checked;
      });
    }

    const gridToggle = document.getElementById('gridToggle');
    if (gridToggle) {
      gridToggle.addEventListener('change', e => {
        const scanGrid = document.getElementById('scanGrid');
        if (scanGrid) scanGrid.hidden = !e.target.checked;
      });
    }

    const labelsToggle = document.getElementById('labelsToggle');
    if (labelsToggle) {
      labelsToggle.addEventListener('change', e => {
        const annotations = document.getElementById('annotations');
        if (annotations) annotations.hidden = !e.target.checked;
      });
    }

    // Play / Pause
    const playBtn = document.getElementById('playButton');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.state.playing = !this.state.playing;
        playBtn.innerHTML = this.state.playing ?
          'Ⅱ <span>PAUSE SIMULATION</span>' : '▶ <span>RESUME SIMULATION</span>';
      });
    }

    // Reset
    const resetBtn = document.getElementById('resetButton');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.state.elapsed = 0;
        this.state.playing = true;
        if (playBtn) playBtn.innerHTML = 'Ⅱ <span>PAUSE SIMULATION</span>';
        this.seed();
      });
    }

    // Speed Range Slider
    const speedRange = document.getElementById('speedRange');
    const speedText = document.getElementById('speedText');
    if (speedRange) {
      speedRange.addEventListener('input', e => {
        this.state.bpm = +e.target.value;
        if (speedText) speedText.textContent = this.state.bpm + ' BPM';
        const img = document.querySelector('.image-frame img');
        const glow = document.getElementById('breathingGlow');
        const dur = (60 / this.state.bpm) + 's';
        if (img) img.style.animationDuration = dur;
        if (glow) glow.style.animationDuration = dur;
      });
    }
  }

  setBpm(bpm) {
    if (bpm > 5 && bpm < 45) {
      this.state.bpm = Math.round(bpm);
      const speedText = document.getElementById('speedText');
      const speedRange = document.getElementById('speedRange');
      if (speedText) speedText.textContent = this.state.bpm + ' BPM';
      if (speedRange) speedRange.value = this.state.bpm;
    }
  }

  animate(ts) {
    const dt = this.state.last ? Math.min((ts - this.state.last) / 1000, 0.05) : 0;
    this.state.last = ts;
    if (this.state.playing) this.state.elapsed += dt;
    const phase = this.state.elapsed * (this.state.bpm / 60) * Math.PI * 2;

    this.drawParticles(this.state.playing ? dt : 0, phase);
    this.updateTelemetry(phase);
  }
}
