// Real-time UTC Clock
function updateClock() {
    const now = new Date();
    document.getElementById('utc-clock').textContent = now.toUTCString().split(' ')[4] + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// Interactive Antigravity & Digestive Sliders
const levitationSlider = document.getElementById('levitation-slider');
const levitationVal = document.getElementById('levitation-val');
const absorptionSlider = document.getElementById('absorption-slider');
const absorptionVal = document.getElementById('absorption-val');
const vAbsorption = document.getElementById('v-absorption');
const enzymeSlider = document.getElementById('enzyme-slider');
const enzymeVal = document.getElementById('enzyme-val');
const vEnzyme = document.getElementById('v-enzyme');

levitationSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    levitationVal.textContent = val;
    addLog(`Particle levitation force adjusted to ${val}%`);
});

absorptionSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    absorptionVal.textContent = val;
    vAbsorption.textContent = val + '%';
    addLog(`Nutrient absorption efficiency set to ${val}%`);
});

enzymeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    enzymeVal.textContent = val;
    vEnzyme.textContent = val + '%';
    addLog(`Enzyme catalytic activity adjusted to ${val}%`);
});

const visceralToggle = document.getElementById('visceral-toggle');
visceralToggle.addEventListener('click', () => {
    visceralToggle.classList.toggle('active');
    if (visceralToggle.classList.contains('active')) {
        visceralToggle.textContent = 'ENGAGED';
        addLog('Visceral antigravity damper engaged.');
    } else {
        visceralToggle.textContent = 'DISENGAGED';
        addLog('WARNING: Visceral antigravity damper offline!');
    }
});

const purgeBtn = document.getElementById('purge-btn');
purgeBtn.addEventListener('click', () => {
    alert('GASTROINTESTINAL TOXIN PURGE INITIATED // ANTIGRAVITY PARTICLE FLUSH ACTIVE');
    addLog('CRITICAL: Gastrointestinal toxin purge dispatched.');
});

// Telemetry fluctuations
setInterval(() => {
    const flux = 180 + Math.floor(Math.random() * 10);
    const coherence = (98.8 + Math.random() * 0.8).toFixed(1);
    const ph = (1.7 + Math.random() * 0.3).toFixed(1);

    document.getElementById('flux-val').textContent = flux + ' p/s';
    document.getElementById('coherence-val').textContent = coherence + '%';
    document.getElementById('ph-val').textContent = ph;
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

// Canvas Waveform Animation (Particle Antigravity Levitation Pulse)
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let waveOffset = 0;

function drawParticleWave() {
    ctx.fillStyle = 'rgba(0, 10, 25, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff4444';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff4444';

    ctx.beginPath();
    const sliceWidth = canvas.width / 150;
    let x = 0;

    for (let i = 0; i < 150; i++) {
        let v = Math.sin((i + waveOffset) * 0.1) * 16;
        if (i % 25 === 0) v += (Math.random() - 0.5) * 32; // Particle upward surge

        let y = (canvas.height / 2) + v;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.stroke();
    waveOffset += 1.6;
    requestAnimationFrame(drawParticleWave);
}

drawParticleWave();
