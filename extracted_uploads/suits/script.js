// Real-time UTC Clock
function updateClock() {
    const now = new Date();
    document.getElementById('utc-clock').textContent = now.toUTCString().split(' ')[4] + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// Interactive EMU Component Controls
const componentSelect = document.getElementById('component-select');
const activeTag = document.getElementById('active-tag');
const pressureSlider = document.getElementById('pressure-slider');
const pressureVal = document.getElementById('pressure-val');
const fluxSlider = document.getElementById('antigravity-flux-slider');
const fluxVal = document.getElementById('flux-val');

componentSelect.addEventListener('change', (e) => {
    const compName = e.target.options[e.target.selectedIndex].text;
    activeTag.textContent = `SYSTEM: ${e.target.value.toUpperCase()}`;
    addLog(`Switched EMU subsystem focus to: ${compName}`);
});

pressureSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    pressureVal.textContent = val;
    document.getElementById('po2-val').textContent = (val * 0.72).toFixed(1);
    addLog(`Suit internal pressure adjusted to ${val} PSI`);
});

fluxSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    fluxVal.textContent = val;
    addLog(`Antigravity field density modulated to ${val}%`);
});

// Hotspot clicks
document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
        const part = e.target.getAttribute('data-part');
        componentSelect.value = part;
        activeTag.textContent = `SYSTEM: ${part.toUpperCase()}`;
        addLog(`Target locked via hologram hotspot: ${part.toUpperCase()}`);
    });
});

const servoToggle = document.getElementById('servo-toggle');
servoToggle.addEventListener('click', () => {
    servoToggle.classList.toggle('active');
    if (servoToggle.classList.contains('active')) {
        servoToggle.textContent = 'ENGAGED';
        addLog('Inertial servo-stabilizers engaged for 0.38G.');
    } else {
        servoToggle.textContent = 'DISENGAGED';
        addLog('WARNING: Inertial stabilizers offline!');
    }
});

const overrideBtn = document.getElementById('override-btn');
overrideBtn.addEventListener('click', () => {
    alert('EMERGENCY DEPRESSURIZATION PURGE INITIATED // PLSS OXYGEN RESERVE DUMPED');
    addLog('CRITICAL: Emergency suit depressurization purge executed.');
});

// Vitals & Telemetry Fluctuations
setInterval(() => {
    const integrity = (99.5 + Math.random() * 0.4).toFixed(1);
    const battery = (94.0 + Math.random() * 1.0).toFixed(1);
    const temp = (41.8 + Math.random() * 0.6).toFixed(1);

    document.getElementById('integrity-val').textContent = integrity + '%';
    document.getElementById('battery-val').textContent = battery + '%';
    document.getElementById('temp-val').textContent = temp + ' °C';
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

// Canvas Waveform Animation (EMU Telemetry Pulse)
const canvas = document.getElementById('emuCanvas');
const ctx = canvas.getContext('2d');
let waveOffset = 0;

function drawEmuWaveform() {
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
        let v = Math.sin((i + waveOffset) * 0.1) * 16;
        if (i % 30 === 0) v += (Math.random() - 0.5) * 28; // Pulse

        let y = (canvas.height / 2) + v;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.stroke();
    waveOffset += 1.4;
    requestAnimationFrame(drawEmuWaveform);
}

drawEmuWaveform();
