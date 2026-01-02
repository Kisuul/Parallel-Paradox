// PhaseCube Delta — Lens-Modulated Tri-Swarm (DeltaID: F6N2Q4)
// Core mechanics: neighbor graph, phase grids, plasticity, bias pulses, and tri-swarm orchestration.
// TODO: Thing, for reason(s) — swap Float32Array buffers for GPU buffers when scaling agent counts.

import { LENS_PRESETS } from './config.js';

const TWO_PI = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrap01(value) {
  const v = value % 1;
  return v < 0 ? v + 1 : v;
}

export function buildPositions(size, scale) {
  const half = (size - 1) / 2;
  const positions = new Float32Array(size * size * size * 3);
  let idx = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        positions[idx++] = (x - half) * scale;
        positions[idx++] = (y - half) * scale;
        positions[idx++] = (z - half) * scale;
      }
    }
  }
  return positions;
}

class DelayLine {
  constructor(length, decay, gain) {
    this.buffer = new Float32Array(Math.max(1, length));
    this.decay = decay;
    this.gain = gain;
    this.index = 0;
  }

  push(value) {
    this.buffer[this.index] = value;
    this.index = (this.index + 1) % this.buffer.length;

    let influence = 0;
    let weight = 1;
    for (let i = 0; i < this.buffer.length; i++) {
      const idx = (this.index + i) % this.buffer.length;
      influence += this.buffer[idx] * weight;
      weight *= this.decay;
    }
    return (influence / this.buffer.length) * this.gain;
  }
}

class NeighborGraph {
  constructor(size) {
    this.size = size;
    this.count = size * size * size;
    this.edges = new Int32Array(this.count * 6); // 6 neighbors per cell.
    this._seedCardinal();
  }

  _seedCardinal() {
    const { size } = this;
    const idx = (x, y, z) => ((x * size + y) * size + z);
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const base = idx(x, y, z) * 6;
          this.edges[base + 0] = idx((x + 1) % size, y, z);
          this.edges[base + 1] = idx((x + size - 1) % size, y, z);
          this.edges[base + 2] = idx(x, (y + 1) % size, z);
          this.edges[base + 3] = idx(x, (y + size - 1) % size, z);
          this.edges[base + 4] = idx(x, y, (z + 1) % size);
          this.edges[base + 5] = idx(x, y, (z + size - 1) % size);
        }
      }
    }
  }

  neighborIndices(cellIndex) {
    const start = cellIndex * 6;
    return this.edges.subarray(start, start + 6);
  }

  rewireRandomEdge() {
    const cell = Math.floor(Math.random() * this.count);
    const slot = Math.floor(Math.random() * 6);
    const target = Math.floor(Math.random() * this.count);
    this.edges[cell * 6 + slot] = target;
  }
}

class PlasticityManager {
  constructor(config, graph) {
    this.config = config;
    this.graph = graph;
    this.frameCounter = 0;
  }

  tick() {
    this.frameCounter++;
    if (this.frameCounter % this.config.window !== 0) return;
    if (Math.random() < this.config.rewireProbability) {
      this.graph.rewireRandomEdge();
    }
  }
}

class BiasField {
  constructor(size, biasConfig) {
    this.size = size;
    this.count = size * size * size;
    this.biasConfig = biasConfig;
    this.pulses = [];
    this.biasBuffer = new Float32Array(this.count);
    this.positions = this._buildNormalizedPositions();
  }

