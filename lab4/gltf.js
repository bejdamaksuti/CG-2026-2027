import * as THREE from "three"
import { OrbitControls, GLTFLoader } from "three/examples/jsm/Addons.js"

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(3, 2, 4)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.position.set(5, 8, 4)
scene.add(ambientLight, directionalLight)

const control = new OrbitControls(camera, renderer.domElement)

const info = document.createElement("div")
info.style.cssText = "position:fixed;top:10px;left:10px;font:16px monospace;background:#fff;padding:8px;white-space:pre"
document.body.appendChild(info)

const loader = new GLTFLoader()
loader.load("/model.glb", (gltf) => {
  const model = gltf.scene
  model.rotation.y = Math.PI

  let meshes = 0
  let totalNumberOfVertices = 0
  let totalNumberOfFaces = 0
  model.traverse((obj) => {
    if (obj.isMesh) {
      meshes++
      const geo = obj.geometry
      totalNumberOfVertices += geo.attributes.position.count
      totalNumberOfFaces += (geo.index ? geo.index.count : geo.attributes.position.count) / 3
    }
  })
  info.innerText = `meshes: ${meshes}\ntotalNumberOfVertices: ${totalNumberOfVertices}\ntotalNumberOfFaces: ${totalNumberOfFaces}`
  console.log({ meshes, totalNumberOfVertices, totalNumberOfFaces })

  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const scale = 3 / Math.max(size.x, size.y, size.z)
  model.scale.setScalar(scale)
  model.position.sub(center.multiplyScalar(scale))
  scene.add(model)
})

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
  requestAnimationFrame(animate)
  control.update()
  renderer.render(scene, camera)
}
animate()