# ASTRA – Astronaut Survival & Telemetry Response Architecture

**NASA Space Apps Challenge Project**  
*Complete Life Monitoring & Control System for Deep Space Exploration & EVA Operations*

---

## 🌟 Quick Launch: Where is the Output Page?

Your output dashboard page is located right here in the root folder:

### 🚀 **`index.html`**
- **To view it immediately right now**: Simply **double-click `index.html`** in your file manager or right-click and open with **Google Chrome / Microsoft Edge**.
- It works out-of-the-box with a high-fidelity built-in telemetry simulation engine, live glowing ECG oscilloscope, and rotating 3D holographic neural brain!

---

## 💻 Programming Languages Used

1. **Rust (Backend & Calculation Engine)**:
   - Zero-cost abstractions, memory safety, and high-performance signal processing.
   - Handles on-board mathematical calculations: Heart Rate Variability (SDNN, RMSSD), Mean Arterial Pressure (MAP), SpO₂ Red/IR ratios, 5-band EEG spectral powers (Gamma, Beta, Alpha, Theta, Delta), spacesuit decompression leak rate ($dP/dt$), and autonomous medical triage rules.
   - Built as a multi-crate Cargo workspace (`astra-core`, `astra-sensors`, `astra-analytics`, `astra-telemetry`, `astra-server`).

2. **HTML5 & CSS3 (Cyberpunk HUD Theme)**:
   - High-contrast sci-fi cyberpunk HUD styling inspired by modern space telemetry and your reference designs (NASA EVA Spacewalk Cockpit, BrainMed+ Neurological HUD, and The Martian Hab Airlock telemetry).
   - Glassmorphism, neon amber/cyan/red alerts, and dynamic responsive widgets.

3. **JavaScript (Canvas & WebSocket Client)**:
   - 60 FPS HTML5 Canvas real-time rendering for the Lead-1 ECG waveform.
   - 3D rotating holographic neural brain visualizer with synaptic nodes and stress coloring.
   - Real-time WebSocket synchronization across multiple devices simultaneously.

---

## 📁 Project Architecture & Crates

```text
ASTRA H/
├── index.html                   <-- YOUR OUTPUT WEBPAGE (Double-click to open!)
├── Cargo.toml                   <-- Rust Workspace Root
├── crates/
│   ├── astra-core/              <-- Telemetry data models & 10 vitals divisions
│   ├── astra-sensors/           <-- Sensor drivers & realistic physiological simulator
│   ├── astra-analytics/         <-- Onboard DSP, HRV, SpO2, EEG bands, decompression models
│   ├── astra-telemetry/         <-- Multi-device WebSocket & network synchronization hub
│   └── astra-server/            <-- Web server hosting the Cyberpunk HUD on port 8080
├── static/                      <-- Cyberpunk HUD assets
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       ├── ecg_chart.js
│       └── brain_hud.js
└── docs/
    └── VSCODE_BEGINNER_GUIDE.md <-- Detailed step-by-step beginner guide for VS Code
```

---

## 🔌 Hardware Sensor Peripherals Supported

1. **MAX30102** – Heart Rate & SpO₂ Optical PPG
2. **MAX30205** – Clinical Grade Body Temperature (±0.1°C)
3. **BMP280** – Cabin / Spacesuit Barometric Pressure
4. **ADS1299** – 8-Channel 24-Bit Low-Noise EEG Brainwaves
5. **AD8232** – Single-Lead Analog ECG Heart Monitor
6. **MH-Z19B** – NDIR Infrared CO₂ Sensor
7. **Oxygen Sensor** – Galvanic Fuel Cell / Optical O₂
8. **Pressure Transducer** – High-Pressure Suit & Tank Ratiometric Sensor
9. **External Temperature Sensor** – Deep Space Exterior RTD PT100 (-150°C to +150°C)
10. **Digital Blood Pressure Monitor** – Automated Oscillometric Serial Protocol

---

## 📖 Step-by-Step Instructions

Check out the full beginner-friendly walkthrough in:  
**[`docs/VSCODE_BEGINNER_GUIDE.md`](file:///c:/Users/saiki/OneDrive/Desktop/ASTRA%20H/docs/VSCODE_BEGINNER_GUIDE.md)**
