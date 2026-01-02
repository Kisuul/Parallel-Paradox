// MemoryField buffers recent bias fields and re-injects them as a gentle echo.
export class MemoryField {
  constructor(config) {
    this.size = config.GRID;
    this.n = this.size ** 3;
    this.depth = config.MEMORY_DEPTH;
    this.decay = config.MEMORY_DECAY;
    this.buffer = Array.from({ length: this.depth }, () => new Float32Array(this.n));
    this.cursor = 0;
    this.mix = new Float32Array(this.n);
  }

  record(field) {
    if (!field) return;
    this.buffer[this.cursor].set(field);
    this.cursor = (this.cursor + 1) % this.depth;
  }

  blend(current, weight) {
    if (!current && weight <= 0) return null;
    if (weight <= 0) return current;
    this.mix.fill(0);
    for (const buf of this.buffer) {
      for (let i = 0; i < this.n; i++) this.mix[i] += buf[i];
    }
    const depth = this.depth || 1;
    for (let i = 0; i < this.n; i++) {
      const echo = (this.mix[i] / depth) * this.decay;
      const base = current ? current[i] : 0;
      this.mix[i] = base * (1 - weight) + echo * weight;
    }
    // TODO: Introduce adaptive decay (for reason: allow longer echoes when input quiets).
    return this.mix;
  }
}
