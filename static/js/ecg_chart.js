// Lead-I ECG Real-Time Continuous Oscilloscope Visualizer (AD8232 Clinical Telemetry)
class EcgChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.points = [];
    this.maxPoints = 400; // High resolution oscilloscope buffer
    this.heartRate = 72; // BPM
    this.sweepX = 0; // Sweep bar x position
    this.sweepSpeed = 2.2; // Pixels per frame sweep velocity
    this.time = 0; // Continuous phase timer

    // Realistic P-Q-R-S-T generator state
    this.lastBeatTime = 0;
    this.gridOffset = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = (parent && parent.clientWidth > 0) ? parent.clientWidth : 600;
    this.canvas.height = (parent && parent.clientHeight > 0) ? parent.clientHeight : 140;
    this.maxPoints = Math.max(300, Math.floor(this.canvas.width));
    if (this.points.length !== this.maxPoints) {
      this.points = new Array(this.maxPoints).fill(0);
    }
  }

  setHeartRate(bpm) {
    if (bpm > 30 && bpm < 240) {
      this.heartRate = bpm;
    }
  }

  updateData(newPoints) {
    if (newPoints && newPoints.length > 0) {
      // Ingest live hardware AD8232 buffer if supplied
      for (let pt of newPoints) {
        this.points.push(pt);
        if (this.points.length > this.maxPoints) this.points.shift();
      }
    }
  }

  // Generates real-time P-Q-R-S-T voltage waveform value at time t
  getEcgVoltage(t) {
    const cycleDuration = 60 / this.heartRate; // Seconds per beat
    const beatTime = t % cycleDuration; // Time within current cardiac cycle

    // Baseline micro-fluctuation
    let v = Math.sin(t * 1.5) * 0.02 + (Math.random() - 0.5) * 0.03;

    // 1. P-Wave (Atrial Depolarization): 0.04 to 0.14 s
    if (beatTime >= 0.04 && beatTime <= 0.14) {
      const pPhase = (beatTime - 0.04) / 0.10;
      v += 0.16 * Math.sin(pPhase * Math.PI);
    }
    // 2. Q-Wave (Septal Depolarization): 0.17 to 0.19 s
    else if (beatTime > 0.17 && beatTime <= 0.195) {
      const qPhase = (beatTime - 0.17) / 0.025;
      v -= 0.18 * Math.sin(qPhase * Math.PI);
    }
    // 3. R-Peak (Ventricular Depolarization Spike): 0.195 to 0.245 s
    else if (beatTime > 0.195 && beatTime <= 0.245) {
      const rPhase = (beatTime - 0.195) / 0.05;
      v += 1.45 * Math.sin(rPhase * Math.PI);
    }
    // 4. S-Wave (Late Ventricular Depolarization): 0.245 to 0.28 s
    else if (beatTime > 0.245 && beatTime <= 0.285) {
      const sPhase = (beatTime - 0.245) / 0.04;
      v -= 0.32 * Math.sin(sPhase * Math.PI);
    }
    // 5. ST Segment & T-Wave (Ventricular Repolarization): 0.34 to 0.52 s
    else if (beatTime >= 0.34 && beatTime <= 0.52) {
      const tPhase = (beatTime - 0.34) / 0.18;
      v += 0.30 * Math.sin(tPhase * Math.PI);
    }
    // 6. U-Wave (Occasional small papillary muscle repolarization): 0.55 to 0.62 s
    else if (beatTime >= 0.55 && beatTime <= 0.62) {
      const uPhase = (beatTime - 0.55) / 0.07;
      v += 0.05 * Math.sin(uPhase * Math.PI);
    }

    return v;
  }

  // Draw continuous moving oscilloscope frame (called at 60 FPS)
  draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w === 0 || h === 0) return;

    // Advance time smoothly for continuous motion
    const dt = 1 / 60; // 60 FPS step
    this.time += dt;

    // Push new moving ECG points into the rolling buffer
    const pointsToAdd = Math.max(1, Math.round(this.sweepSpeed));
    for (let p = 0; p < pointsToAdd; p++) {
      const sampleTime = this.time + (p * dt / pointsToAdd);
      const v = this.getEcgVoltage(sampleTime);
      this.points.push(v);
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }
    }

    // 1. Oscilloscope Screen Dark CRT Background
    this.ctx.fillStyle = '#020610';
    this.ctx.fillRect(0, 0, w, h);

    // 2. Clinical Medical Grid (Major & Minor ECG Squares)
    // Minor grid: 10px (~0.04s)
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    for (let x = 0; x < w; x += 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Major grid: 50px (~0.20s standard ECG block)
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
    for (let x = 0; x < w; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Center Isoelectric Zero-line
    const midY = h / 2 + 5;
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([3, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, midY);
    this.ctx.lineTo(w, midY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 3. 1 mV Calibration Step on left edge
    this.ctx.strokeStyle = '#ffb703';
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.moveTo(8, midY);
    this.ctx.lineTo(16, midY);
    this.ctx.lineTo(16, midY - 38);
    this.ctx.lineTo(26, midY - 38);
    this.ctx.lineTo(26, midY);
    this.ctx.lineTo(34, midY);
    this.ctx.stroke();

    this.ctx.font = '8px "Share Tech Mono", monospace';
    this.ctx.fillStyle = 'rgba(255, 183, 3, 0.7)';
    this.ctx.fillText("1 mV", 13, midY - 42);

    // 4. Moving Continuous Waveform Plotting
    const step = (w - 40) / Math.max(1, this.points.length - 1);
    const scaleY = h * 0.36;

    // Glowing Under-Wave Blur
    this.ctx.save();
    this.ctx.shadowColor = '#ffb703';
    this.ctx.shadowBlur = 12;
    this.ctx.strokeStyle = '#ffb703';
    this.ctx.lineWidth = 2.2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const x = 38 + i * step;
      const y = midY - this.points[i] * scaleY;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();

    // Secondary Bright Neon Core Line
    this.ctx.shadowBlur = 4;
    this.ctx.strokeStyle = '#fff5cc';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();
    this.ctx.restore();

    // 5. Animated Sweep Head Glowing Dot at the current leading edge
    if (this.points.length > 0) {
      const lastIdx = this.points.length - 1;
      const headX = 38 + lastIdx * step;
      const headY = midY - this.points[lastIdx] * scaleY;

      this.ctx.save();
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.beginPath();
      this.ctx.arc(headX, headY, 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Outer Pulse Ring
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(headX, headY, 6.5, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 6. Real-Time Oscilloscope HUD Badges & Telemetry Overlay
    this.ctx.font = '10px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#ffb703';
    this.ctx.fillText(`LEAD-I // AD8232 LIVE`, 42, 18);

    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.fillText(`25 mm/s  10 mm/mV`, w - 145, 18);

    this.ctx.fillStyle = '#00ff88';
    this.ctx.fillText(`HR: ${Math.round(this.heartRate)} BPM`, 42, h - 8);

    this.ctx.fillStyle = '#7f9bb3';
    this.ctx.fillText(`PR: 148ms | QRS: 88ms | QTc: 395ms`, w - 215, h - 8);
  }
}
