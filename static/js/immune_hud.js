// Project Ares // Immune, Cellular & Genetic Health HUD Module
class ImmuneHud {
  constructor() {
    this.canvas = document.getElementById('immuneCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.video = document.getElementById('immune-sim-video');
    this.logConsole = document.getElementById('immune-log-console');
    this.waveOffset = 0;

    this.bindEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = (this.canvas.parentElement && this.canvas.parentElement.clientWidth > 0) ? this.canvas.parentElement.clientWidth : 600;
    this.canvas.height = 90;
  }

  playVideo() {
    if (this.video && this.video.paused) {
      this.video.play().catch(() => {});
    }
  }

  bindEvents() {
    const tcellSlider = document.getElementById('immune-tcell-slider');
    const tcellVal = document.getElementById('immune-tcell-val');
    const vTcells = document.getElementById('v-immune-tcells');
    const barTcells = document.getElementById('bar-immune-tcells');

    if (tcellSlider) {
      tcellSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (tcellVal) tcellVal.textContent = val;
        if (vTcells) vTcells.innerHTML = `${val} <small style="font-size:12px;">/µL</small>`;
        if (barTcells) barTcells.style.width = `${Math.min(100, (val / 1500) * 100)}%`;
        this.addLog(`T-Cell proliferation rate adjusted to ${val} /µL`);
      });
    }

    const repairSlider = document.getElementById('immune-repair-slider');
    const repairVal = document.getElementById('immune-repair-val');
    const vRepair = document.getElementById('v-immune-repair');
    const barRepair = document.getElementById('bar-immune-repair');

    if (repairSlider) {
      repairSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        if (repairVal) repairVal.textContent = val;
        if (vRepair) vRepair.textContent = `${val}%`;
        if (barRepair) barRepair.style.width = `${val}%`;
        this.addLog(`DNA repair enzyme synthesis set to ${val}%`);
      });
    }

    const radSlider = document.getElementById('immune-rad-slider');
    const radVal = document.getElementById('immune-rad-val');
    const vDmg = document.getElementById('v-immune-dmg');

    if (radSlider) {
      radSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        if (radVal) radVal.textContent = val;
        if (vDmg) vDmg.textContent = val;
        this.addLog(`Radiation-induced γ-H2AX double-strand breaks: ${val}`);
      });
    }

    const damperToggle = document.getElementById('immune-damper-toggle');
    if (damperToggle) {
      damperToggle.addEventListener('click', () => {
        damperToggle.classList.toggle('active');
        if (damperToggle.classList.contains('active')) {
          damperToggle.textContent = 'ENGAGED';
          this.addLog('Radioprotective cellular damper matrix engaged.');
        } else {
          damperToggle.textContent = 'DISENGAGED';
          this.addLog('WARNING: Cellular radioprotection offline!');
        }
      });
    }

    const overrideBtn = document.getElementById('immune-override-btn');
    if (overrideBtn) {
      overrideBtn.addEventListener('click', () => {
        alert('EMERGENCY IMMUNOSTIMULANT COCKTAIL DISPATCHED // CYTOKINE CASCADE INITIATED');
        this.addLog('CRITICAL: Emergency immunostimulant cocktail infused.');
      });
    }
  }

  addLog(text) {
    if (!this.logConsole) return;
    const time = new Date().toTimeString().split(' ')[0];
    const p = document.createElement('p');
    p.textContent = `[${time}] ${text}`;
    this.logConsole.insertBefore(p, this.logConsole.firstChild);
    if (this.logConsole.children.length > 10) {
      this.logConsole.removeChild(this.logConsole.lastChild);
    }
  }

  // Draw continuous DNA repair / cytokine wave (60 FPS)
  draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.fillStyle = 'rgba(0, 10, 25, 0.35)';
    this.ctx.fillRect(0, 0, w, h);

    // Reticle grid
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Double Helix Repair Waveform
    this.waveOffset += 0.04;
    const count = 100;
    const dx = w / count;

    // Strand 1 (Cyan)
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const x = i * dx;
      const y = (h / 2) + Math.sin(this.waveOffset + i * 0.18) * 22;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Strand 2 (Magenta / Violet)
    this.ctx.strokeStyle = '#ff70a6';
    this.ctx.shadowColor = '#ff70a6';
    this.ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const x = i * dx;
      const y = (h / 2) - Math.sin(this.waveOffset + i * 0.18) * 22;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Base pair cross links
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 0;
    for (let i = 0; i <= count; i += 6) {
      const x = i * dx;
      const y1 = (h / 2) + Math.sin(this.waveOffset + i * 0.18) * 22;
      const y2 = (h / 2) - Math.sin(this.waveOffset + i * 0.18) * 22;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y1);
      this.ctx.lineTo(x, y2);
      this.ctx.stroke();
    }
  }
}
