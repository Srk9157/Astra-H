// ECG Real-Time Oscilloscope Visualizer
class EcgChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.maxPoints = 200;
    this.phase = 0;
    this.heartRate = 72;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = 120;
  }

  updateData(newPoints) {
    if (newPoints && newPoints.length > 0) {
      this.points = newPoints;
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear background
    this.ctx.fillStyle = '#030812';
    this.ctx.fillRect(0, 0, w, h);

    // Draw grid
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    this.ctx.lineWidth = 1;
    const gridStep = 20;
    for (let x = 0; x < w; x += gridStep) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Fallback wave generation if no points received yet
    if (this.points.length === 0) {
      this.phase += 0.08;
      for (let i = 0; i < this.maxPoints; i++) {
        const t = (this.phase + (i / this.maxPoints) * Math.PI * 4) % (Math.PI * 2);
        let val = 0;
        if (t > 1.2 && t < 1.35) val = 1.3 * Math.sin((t - 1.2) / 0.15 * Math.PI); // R peak
        else if (t > 1.1 && t < 1.2) val = -0.2; // Q
        else if (t > 1.35 && t < 1.45) val = -0.3; // S
        else if (t > 0.7 && t < 0.9) val = 0.15; // P
        else if (t > 1.7 && t < 2.1) val = 0.25; // T
        this.points.push(val + (Math.random() - 0.5) * 0.04);
        if (this.points.length > this.maxPoints) this.points.shift();
      }
    }

    // Draw ECG waveform with Neon Amber/Yellow Glow (Image 1 style)
    this.ctx.strokeStyle = '#ffb703';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#ffb703';
    this.ctx.shadowBlur = 8;

    this.ctx.beginPath();
    const step = w / (this.points.length - 1 || 1);
    const midY = h / 2;
    const scaleY = h * 0.35;

    for (let i = 0; i < this.points.length; i++) {
      const x = i * step;
      const y = midY - this.points[i] * scaleY;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }
}
