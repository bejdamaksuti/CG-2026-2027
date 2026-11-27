import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const planeA = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
);
const planeB = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
);
planeA.position.set(0, 3, -40);
planeB.position.set(0, 3, -40.001); // almost the same depth
scene.add(planeA, planeB);

// GUI setup for testing the exercise parameters live
const gui = new GUI();
const settings = {
  offsetZ: -40.001,
  near: camera.near,
  far: camera.far
};

gui.add(settings, 'offsetZ', -40.5, -40.0001, 0.001).name('Plane B Z-Pos').onChange((val) => {
  planeB.position.z = val;
});

gui.add(settings, 'near', 0.01, 5, 0.01).name('Camera Near').onChange((val) => {
  camera.near = val;
  camera.updateProjectionMatrix();
});

gui.add(settings, 'far', 100, 2000, 10).name('Camera Far').onChange((val) => {
  camera.far = val;
  camera.updateProjectionMatrix();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();