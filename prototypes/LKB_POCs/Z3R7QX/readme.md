# PhaseCube Δ Z3R7QX — Modular Upgrade Path

This proof-of-concept iterates on the original `phasecube_dreaming_0001.html` by breaking the simulation into **human-readable, composable modules** and by adding a **lightweight memory buffer** and **pluggable input bridge**. It keeps the dreaming aesthetic while making the roadmap explicit:

- **Modularity:** Separate files for configuration, simulation, rendering, audio ingress, memory buffering, and UI wiring. Drop-in replacements are easy (e.g., swap `renderer.js` for WebGL later).
- **Tunable & Configurable:** All knobs live in `config.js`; UI exposes core path bias and input parameters.
- **Robustness:** Toroidal grid, bounded clamps, decoupled rendering loop, and optional audio so the system runs even when media permissions are denied.
- **Upgrade-friendly:** Memory buffer provides a short sliding window; comments mark extension points (`TODO` notes) for long-horizon storage, multi-grid scaling, and richer bias curves.

## Files
- `index.html` — Lean shell that loads the module graph and hosts the canvas/HUD.
- `config.js` — Central tunables and DeltaID stamp for diff tracking.
- `simulation.js` — `PhaseGrid` dynamics + `InputField` diffusion; clamp helpers keep values bounded.
- `renderer.js` — Pure projection/drawing logic; no sim state mutations.
- `audio.js` — Optional Web Audio bridge (live mic, synth, or file).
- `memory.js` — Sliding window of recent frames for inspection/export.
- `ui.js` — DOM bindings; writes directly into `CONFIG` so tweaks are immediate.
- `main.js` — Orchestrates everything and exposes `startApp()`.

## Running
1. Open `index.html` in a modern browser (no build required).
2. Choose a mode (Muted/Live Mic/Synth/File).
3. Drag the canvas to rotate; adjust sliders for `p(B)`, decay, and input strength.
4. Click **Save PNG** to capture the current state. Memory buffer automatically keeps ~1.5 seconds of history.

## Notes & Next Steps
- **TODO: Thing, for reason(s)** — Stream the `MemoryBuffer` to IndexedDB for multi-minute recalls and exportable deltas.
- **TODO: Thing, for reason(s)** — Replace the 2D canvas renderer with WebGL/WebGPU for higher agent counts.
- **TODO: Thing, for reason(s)** — Add keyboard shortcuts and control presets to improve live performance ergonomics.
- **TODO: Thing, for reason(s)** — Expose a plug-in bus so alternative force kernels or ethics lenses can hot-swap at runtime.
- **TODO: Thing, for reason(s)** — Bundle an interpretable telemetry panel showing parity/plasma histograms per slice.

DeltaID: **Z3R7QX** (embed in commit message/PR body for tracking).
