// Project Ares // Cardiovascular Dynamics & Telemetry HUD Module
class CardioHud {
  constructor() {
    this.bpm = 72;
    this.spo2 = 98;
    this.sysBp = 118;
    this.diaBp = 76;
    this.logConsole = document.getElementById('cardio-log-console');

    this.bindEvents();
    this.startFluctuations();
  }

  bindEvents() {
    const bpmSlider = document.getElementById('cardio-bpm-slider');
    const bpmVal = document.getElementById('cardio-bpm-val');
    const vBpm = document.getElementById('cardio-v-bpm');
    const bpmBar = document.getElementById('cardio-bpm-bar');

    if (bpmSlider) {
      bpmSlider.addEventListener('input', (e) => {
        this.bpm = parseInt(e.target.value, 10);
        if (bpmVal) bpmVal.textContent = this.bpm;
        if (vBpm) vBpm.innerHTML = `${this.bpm} <small style="font-size:12px;">BPM</small>`;
        if (bpmBar) bpmBar.style.width = `${Math.min(100, Math.max(10, (this.bpm / 160) * 100))}%`;

        // Sync ECG Oscilloscopes
        if (window.cardioEcgChart) window.cardioEcgChart.setHeartRate(this.bpm);
        if (window.ecgChart) window.ecgChart.setHeartRate(this.bpm);
        if (window.heartCanvas) window.heartCanvas.setBpm(this.bpm);

        this.addLog(`Heart rate frequency adjusted to ${this.bpm} BPM`);
      });
    }

    const spo2Slider = document.getElementById('cardio-spo2-slider');
    const spo2Val = document.getElementById('cardio-spo2-val');
    const vSpo2 = document.getElementById('cardio-v-spo2');
    const spo2Bar = document.getElementById('cardio-spo2-bar');

    if (spo2Slider) {
      spo2Slider.addEventListener('input', (e) => {
        this.spo2 = parseInt(e.target.value, 10);
        if (spo2Val) spo2Val.textContent = this.spo2;
        if (vSpo2) vSpo2.innerHTML = `${this.spo2} <small style="font-size:12px;">%</small>`;
        if (spo2Bar) spo2Bar.style.width = `${this.spo2}%`;
        this.addLog(`Blood oxygen saturation set to ${this.spo2}%`);
      });
    }

    const pressureSlider = document.getElementById('cardio-pressure-slider');
    const pressureVal = document.getElementById('cardio-pressure-val');
    const vBp = document.getElementById('cardio-v-bp');
    const bpBar = document.getElementById('cardio-bp-bar');

    if (pressureSlider) {
      pressureSlider.addEventListener('input', (e) => {
        this.sysBp = parseInt(e.target.value, 10);
        this.diaBp = Math.round(this.sysBp * 0.64);
        if (pressureVal) pressureVal.textContent = this.sysBp;
        if (vBp) vBp.innerHTML = `${this.sysBp}/${this.diaBp} <small style="font-size:12px;">mmHg</small>`;
        if (bpBar) bpBar.style.width = `${Math.min(100, (this.sysBp / 180) * 100)}%`;
        this.addLog(`Systolic pressure adjusted to ${this.sysBp} mmHg`);
      });
    }

    const damperToggle = document.getElementById('cardio-damper-toggle');
    if (damperToggle) {
      damperToggle.addEventListener('click', () => {
        damperToggle.classList.toggle('active');
        if (damperToggle.classList.contains('active')) {
          damperToggle.textContent = 'ENGAGED';
          this.addLog('Cardiovascular antigravity damper engaged.');
        } else {
          damperToggle.textContent = 'DISENGAGED';
          this.addLog('WARNING: Cardiovascular antigravity damper offline!');
        }
      });
    }

    const overrideBtn = document.getElementById('cardio-override-btn');
    if (overrideBtn) {
      overrideBtn.addEventListener('click', () => {
        alert('EMERGENCY DEFIBRILLATION OVERRIDE DISPATCHED // 360J PULSE APPLIED');
        this.addLog('CRITICAL: Emergency defibrillation override executed.');
      });
    }
  }

  startFluctuations() {
    setInterval(() => {
      const output = (4.8 + Math.random() * 0.8).toFixed(1);
      const stress = (11.5 + Math.random() * 1.8).toFixed(1);

      const outEl = document.getElementById('cardio-output-val');
      const stressEl = document.getElementById('cardio-stress-val');
      if (outEl) outEl.textContent = `${output} L/min`;
      if (stressEl) stressEl.textContent = `${stress} kPa`;
    }, 2000);
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
}
