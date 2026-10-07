import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    100
)
camera.position.set(6, 5, 8)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const control = new OrbitControls(camera, renderer.domElement)

//floor(plane)
const n = new THREE.Vector3(0, 1, 0);
const p0 = new THREE.Vector3(0, 0, 0);
const d = n.dot(p0);

const geometry = new THREE.PlaneGeometry(12, 12)
const material = new THREE.MeshBasicMaterial({ color: 0x2a3140 })
const floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
floor.updateMatrixWorld(true);
const grid = new THREE.GridHelper(12, 12);
scene.add(floor, grid);

//ray
const o = new THREE.Vector3(2, 5, 1)
const dir = new THREE.Vector3(0.3, -1, 0.1).normalize()

//formula
const t = (d - n.dot(o)) / n.dot(dir)
const hit = o.clone().addScaledVector(dir, t);

scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([o, hit]),
    new THREE.MeshBasicMaterial({ color: 0xff4422 })
))
const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18),
    new THREE.MeshBasicMaterial({ color: 0xffd700 })
)
dot.position.copy(hit)
scene.add(dot)

//Compare with RayCaster
const rayCaster = new THREE.Raycaster(o, dir).intersectObject(floor)[0];
console.log('Our formula', hit.toArray().map(x => x.toFixed(3)))
console.log('Ray Caster', rayCaster.point.toArray().map(x => x.toFixed(3)))

function animate() {
    requestAnimationFrame(animate)
    control.update();
    renderer.render(scene, camera);
}
animate()