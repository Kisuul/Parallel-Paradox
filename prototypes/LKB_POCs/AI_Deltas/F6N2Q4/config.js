// PhaseCube Delta configuration (DeltaID: F6N2Q4)
// Tunables stay centralized to keep the POC modular, human-readable, and easy to remix.

export const DELTA_ID = 'F6N2Q4';

export const DEFAULT_CONFIG = {
  gridSize: 12, // Keep modest for CPU; scale cautiously once WebGL is introduced.
  scale: 24, // Spatial scale for projection.
  alpha: 0.22, // Solid-phase damping (forgiveness-style persistence).
  flipProbability: 0.024, // Random plasma flips to prevent collapse.
  parityProbability: 0.012, // Parity toggles to maintain asymmetry.
  pathBProbability: 0.6, // Base probability of difference-amplifying branch.
  coupling: {
    coreToEcho: 0.14,
    echoToScout: 0.12,
    scoutToCore: 0.1
  },
  plasticity: {
    rewireProbability: 0.0015, // Chance per plasticity window to rewire a neighbor edge.
    window: 80 // Frames between plasticity attempts.
  },
  delay: {
    length: 14, // Frames retained in the delay line.
    decay: 0.9, // How quickly historical influence fades.
    gain: 0.3 // Strength of reinjected history.
  },
  bias: {
    baseBreath: 0.04, // Low-frequency bias oscillator amplitude.
    pulseDecay: 0.93, // Decay factor for injected pulses.
    pulseStrength: 0.42 // Default strength for injected pulses.
  },
  renderer: {
    pointSize: 4,
    bg: '#04060c',
    stroke: 'rgba(255,255,255,0.35)'
  },
  lensProfile: 'balanced'
};

export const LENS_PRESETS = {
  balanced: { human: 0.2, predictive: 0.2, systemic: 0.2, harmonic: 0.4 },
  exploratory: { human: 0.1, predictive: 0.35, systemic: 0.15, harmonic: 0.4 },
  harmonic: { human: 0.2, predictive: 0.15, systemic: 0.15, harmonic: 0.5 }
};

export function withOverrides(config, overrides) {
  // Shallow merge with nested support for structured sections.
  return {
    ...config,
    ...overrides,
    coupling: { ...config.coupling, ...(overrides?.coupling || {}) },
    plasticity: { ...config.plasticity, ...(overrides?.plasticity || {}) },
    delay: { ...config.delay, ...(overrides?.delay || {}) },
    bias: { ...config.bias, ...(overrides?.bias || {}) },
    renderer: { ...config.renderer, ...(overrides?.renderer || {}) }
  };
}
