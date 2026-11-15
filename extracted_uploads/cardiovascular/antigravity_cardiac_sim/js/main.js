import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildCardiacModel } from './heartBuilder.js';

// Simulation State
const state = {
    bpm: 69,
    antiGravIntensity: 1.0,
    autoRotate: true
};

// 1. Scene & Renderer
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020306, 0.035);

const defaultCamPos = new THREE.Vector3(0, 0.4, 9.5);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.copy(defaultCamPos);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;

// 2. Lighting
scene.add(new THREE.AmbientLight(0x1a2233, 2.0));

const topLight = new THREE.DirectionalLight(0xffffff, 3.0);
topLight.position.set(5, 10, 7);
scene.add(topLight);

const rimLightBlue = new THREE.PointLight(0x0088ff, 8, 15);
rimLightBlue.position.set(-4, 2, -3);
scene.add(rimLightBlue);

const rimLightRed = new THREE.PointLight(0xff2244, 8, 15);
rimLightRed.position.set(4, -1, 3);
scene.add(rimLightRed);

// 3. Build Heart Model
const {
    heartSystem,
    chambersGroup,
    coronaryGroup,
    outerShellMat,
    redChamberMat,
    blueChamberMat
} = buildCardiacModel();
scene.add(heartSystem);

// 4. Anti-Gravity Particle Field
const particleCount = 180;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const particleSpeeds = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    const radius = 2.4 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 8.0;

    particlePositions[i * 3] = Math.cos(theta) * radius;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
    particleSpeeds[i] = 0.004 + Math.random() * 0.012;

    const isBlue = Math.random() > 0.45;
    particleColors[i * 3] = isBlue ? 0.2 : 1.0;
    particleColors[i * 3 + 1] = isBlue ? 0.6 : 0.25;
    particleColors[i * 3 + 2] = isBlue ? 1.0 : 0.4;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const antiGravityParticles = new THREE.Points(particleGeo, particleMat);
scene.add(antiGravityParticles);

// 5. UI Bindings
const bpmSlider = document.getElementById('bpm-slider');
const bpmVal = document.getElementById('bpm-val');
const bpmDisplay = document.getElementById('bpm-display');

bpmSlider.addEventListener('input', (e) => {
    state.bpm = parseInt(e.target.value, 10);
    bpmVal.textContent = state.bpm;
    bpmDisplay.innerHTML = `HR: <strong>${state.bpm} BPM</strong>`;
});

const antiGravSlider = document.getElementById('antigrav-slider');
const antiGravVal = document.getElementById('antigrav-val');
antiGravSlider.addEventListener('input', (e) => {
    const pct = parseInt(e.target.value, 10);
    state.antiGravIntensity = pct / 100;
    antiGravVal.textContent = `${pct}%`;
});

const shellSlider = document.getElementById('shell-opacity');
const opacityVal = document.getElementById('opacity-val');
shellSlider.addEventListener('input', (e) => {
    const pct = parseInt(e.target.value, 10);
    outerShellMat.opacity = pct / 100;
    opacityVal.textContent = `${pct}%`;
});

function setupToggle(btnId, callback) {
    const btn = document.getElementById(btnId);
    btn.addEventListener('click', () => {
        const next = btn.dataset.active !== 'true';
        btn.dataset.active = next;
        btn.classList.toggle('active', next);
        callback(next);
    });
}

setupToggle('toggle-vessels', (active) => { coronaryGroup.visible = active; });
setupToggle('toggle-chambers', (active) => { chambersGroup.visible = active; });
setupToggle('toggle-particles', (active) => { antiGravityParticles.visible = active; });
setupToggle('toggle-autorotate', (active) => { state.autoRotate = active; });

document.getElementById('reset-camera').addEventListener('click', () => {
    camera.position.copy(defaultCamPos);
    controls.target.set(0, 0, 0);
    controls.update();
});

// 6. Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Zero-G Levitation
    const g = state.antiGravIntensity;
    heartSystem.position.y = (Math.sin(elapsed * 1.1) * 0.24 + Math.cos(elapsed * 0.55) * 0.08) * g;
    heartSystem.position.x = Math.cos(elapsed * 0.7) * 0.08 * g;
    heartSystem.rotation.z = (Math.sin(elapsed * 0.85) * 0.06 - 0.05) * Math.max(0.3, g);
    heartSystem.rotation.x = Math.cos(elapsed * 0.65) * 0.05 * g;

    if (state.autoRotate) {
        heartSystem.rotation.y += 0.003;
    }

    // Cardiac Beat Cycle
    const beatsPerSec = state.bpm / 60;
    const beatCycle = (elapsed * beatsPerSec) % 1.0;
    let pulse = 0;

    if (beatCycle < 0.14) {
        pulse = Math.sin((beatCycle / 0.14) * Math.PI) * 0.045;
    } else if (beatCycle > 0.22 && beatCycle < 0.36) {
        pulse = Math.sin(((beatCycle - 0.22) / 0.14) * Math.PI) * 0.025;
    }

    const baseScale = 0.88;
    heartSystem.scale.set(
        baseScale + pulse,
        baseScale + pulse * 0.85,
        baseScale + pulse
    );

    redChamberMat.emissiveIntensity = 0.65 + pulse * 14.0;
    blueChamberMat.emissiveIntensity = 0.6 + pulse * 12.0;

    // Particle Drift
    const positions = antiGravityParticles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i] * Math.max(0.15, g);
        if (positions[i * 3 + 1] > 4.2) {
            positions[i * 3 + 1] = -4.2;
        }
    }
    antiGravityParticles.geometry.attributes.position.needsUpdate = true;
    antiGravityParticles.rotation.y = elapsed * 0.05;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
