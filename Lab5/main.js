import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Lab 5 — Shape from BufferGeometry
// Maja Jankuloska, ID 132151
// The crystal is constructed manually from a position buffer and triangle indices.

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4.8, 3.7, 6.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdceeff, 0x28334c, 2.0));
const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
keyLight.position.set(4, 7, 5);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x3c9cff, 35, 20);
fillLight.position.set(-4, 1, -3);
scene.add(fillLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.1, 0);

// Ten vertices: one top tip, one bottom tip and two four-point rings.
// The slight alternating offsets make the crystal facets less uniform.
const vertices = new Float32Array([
   0.00,  1.85,  0.00,  // 0 top
   0.00, -1.55,  0.00,  // 1 bottom
   0.92,  0.48,  0.00,  // 2 upper ring
   0.00,  0.62,  0.82,  // 3 upper ring
  -0.88,  0.42,  0.05,  // 4 upper ring
   0.02,  0.50, -0.90,  // 5 upper ring
   0.68, -0.48,  0.08,  // 6 lower ring
   0.00, -0.58,  0.62,  // 7 lower ring
  -0.72, -0.43, -0.02,  // 8 lower ring
   0.00, -0.52, -0.72   // 9 lower ring
]);

// Every face is a triangle. Indices explicitly connect the tips and rings.
const indices = [
  // upper crown
  0, 2, 3,  0, 3, 4,  0, 4, 5,  0, 5, 2,
  // middle belt, connecting upper and lower rings
  2, 6, 3,  3, 7, 4,  4, 8, 5,  5, 9, 2,
  2, 9, 6,  3, 6, 7,  4, 7, 8,  5, 8, 9,
  // lower crown
  1, 7, 6,  1, 8, 7,  1, 9, 8,  1, 6, 9
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();
geometry.computeBoundingSphere();

const crystalMaterial = new THREE.MeshStandardMaterial({
  color: 0x55aaff,
  metalness: 0.35,
  roughness: 0.22,
  flatShading: true,
  side: THREE.DoubleSide
});
const crystal = new THREE.Mesh(geometry, crystalMaterial);
scene.add(crystal);

// Draw the indexed triangle edges so the individual faces are easy to see.
const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(geometry, 1),
  new THREE.LineBasicMaterial({ color: 0xe5f3ff, transparent: true, opacity: 0.8 })
);
crystal.add(edges);

const pedestal = new THREE.Mesh(
  new THREE.CylinderGeometry(1.05, 1.18, 0.18, 48),
  new THREE.MeshStandardMaterial({ color: 0x26364b, metalness: 0.7, roughness: 0.3 })
);
pedestal.position.y = -1.72;
scene.add(pedestal);

console.log('Lab 5 BufferGeometry:', {
  vertices: geometry.attributes.position.count,
  triangles: geometry.index.count / 3,
  indices: geometry.index.count
});

function animate() {
  requestAnimationFrame(animate);
  crystal.rotation.y += 0.004;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
