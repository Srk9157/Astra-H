// Real-time UTC Clock
function updateClock() {
    const now = new Date();
    document.getElementById('utc-clock').textContent = now.toUTCString().split(' ')[4] + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// Interactive Gland Controls
const glandSelect = document.getElementById('gland-select');
const activeGlandTag = document.getElementById('active-gland-tag');
const secretionSlider = document.getElementById('secretion-slider');
const secretionVal = document.getElementById('secretion-val');
const circadianSlider = document.getElementById('circadian-slider');
const circadianVal = document.getElementById('circadian-val');

glandSelect.addEventListener('change', (e) => {
    const glandName = e.target.options[e.target.selectedIndex].text;
    activeGlandTag.textContent = `AXIS: ${e.target.value.toUpperCase()}`;
    addLog(`Switched telemetry focus to ${glandName}`);
});

secretionSlider.addEventListener('input', (e) => {
    secretionVal.textContent = parseFloat(e.target.value).toFixed(1);
    addLog(`Hormone secretion rate adjusted to ${e.target.value}%`);
});

circadianSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    circadianVal.textContent = (val >= 0 ? '+' : '') + val.toFixed(1);
    addLog(`Circadian phase shifted by ${circadianVal.textContent} hrs`);
});

// Hotspot clicks
document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
        const gland = e.target.getAttribute('data-gland');
        glandSelect.value = gland;
        activeGlandTag.textContent = `AXIS: ${gland.toUpperCase()}`;
        addLog(`Selected gland via optical map: ${gland.toUpperCase()}`);
    });
});

const syncToggle = document.getElementById('antigravity-hormone-sync');
syncToggle.addEventListener('click', () => {
    syncToggle.classList.toggle('active');
    if (syncToggle.classList.contains('active')) {
        syncToggle.textContent = 'ACTIVE SYNC';
        addLog('Antigravity endocrine feedback loop synchronized.');
    } else {
        syncToggle.textContent = 'MANUAL MODE';
        addLog('WARNING: Endocrine sync switched to manual override!');
    }
});

const overrideBtn = document.getElementById('override-btn');
overrideBtn.addEventListener('click', () => {
    alert('ENDOCRINE PURGE INITIATED // METABOLIC STABILIZERS FLUSHED');
    addLog('CRITICAL: Metabolic toxins and cortisol surge purged.');
});

// Vitals Fluctuations
setInterval(() => {
    const metab = (98.0 + Math.random() * 1.2).toFixed(1);
    const cortisol = (13.5 + Math.random() * 2.0).toFixed(1);
    const t4 = (8.0 + Math.random() * 0.8).toFixed(1);
    const insulin = 90 + Math.floor(Math.random() * 6);
    const melatonin = (44.0 + Math.random() * 3.0).toFixed(1);

    document.getElementById('metabolic-val').textContent = metab + '%';
    document.getElementById('cortisol-val').textContent = cortisol + ' µg/dL';
    document.getElementById('t4-val').textContent = t4;
    document.getElementById('insulin-val').textContent = insulin;
    document.getElementById('melatonin-val').textContent = melatonin;
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

// Canvas Waveform Animation (Hormone Pulsing / Endocrine Activity)
const canvas = document.getElementById('hormoneCanvas');
const ctx = canvas.getContext('2d');
let waveOffset = 0;

function drawHormoneWaveform() {
    ctx.fillStyle = 'rgba(0, 10, 25, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff64';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ff64';

    ctx.beginPath();
    const sliceWidth = canvas.width / 150;
    let x = 0;

    for (let i = 0; i < 150; i++) {
        let v = Math.sin((i + waveOffset) * 0.08) * 18;
        if (i % 30 === 0) v += (Math.random() - 0.5) * 25; // Hormone pulse

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
    requestAnimationFrame(drawHormoneWaveform);
}

drawHormoneWaveform();
