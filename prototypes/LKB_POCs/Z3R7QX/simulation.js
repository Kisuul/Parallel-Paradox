// Core simulation primitives for PhaseCube DeltaID Z3R7QX.
// Separated from rendering/UI to keep the agent dynamics testable and portable.

import { CONFIG } from './config.js';

export class PhaseGrid {
  constructor(size = CONFIG.gridSize) {
    this.size = size;
    this.count = size ** 3;

    // Typed arrays keep memory compact and deterministic.
    this.plasma = new Float32Array(this.count);
    this.liquid = new Float32Array(this.count);
    this.solid = new Float32Array(this.count);
    this.parity = new Int8Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.plasma[i] = Math.random() * 0.7 + 0.2;
      this.liquid[i] = Math.random() * 0.4 + 0.25;
      this.solid[i] = Math.random() * 0.2;
      this.parity[i] = Math.random() < 0.5 ? 0 : 1;
    }
  }

  index(x, y, z) {
    // Wrap around (toroidal) to avoid boundary conditions collapsing the field.
    const s = this.size;
    return ((x % s + s) % s) + ((y % s + s) % s) * s + ((z % s + s) % s) * s * s;
  }

  neighborAverage(i) {
    // Average over a 6-neighborhood for speed; upgrade to 26-neighborhood if needed.
    const s = this.size;
    const x = i % s;
    const y = Math.floor(i / s) % s;
    const z = Math.floor(i / (s * s));

    let sum = 0;
    sum += this.plasma[this.index(x + 1, y, z)];
    sum += this.plasma[this.index(x - 1, y, z)];
    sum += this.plasma[this.index(x, y + 1, z)];
    sum += this.plasma[this.index(x, y - 1, z)];
    sum += this.plasma[this.index(x, y, z + 1)];
    sum += this.plasma[this.index(x, y, z - 1)];
    return sum / 6;
  }

  perturb(bias = null) {
    // Inject baseline dream noise and optional external bias.
    const flipP = CONFIG.plasmaFlipProbability;
    const parityP = CONFIG.parityFlipProbability;

    for (let i = 0; i < this.count; i++) {
      if (Math.random() < flipP) this.plasma[i] = 1 - this.plasma[i];
      if (Math.random() < parityP) this.parity[i] ^= 1;

      // Low amplitude jitter to prevent lock-in without audio.
      const jitter = (Math.random() - 0.5) * 0.006;
      this.liquid[i] = clamp01(this.liquid[i] + jitter);

      if (bias) {
        const b = bias[i];
        // TODO: Add nonlinear bias curves (e.g., tanh), for richer responses.
        this.plasma[i] = clamp01(this.plasma[i] + b * 0.01);
        this.liquid[i] = clamp01(this.liquid[i] + b * 0.008 * (this.parity[i] ? 1 : -1));
      }
    }
  }

  step(bias = null) {
    const p0 = this.plasma;
    const l0 = this.liquid;
    const s0 = this.solid;

    // Copy solid to avoid mid-frame feedback; liquid/plasma are read-only until end.
    const nextLiquid = new Float32Array(this.count);
    const nextSolid = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const p = p0[i];
      const l = l0[i];
      const s = s0[i];

      const avg = (p + l + s) / 3;
      const neighborDelta = Math.abs(p - this.neighborAverage(i)) + this.parity[i] * 0.08;

      let pathBProb = CONFIG.basePathBProbability;
      if (bias) pathBProb = clamp01(pathBProb + bias[i] * 0.1);

      const chosen = Math.random() < pathBProb ? neighborDelta : avg;
      nextLiquid[i] = clamp01(chosen);
      nextSolid[i] = s * (1 - CONFIG.alpha) + chosen * CONFIG.alpha;
    }

    this.liquid = nextLiquid;
    this.solid = nextSolid;
  }
}

export class InputField {
  constructor(size = CONFIG.gridSize, bins = CONFIG.binCount) {
    this.size = size;
    this.bins = bins;
    this.bias = new Float32Array(size ** 3);
    this.decay = CONFIG.inputDecay;
    this.strength = CONFIG.inputStrength;
    this.radius = CONFIG.inputRadius;
  }

  updateFromBands(left, right) {
    // Decay old bias.
    for (let i = 0; i < this.bias.length; i++) {
      this.bias[i] *= this.decay;
    }

    const centerY = Math.floor(this.size / 2);
    const centerX = Math.floor(this.size / 2);

    for (let bin = 0; bin < this.bins; bin++) {
      const l = left[bin] || 0;
      const r = right[bin] || 0;
      const energy = (l + r) * 0.5;
      const pan = (r - l) * (this.size * 0.18);

      // Map frequency to depth (z), pan to x.
      const z = Math.floor((bin / (this.bins - 1)) * (this.size - 1));
      const x = clampInt(centerX + pan, 0, this.size - 1);
      const y = centerY;

      this.diffuse(x, y, z, energy);
    }
    clampBias(this.bias);
  }

  diffuse(x, y, z, energy) {
    const r = this.radius;
    const strength = this.strength * energy;
    const radiusSq = r * r;
    const s = this.size;

    for (let dz = -r; dz <= r; dz++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > radiusSq) continue;
          const falloff = Math.exp(-d2 / radiusSq);
          const idx = (x + dx) + (y + dy) * s + (z + dz) * s * s;
          if (idx < 0 || idx >= this.bias.length) continue;
          this.bias[idx] += strength * falloff;
        }
      }
    }
  }
}

export function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function clampInt(v, min, max) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function clampBias(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.max(-0.25, Math.min(0.25, arr[i]));
  }
}
