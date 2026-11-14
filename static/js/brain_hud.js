// BrainMed+ Holographic Neural Visualizer & EEG Frequency Bands
class BrainHud {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.angle = 0;
    this.stressLevel = 25; // 0-100%
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 360;
    this.canvas.height = 260;
  }

  setStress(val) {
    this.stressLevel = val;
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2 - 10;

    this.ctx.fillStyle = '#020712';
    this.ctx.fillRect(0, 0, w, h);

    // Draw Holo Base Ring
    this.ctx.save();
    this.ctx.translate(cx, cy + 90);
    this.ctx.scale(1, 0.35);
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 95, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 115, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();

    this.angle += 0.02;

    // Draw Holographic Brain Nodes & Lobe Clusters
    const numPoints = 85;
    const brainColor = this.stressLevel > 60 ? '#ff1e56' : (this.stressLevel > 40 ? '#ffaa00' : '#00f0ff');

    for (let i = 0; i < numPoints; i++) {
      const u = (i / numPoints) * Math.PI * 2;
      const v = ((i * 7) % numPoints) / numPoints * Math.PI - (Math.PI / 2);

      // Spherical to 3D ellipsoid for brain hemispheres
      const r = 70;
      let x3d = r * Math.cos(v) * Math.cos(u);
      let y3d = (r * 0.85) * Math.sin(v);
      let z3d = (r * 0.95) * Math.cos(v) * Math.sin(u);

      // Shift for left/right hemisphere separation
      if (x3d > 0) x3d += 6;
      else x3d -= 6;

      // Rotate around Y axis
      const rotX = x3d * Math.cos(this.angle) - z3d * Math.sin(this.angle);
      const rotZ = x3d * Math.sin(this.angle) + z3d * Math.cos(this.angle);

      // Perspective projection
      const fov = 260;
      const pScale = fov / (fov + rotZ);
      const px = cx + rotX * pScale;
      const py = cy + y3d * pScale;

      const alpha = Math.max(0.15, (rotZ + r) / (2 * r));

      // Draw neural synaptic point
      this.ctx.fillStyle = brainColor;
      this.ctx.shadowColor = brainColor;
      this.ctx.shadowBlur = this.stressLevel > 50 ? 8 : 4;
      this.ctx.globalAlpha = alpha;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.5 * pScale, 0, Math.PI * 2);
      this.ctx.fill();

      // Connect adjacent nodes with faint neural filaments
      if (i % 4 === 0) {
        this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.3})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(cx, cy);
        this.ctx.stroke();
      }
    }
    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;

    // Draw Holo HUD text
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.fillText("ADS1299 8-CH SYNAPTIC COHERENCE", 15, h - 15);
    this.ctx.fillStyle = brainColor;
    this.ctx.fillText(`STRESS INDEX: ${this.stressLevel.toFixed(1)}%`, w - 145, h - 15);
  }
}
