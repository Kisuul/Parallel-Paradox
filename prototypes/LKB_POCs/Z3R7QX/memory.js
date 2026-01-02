// Memory buffer for PhaseCube DeltaID Z3R7QX.
// Provides a sliding window of recent frames for inspection or export.

import { CONFIG } from './config.js';

export class MemoryBuffer {
  constructor(capacity = CONFIG.memoryFrames) {
    this.capacity = capacity;
    this.frames = [];
    this.cursor = 0;
  }

  push({ plasma, liquid, solid, timestamp }) {
    if (this.capacity <= 0) return;
    const snapshot = {
      plasma: new Float32Array(plasma),
      liquid: new Float32Array(liquid),
      solid: new Float32Array(solid),
      timestamp,
    };

    if (this.frames.length < this.capacity) {
      this.frames.push(snapshot);
    } else {
      this.frames[this.cursor] = snapshot;
      this.cursor = (this.cursor + 1) % this.capacity;
    }
  }

  latest() {
    if (this.frames.length === 0) return null;
    const idx = (this.cursor - 1 + this.frames.length) % this.frames.length;
    return this.frames[idx];
  }

  exportSummary() {
    // Summaries avoid heavy payloads; useful for quick diffs or telemetry.
    return this.frames.map((f) => ({
      timestamp: f.timestamp,
      plasmaMean: mean(f.plasma),
      liquidMean: mean(f.liquid),
      solidMean: mean(f.solid),
    }));
  }
}

function mean(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) sum += array[i];
  return sum / array.length;
}
