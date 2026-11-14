// Image 4 & 5: Brain & Spine Profile with Synaptic Firing Nodes and Multi-Angle MRI
class BrainMriCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.pulse = 0;
    this.stressLevel = 24.5;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 360;
    this.canvas.height = 240;
  }

  setStress(stress) {
    this.stressLevel = stress;
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2 - 10;

    this.ctx.fillStyle = '#020611';
    this.ctx.fillRect(0, 0, w, h);

    this.pulse = (this.pulse + 0.08) % (Math.PI * 2);

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // 1. Brain Silhouette Profile (Side view Image 4 style)
    this.ctx.shadowBlur = 10;
    const glowColor = this.stressLevel > 60 ? '#ff1e56' : '#00f0ff';
    this.ctx.shadowColor = glowColor;
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
    this.ctx.fillStyle = 'rgba(0, 119, 255, 0.15)';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    // Frontal lobe
    this.ctx.moveTo(35, -25);
    this.ctx.bezierCurveTo(45, -55, 10, -75, -20, -75);
    // Parietal & Occipital lobe
    this.ctx.bezierCurveTo(-60, -75, -75, -45, -70, -15);
    // Cerebellum
    this.ctx.bezierCurveTo(-75, 15, -45, 30, -30, 20);
    // Brainstem
    this.ctx.lineTo(-20, 30);
    this.ctx.lineTo(-20, 80); // Spinal cord
    this.ctx.lineTo(-10, 80);
    this.ctx.lineTo(-10, 25);
    // Temporal lobe
    this.ctx.bezierCurveTo(0, 15, 25, 10, 35, -25);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 2. Spinal Cord Nerve Fibers branching outward (Image 4 style)
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    this.ctx.lineWidth = 1;
    for (let y = 35; y <= 75; y += 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(-15, y);
      this.ctx.lineTo(-35 - (y - 35) * 0.3, y + 8);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(-15, y);
      this.ctx.lineTo(10 + (y - 35) * 0.3, y + 8);
      this.ctx.stroke();
    }

    // 3. Firing Synaptic Action Potentials (Red/Orange glowing nodes)
    const synapses = [
      { x: 15, y: -45 },
      { x: -10, y: -55 },
      { x: -40, y: -35 },
      { x: -45, y: 5 },
      { x: -15, y: 35 },
      { x: -15, y: 55 },
      { x: -15, y: 75 },
    ];

    for (let i = 0; i < synapses.length; i++) {
      const s = synapses[i];
      const firePhase = Math.sin(this.pulse + i * 1.2);
      if (firePhase > 0) {
        this.ctx.fillStyle = '#ff3366';
        this.ctx.shadowColor = '#ff1e56';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.restore();
    this.ctx.shadowBlur = 0;

    // HUD Text
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.fillText("SYNAPSE MRI // SAGITTAL PROFILE", 15, 20);
    this.ctx.fillStyle = glowColor;
    this.ctx.fillText(`COGNITIVE LOAD: ${this.stressLevel.toFixed(1)}%`, 15, h - 15);
  }
}
