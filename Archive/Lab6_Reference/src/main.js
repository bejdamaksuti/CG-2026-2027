import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

// 1. Scene Setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

// 2. Cameras Setup (Perspective and Orthographic)
const aspect = window.innerWidth / window.innerHeight
const perspectiveCamera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100)
perspectiveCamera.position.set(3, 2, 4)

const orthographicCamera = new THREE.OrthographicCamera(-3 * aspect, 3 * aspect, 3, -3, 0.1, 100)
orthographicCamera.position.set(3, 2, 4)

let activeCamera = perspectiveCamera

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 4. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(5, 10, 4)
scene.add(directionalLight)

// 5. Controls
const controls = new OrbitControls(activeCamera, renderer.domElement)

// 6. Load PLY Model (Make sure 3dModel.ply is in a 'models' folder inside lab6)
const depths = [0, -4, -8]
const colors = [0xFF8A40, 0x009494, 0x484F82]

new PLYLoader().load('models/3dModel.ply', function (geometry) {
  geometry.center()
  for (let i = 0; i < depths.length; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.4
      })
    )
    mesh.scale.setScalar(0.02)
    mesh.rotation.x = Math.PI
    mesh.position.x = (i - 1) * 2
    mesh.position.z = depths[i]
    scene.add(mesh)
  }
})

// 7. Spacebar Event Listener (Switch Cameras)[cite: 15]
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    activeCamera = (activeCamera === perspectiveCamera) ? orthographicCamera : perspectiveCamera
    controls.object = activeCamera
    controls.update()
  }
})

// 8. Animation Loop
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, activeCamera)
}
animate()