  _buildNormalizedPositions() {
    const half = (this.size - 1) / 2;
    const coords = new Float32Array(this.count * 3);
    let idx = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.size; z++) {
          coords[idx++] = (x - half) / this.size;
          coords[idx++] = (y - half) / this.size;
          coords[idx++] = (z - half) / this.size;
        }
      }
    }
    return coords;
  }

  injectPulse(strength = this.biasConfig.pulseStrength) {
    const center = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
    this.pulses.push({ center, strength });
  }

  compute(frame) {
    const { baseBreath, pulseDecay } = this.biasConfig;
    const breathing = Math.sin(frame * 0.006) * baseBreath;
    this.biasBuffer.fill(breathing);

    // Apply decaying pulses.
    for (let p = this.pulses.length - 1; p >= 0; p--) {
      const pulse = this.pulses[p];
      pulse.strength *= pulseDecay;
      if (pulse.strength < 0.01) {
        this.pulses.splice(p, 1);
        continue;
      }

      for (let i = 0, c = 0; i < this.count; i++, c += 3) {
        const dx = this.positions[c] - pulse.center[0];
        const dy = this.positions[c + 1] - pulse.center[1];
        const dz = this.positions[c + 2] - pulse.center[2];
        const dist2 = dx * dx + dy * dy + dz * dz;
        const influence = pulse.strength * Math.exp(-dist2 * 14); // Localized bump.
        this.biasBuffer[i] += influence;
      }
    }

    return this.biasBuffer;
  }
}

function lensCoefficients(lensName) {
  const lens = LENS_PRESETS[lensName] || LENS_PRESETS.balanced;
  const total = lens.human + lens.predictive + lens.systemic + lens.harmonic || 1;
  const human = lens.human / total;
  const predictive = lens.predictive / total;
  const systemic = lens.systemic / total;
  const harmonic = lens.harmonic / total;

  return {
    divergence: predictive * 0.7 + systemic * 0.3,
    memory: systemic * 0.6 + harmonic * 0.2,
    forgiveness: harmonic * 0.7 + human * 0.2,
    stability: human * 0.4 + harmonic * 0.4
  };
}

class PhaseGrid {
  constructor(size, config, graph) {
    this.size = size;
    this.count = size * size * size;
    this.graph = graph;
    this.config = config;
    this.plasma = new Float32Array(this.count);
    this.liquid = new Float32Array(this.count);
    this.solid = new Float32Array(this.count);
    this.parity = new Int8Array(this.count);
    this._seed();
  }

  _seed() {
    for (let i = 0; i < this.count; i++) {
      this.plasma[i] = Math.random();
      this.liquid[i] = Math.random();
      this.solid[i] = Math.random();
      this.parity[i] = 0;
    }
  }

  perturb(noise) {
    for (let i = 0; i < this.count; i++) {
      if (Math.random() < noise) {
        this.plasma[i] = wrap01(this.plasma[i] + (Math.random() - 0.5) * 0.3);
      }
      if (Math.random() < this.config.parityProbability) {
        this.parity[i] = this.parity[i] ? 0 : 1;
      }
    }
  }

  step(biases, lens, crossBias = 0) {
    const newLiquid = new Float32Array(this.count);
    const newSolid = new Float32Array(this.count);
    const { pathBProbability, alpha } = this.config;

    for (let i = 0; i < this.count; i++) {
      const p = this.plasma[i];
      const l = this.liquid[i];
      const s = this.solid[i];
      const parity = this.parity[i];
      const neighbors = this.graph.neighborIndices(i);

      let neighborMean = 0;
      for (let n = 0; n < neighbors.length; n++) neighborMean += this.plasma[neighbors[n]];
      neighborMean /= neighbors.length;

      const avg = (p + l + s) / 3;
      const diff = Math.abs(p - neighborMean) + parity * 0.1 + biases[i] + crossBias;
      const pathBias = clamp(pathBProbability * (1 + lens.divergence) + Math.abs(biases[i]) * 0.2, 0.05, 0.95);
      const mix = Math.random() < pathBias ? diff : avg;

      // Forgiveness pulls the mix toward the average to avoid runaway spikes.
      const softened = mix * (1 - lens.forgiveness * 0.35) + avg * lens.forgiveness * 0.35;
      const solidBlend = clamp(alpha * (1 + lens.memory * 0.6), 0.05, 0.8);

      newLiquid[i] = wrap01(softened + biases[i] * 0.5);
      newSolid[i] = wrap01(s * (1 - solidBlend) + mix * solidBlend);
      this.plasma[i] = wrap01(p + (mix - p) * 0.18 + biases[i] * 0.35 + lens.stability * 0.02);
    }

    this.liquid = newLiquid;
    this.solid = newSolid;
  }

