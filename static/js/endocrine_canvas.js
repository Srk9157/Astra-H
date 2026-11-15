// Image 7: Transparent Human Endocrine System Glandular Canvas Visualizer
class EndocrineCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.pulse = 0;
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
    const cy = h / 2;

    this.ctx.fillStyle = '#020713';
    this.ctx.fillRect(0, 0, w, h);

    this.pulse = (this.pulse + 0.06) % (Math.PI * 2);

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // 1. Translucent Body Outline
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    // Head
    this.ctx.arc(0, -90, 16, 0, Math.PI * 2);
    // Torso
    this.ctx.moveTo(-20, -70);
    this.ctx.lineTo(20, -70);
    this.ctx.lineTo(15, 20);
    this.ctx.lineTo(-15, 20);
    this.ctx.closePath();
    this.ctx.stroke();

    // 2. Endocrine Glands (Image 7 Exact Labels & Glowing Nodes)
    const glands = [
      { name: "Pineal Gland", y: -94, col: "#00f0ff" },
      { name: "Pituitary Gland", y: -86, col: "#00f0ff" },
      { name: "Thyroid & Parathyroid", y: -65, col: "#ffaa00" },
      { name: "Thymus", y: -45, col: "#00ff88" },
      { name: "Adrenal Glands", y: -15, col: "#ff1e56" },
      { name: "Pancreas", y: -5, col: "#9d4edd" },
      { name: "Gonads / Hormones", y: 25, col: "#00f0ff" },
    ];

    for (let i = 0; i < glands.length; i++) {
      const g = glands[i];
      const glow = Math.sin(this.pulse + i) * 3 + 6;

      this.ctx.fillStyle = g.col;
      this.ctx.shadowColor = g.col;
      this.ctx.shadowBlur = glow;

      // Draw glowing gland node
      this.ctx.beginPath();
      this.ctx.arc(0, g.y, 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Horizontal leader line to label
      this.ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
      this.ctx.lineWidth = 0.8;
      const isRight = (i % 2 === 0);
      const labelX = isRight ? 45 : -45;

      this.ctx.beginPath();
      this.ctx.moveTo(0, g.y);
      this.ctx.lineTo(labelX, g.y);
      this.ctx.stroke();

      this.ctx.font = '9px "Share Tech Mono", monospace';
      this.ctx.fillStyle = '#e0f4ff';
      this.ctx.textAlign = isRight ? "left" : "right";
      this.ctx.fillText(g.name, labelX + (isRight ? 6 : -6), g.y + 3);
    }

    this.ctx.restore();
    this.ctx.shadowBlur = 0;

    // HUD Header
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.textAlign = "left";
    this.ctx.fillText("ENDOCRINE GLANDULAR AXIS // 7 LOOPS ACTIVE", 15, 20);
  }
}
