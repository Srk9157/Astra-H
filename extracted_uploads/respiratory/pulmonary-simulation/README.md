# ASTRA MEDVIS — Pulmonary Visualization UI

A standalone frontend-only simulation concept built from the supplied anatomical reference image. This is **not a full application** and does not connect to sensors, devices, medical APIs, or a backend.

## Open

Open `index.html` in Chrome, Edge, or Firefox. No npm installation, build system, or internet connection is needed.

## Antigravity integration

1. Extract this ZIP into your Antigravity project workspace.
2. Open the `pulmonary-simulation` folder.
3. Preview `index.html` using your preferred local static-file preview or browser.
4. Reuse `assets/lungs-reference.png` and the UI components as a frontend visual reference for your broader application.

## Features

- Supplied lung reference image displayed as the visual centerpiece.
- Responsive cyber-medical dashboard aesthetic.
- Animated synthetic airflow particles, breathing scale/glow, waveform, scan grid, and overlays.
- Three visualization modes and layer visibility toggles.
- Pause/resume, reset, and breath-rate controls.
- Dynamic **synthetic** telemetry values for visual demonstration only.

## Files

- `index.html` — frontend markup
- `styles.css` — responsive styling and effects
- `script.js` — browser-only animation and interactions
- `assets/lungs-reference.png` — original user-provided image

## Disclaimer

All values and visual animations are illustrative, not physiologically validated and not suitable for clinical use. Anatomical labels are approximate UI annotations, not precise segmentation.
