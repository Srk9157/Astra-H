// Project Ares // Neurological & Neural Telemetry HUD Module
class NeuroHud {
  constructor() {
    this.canvas = document.getElementById('eegCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.waveOffset = 0;
    this.logConsole = document.getElementById('neuro-log-console');

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
    // Quantum Flux Slider
    const fluxSlider = document.getElementById('flux-slider');
    const fluxVal = document.getElementById('flux-val');
    if (fluxSlider && fluxVal) {
      fluxSlider.addEventListener('input', (e) => {
        fluxVal.textContent = parseFloat(e.target.value).toFixed(1);
        this.addLog(`Quantum flux adjusted to ${e.target.value}%`);
      });
    }

    // Gravity Slider
    const gravitySlider = document.getElementById('gravity-slider');
    const gravityVal = document.getElementById('gravity-val');
    if (gravitySlider && gravityVal) {
      gravitySlider.addEventListener('input', (e) => {
        gravityVal.textContent = parseFloat(e.target.value).toFixed(2);
        this.addLog(`Antigravity nullification set to ${e.target.value} G`);
      });
    }

    // Inertial Damper Toggle
    const stabilizerToggle = document.getElementById('stabilizer-toggle');
    if (stabilizerToggle) {
      stabilizerToggle.addEventListener('click', () => {
        stabilizerToggle.classList.toggle('active');
        if (stabilizerToggle.classList.contains('active')) {
          stabilizerToggle.textContent = 'ENGAGED';
          this.addLog('Inertial Damper Matrix engaged.');
        } else {
          stabilizerToggle.textContent = 'DISENGAGED';
          this.addLog('WARNING: Inertial dampers offline!');
        }
      });
    }

    // Mayday Emergency Override
    const maydayBtn = document.getElementById('mayday-btn');
    if (maydayBtn) {
      maydayBtn.addEventListener('click', () => {
        alert('EMERGENCY MAYDAY BROADCAST SENT TO EARTH STATIONS // RE-ROUTING LIFE SUPPORT');
        this.addLog('CRITICAL: Emergency Mayday transmission dispatched!');
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

    // Grid lines
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // 8-Channel Multi-Lead EEG Synthesis
    this.ctx.lineWidth = 1.8;
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#00f0ff';

    this.ctx.beginPath();
    const count = 120;
    const sliceWidth = w / count;
    let x = 0;

    for (let i = 0; i < count; i++) {
      let v = Math.sin((i + this.waveOffset) * 0.15) * 12 +
              Math.sin((i * 2 + this.waveOffset) * 0.3) * 6;
      if (i % 18 === 0) v += (Math.random() - 0.5) * 32; // Evoked potential spike

      let y = (h / 2) + v;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
      x += sliceWidth;
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    this.waveOffset += 1.8;
  }
}
