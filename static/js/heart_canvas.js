// Image 2: Anatomical Beating 3D Heart Canvas Visualizer
class AnatomicalHeartCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.beatPhase = 0;
    this.bpm = 72;
    window.heartCanvas = this;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent ? (parent.clientWidth || 600) : 600;
    this.canvas.height = parent ? (parent.clientHeight || 480) : 480;
  }

  setBpm(bpm) {
    this.bpm = bpm;
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.fillStyle = '#020610';
    this.ctx.fillRect(0, 0, w, h);

    // Beating pulsation scale
    const speed = (this.bpm / 60) * 0.08;
    this.beatPhase = (this.beatPhase + speed) % (Math.PI * 2);
    // Systole contraction & diastole expansion
    let beatScale = 1.0;
    if (this.beatPhase < 0.6) {
      beatScale = 1.0 + Math.sin(this.beatPhase / 0.6 * Math.PI) * 0.12;
    } else if (this.beatPhase < 1.2) {
      beatScale = 1.0 + Math.sin((this.beatPhase - 0.6) / 0.6 * Math.PI) * 0.06;
    }

    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.scale(beatScale, beatScale);

    // 1. Aorta (Red Artery Arch - Oxygenated Blood)
    this.ctx.strokeStyle = '#ff1e56';
    this.ctx.lineWidth = 14;
    this.ctx.shadowColor = '#ff1e56';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(10, -35, 25, Math.PI * 0.8, Math.PI * 1.9, false);
    this.ctx.stroke();

    // 2. Vena Cava / Pulmonary Artery (Blue Vein - Deoxygenated Blood)
    this.ctx.strokeStyle = '#0077ff';
    this.ctx.lineWidth = 12;
    this.ctx.shadowColor = '#0077ff';
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(-18, -60);
    this.ctx.lineTo(-18, -20);
    this.ctx.stroke();

    // 3. Ventricles & Atria Heart Chambers (Image 2 Translucent Hologram)
    this.ctx.shadowBlur = 14;
    this.ctx.shadowColor = '#ff3366';
    this.ctx.fillStyle = 'rgba(255, 30, 86, 0.35)';
    this.ctx.strokeStyle = 'rgba(255, 100, 140, 0.85)';
    this.ctx.lineWidth = 2.5;

    // Heart Body Shape
    this.ctx.beginPath();
    this.ctx.moveTo(0, 50); // Apex of heart
    // Left ventricle curve
    this.ctx.bezierCurveTo(-50, 20, -60, -25, -25, -45);
    // Left atrium
    this.ctx.bezierCurveTo(-10, -50, 0, -35, 0, -25);
    // Right atrium
    this.ctx.bezierCurveTo(0, -35, 10, -50, 25, -45);
    // Right ventricle curve
    this.ctx.bezierCurveTo(60, -25, 50, 20, 0, 50);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. Coronary Arterial Vascular Tree (Bioluminescent red/blue branch filaments)
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.2;
    this.ctx.shadowBlur = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(-10, -30);
    this.ctx.lineTo(-5, 0);
    this.ctx.lineTo(-12, 20);
    this.ctx.lineTo(0, 48);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#ff8fa3';
    this.ctx.beginPath();
    this.ctx.moveTo(-5, 0);
    this.ctx.lineTo(15, 12);
    this.ctx.stroke();

    this.ctx.restore();
    this.ctx.shadowBlur = 0;

    // Metrics overlay
    this.ctx.font = '11px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#ff1e56';
    this.ctx.fillText(`CARDIAC SYNC: ${this.bpm.toFixed(0)} BPM`, 15, h - 15);
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText("EF: 62.5% | STROKE: 75mL", w - 170, h - 15);
  }
}
