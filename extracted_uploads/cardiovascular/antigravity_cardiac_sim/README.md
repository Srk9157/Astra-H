# Anti-Gravity Cardiac Simulation UI

A modular HTML5, CSS3, and Three.js frontend simulation featuring a translucent 3D holographic heart suspended in a zero-gravity field with interactive telemetry controls.

## Project Structure

```text
antigravity_cardiac_sim/
├── index.html          # Main viewport and HUD layout
├── css/
│   └── styles.css      # Glassmorphism UI styling and animations
├── js/
│   ├── heartBuilder.js # Procedural 3D anatomy, chambers, and coronary splines
│   └── main.js         # Scene setup, zero-G physics, cardiac pulse, and UI bindings
└── README.md
```

## Running Locally

Because the project uses ES Modules (`<script type="module">`), serve the folder using any local HTTP server:

```bash
# Using Python 3
python -m http.server 8080

# Or using Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.
