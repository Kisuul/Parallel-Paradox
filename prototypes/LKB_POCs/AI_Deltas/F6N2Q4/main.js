// PhaseCube Delta entry point (DeltaID: F6N2Q4)
// Wires together config, tri-swarm core, renderer, and minimal controls.

import { DEFAULT_CONFIG, DELTA_ID, LENS_PRESETS, withOverrides } from './config.js';
import { Renderer } from './renderer.js';
import { TriSwarm, lensLabel } from './swarm.js';

function qs(selector) {
  return document.querySelector(selector);
}

function buildSlider(label, id, min, max, step, value, onChange) {
  const wrapper = document.createElement('label');
  wrapper.innerHTML = `${label}<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" />`;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => onChange(parseFloat(input.value)));
  return wrapper;
}

function init() {
  const canvas = qs('#viewport');
  const controls = qs('#controls');
  const lensDisplay = qs('#lens-display');
  const status = qs('#status');

  let config = { ...DEFAULT_CONFIG };
  let swarm = new TriSwarm(config);
  const renderer = new Renderer(canvas, config.gridSize, config.scale, config.renderer);
  let paused = false;
  let autoPulseFrames = 0;

  const refreshLens = () => {
    lensDisplay.textContent = lensLabel(config.lensProfile);
  };

  const rebuild = (overrides) => {
    config = withOverrides(config, overrides);
    swarm = new TriSwarm(config);
    refreshLens();
  };

  controls.append(
    buildSlider('Noise', 'noise', 0, 0.08, 0.001, config.flipProbability, (v) => (config.flipProbability = v)),
    buildSlider('Coupling', 'coupling', 0, 0.4, 0.01, config.coupling.coreToEcho, (v) => {
      rebuild({ coupling: { coreToEcho: v, echoToScout: Math.max(0, v - 0.02), scoutToCore: Math.max(0, v - 0.04) } });
    }),
    buildSlider('Plasticity', 'plasticity', 0, 0.01, 0.0005, config.plasticity.rewireProbability, (v) => {
      rebuild({ plasticity: { ...config.plasticity, rewireProbability: v } });
    })
  );

  const lensSelect = document.createElement('select');
  Object.keys(LENS_PRESETS).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    lensSelect.append(option);
  });
  lensSelect.value = config.lensProfile;
  lensSelect.addEventListener('change', () => {
    config.lensProfile = lensSelect.value;
    swarm.setLensProfile(config.lensProfile);
    refreshLens();
  });
  const lensLabelEl = document.createElement('label');
  lensLabelEl.textContent = 'Lens profile';
  lensLabelEl.append(lensSelect);
  controls.append(lensLabelEl);

  const pulseBtn = document.createElement('button');
  pulseBtn.textContent = 'Pulse input';
  pulseBtn.addEventListener('click', () => swarm.injectPulse(config.bias.pulseStrength));
  controls.append(pulseBtn);

  refreshLens();

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      paused = !paused;
      status.textContent = paused ? 'Paused' : 'Running';
    }
  });

  status.textContent = 'Running';

  function loop() {
    if (!paused) {
      autoPulseFrames++;
      if (autoPulseFrames % 360 === 0) {
        swarm.injectPulse(config.bias.pulseStrength * 0.6);
      }
      const metrics = swarm.step(config.flipProbability);
      renderer.draw({ core: swarm.core, echo: swarm.echo, scout: swarm.scout }, metrics, lensDisplay.textContent);
    }
    requestAnimationFrame(loop);
  }

  loop();
}

window.addEventListener('DOMContentLoaded', init);
