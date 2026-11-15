// Anti-Gravity Cardiac Simulation UI (Three.js 3D & Anatomical Canvas Engine)

function buildCardiacModel(THREE) {
  const heartSystem = new THREE.Group();
  const chambersGroup = new THREE.Group();
  const coronaryGroup = new THREE.Group();

  heartSystem.add(chambersGroup);
  heartSystem.add(coronaryGroup);

  function createHeartGeometry(scaleX = 1, scaleY = 1, scaleZ = 1) {
    const geo = new THREE.SphereGeometry(1.6, 64, 64);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ny = v.y / 1.6;

      let taper = 1.0;
      if (ny < 0) {
        taper = Math.pow(1.0 + ny * 0.65, 0.85);
      } else {
        taper = 1.0 - Math.pow(ny, 2.2) * 0.25;
      }

      const apexShiftX = ny < 0 ? Math.pow(-ny, 1.5) * 0.35 : 0;
      const apexShiftZ = ny < 0 ? Math.pow(-ny, 1.5) * 0.15 : 0;
      const lobe = 1.0 + 0.08 * Math.sin(v.x * 2.0) * Math.cos(v.y * 2.0);

      v.x = (v.x * taper * lobe * scaleX) + apexShiftX;
      v.y = v.y * 1.25 * scaleY;
      v.z = (v.z * taper * 0.82 * lobe * scaleZ) + apexShiftZ;

      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // Translucent Glass Outer Shell
  const outerShellGeo = createHeartGeometry(1.0, 1.0, 1.0);
  const outerShellMat = new THREE.MeshPhysicalMaterial({
    color: 0xaaccff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.12,
    metalness: 0.05,
    ior: 1.45,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const outerShell = new THREE.Mesh(outerShellGeo, outerShellMat);
  heartSystem.add(outerShell);

  // Internal Chamber Materials
  const blueChamberMat = new THREE.MeshPhysicalMaterial({
    color: 0x0066ff,
    emissive: 0x002288,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.55,
    roughness: 0.25,
    depthWrite: false
  });

  const redChamberMat = new THREE.MeshPhysicalMaterial({
    color: 0xff1e38,
    emissive: 0x880015,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.58,
    roughness: 0.25,
    depthWrite: false
  });

  // Right Chamber (Deoxygenated Blue)
  const rightChamber = new THREE.Mesh(createHeartGeometry(0.55, 0.85, 0.72), blueChamberMat);
  rightChamber.position.set(-0.48, -0.05, 0.15);
  rightChamber.rotation.z = 0.15;
  chambersGroup.add(rightChamber);

  // Left Chamber (Oxygenated Red)
  const leftChamber = new THREE.Mesh(createHeartGeometry(0.58, 0.88, 0.75), redChamberMat);
  leftChamber.position.set(0.42, -0.08, -0.05);
  leftChamber.rotation.z = -0.18;
  chambersGroup.add(leftChamber);

  // Major Vessels
  function createVessel(points, radius, material, glassJacket = true) {
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, radius, 20, false);
    chambersGroup.add(new THREE.Mesh(tubeGeo, material));

    if (glassJacket) {
      const jacketGeo = new THREE.TubeGeometry(curve, 48, radius * 1.24, 20, false);
      heartSystem.add(new THREE.Mesh(jacketGeo, outerShellMat));
    }
  }

  // Aortic Arch + Branches
  createVessel([
    new THREE.Vector3(0.1, 0.8, 0.0),
    new THREE.Vector3(0.05, 1.85, 0.1),
    new THREE.Vector3(0.45, 2.45, -0.05),
    new THREE.Vector3(1.05, 2.25, -0.25),
    new THREE.Vector3(1.25, 1.75, -0.35)
  ], 0.28, redChamberMat);

  createVessel([new THREE.Vector3(0.32, 2.35, -0.02), new THREE.Vector3(0.35, 2.95, 0.02)], 0.09, redChamberMat);
  createVessel([new THREE.Vector3(0.58, 2.42, -0.08), new THREE.Vector3(0.68, 3.0, -0.08)], 0.08, redChamberMat);
  createVessel([new THREE.Vector3(0.82, 2.35, -0.15), new THREE.Vector3(0.98, 2.9, -0.18)], 0.08, redChamberMat);

  // Superior Vena Cava
  createVessel([
    new THREE.Vector3(-0.45, 0.7, -0.1),
    new THREE.Vector3(-0.38, 1.8, -0.12),
    new THREE.Vector3(-0.35, 2.85, -0.15)
  ], 0.24, blueChamberMat);

  // Pulmonary Trunk
  createVessel([
    new THREE.Vector3(-0.15, 0.6, 0.35),
    new THREE.Vector3(-0.1, 1.45, 0.3),
    new THREE.Vector3(0.45, 1.65, 0.1),
    new THREE.Vector3(1.35, 1.45, -0.05)
  ], 0.23, blueChamberMat);

  // Coronary Vascular Network
  const arteryMat = new THREE.MeshStandardMaterial({
    color: 0xff2a3c,
    emissive: 0xff0022,
    emissiveIntensity: 0.9,
    roughness: 0.3
  });

  const veinMat = new THREE.MeshStandardMaterial({
    color: 0x1a8cff,
    emissive: 0x0055ff,
    emissiveIntensity: 0.9,
    roughness: 0.3
  });

  function snapToHeartSurface(x, y, z, offset = 1.005) {
    const ny = y / 2.0;
    const taper = ny < 0 ? Math.pow(1.0 + ny * 0.65, 0.85) : 1.0 - Math.pow(ny, 2.2) * 0.25;
    const apexShiftX = ny < 0 ? Math.pow(-ny, 1.5) * 0.35 : 0;
    const apexShiftZ = ny < 0 ? Math.pow(-ny, 1.5) * 0.15 : 0;

    const dir = new THREE.Vector3(x, 0, z).normalize();
    const radiusX = 1.6 * taper * offset;
    const radiusZ = 1.6 * taper * 0.82 * offset;

    return new THREE.Vector3(dir.x * radiusX + apexShiftX, y, dir.z * radiusZ + apexShiftZ);
  }

  function createCoronaryBranch(rawCoords, baseRadius, mat) {
    const pts = rawCoords.map(c => snapToHeartSurface(c[0], c[1], c[2], 1.005));
    const curve = new THREE.CatmullRomCurve3(pts);
    const segments = 36;
    const geo = new THREE.TubeGeometry(curve, segments, baseRadius, 8, false);
    const pos = geo.attributes.position;
    const center = new THREE.Vector3();
    const v = new THREE.Vector3();

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      curve.getPointAt(t, center);
      const scale = 1.0 - t * 0.72;
      for (let j = 0; j <= 8; j++) {
        const idx = i * 9 + j;
        if (idx < pos.count) {
          v.fromBufferAttribute(pos, idx);
          v.sub(center).multiplyScalar(scale).add(center);
          pos.setXYZ(idx, v.x, v.y, v.z);
        }
      }
    }
    geo.computeVertexNormals();
    coronaryGroup.add(new THREE.Mesh(geo, mat));
  }

  // Arteries
  createCoronaryBranch([[-0.1, 0.95, 1.2], [-0.05, 0.4, 1.35], [0.08, -0.2, 1.25], [0.22, -0.9, 0.9], [0.32, -1.65, 0.4]], 0.036, arteryMat);
  createCoronaryBranch([[-0.02, 0.35, 1.35], [0.45, 0.0, 1.25], [0.85, -0.5, 0.9], [1.05, -1.1, 0.5]], 0.026, arteryMat);
  createCoronaryBranch([[0.08, -0.2, 1.25], [0.55, -0.55, 1.1], [0.85, -1.15, 0.65]], 0.022, arteryMat);
  createCoronaryBranch([[-0.2, 0.9, 1.15], [-0.75, 0.65, 1.0], [-1.25, 0.2, 0.6], [-1.35, -0.45, 0.2], [-1.0, -1.15, 0.1]], 0.034, arteryMat);
  createCoronaryBranch([[-0.95, 0.45, 0.85], [-0.85, -0.15, 0.95], [-0.65, -0.85, 0.75], [-0.35, -1.45, 0.45]], 0.024, arteryMat);
  createCoronaryBranch([[0.1, 0.95, 1.15], [0.7, 0.85, 0.95], [1.2, 0.55, 0.4], [1.35, 0.1, -0.3], [1.15, -0.55, -0.7]], 0.032, arteryMat);
  createCoronaryBranch([[0.2, 0.7, -1.1], [0.15, 0.0, -1.2], [0.25, -0.8, -0.9], [0.32, -1.5, -0.4]], 0.03, arteryMat);

  // Veins
  createCoronaryBranch([[-0.18, 0.85, 1.22], [-0.15, 0.25, 1.35], [-0.05, -0.35, 1.22], [0.12, -1.05, 0.85], [0.25, -1.7, 0.35]], 0.032, veinMat);
  createCoronaryBranch([[-0.15, 0.25, 1.35], [-0.55, -0.1, 1.25], [-0.82, -0.7, 0.95], [-0.6, -1.35, 0.5]], 0.024, veinMat);
  createCoronaryBranch([[0.15, 0.85, 1.18], [0.65, 0.72, 1.0], [1.1, 0.35, 0.55], [1.22, -0.35, 0.1], [0.95, -1.0, -0.2]], 0.028, veinMat);
  createCoronaryBranch([[-0.4, 0.8, 1.1], [-0.95, 0.5, 0.8], [-1.3, -0.1, 0.35], [-1.15, -0.8, -0.1]], 0.025, veinMat);
  createCoronaryBranch([[-0.2, 0.7, -1.1], [-0.25, -0.1, -1.18], [-0.1, -0.9, -0.85], [0.15, -1.55, -0.35]], 0.03, veinMat);

  return {
    heartSystem,
    chambersGroup,
    coronaryGroup,
    outerShellMat,
    redChamberMat,
    blueChamberMat
  };
}

class CardioSim {
  constructor() {
    this.container = document.getElementById('cardio-3d-viewport');
    this.fallbackBox = document.getElementById('cardio-fallback-box');
    this.bpm = 72;
    this.antiGrav = 1.0;
    this.shellOpacity = 0.22;
    this.autoRotate = true;
    this.showVessels = true;
    this.showChambers = true;
    this.showMotes = true;

    // Ensure fallback canvas is active by default
    if (this.fallbackBox) {
      this.fallbackBox.style.display = 'block';
    }

    this.bindControls();
    this.tryInitThreeJs();
  }

  bindControls() {
    const bpmSlider = document.getElementById('cardio-bpm-slider');
    const bpmVal = document.getElementById('cardio-bpm-val');
    if (bpmSlider && bpmVal) {
      bpmSlider.addEventListener('input', (e) => {
        this.bpm = parseInt(e.target.value, 10);
        bpmVal.textContent = this.bpm;
        // Synchronize fallback canvas and ECG
        if (window.heartCanvas) window.heartCanvas.setBpm(this.bpm);
        if (window.cardioEcgChart) window.cardioEcgChart.setHeartRate(this.bpm);
        if (window.ecgChart) window.ecgChart.setHeartRate(this.bpm);
      });
    }

    const antiGravSlider = document.getElementById('cardio-antigrav-slider');
    const antiGravVal = document.getElementById('cardio-antigrav-val');
    if (antiGravSlider && antiGravVal) {
      antiGravSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        this.antiGrav = pct / 100;
        antiGravVal.textContent = `${pct}%`;
      });
    }

    const shellSlider = document.getElementById('cardio-shell-opacity');
    const opacityVal = document.getElementById('cardio-opacity-val');
    if (shellSlider && opacityVal) {
      shellSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        this.shellOpacity = pct / 100;
        opacityVal.textContent = `${pct}%`;
        if (this.outerShellMat) this.outerShellMat.opacity = this.shellOpacity;
      });
    }

    this.setupToggle('cardio-toggle-vessels', (act) => {
      this.showVessels = act;
      if (this.coronaryGroup) this.coronaryGroup.visible = act;
    });

    this.setupToggle('cardio-toggle-chambers', (act) => {
      this.showChambers = act;
      if (this.chambersGroup) this.chambersGroup.visible = act;
    });

    this.setupToggle('cardio-toggle-particles', (act) => {
      this.showMotes = act;
      if (this.antiGravityParticles) this.antiGravityParticles.visible = act;
    });

    this.setupToggle('cardio-toggle-autorotate', (act) => {
      this.autoRotate = act;
    });

    const resetBtn = document.getElementById('cardio-reset-camera');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.camera) {
          this.camera.position.set(0, 0.4, 9.5);
          if (this.controls) {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
          }
        }
      });
    }
  }

  setupToggle(id, cb) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isAct = btn.getAttribute('data-active') !== 'false';
      const next = !isAct;
      btn.setAttribute('data-active', next);
      btn.classList.toggle('active', next);
      cb(next);
    });
  }

  async tryInitThreeJs() {
    if (!this.container) return;

    // Check if Three.js is available or can be dynamically imported
    if (typeof THREE === 'undefined') {
      try {
        const module = await import('three');
        window.THREE = module;
      } catch (err) {
        if (this.fallbackBox) this.fallbackBox.style.display = 'block';
        console.info("Notice: 3D WebGL engine in offline/local file mode. Interactive 2D/3D Anatomical Heart canvas is active.");
        return;
      }
    }

    try {
      const THREE = window.THREE;
      if (!THREE || !THREE.Scene) {
        if (this.fallbackBox) this.fallbackBox.style.display = 'block';
        return;
      }

      let OrbitControls = THREE.OrbitControls;
      if (!OrbitControls) {
        try {
          const controlsModule = await import('three/addons/controls/OrbitControls.js');
          OrbitControls = controlsModule.OrbitControls;
        } catch (e) {
          // OrbitControls optional
        }
      }

      const width = this.container.clientWidth || 600;
      const height = this.container.clientHeight || 480;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x020306, 0.035);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0.4, 9.5);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      this.container.innerHTML = '';
      this.container.appendChild(renderer.domElement);

      if (OrbitControls) {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 4;
        controls.maxDistance = 16;
        this.controls = controls;
      } else {
        // Fallback simple mouse-drag rotation
        let isDragging = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        renderer.domElement.addEventListener('mousedown', (e) => {
          isDragging = true;
          prevMouseX = e.clientX;
          prevMouseY = e.clientY;
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        renderer.domElement.addEventListener('mousemove', (e) => {
          if (!isDragging || !this.heartSystem) return;
          const deltaX = e.clientX - prevMouseX;
          const deltaY = e.clientY - prevMouseY;
          this.heartSystem.rotation.y += deltaX * 0.01;
          this.heartSystem.rotation.x += deltaY * 0.01;
          prevMouseX = e.clientX;
          prevMouseY = e.clientY;
        });
      }
      this.camera = camera;

      // Lights
      scene.add(new THREE.AmbientLight(0x1a2233, 2.0));
      const topLight = new THREE.DirectionalLight(0xffffff, 3.0);
      topLight.position.set(5, 10, 7);
      scene.add(topLight);

      const rimBlue = new THREE.PointLight(0x0088ff, 8, 15);
      rimBlue.position.set(-4, 2, -3);
      scene.add(rimBlue);

      const rimRed = new THREE.PointLight(0xff2244, 8, 15);
      rimRed.position.set(4, -1, 3);
      scene.add(rimRed);

      // Heart Model built directly with Three.js
      const model = buildCardiacModel(THREE);
      this.heartSystem = model.heartSystem;
      this.chambersGroup = model.chambersGroup;
      this.coronaryGroup = model.coronaryGroup;
      this.outerShellMat = model.outerShellMat;
      this.redChamberMat = model.redChamberMat;
      this.blueChamberMat = model.blueChamberMat;
      scene.add(this.heartSystem);

      // Particle Motes
      const count = 150;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const cols = new Float32Array(count * 3);
      const speeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const r = 2.4 + Math.random() * 4.5;
        const th = Math.random() * Math.PI * 2;
        pos[i * 3] = Math.cos(th) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
        pos[i * 3 + 2] = Math.sin(th) * r;
        speeds[i] = 0.004 + Math.random() * 0.012;

        const isB = Math.random() > 0.45;
        cols[i * 3] = isB ? 0.2 : 1.0;
        cols[i * 3 + 1] = isB ? 0.6 : 0.25;
        cols[i * 3 + 2] = isB ? 1.0 : 0.4;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.antiGravityParticles = new THREE.Points(geo, pMat);
      scene.add(this.antiGravityParticles);

      // Three.js 3D successfully initialized, hide 2D canvas fallback
      if (this.fallbackBox) {
        this.fallbackBox.style.display = 'none';
      }

      // Animation Loop
      const clock = new THREE.Clock();
      const animate3D = () => {
        requestAnimationFrame(animate3D);
        const elapsed = clock.getElapsedTime();
        const g = this.antiGrav;

        // Zero-G Levitation
        this.heartSystem.position.y = (Math.sin(elapsed * 1.1) * 0.24 + Math.cos(elapsed * 0.55) * 0.08) * g;
        this.heartSystem.position.x = Math.cos(elapsed * 0.7) * 0.08 * g;
        this.heartSystem.rotation.z = (Math.sin(elapsed * 0.85) * 0.06 - 0.05) * Math.max(0.3, g);
        this.heartSystem.rotation.x = Math.cos(elapsed * 0.65) * 0.05 * g;

        if (this.autoRotate) {
          this.heartSystem.rotation.y += 0.004;
        }

        // Cardiac beat pulsation
        const beatsPerSec = this.bpm / 60;
        const beatCycle = (elapsed * beatsPerSec) % 1.0;
        let pulse = 0;
        if (beatCycle < 0.14) {
          pulse = Math.sin((beatCycle / 0.14) * Math.PI) * 0.045;
        } else if (beatCycle > 0.22 && beatCycle < 0.36) {
          pulse = Math.sin(((beatCycle - 0.22) / 0.14) * Math.PI) * 0.025;
        }

        const baseScale = 0.88;
        this.heartSystem.scale.set(baseScale + pulse, baseScale + pulse * 0.85, baseScale + pulse);
        this.redChamberMat.emissiveIntensity = 0.65 + pulse * 14.0;
        this.blueChamberMat.emissiveIntensity = 0.6 + pulse * 12.0;

        // Particle drift
        const positions = this.antiGravityParticles.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += speeds[i] * Math.max(0.15, g);
          if (positions[i * 3 + 1] > 4.2) positions[i * 3 + 1] = -4.2;
        }
        this.antiGravityParticles.geometry.attributes.position.needsUpdate = true;
        this.antiGravityParticles.rotation.y = elapsed * 0.05;

        if (this.controls) this.controls.update();
        renderer.render(scene, camera);
      };

      window.addEventListener('resize', () => {
        const nw = this.container.clientWidth;
        const nh = this.container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      });

      animate3D();
    } catch (e) {
      console.info("Using anatomical canvas fallback for cardiac simulation.", e);
      if (this.fallbackBox) this.fallbackBox.style.display = 'block';
    }
  }
}

// Initialize safely regardless of document ready state
function initCardioSim() {
  window.cardioSim = new CardioSim();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCardioSim);
} else {
  initCardioSim();
}
