// Image 10: Real-Time Simulation Human Digestion & Gastric Villi Canvas Visualizer
class DigestionCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.phase = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 360;
    this.canvas.height = 280;
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2 - 20;

    this.ctx.fillStyle = '#020713';
    this.ctx.fillRect(0, 0, w, h);

    this.phase = (this.phase + 0.05) % (Math.PI * 2);

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // 1. Esophagus & Stomach (Image 10 style)
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 10;
    this.ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';

    this.ctx.beginPath();
    // Esophagus down to stomach
    this.ctx.moveTo(0, -90);
    this.ctx.lineTo(0, -60);
    // Greater and lesser curvature of stomach
    this.ctx.bezierCurveTo(-35, -55, -45, -15, -15, 0);
    this.ctx.bezierCurveTo(25, 10, 40, -25, 30, -50);
    this.ctx.bezierCurveTo(15, -60, 5, -55, 0, -60);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 2. Dynamic Stomach Acid Fluid Waves
    const acidLevel = -15 + Math.sin(this.phase * 2) * 3;
    this.ctx.fillStyle = 'rgba(0, 255, 136, 0.35)';
    this.ctx.beginPath();
    this.ctx.moveTo(-35, acidLevel);
    this.ctx.bezierCurveTo(-20, acidLevel - 4, 0, acidLevel + 4, 25, acidLevel);
    this.ctx.lineTo(15, 0);
    this.ctx.lineTo(-15, 0);
    this.ctx.closePath();
    this.ctx.fill();

    // Bubbles in stomach acid (acid production)
    for (let i = 0; i < 6; i++) {
      const bx = -20 + i * 7 + Math.sin(this.phase + i) * 3;
      const by = acidLevel - 4 - ((this.phase * 8 + i * 5) % 20);
      this.ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
      this.ctx.beginPath();
      this.ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 3. Intestinal Peristaltic Coils
    this.ctx.strokeStyle = '#00c3ff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    // Duodenum and small intestine loops
    for (let r = 0; r < 3; r++) {
      const iy = 15 + r * 16;
      this.ctx.moveTo(-30, iy);
      this.ctx.bezierCurveTo(-15, iy + 10, 15, iy - 10, 30, iy);
    }
    this.ctx.stroke();

    // 4. Intestinal Villi Micro-Absorption Cross Section (Bottom Right - Image 10)
    const villiX = 80;
    const villiY = 65;
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    for (let v = 0; v < 4; v++) {
      const vx = -40 + v * 20;
      this.ctx.moveTo(vx, 70);
      this.ctx.lineTo(vx + 4, 52);
      this.ctx.arc(vx + 8, 52, 4, Math.PI, 0, false);
      this.ctx.lineTo(vx + 12, 70);
    }
    this.ctx.stroke();

    this.ctx.restore();
    this.ctx.shadowBlur = 0;

    // HUD Text
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#00ff88';
    this.ctx.fillText("GASTRIC ACID: pH 1.8 // PEPSIN ACTIVE", 15, h - 25);
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText("NUTRIENT ABSORPTION: 94.5% EFFICIENCY", 15, h - 10);
  }
}
