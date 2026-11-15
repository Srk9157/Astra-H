// Real-time UTC Clock
function updateClock() {
    const now = new Date();
    document.getElementById('utc-clock').textContent = now.toUTCString().split(' ')[4] + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// Interactive Controls & Sliders
const bpmSlider = document.getElementById('bpm-slider');
const bpmVal = document.getElementById('bpm-val');
const vBpm = document.getElementById('v-bpm');

const spo2Slider = document.getElementById('spo2-slider');
const spo2Val = document.getElementById('spo2-val');
const vSpo2 = document.getElementById('v-spo2');

const pressureSlider = document.getElementById('pressure-slider');
const pressureVal = document.getElementById('pressure-val');
const vBp = document.getElementById('v-bp');

bpmSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    bpmVal.textContent = val;
    vBpm.innerHTML = val + ' <small>BPM</small>';
    addLog(`Heart rate frequency adjusted to ${val} BPM`);
});

spo2Slider.addEventListener('input', (e) => {
    const val = e.target.value;
    spo2Val.textContent = val;
    vSpo2.innerHTML = val + ' <small>%</small>';
    addLog(`Blood oxygen saturation set to ${val}%`);
});

pressureSlider.addEventListener('input', (e) => {
    const sys = e.target.value;
    const dia = Math.round(sys * 0.64);
    pressureVal.textContent = sys;
    vBp.innerHTML = `${sys}/${dia} <small>mmHg</small>`;
    addLog(`Systolic pressure adjusted to ${sys} mmHg`);
});

const damperToggle = document.getElementById('damper-toggle');
damperToggle.addEventListener('click', () => {
    damperToggle.classList.toggle('active');
    if (damperToggle.classList.contains('active')) {
        damperToggle.textContent = 'ENGAGED';
        addLog('Cardiovascular antigravity damper engaged.');
    } else {
        damperToggle.textContent = 'DISENGAGED';
        addLog('WARNING: Cardiovascular antigravity damper offline!');
    }
});

const overrideBtn = document.getElementById('override-btn');
overrideBtn.addEventListener('click', () => {
    alert('EMERGENCY DEFIBRILLATION OVERRIDE DISPATCHED // 360J PULSE APPLIED');
    addLog('CRITICAL: Emergency defibrillation override executed.');
});

// Telemetry fluctuations
setInterval(() => {
    const output = (4.8 + Math.random() * 0.8).toFixed(1);
    const stress = (11.5 + Math.random() * 1.8).toFixed(1);

    document.getElementById('output-val').textContent = output + ' L/min';
    document.getElementById('stress-val').textContent = stress + ' kPa';
}, 2000);

// Log Console
const logConsole = document.getElementById('log-console');
function addLog(text) {
    const time = new Date().toTimeString().split(' ')[0];
    const p = document.createElement('p');
    p.textContent = `[${time}] ${text}`;
    logConsole.insertBefore(p, logConsole.firstChild);
    if (logConsole.children.length > 10) {
        logConsole.removeChild(logConsole.lastChild);
    }
}

// Canvas ECG Waveform Animation
const canvas = document.getElementById('ecgCanvas');
const ctx = canvas.getContext('2d');
let waveOffset = 0;

function drawECGWave() {
    ctx.fillStyle = 'rgba(0, 10, 25, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';

    ctx.beginPath();
    const sliceWidth = canvas.width / 150;
    let x = 0;

    for (let i = 0; i < 150; i++) {
        let v = 0;
        let pPos = (i + Math.floor(waveOffset)) % 50;
        
        // ECG QRS Complex simulation
        if (pPos === 20) v = -25;
        else if (pPos === 22) v = 35;
        else if (pPos === 24) v = -15;
        else if (pPos === 32) v = 8;
        else v = (Math.random() - 0.5) * 3;

        let y = (canvas.height / 2) + v;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.stroke();
    waveOffset += 1.2;
    requestAnimationFrame(drawECGWave);
}

drawECGWave();
