import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

// Lab 6 — Loading a PLY model and comparing camera projections.
// The same PLY geometry is reused by three meshes with different materials.

const statusElement = document.querySelector('#status');
const cameraToggle = document.querySelector('#camera-toggle');
const cameraMode = document.querySelector('#camera-mode');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1220);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.domElement.setAttribute('aria-label', 'Interactive 3D scene showing three colored copies of a PLY model');
document.body.appendChild(renderer.domElement);

const aspect = window.innerWidth / window.innerHeight;
const perspectiveCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
perspectiveCamera.position.set(0, 4.3, 10.5);

const orthographicFrustumHeight = 7.2;
const orthographicCamera = new THREE.OrthographicCamera(
  -orthographicFrustumHeight * aspect / 2,
  orthographicFrustumHeight * aspect / 2,
  orthographicFrustumHeight / 2,
  -orthographicFrustumHeight / 2,
  0.1,
  100
);
orthographicCamera.position.copy(perspectiveCamera.position);
orthographicCamera.lookAt(0, 0, 0);

let activeCamera = perspectiveCamera;
let isPerspective = true;

const controls = new OrbitControls(activeCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 5;
controls.maxDistance = 24;
controls.target.set(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xdceaff, 0x26334a, 2.0));
const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
keyLight.position.set(4, 8, 6);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x48a9ff, 45, 24);
fillLight.position.set(-5, 2, -3);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0x7c8cff, 1.5);
rimLight.position.set(-4, 3, -6);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x101c2e, roughness: 0.95, metalness: 0.05 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.38;
scene.add(floor);
const grid = new THREE.GridHelper(30, 30, 0x35506e, 0x1c2c42);
grid.position.y = -1.365;
scene.add(grid);

const modelColors = [0xff984d, 0x21c6b7, 0x8796ff];
const modelPositions = [-3.05, 0, 3.05];
const modelNames = ['Amber', 'Teal', 'Indigo'];
const modelMeshes = [];

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle('error', isError);
}

function updateCameraLabel() {
  const mode = isPerspective ? 'PERSPECTIVE' : 'ORTHOGRAPHIC';
  cameraMode.textContent = mode;
  cameraToggle.textContent = isPerspective ? 'Switch to Orthographic' : 'Switch to Perspective';
}

function switchCamera() {
  isPerspective = !isPerspective;
  const nextCamera = isPerspective ? perspectiveCamera : orthographicCamera;
  // Transfer the current orbit view so switching projection does not jump the scene.
  nextCamera.position.copy(activeCamera.position);
  nextCamera.quaternion.copy(activeCamera.quaternion);
  activeCamera = nextCamera;
  controls.object = activeCamera;
  activeCamera.updateProjectionMatrix();
  controls.update();
  updateCameraLabel();
}

cameraToggle.addEventListener('click', switchCamera);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !event.repeat) {
    event.preventDefault();
    switchCamera();
  }
});

const loader = new PLYLoader();
loader.load(
  new URL('./models/3dModel.ply', import.meta.url).href,
  (geometry) => {
    geometry.computeBoundingBox();
    geometry.center();

    // Normalize the source model so it fits consistently, regardless of its original units.
    const bounds = geometry.boundingBox;
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const largestDimension = Math.max(size.x, size.y, size.z);
    const normalizedScale = 2.25 / largestDimension;
    geometry.scale(normalizedScale, normalizedScale, normalizedScale);
    geometry.computeBoundingSphere();

    // PLYLoader reads the normals stored in this file. Recompute only if they are absent.
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();

    modelColors.forEach((color, index) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.38,
        metalness: 0.18,
        flatShading: false
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(modelPositions[index], -0.18, 0);
      // The source model uses the same orientation adjustment as the original lab code.
      mesh.rotation.x = Math.PI;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = `${modelNames[index]} PLY model`;
      scene.add(mesh);
      modelMeshes.push(mesh);
    });

    const vertexCount = geometry.getAttribute('position').count;
    const triangleCount = geometry.index
      ? geometry.index.count / 3
      : geometry.getAttribute('position').count / 3;
    setStatus(`Model loaded · ${vertexCount.toLocaleString()} vertices · ${triangleCount.toLocaleString()} triangles · 3 color variations`);
    console.log('Lab 6 PLY model loaded:', {
      vertices: vertexCount,
      triangles: triangleCount,
      copies: modelMeshes.length,
      normalizedScale
    });
  },
  (event) => {
    if (event.total) {
      const percent = Math.round((event.loaded / event.total) * 100);
      setStatus(`Loading PLY model… ${percent}%`);
    }
  },
  (error) => {
    console.error('Could not load Lab 6 PLY model:', error);
    setStatus('Could not load models/3dModel.ply. Check that the file exists and run this lab through a local server.', true);
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, activeCamera);
}
animate();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nextAspect = width / height;

  perspectiveCamera.aspect = nextAspect;
  perspectiveCamera.updateProjectionMatrix();

  orthographicCamera.left = -orthographicFrustumHeight * nextAspect / 2;
  orthographicCamera.right = orthographicFrustumHeight * nextAspect / 2;
  orthographicCamera.top = orthographicFrustumHeight / 2;
  orthographicCamera.bottom = -orthographicFrustumHeight / 2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

updateCameraLabel();
