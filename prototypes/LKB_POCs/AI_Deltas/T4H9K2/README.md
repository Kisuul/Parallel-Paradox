# PhaseCube — Lens Scheduler + Echo Bias (DeltaID: T4H9K2)

This delta extends the PhaseCube upgrade path noted in `prototypes/Readme.md` and `docs/Parallel-Paradox-Design.md` by layering **lens-aware scheduling**, a **memory echo bias bus**, and clearer **input gain controls** while keeping the ES-module structure and minimal footprint.

## What changed vs. `phasecube_dreaming_0001.html`
- **Lens scheduler:** A small autopilot blends the four-lens presets over time to prevent abrupt parameter jumps; manual presets still apply instantly.
- **Echo bias bus:** Recent input fields are buffered and re-injected with tunable weight, giving a short-term “memory of influence” without overwriting internal state.
- **Gain-aware ingestion:** Input field strength is adjustable at runtime so live audio, synthetic pulses, and idle noise can be balanced quickly.
- **Status feedback:** Lens state and memory weight surface in the UI, clarifying how the lattice is being nudged frame-to-frame.
- **DeltaID tagging:** The code and UI embed DeltaID `T4H9K2` for easier traceability across iterations.

## Quick start
Open `index.html` in a modern browser with ES module support. Choose **Start Live Audio** for mic-driven bias, **Synthetic Pulse** for a deterministic demo, or **Idle Dream** for noise-only evolution. Drag to rotate; press **P** to pause and **S** to save a PNG snapshot.

## Expansion notes
- TODO: Add recorded file ingestion plus mel scaling in the audio driver to better map perception to depth.
- TODO: Promote the bias bus to pluggable adapters (e.g., text/Lyriel lens adapters) for structured inputs.
- TODO: Move scheduler presets to JSON + URL params for reproducible experiments and remote collaboration.
