// Real-time UTC Clock
function updateClock() {
    const now = new Date();
    document.getElementById('utc-clock').textContent = now.toUTCString().split(' ')[4] + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// Interactive Controls & Sliders
const absorptionSlider = document.getElementById('absorption-slider');
const absorptionVal = document.getElementById('absorption-val');
const vAbsorption = document.getElementById('v-absorption');

absorptionSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    absorptionVal.textContent = val;
    vAbsorption.textContent = val + '%';
    addLog(`Nutrient absorption adjusted to ${val}%`);
});

const enzymeSlider = document.getElementById('enzyme-slider');
const enzymeVal = document.getElementById('enzyme-val');
const vEnzyme = document.getElementById('v-enzyme');

enzymeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    enzymeVal.textContent = val;
    vEnzyme.textContent = val + '%';
    addLog(`Enzyme activity level adjusted to ${val}%`);
});

const peristalsisSlider = document.getElementById('peristalsis-slider');
const peristalsisVal = document.getElementById('peristalsis-val');
peristalsisSlider.addEventListener('input', (e) => {
    peristalsisVal.textContent = parseFloat(e.target.value).toFixed(1);
    addLog(`Peristalsis frequency set to ${e.target.value} Hz`);
});

// Hotspot Clicks
document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
        const process = e.target.getAttribute('data-process');
        addLog(`Target locked on digestive process: ${process.toUpperCase()}`);
    });
});

const syncToggle = document.getElementById('antigravity-digestion-sync');
syncToggle.addEventListener('click', () => {
    syncToggle.classList.toggle('active');
    if (syncToggle.classList.contains('active')) {
        syncToggle.textContent = 'ENGAGED';
        addLog('Antigravity visceral damper engaged.');
    } else {
        syncToggle.textContent = 'DISENGAGED';
        addLog('WARNING: Visceral damper offline in 0.38G!');
    }
});

const overrideBtn = document.getElementById('override-btn');
overrideBtn.addEventListener('click', () => {
    alert('GASTROINTESTINAL PURGE INITIATED // TOXIN NEUTRALIZATION ACTIVE');
    addLog('CRITICAL: Emergency digestive toxin purge dispatched.');
});

// Vitals Fluctuations
setInterval(() => {
    const ph = (1.7 + Math.random() * 0.3).toFixed(1);
    const flux = 140 + Math.floor(Math.random() * 8);

    document.getElementById('ph-val').textContent = ph + ' pH';
    document.getElementById('flux-val').textContent = flux + ' p/s';
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

// Canvas Waveform Animation (Peristaltic Wave / Digestion Telemetry)
const canvas = document.getElementById('peristalsisCanvas');
const ctx = canvas.getContext('2d');
let waveOffset = 0;

function drawPeristalsisWave() {
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
        let v = Math.sin((i + waveOffset) * 0.12) * 16;
        if (i % 25 === 0) v += (Math.random() - 0.5) * 30; // Peristalsis contraction

        let y = (canvas.height / 2) + v;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.stroke();
    waveOffset += 1.8;
    requestAnimationFrame(drawPeristalsisWave);
}

drawPeristalsisWave();
