// PhaseCube DeltaID Z3R7QX — modernized, modular POC.
// Orchestrates simulation, rendering, audio, memory, and UI wiring.

import { CONFIG } from './config.js';
import { PhaseGrid, InputField } from './simulation.js';
import { Renderer } from './renderer.js';
import { AudioBridge } from './audio.js';
import { MemoryBuffer } from './memory.js';
import { wireControls } from './ui.js';

class PhaseCubeEngine {
  constructor({ canvas, statsEl }) {
    this.renderer = new Renderer(canvas);
    this.statsEl = statsEl;

    this.grid = new PhaseGrid(CONFIG.gridSize);
    this.input = new InputField(CONFIG.gridSize, CONFIG.binCount);
    this.audio = new AudioBridge();
    this.memory = new MemoryBuffer(CONFIG.memoryFrames);

    this.positions = this.buildPositions(CONFIG.gridSize, CONFIG.scale);
    this.paused = false;
    this.time = 0;
    this.lastFrame = performance.now();
    this.mode = 'muted';

    // TODO: Add support for multiple grids stitched together for scale-out demos.
  }

  buildPositions(size, scale) {
    const total = size ** 3;
    const arr = new Float32Array(total * 3);
    const half = (size - 1) / 2;
    let ptr = 0;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          arr[ptr++] = (x - half) * scale;
          arr[ptr++] = (y - half) * scale;
          arr[ptr++] = (z - half) * scale;
        }
      }
    }
    return arr;
  }

  async switchMode(mode, opts = {}) {
    this.mode = mode;
    if (mode === 'live') {
      await this.audio.useLiveInput();
    } else if (mode === 'file' && opts.file) {
      await this.audio.useFile(opts.file);
    } else if (mode === 'synth') {
      await this.audio.useSynth(opts);
    }
  }

  togglePause() {
    this.paused = !this.paused;
    return this.paused;
  }

  snapshotPNG() {
    const link = document.createElement('a');
    link.download = `phasecube_${Date.now()}.png`;
    link.href = this.renderer.canvas.toDataURL('image/png');
    link.click();
  }

  update() {
    const now = performance.now();
    const deltaMs = now - this.lastFrame;
    this.lastFrame = now;

    if (!this.paused) {
      this.time += deltaMs / 1000;

      let bias = null;
      const bins = this.audio.sampleBins();
      if (bins) {
        this.input.updateFromBands(bins.left, bins.right);
        bias = this.input.bias;
      }

      this.grid.perturb(bias);
      this.grid.step(bias);

      this.memory.push({
        plasma: this.grid.plasma,
        liquid: this.grid.liquid,
        solid: this.grid.solid,
        timestamp: now,
      });
    }

    // Render regardless of pause to keep UI responsive.
    const points = this.renderer.projectPositions(this.positions);
    this.renderer.draw(points, this.grid, this.time);

    this.updateStats(deltaMs);
    requestAnimationFrame(() => this.update());
  }

  updateStats(deltaMs) {
    const fps = 1000 / Math.max(1, deltaMs);
    if (this.statsEl) {
      this.statsEl.textContent = `FPS: ${fps.toFixed(1)} • Mode: ${this.mode} • Stored frames: ${this.memory.frames.length}`;
    }
  }
}

export function startApp() {
  const canvas = document.getElementById('phasecube-canvas');
  const statsEl = document.getElementById('stats');
  const engine = new PhaseCubeEngine({ canvas, statsEl });

  wireControls(engine);

  // Kick off the loop.
  requestAnimationFrame(() => {
    engine.lastFrame = performance.now();
    engine.update();
  });
}

// Expose for debugging in console.
window.PhaseCube = { startApp };
