// Real-time UTC Clock
function updateClock() {
    const now = new Date();
    document.getElementById('utc-clock').textContent = now.toUTCString().split(' ')[4] + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// Interactive Controls & Sliders
const fluxSlider = document.getElementById('flux-slider');
const fluxVal = document.getElementById('flux-val');
fluxSlider.addEventListener('input', (e) => {
    fluxVal.textContent = parseFloat(e.target.value).toFixed(1);
    addLog(`Quantum flux adjusted to ${e.target.value}%`);
});

const gravitySlider = document.getElementById('gravity-slider');
const gravityVal = document.getElementById('gravity-val');
gravitySlider.addEventListener('input', (e) => {
    gravityVal.textContent = parseFloat(e.target.value).toFixed(2);
    addLog(`Antigravity nullification set to ${e.target.value} G`);
});

const stabilizerToggle = document.getElementById('stabilizer-toggle');
stabilizerToggle.addEventListener('click', () => {
    stabilizerToggle.classList.toggle('active');
    if (stabilizerToggle.classList.contains('active')) {
        stabilizerToggle.textContent = 'ENGAGED';
        addLog('Inertial Damper Matrix engaged.');
    } else {
        stabilizerToggle.textContent = 'DISENGAGED';
        addLog('WARNING: Inertial dampers offline!');
    }
});

const maydayBtn = document.getElementById('mayday-btn');
maydayBtn.addEventListener('click', () => {
    alert('EMERGENCY MAYDAY BROADCAST SENT TO EARTH STATIONS // RE-ROUTING LIFE SUPPORT');
    addLog('CRITICAL: Emergency Mayday transmission dispatched!');
});

// Vitals Fluctuations
setInterval(() => {
    const sys = 118 + Math.floor(Math.random() * 5);
    const dia = 92 + Math.floor(Math.random() * 4);
    const pul = 122 + Math.floor(Math.random() * 5);
    const coherence = (99.0 + Math.random() * 0.8).toFixed(1);

    document.getElementById('sys-val').textContent = sys;
    document.getElementById('dia-val').textContent = dia;
    document.getElementById('pul-val').textContent = pul;
    document.getElementById('coherence-val').textContent = coherence + '%';
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

// Canvas Waveform Animation (EEG / Neural Activity)
const canvas = document.getElementById('eegCanvas');
const ctx = canvas.getContext('2d');
let waveOffset = 0;

function drawWaveform() {
    ctx.fillStyle = 'rgba(0, 10, 25, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f0ff';

    ctx.beginPath();
    const sliceWidth = canvas.width / 150;
    let x = 0;

    for (let i = 0; i < 150; i++) {
        let v = Math.sin((i + waveOffset) * 0.1) * 15;
        if (i % 20 === 0) v += (Math.random() - 0.5) * 35; // Spike

        let y = (canvas.height / 2) + v;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.stroke();
    waveOffset += 1.5;
    requestAnimationFrame(drawWaveform);
}

drawWaveform();
