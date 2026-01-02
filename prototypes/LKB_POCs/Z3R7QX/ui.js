// UI binding for PhaseCube DeltaID Z3R7QX.
// Keeps DOM manipulation out of the simulation core.

import { CONFIG } from './config.js';

export function wireControls(engine) {
  const pauseBtn = document.getElementById('pause-btn');
  const saveBtn = document.getElementById('save-btn');
  const modeSelect = document.getElementById('mode-select');
  const fileInput = document.getElementById('file-input');
  const synthFreq = document.getElementById('synth-freq');
  const synthPan = document.getElementById('synth-pan');
  const probSlider = document.getElementById('pathb-prob');
  const decaySlider = document.getElementById('input-decay');
  const strengthSlider = document.getElementById('input-strength');

  pauseBtn.addEventListener('click', () => {
    const paused = engine.togglePause();
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  });

  saveBtn.addEventListener('click', () => engine.snapshotPNG());

  modeSelect.addEventListener('change', async (e) => {
    const mode = e.target.value;
    if (mode === 'file') {
      fileInput.click();
    } else if (mode === 'synth') {
      await engine.switchMode('synth', {
        type: 'sine',
        frequency: Number(synthFreq.value),
        pan: Number(synthPan.value),
      });
    } else if (mode === 'live') {
      try {
        await engine.switchMode('live');
      } catch (err) {
        console.warn('Live audio unavailable; staying muted', err);
        modeSelect.value = 'muted';
      }
    } else {
      // muted
      await engine.switchMode('muted');
    }
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await engine.switchMode('file', { file });
      modeSelect.value = 'file';
    }
  });

  synthFreq.addEventListener('input', async () => {
    if (modeSelect.value === 'synth') {
      await engine.switchMode('synth', {
        type: 'sine',
        frequency: Number(synthFreq.value),
        pan: Number(synthPan.value),
      });
    }
  });

  synthPan.addEventListener('input', async () => {
    if (modeSelect.value === 'synth') {
      await engine.switchMode('synth', {
        type: 'sine',
        frequency: Number(synthFreq.value),
        pan: Number(synthPan.value),
      });
    }
  });

  probSlider.addEventListener('input', (e) => {
    CONFIG.basePathBProbability = Number(e.target.value);
  });

  decaySlider.addEventListener('input', (e) => {
    CONFIG.inputDecay = Number(e.target.value);
  });

  strengthSlider.addEventListener('input', (e) => {
    CONFIG.inputStrength = Number(e.target.value);
  });

  // Pointer rotation support: keeps the view interactive without clutter.
  const canvas = document.getElementById('phasecube-canvas');
  let dragging = false;
  canvas.addEventListener('pointerdown', () => (dragging = true));
  window.addEventListener('pointerup', () => (dragging = false));
  window.addEventListener('pointermove', (evt) => {
    if (!dragging) return;
    engine.renderer.setRotationFromPointer(evt);
  });

  // TODO: Add keyboard shortcuts for mode switching and parameter nudging, for live performance UX.
}
