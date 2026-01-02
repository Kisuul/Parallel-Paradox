// DeltaID: Z3R7QX — configuration surface for the upgraded PhaseCube proof-of-concept.
// Tunable values are intentionally centralized for human readability and fast iteration.

export const CONFIG = {
  gridSize: 16, // Core lattice dimension (16^3 agents). TODO: Expose dynamic resizing UI, for quick scale experiments.
  scale: 24, // Spatial scale multiplier for rendering.
  pointSize: 4.25, // Base particle size in pixels.
  plasmaFlipProbability: 0.012, // Noise injection into the plasma channel each tick.
  parityFlipProbability: 0.006, // Noise for parity bit; asymmetry driver.
  basePathBProbability: 0.72, // Bias toward exploratory path; audio/input can modulate this.
  alpha: 0.16, // Damping for the solid (memory-like) accumulator.
  visThreshold: 0.01, // Minimum liquid intensity to draw a point.

  // Input bias diffusion — maps external stimuli into the lattice.
  inputRadius: 3,
  inputDecay: 0.94,
  inputStrength: 0.075,
  binCount: 48, // Audio bins / bias bands.

  // Rendering + loop timing.
  cameraZ: 420,
  fov: Math.PI / 4,
  targetFPS: 60,

  // Memory buffer for inspection/export.
  memoryFrames: 90, // Store ~1.5s at 60 FPS. TODO: Stream to IndexedDB for longer history, for persistence audits.
};
