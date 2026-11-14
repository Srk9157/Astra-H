// Image 1: Cyberpunk Full Human Body Hologram HUD Canvas
class HumanBodyHud {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.angle = 0;
    this.pulse = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 400;
    this.canvas.height = 360;
  }

  draw(activeHotspot) {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.fillStyle = '#030814';
    this.ctx.fillRect(0, 0, w, h);

    this.pulse = (this.pulse + 0.05) % (Math.PI * 2);
    this.angle += 0.015;

    // Concentric HUD Radar Rings (Image 1 style)
    this.ctx.save();
    this.ctx.translate(cx, cy);
    for (let r of [110, 140, 165]) {
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 + Math.sin(this.pulse) * 0.05})`;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([6, 8]);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.setLineDash([]);

    // Rotating Hologram Compass Ticks
    this.ctx.rotate(this.angle);
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    this.ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      this.ctx.rotate(Math.PI / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(100, 0);
      this.ctx.lineTo(115, 0);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // Central Glowing Human Body Silhouette
    this.ctx.save();
    this.ctx.translate(cx, cy - 20);

    const glowColor = '#00f0ff';
    this.ctx.shadowColor = glowColor;
    this.ctx.shadowBlur = 12 + Math.sin(this.pulse) * 4;
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
    this.ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    this.ctx.lineWidth = 2;

    // Draw Head
    this.ctx.beginPath();
    this.ctx.arc(0, -95, 14, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Neck
    this.ctx.beginPath();
    this.ctx.moveTo(-5, -81);
    this.ctx.lineTo(-5, -72);
    this.ctx.lineTo(5, -72);
    this.ctx.lineTo(5, -81);
    this.ctx.stroke();

    // Torso & Pelvis
    this.ctx.beginPath();
    this.ctx.moveTo(-24, -70); // Left shoulder
    this.ctx.lineTo(24, -70);  // Right shoulder
    this.ctx.lineTo(18, -25);  // Waist
    this.ctx.lineTo(19, 10);   // Hip
    this.ctx.lineTo(6, 20);    // Groin
    this.ctx.lineTo(-19, 10);  // Hip
    this.ctx.lineTo(-18, -25); // Waist
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Arms
    // Left Arm
    this.ctx.beginPath();
    this.ctx.moveTo(-24, -70);
    this.ctx.lineTo(-42, -20);
    this.ctx.lineTo(-54, 25);
    this.ctx.stroke();
    // Right Arm
    this.ctx.beginPath();
    this.ctx.moveTo(24, -70);
    this.ctx.lineTo(42, -20);
    this.ctx.lineTo(54, 25);
    this.ctx.stroke();

    // Legs
    // Left Leg
    this.ctx.beginPath();
    this.ctx.moveTo(-14, 15);
    this.ctx.lineTo(-16, 75);
    this.ctx.lineTo(-18, 135);
    this.ctx.stroke();
    // Right Leg
    this.ctx.beginPath();
    this.ctx.moveTo(14, 15);
    this.ctx.lineTo(16, 75);
    this.ctx.lineTo(18, 135);
    this.ctx.stroke();

    // Anatomical Vital Synaptic Hotspots (Clickable Target Nodes)
    const hotspots = [
      { id: "brain", name: "4. Brain & Neuro", x: 0, y: -95, col: "#9d4edd" },
      { id: "cardio", name: "2. Heart & Cardio", x: 4, y: -50, col: "#ff1e56" },
      { id: "lungs", name: "3. Lungs & Resp", x: -8, y: -45, col: "#00f0ff" },
      { id: "endocrine", name: "7. Thyroid & Glands", x: 0, y: -72, col: "#ffaa00" },
      { id: "digestive", name: "8. Stomach & GI", x: 2, y: -15, col: "#00ff88" },
      { id: "immune", name: "9. Bone Marrow / DNA", x: 0, y: 15, col: "#ff70a6" },
    ];

    for (let spot of hotspots) {
      const isSel = (activeHotspot === spot.id);
      this.ctx.fillStyle = spot.col;
      this.ctx.shadowColor = spot.col;
      this.ctx.shadowBlur = isSel ? 16 : 8;

      this.ctx.beginPath();
      this.ctx.arc(spot.x, spot.y, isSel ? 7 : 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Pulsing Ring around node
      this.ctx.strokeStyle = spot.col;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.arc(spot.x, spot.y, (isSel ? 12 : 7) + Math.sin(this.pulse * 2) * 2, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.restore();
    this.ctx.shadowBlur = 0;

    // HUD Corner Accents
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.fillText("HOLO BIO-SCAN: ACTIVE", 15, 20);
    this.ctx.fillText("12 BIOLOGICAL VITAL ZONES SYNCED", 15, h - 15);
  }
}
