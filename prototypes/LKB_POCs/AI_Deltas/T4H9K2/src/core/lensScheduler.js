// LensScheduler blends presets over time to avoid abrupt jumps and keep the lattice harmonic.
import { lensPresets } from '../config.js';

export function createLensScheduler(config) {
  const order = ['balanced', 'human', 'predictive', 'systemic', 'harmonic'];
  const state = {
    active: 'balanced',
    target: 'balanced',
    autopilot: true,
    elapsed: 0,
    weights: { ...lensPresets.balanced },
  };

  function nextName() {
    const idx = order.indexOf(state.target);
    return order[(idx + 1) % order.length];
  }

  function setPreset(name) {
    if (!lensPresets[name]) return;
    state.active = name;
    state.target = name;
    state.weights = { ...lensPresets[name] };
  }

  function setAutopilot(enabled) {
    state.autopilot = enabled;
    state.elapsed = 0;
    if (enabled) state.target = nextName();
  }

  function tick(dt) {
    if (state.autopilot) {
      state.elapsed += dt;
      if (state.elapsed >= config.LENS_AUTOPILOT_PERIOD) {
        state.elapsed = 0;
        state.target = nextName();
      }
    }
    const tgt = lensPresets[state.target];
    const t = config.LENS_BLEND * dt;
    state.weights.basePathB = lerp(state.weights.basePathB, tgt.basePathB, t);
    state.weights.forgiveness = lerp(state.weights.forgiveness, tgt.forgiveness, t);
    state.weights.biasCoupling = lerp(state.weights.biasCoupling, tgt.biasCoupling, t);
    // TODO: Surface per-lens metadata for reason: UI could show intended behaviors (explore vs. cohere).
    return { ...state.weights, name: state.target, autopilot: state.autopilot };
  }

  function lerp(a, b, t) { return a + (b - a) * Math.min(1, Math.max(0, t)); }

  return { tick, setPreset, setAutopilot, state };
}
