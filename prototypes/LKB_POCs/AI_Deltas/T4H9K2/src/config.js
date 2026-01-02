// DeltaID: T4H9K2 — shared tunables live here for clarity and experiment reproducibility.
export const deltaId = 'T4H9K2';

export const config = {
  GRID: 16,
  SCALE: 26,
  POINT_SIZE: 4.5,
  FLIP_P: 0.014,
  PARITY_P: 0.007,
  BASE_PATH_B_P: 0.7,
  ALPHA: 0.2,
  FORGIVENESS: 0.45, // harmonic damping when dispersion spikes
  INPUT_DECAY: 0.93,
  INPUT_STRENGTH: 0.09,
  INPUT_RADIUS: 3,
  BIN_COUNT: 48,
  FFT_SIZE: 2048,
  FPS_TARGET: 60,
  VIS_THRESHOLD: 0.012,
  DREAM_JITTER: 0.004,
  BIAS_GAIN: 1.0,
  MEMORY_ECHO_WEIGHT: 0.32,
  MEMORY_DEPTH: 4,
  MEMORY_DECAY: 0.86,
  LENS_AUTOPILOT_PERIOD: 22, // seconds to move between presets
  LENS_BLEND: 0.22, // smoothing factor for autopilot transitions
  CANVAS: { fov: Math.PI / 4, cameraZ: 420 },
};

// Lens presets map the four-lens framing into Path A/B weights and bias coupling.
export const lensPresets = {
  balanced: { basePathB: 0.7, forgiveness: 0.45, biasCoupling: 1.0 },
  human: { basePathB: 0.64, forgiveness: 0.52, biasCoupling: 0.9 },
  predictive: { basePathB: 0.82, forgiveness: 0.32, biasCoupling: 1.15 },
  systemic: { basePathB: 0.74, forgiveness: 0.42, biasCoupling: 1.05 },
  harmonic: { basePathB: 0.68, forgiveness: 0.62, biasCoupling: 0.95 },
};

export function applyLensPreset(cfg, preset) {
  if (!preset) return;
  cfg.BASE_PATH_B_P = preset.basePathB;
  cfg.FORGIVENESS = preset.forgiveness;
}
