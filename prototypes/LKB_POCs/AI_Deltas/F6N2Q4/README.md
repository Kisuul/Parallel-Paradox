# PhaseCube Delta — Lens-Modulated Tri-Swarm (DeltaID: F6N2Q4)

This proof-of-concept iterates the PhaseCube upgrade path from `prototypes/LKB_POCs/readme.md` by combining **multi-grid interaction**, **delayed feedback**, **structural plasticity**, and a lightweight **interpretive layer** with lens-inspired modulators.

## Why this version matters
- **Three-way dialogue:** Core, echo, and scout grids share soft bias fields and cross-coupling matrices rather than hard control channels.
- **Lens modulators:** Four tunable lens weights (human, predictive, systemic, harmonic) reshape the update balance between stability, divergence, and memory.
- **Bias pulses + delay lines:** A decaying bias field simulates external influence (e.g., audio taps), while per-grid delay lines re-inject recent energy.
- **Plastic yet bounded:** Low-rate rewiring plus damping keep the swarm adaptive without collapsing into noise or stasis.
- **Readable overlay:** Metrics and current lens profile are visible; controls expose key tunables without hiding the mechanics.

Design goals: minimal but robust, modular, tunable, and fully human-readable. DeltaID markers appear in code comments for easier delta tracking.

## Files
- `index.html` — UI shell (canvas + sidebar) wiring the module-based simulation.
- `config.js` — Default tunables, lens presets, and helper to merge overrides.
- `swarm.js` — Core mechanics: neighbor graph, phase grids, plasticity, bias pulses, and tri-swarm orchestration.
- `renderer.js` — Canvas renderer with orbit controls and overlay metrics.
- `main.js` — Entry point that stitches config, swarm, renderer, and UI controls.

## How to run
Open `index.html` in a modern browser with ES module support. No build step or external dependencies are required.

## Controls
- **Space** — Pause/resume simulation.
- **Noise** — Set stochastic plasma flip rate (prevents collapse).
- **Coupling** — Tune cross-talk strength between grids.
- **Plasticity** — Adjust rewiring probability (structural plasticity).
- **Lens profile** — Pick balanced, exploratory, or harmonic weighting.
- **Pulse input** — Inject a decaying bias pulse (simulates audio/impulse influence).

## Extension notes
- TODO: Thing, for reason(s) — add real audio bias input that feeds the bias pulses without overwriting internal state.
- TODO: Thing, for reason(s) — swap the canvas renderer for WebGL instancing to scale agent counts.
- TODO: Thing, for reason(s) — persist metrics (e.g., IndexedDB) to study long-horizon behavior.
- TODO: Thing, for reason(s) — expose per-lens curves per grid to explore heterogeneous swarms.

## Ethos
The swarm stays below goal-driven AI: autonomous, bounded, interpretable, and influenceable. The DeltaID (F6N2Q4) is embedded in comments to improve delta tracking for this AI-assisted iteration.
