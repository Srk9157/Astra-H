import * as THREE from 'three';

export function buildCardiacModel() {
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
