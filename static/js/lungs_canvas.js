// Image 3: Glowing Transparent Respiratory Lungs & Bronchial Tree Visualizer
class RespiratoryLungsCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.breathPhase = 0;
    this.respRate = 14.5;
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 80,
        y: -40 + Math.random() * 90,
        r: Math.random() * 2 + 1,
        speed: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 360;
    this.canvas.height = 240;
  }

  setRespRate(rate) {
    this.respRate = rate;
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.fillStyle = '#020713';
    this.ctx.fillRect(0, 0, w, h);

    // Inhalation / Exhalation breathing cycle expansion
    const cycleSpeed = (this.respRate / 60) * 0.08;
    this.breathPhase = (this.breathPhase + cycleSpeed) % (Math.PI * 2);
    const lungExpansion = 1.0 + Math.sin(this.breathPhase) * 0.08;

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // 1. Trachea Windpipe
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 10;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -75);
    this.ctx.lineTo(0, -25);
    this.ctx.stroke();

    // 2. Primary Bronchial Tree Bifurcation (Carina)
    this.ctx.lineWidth = 6;
    // Left Bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(0, -25);
    this.ctx.lineTo(-24, 0);
    this.ctx.stroke();
    // Right Bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(0, -25);
    this.ctx.lineTo(24, 0);
    this.ctx.stroke();

    // 3. Glowing Transparent Left and Right Lungs (Image 3 Style)
    this.ctx.save();
    this.ctx.scale(lungExpansion, lungExpansion);

    // Left Lung Lobes
    this.ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 12;

    this.ctx.beginPath();
    this.ctx.moveTo(-15, -20);
    this.ctx.bezierCurveTo(-55, -25, -75, 10, -55, 55);
    this.ctx.bezierCurveTo(-45, 65, -20, 60, -10, 30);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Right Lung Lobes
    this.ctx.beginPath();
    this.ctx.moveTo(15, -20);
    this.ctx.bezierCurveTo(55, -25, 75, 10, 55, 55);
    this.ctx.bezierCurveTo(45, 65, 20, 60, 10, 30);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // 4. Bioluminescent Alveolar Airway Particles (Expanding gas exchange)
    for (let p of this.particles) {
      p.y += (Math.sin(this.breathPhase) > 0 ? p.speed : -p.speed);
      if (p.y > 55) p.y = -20;
      if (p.y < -25) p.y = 50;

      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
    this.ctx.restore();
    this.ctx.shadowBlur = 0;

    // HUD Text
    this.ctx.font = '11px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText(`RESPIRATORY RATE: ${this.respRate.toFixed(1)} BPM`, 15, h - 15);
    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.fillText("ALVEOLAR GAS EXCHANGE: 98.4%", w - 185, h - 15);
  }
}
