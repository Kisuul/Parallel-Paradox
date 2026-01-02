// Controller coordinates simulation ticks, input ingestion, and rendering.
export function createController({ renderer, grid, inputField, audio, config, lensScheduler, memoryField }) {
  const state = { time: 0, last: 0, paused: false, sampler: null, memoryWeight: config.MEMORY_ECHO_WEIGHT };

  async function switchDriver(mode) {
    state.sampler = await audio.switchMode(mode);
  }

  function setMemoryWeight(v) { state.memoryWeight = v; }
  function setGain(v) { inputField.setGain(v); }
  function setPreset(name) { lensScheduler.setPreset(name); }
  function setAutopilot(on) { lensScheduler.setAutopilot(on); }

  function tick(now = 0) {
    const deltaMs = now - state.last;
    const deltaSeconds = deltaMs / 1000;
    state.last = now;
    const lens = lensScheduler.tick(deltaSeconds);
    if (!state.paused) {
      state.time += deltaSeconds;
      const sample = state.sampler ? state.sampler() : null;
      if (sample) inputField.ingest(sample.left, sample.right);
      const currentBias = sample ? inputField.bias : null;
      memoryField.record(currentBias);
      const fusedBias = memoryField.blend(currentBias, state.memoryWeight);
      grid.perturb(fusedBias);
      grid.step(fusedBias, lens);
    }
    renderer.draw({
      positions: grid.positions,
      plasma: grid.plasma,
      liquid: grid.liquid,
      parity: grid.parity,
      time: state.time,
    });
    requestAnimationFrame(tick);
  }

  function togglePause() { state.paused = !state.paused; }

  function start() {
    // Default to idle driver so the sim runs even without mic permissions.
    switchDriver('idle');
    // TODO: add backpressure via FPS_TARGET if needed.
    requestAnimationFrame((t) => { state.last = t; tick(t); });
  }

  return {
    start,
    togglePause,
    switchDriver,
    setMemoryWeight,
    setGain,
    setPreset,
    setAutopilot,
    state,
    lensState: lensScheduler.state,
  };
}
