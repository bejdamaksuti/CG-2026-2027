import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const aspect = window.innerWidth / window.innerHeight

const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 100)
perspective.position.set(2, 2, 10)
perspective.lookAt(0, 0, 0)
scene.add(perspective)

const size = 8
const orthographic = new THREE.OrthographicCamera(
-size * aspect,
size * aspect,
size,
-size,
0.1,
100
)
orthographic.position.set(0, 0, 10)
orthographic.lookAt(0, 0, 0)

const cameras = [perspective, orthographic]
let current = 0
console.log('Active: PerspectiveCamera')

addEventListener('keydown', (e) => {
if (e.code === 'Space') {
e.preventDefault()
current = current + 1
if (current >= cameras.length) {
current = 0
    }
console.log('Active:', current === 0 ? 'PerspectiveCamera' : 'OrthographicCamera')
  }
})

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambient = new THREE.AmbientLight(0xffffff, 0.35)
const directional = new THREE.DirectionalLight(0xffffff, 2.5)
scene.add(ambient, directional)

// NOTE: Complete TODOs below BEFORE running this code.
// 1. Add an array of depths
// 2. Add an array of colors
// 3. Add 2 more models with different colors and depths and show all 3 objects with both cameras (press Space to switch between them).

new PLYLoader().load('models/3D.ply', (geo) => {
geo.center()
const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xdb8787, roughness: 0.5 }))
mesh.scale.setScalar(0.02)
mesh.rotation.x = Math.PI / 2
scene.add(mesh)
})

function animate() {
requestAnimationFrame(animate)
renderer.render(scene, cameras[current])
}
animate()
