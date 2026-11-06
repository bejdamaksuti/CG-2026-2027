import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const aspect = window.innerWidth / window.innerHeight
const perspective = new THREE.PerspectiveCamera(75,
    aspect,
    0.1,
    100)
perspective.position.set(2, 2, 10)
perspective.lookAt(0, 0, 0)

const size = 8
const ortographic = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    aspect,
    -aspect,
    0.1,
    100
)
ortographic.position.set(0, 0, 10)
ortographic.lookAt(0, 0, 0)

const cameras = [perspective, ortographic]
let current = 0;
console.log('Active: Perspective')


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambient = new THREE.AmbientLight(0xffffff, 0.4)
const directional = new THREE.DirectionalLight(0xffffff, 3.5)
directional.position.set(5, 8, 4)
scene.add(ambient, directional)


const depths = [0, -3, -8]
const colors = [0xA65C4C, 0xed9494, 0x404F82]

new PLYLoader().load('models/3dModel.ply', (geo) => {
    geo.center()
    for (let i = 0; i < depths.length; i++) {
        const mesh = new THREE.Mesh(geo,
            new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.4 }))
        mesh.scale.setScalar(0.02)
        mesh.rotation.x = Math.PI
        mesh.position.x = (i - 1) * 2
        mesh.position.z = depths[i]
        scene.add(mesh)
    }
})

// NOTE: Complete TODO below BEFORE running this code.
// implement a listener that will switch between two cameras whenever the Space key is pressed

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, perspective)
}
animate()