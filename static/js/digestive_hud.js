// Project Ares // Digestive Processes & Metabolic Telemetry HUD Module
class DigestiveHud {
  constructor() {
    this.canvas = document.getElementById('peristalsisCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.waveOffset = 0;
    this.peristalsisFreq = 1.2;
    this.logConsole = document.getElementById('digestive-log-console');

    this.bindEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = (this.canvas.parentElement && this.canvas.parentElement.clientWidth > 0) ? this.canvas.parentElement.clientWidth : 600;
    this.canvas.height = 90;
  }

  bindEvents() {
    const absorptionSlider = document.getElementById('absorption-slider');
    const absorptionVal = document.getElementById('absorption-val');
    const vAbsorption = document.getElementById('v-absorption');

    if (absorptionSlider) {
      absorptionSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        if (absorptionVal) absorptionVal.textContent = val;
        if (vAbsorption) vAbsorption.textContent = val + '%';
        this.addLog(`Nutrient absorption adjusted to ${val}%`);
      });
    }

    const enzymeSlider = document.getElementById('enzyme-slider');
    const enzymeVal = document.getElementById('enzyme-val');
    const vEnzyme = document.getElementById('v-enzyme');

    if (enzymeSlider) {
      enzymeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        if (enzymeVal) enzymeVal.textContent = val;
        if (vEnzyme) vEnzyme.textContent = val + '%';
        this.addLog(`Enzyme activity level adjusted to ${val}%`);
      });
    }

    const peristalsisSlider = document.getElementById('peristalsis-slider');
    const peristalsisVal = document.getElementById('peristalsis-val');
    if (peristalsisSlider) {
      peristalsisSlider.addEventListener('input', (e) => {
        this.peristalsisFreq = parseFloat(e.target.value);
        if (peristalsisVal) peristalsisVal.textContent = this.peristalsisFreq.toFixed(1);
        this.addLog(`Peristalsis frequency set to ${e.target.value} Hz`);
      });
    }

    // Digestive Hotspots
    document.querySelectorAll('.digestive-hotspot').forEach(hotspot => {
      hotspot.addEventListener('click', (e) => {
        const process = e.target.getAttribute('data-process');
        this.addLog(`Target locked on digestive process: ${process.toUpperCase()}`);
      });
    });

    const syncToggle = document.getElementById('antigravity-digestion-sync');
    if (syncToggle) {
      syncToggle.addEventListener('click', () => {
        syncToggle.classList.toggle('active');
        if (syncToggle.classList.contains('active')) {
          syncToggle.textContent = 'ENGAGED';
          this.addLog('Antigravity visceral damper engaged.');
        } else {
          syncToggle.textContent = 'DISENGAGED';
          this.addLog('WARNING: Visceral damper offline in 0.38G!');
        }
      });
    }

    const overrideBtn = document.getElementById('digestive-override-btn');
    if (overrideBtn) {
      overrideBtn.addEventListener('click', () => {
        alert('GASTROINTESTINAL PURGE INITIATED // TOXIN NEUTRALIZATION ACTIVE');
        this.addLog('CRITICAL: Emergency digestive toxin purge dispatched.');
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

  draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.fillStyle = 'rgba(0, 10, 25, 0.35)';
    this.ctx.fillRect(0, 0, w, h);

    // Reticle
    this.ctx.strokeStyle = 'rgba(255, 68, 68, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Peristaltic Contraction Waveform
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#ff4444';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#ff4444';

    this.ctx.beginPath();
    const count = 120;
    const sliceWidth = w / count;
    let x = 0;

    for (let i = 0; i < count; i++) {
      let v = Math.sin((i + this.waveOffset) * 0.1 * this.peristalsisFreq) * 14 *
              Math.sin(i * 0.05);
      let y = (h / 2) + v;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
      x += sliceWidth;
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    this.waveOffset += 1.5 * this.peristalsisFreq;
  }
}
