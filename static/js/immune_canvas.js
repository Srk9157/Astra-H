// Image 8: Immune Cellular & Genomic T-Cell Cytokine Signaling Canvas Visualizer
class ImmuneCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.angle = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 360;
    this.canvas.height = 240;
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.fillStyle = '#020612';
    this.ctx.fillRect(0, 0, w, h);

    this.angle += 0.03;

    // 1. Rotating DNA Double Helix (Left Side - Image 8)
    const dnaX = 60;
    for (let i = 0; i < 18; i++) {
      const y = 25 + i * 11;
      const t = this.angle + i * 0.35;
      const strand1X = dnaX + Math.sin(t) * 22;
      const strand2X = dnaX - Math.sin(t) * 22;

      // Base pair rung
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(strand1X, y);
      this.ctx.lineTo(strand2X, y);
      this.ctx.stroke();

      // Phosphate backbone nodes
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.beginPath();
      this.ctx.arc(strand1X, y, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ff70a6';
      this.ctx.beginPath();
      this.ctx.arc(strand2X, y, 2.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Engineered T-Cell (Blue - Left Center)
    const tCellX = cx + 20;
    const tCellY = cy - 20;
    this.ctx.save();
    this.ctx.shadowColor = '#0077ff';
    this.ctx.shadowBlur = 10;
    this.ctx.fillStyle = '#0077ff';
    this.ctx.beginPath();
    this.ctx.arc(tCellX, tCellY, 22, 0, Math.PI * 2);
    this.ctx.fill();

    // T-cell receptor spikes (CD4/CD8)
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(tCellX + Math.cos(a) * 22, tCellY + Math.sin(a) * 22);
      this.ctx.lineTo(tCellX + Math.cos(a) * 32, tCellY + Math.sin(a) * 32);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // 3. Tumor Antigen / Target Pathogen (Red - Right Side)
    const antigenX = cx + 105;
    const antigenY = cy - 10;
    this.ctx.save();
    this.ctx.shadowColor = '#ff1e56';
    this.ctx.shadowBlur = 12;
    this.ctx.fillStyle = 'rgba(255, 30, 86, 0.85)';
    this.ctx.beginPath();
    this.ctx.arc(antigenX, antigenY, 28, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // 4. Cytokine Signaling Arrows (IL-2 & Immune Synapse)
    this.ctx.strokeStyle = '#ffaa00';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(tCellX + 22, tCellY);
    this.ctx.lineTo(antigenX - 28, antigenY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // HUD Text
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText("DNA REPAIR: 94.8% // GAMMA-H2AX: 1.4", 15, h - 25);
    this.ctx.fillStyle = '#ffaa00';
    this.ctx.fillText("CYTOKINE SIGNALING (IL-2): ACTIVE", 15, h - 10);
  }
}