  metrics() {
    let energy = 0;
    let coherence = 0;
    for (let i = 0; i < this.count; i++) {
      energy += this.plasma[i];
      const neighbors = this.graph.neighborIndices(i);
      let local = 0;
      for (let n = 0; n < neighbors.length; n++) local += this.plasma[neighbors[n]];
      coherence += 1 - Math.abs(this.plasma[i] - local / neighbors.length);
    }
    return {
      energy: energy / this.count,
      coherence: coherence / this.count
    };
  }
}

export class TriSwarm {
  constructor(config) {
    this.config = config;
    this.graph = new NeighborGraph(config.gridSize);
    this.plasticity = new PlasticityManager(config.plasticity, this.graph);
    this.biasField = new BiasField(config.gridSize, config.bias);
    this.delayCore = new DelayLine(config.delay.length, config.delay.decay, config.delay.gain);
    this.delayEcho = new DelayLine(config.delay.length, config.delay.decay, config.delay.gain * 0.8);
    this.delayScout = new DelayLine(config.delay.length, config.delay.decay, config.delay.gain * 0.6);
    this.core = new PhaseGrid(config.gridSize, config, this.graph);
    this.echo = new PhaseGrid(config.gridSize, config, this.graph);
    this.scout = new PhaseGrid(config.gridSize, config, this.graph);
    this.lens = lensCoefficients(config.lensProfile);
    this.frame = 0;
    this.metrics = this._collectMetrics();
  }

  _collectMetrics() {
    const core = this.core.metrics();
    const echo = this.echo.metrics();
    const scout = this.scout.metrics();
    return {
      core,
      echo,
      scout,
      divergence: Math.abs(core.energy - echo.energy) + Math.abs(core.energy - scout.energy),
      historyBias: 0,
      pulses: this.biasField.pulses.length,
      lens: this.lens
    };
  }

  setLensProfile(name) {
    this.lens = lensCoefficients(name);
    // TODO: Thing, for reason(s) — expose per-grid lens blending for heterogeneous swarms.
  }

  injectPulse(strength) {
    this.biasField.injectPulse(strength);
  }

  step(noise) {
    this.frame++;
    this.plasticity.tick();

    const biases = this.biasField.compute(this.frame);

    // Perturb before stepping to keep noise decoupled from biasing.
    this.core.perturb(noise);
    this.echo.perturb(noise * 0.9);
    this.scout.perturb(noise * 1.1);

    const prev = this.metrics; // Cross-talk leans on prior energies to stay causal.
    const coreBias = this.config.coupling.coreToEcho * (prev.core.energy - prev.echo.energy) + this.delayCore.push(prev.core.energy);
    const echoBias = this.config.coupling.echoToScout * (prev.echo.energy - prev.scout.energy) + this.delayEcho.push(prev.echo.energy);
    const scoutBias = this.config.coupling.scoutToCore * (prev.scout.energy - prev.core.energy) + this.delayScout.push(prev.scout.energy);

    this.core.step(biases, this.lens, scoutBias);
    this.echo.step(biases, this.lens, coreBias);
    this.scout.step(biases, this.lens, echoBias);

    this.metrics = this._collectMetrics();
    this.metrics.historyBias = Math.max(coreBias, echoBias, scoutBias);
    this.metrics.pulses = this.biasField.pulses.length;
    return this.metrics;
  }
}

export function lensLabel(lensName) {
  const preset = LENS_PRESETS[lensName] || LENS_PRESETS.balanced;
  return `Lens preset: H${preset.human.toFixed(2)} / P${preset.predictive.toFixed(2)} / S${preset.systemic.toFixed(2)} / E${preset.harmonic.toFixed(2)}`;
}
