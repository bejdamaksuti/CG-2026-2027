# Computer Graphics Labs — 2026/2027

**Student:** Maja Jankuloska  
**Student ID:** 132151

This repository contains six Computer Graphics labs. Each lab is in its own folder and can be opened independently in a browser.

## Labs

| Folder | Assignment | Main implementation |
|---|---|---|
| `Lab1` | Rotating cube | `Lab1/index.html` |
| `Lab2` | Vector laboratory | `Lab2/index.html` |
| `Lab3` | Solar system and scene hierarchy | `Lab3/index.html` |
| `Lab4` | Robotic hand | `Lab4/index.html` |
| `Lab5` | Shape from BufferGeometry | `Lab5/index.html` |
| `Lab6` | PLY model loading and camera projections | `Lab6/index.html` |

## Run a lab

The labs use Three.js through browser ES modules and an import map. Because browsers restrict ES-module loading from `file://`, run a local static server from the repository root. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open one of these addresses:

- `http://localhost:8000/Lab1/`
- `http://localhost:8000/Lab2/`
- `http://localhost:8000/Lab3/`
- `http://localhost:8000/Lab4/`
- `http://localhost:8000/Lab5/`
- `http://localhost:8000/Lab6/`

## Lab notes

- **Lab 2:** Includes Minimum, Standard and Challenge work, including the required ray-plane intersection and comparison with `THREE.Raycaster`.
- **Lab 3:** The Sun is the root; Earth and Mars orbit under it, while the Moon is parented to Earth and Phobos is parented to Mars.
- **Lab 4:** The robotic hand is built from Three.js meshes. It includes a palm, four segmented fingers, visible joints and an opposable thumb on the left side of the palm.
- **Lab 5:** The crystal is built from a `Float32Array` position attribute and an explicit index buffer of triangular faces. It does not load a pre-made model.
- **Lab 6:** Loads `Lab6/models/3dModel.ply` with `PLYLoader`, normalizes the geometry, and displays three copies with different materials. It supports Perspective and Orthographic cameras, switchable with the on-screen button or Spacebar, and uses `OrbitControls` for navigation.

## Lab 6 controls

- Left mouse drag: orbit the scene
- Mouse wheel: zoom
- Right mouse drag: pan
- Spacebar or the on-screen button: switch between Perspective and Orthographic cameras
