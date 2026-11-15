// Project Ares // Endocrine System & Hormonal Telemetry HUD Module
class EndocrineHud {
  constructor() {
    this.canvas = document.getElementById('hormoneCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.waveOffset = 0;
    this.logConsole = document.getElementById('endocrine-log-console');

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
    const glandSelect = document.getElementById('gland-select');
    const activeGlandTag = document.getElementById('active-gland-tag');
    const secretionSlider = document.getElementById('secretion-slider');
    const secretionVal = document.getElementById('secretion-val');
    const circadianSlider = document.getElementById('circadian-slider');
    const circadianVal = document.getElementById('circadian-val');

    if (glandSelect) {
      glandSelect.addEventListener('change', (e) => {
        const glandName = e.target.options[e.target.selectedIndex].text;
        if (activeGlandTag) activeGlandTag.textContent = `AXIS: ${e.target.value.toUpperCase()}`;
        this.addLog(`Switched telemetry focus to ${glandName}`);
      });
    }

    if (secretionSlider && secretionVal) {
      secretionSlider.addEventListener('input', (e) => {
        secretionVal.textContent = parseFloat(e.target.value).toFixed(1);
        this.addLog(`Hormone secretion rate adjusted to ${e.target.value}%`);
      });
    }

    if (circadianSlider && circadianVal) {
      circadianSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        circadianVal.textContent = (val >= 0 ? '+' : '') + val.toFixed(1);
        this.addLog(`Circadian phase shifted by ${circadianVal.textContent} hrs`);
      });
    }

    // Optical Hotspots
    document.querySelectorAll('.endocrine-hotspot').forEach(hotspot => {
      hotspot.addEventListener('click', (e) => {
        const gland = e.target.getAttribute('data-gland');
        if (glandSelect) glandSelect.value = gland;
        if (activeGlandTag) activeGlandTag.textContent = `AXIS: ${gland.toUpperCase()}`;
        this.addLog(`Selected gland via optical map: ${gland.toUpperCase()}`);
      });
    });

    const syncToggle = document.getElementById('antigravity-hormone-sync');
    if (syncToggle) {
      syncToggle.addEventListener('click', () => {
        syncToggle.classList.toggle('active');
        if (syncToggle.classList.contains('active')) {
          syncToggle.textContent = 'ACTIVE SYNC';
          this.addLog('Antigravity endocrine feedback loop synchronized.');
        } else {
          syncToggle.textContent = 'MANUAL MODE';
          this.addLog('WARNING: Endocrine sync switched to manual override!');
        }
      });
    }

    const overrideBtn = document.getElementById('endocrine-override-btn');
    if (overrideBtn) {
      overrideBtn.addEventListener('click', () => {
        alert('ENDOCRINE PURGE INITIATED // METABOLIC STABILIZERS FLUSHED');
        this.addLog('CRITICAL: Metabolic toxins and cortisol surge purged.');
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
    this.ctx.strokeStyle = 'rgba(0, 255, 100, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Hormone Pulsing Waveform
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#00ff88';

    this.ctx.beginPath();
    const count = 120;
    const sliceWidth = w / count;
    let x = 0;

    for (let i = 0; i < count; i++) {
      let v = Math.sin((i + this.waveOffset) * 0.08) * 16 +
              Math.sin((i * 0.5 + this.waveOffset) * 0.04) * 8;
      let y = (h / 2) + v;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
      x += sliceWidth;
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    this.waveOffset += 1.2;
  }
}
