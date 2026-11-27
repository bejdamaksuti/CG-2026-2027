# Lab 8 - Z-Fighting and Depth Buffer Analysis

## Part 1: Observations
* **Orbiting Camera:** Flickering (z-fighting) appears across the overlapping planes.
* **Moving Closer:** Flickering decreases as depth resolution increases near the camera.
* **Moving Farther:** Flickering worsens because depth precision drops at longer distances.

## Part 2: Fixes
* **Offset:** A minimum offset of `0.1` units (`planeB.position.z = -40.1`) eliminates flickering at distance `-40`.
* **Near Plane:** Raising `camera.near` from `0.1` to `1` fixes z-fighting without changing object positions.

## Short Written Answers
* **a) Why z-fighting happens:** The GPU's z-buffer has finite precision and cannot differentiate which fragment is in front when two surfaces are at almost identical depth coordinates.
* **b) Why it gets worse far away:** Precision in perspective projection is non-linear; floating-point depth resolution is heavily concentrated near the `near` plane and becomes sparse near `far`.
* **c) Raising `near` vs lowering `far`:** Raising `near` is drastically more effective because the depth distribution depends heavily on the ratio of `far / near`.
* **d) Two fixes for z-fighting:**
  1. Increase space between overlapping geometry.
  2. Increase `camera.near` or enable `logarithmicDepthBuffer: true` in WebGLRenderer.