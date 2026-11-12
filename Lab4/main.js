import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Lab 4 — Robotic Hand
// Maja Jankuloska, ID 132151

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101722);
scene.fog = new THREE.Fog(0x101722, 13, 28);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(7.5, 6.2, 9.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xbfdcff, 0x253044, 2.0));
const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
keyLight.position.set(5, 9, 7);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x3d9dff, 2.0);
rimLight.position.set(-6, 4, -5);
scene.add(rimLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2.0, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 17;

const metal = new THREE.MeshStandardMaterial({ color: 0x9aaec2, metalness: 0.82, roughness: 0.27 });
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x26384c, metalness: 0.72, roughness: 0.32 });
const accent = new THREE.MeshStandardMaterial({ color: 0x19b6a4, metalness: 0.55, roughness: 0.28 });
const jointMat = new THREE.MeshStandardMaterial({ color: 0xe1a64b, metalness: 0.68, roughness: 0.3 });

function roundedBox(parent, size, position, material, radius = 0.12) {
  const shape = new THREE.Shape();
  const w = size[0], h = size[1], r = Math.min(radius, w / 2, h / 2);
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: size[2], bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.045, bevelThickness: 0.045 });
  geometry.translate(0, 0, -size[2] / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function cylinderBetween(parent, start, end, radius, material, radialSegments = 20) {
  const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(b, a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), radialSegments), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  parent.add(mesh);
  return mesh;
}

function joint(parent, position, radius = 0.14) {
  const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 16), jointMat);
  ball.position.set(...position);
  parent.add(ball);
  return ball;
}

// Forearm and wrist connect to the palm.
cylinderBetween(scene, [0, -1.15, 0], [0, 0.05, 0], 0.43, darkMetal, 32);
for (let y = -0.85; y < -0.1; y += 0.25) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.435, 0.035, 10, 32), accent);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = y;
  scene.add(ring);
}
roundedBox(scene, [1.05, 0.38, 0.92], [0, 0.18, 0], darkMetal, 0.16);

// Palm: broad plate, reinforced back panel and central detail.
roundedBox(scene, [2.35, 2.15, 0.48], [0, 1.45, 0], metal, 0.28);
roundedBox(scene, [1.72, 1.5, 0.12], [0, 1.48, 0.29], darkMetal, 0.18);
roundedBox(scene, [0.72, 0.62, 0.08], [0, 1.48, 0.39], accent, 0.12);

// Four fingers: each has three articulated phalanges and visible knuckle joints.
// The palm's upper edge is the finger base; the thumb is intentionally on the left.
const fingerX = [-0.86, -0.29, 0.29, 0.86];
const fingerLengths = [0.78, 1.02, 0.94, 0.76];
const fingerWidths = [0.19, 0.21, 0.20, 0.18];

fingerX.forEach((x, i) => {
  const length = fingerLengths[i];
  const width = fingerWidths[i];
  const baseY = 2.53;
  const segments = [length * 0.42, length * 0.34, length * 0.24];
  let y = baseY;
  joint(scene, [x, y, 0], width * 0.83);
  segments.forEach((segmentLength, j) => {
    const nextY = y + segmentLength;
    cylinderBetween(scene, [x, y, 0], [x, nextY, 0], width * (j === 2 ? 0.43 : 0.48), metal, 20);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(width * 0.49, 0.035, 10, 24), accent);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(x, nextY - 0.045, 0);
    scene.add(cuff);
    y = nextY;
    if (j < 2) joint(scene, [x, y, 0], width * 0.72);
  });
  const fingertip = new THREE.Mesh(new THREE.SphereGeometry(width * 0.47, 20, 16), darkMetal);
  fingertip.position.set(x, y + 0.015, 0);
  scene.add(fingertip);
});

// Opposable thumb on the left side of the palm, angled outward and upward.
const thumbRoot = [-1.08, 1.02, 0.02];
const thumbJoint1 = [-1.55, 1.28, 0.02];
const thumbJoint2 = [-1.83, 1.70, 0.02];
const thumbTip = [-1.92, 2.10, 0.02];
joint(scene, thumbRoot, 0.18);
cylinderBetween(scene, thumbRoot, thumbJoint1, 0.16, metal, 24);
joint(scene, thumbJoint1, 0.145);
cylinderBetween(scene, thumbJoint1, thumbJoint2, 0.135, metal, 24);
joint(scene, thumbJoint2, 0.12);
cylinderBetween(scene, thumbJoint2, thumbTip, 0.105, metal, 24);
const thumbCap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 16), darkMetal);
thumbCap.position.set(...thumbTip);
scene.add(thumbCap);

// Small mechanical fasteners on the palm.
for (const x of [-0.88, 0.88]) {
  for (const y of [0.72, 2.18]) {
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.035, 16), jointMat);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(x, y, 0.39);
    scene.add(screw);
  }
}

const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 64), new THREE.MeshStandardMaterial({ color: 0x172333, roughness: 0.9, metalness: 0.1 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.62;
scene.add(floor);
const grid = new THREE.GridHelper(14, 28, 0x38516b, 0x26384c);
grid.position.y = -1.60;
scene.add(grid);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
