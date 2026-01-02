// PhaseCube Delta renderer (DeltaID: F6N2Q4)
// Minimal 3D-ish painter using 2D canvas for readability; upgrades can swap in WebGL instancing later.

import { buildPositions } from './swarm.js';
import { DELTA_ID } from './config.js';

const TWO_PI = Math.PI * 2;

export class Renderer {
  constructor(canvas, size, scale, rendererConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = size;
    this.scale = scale;
    this.rendererConfig = rendererConfig;
    this.time = 0;
    this.rotateX = 0.35;
    this.rotateY = 0.55;
    this.positions = buildPositions(size, scale);
    this.resize();

    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('mousemove', (e) => this._handleOrbit(e));
  }

  resize() {
    this.canvas.width = window.innerWidth - 320;
    this.canvas.height = window.innerHeight;
  }

  _handleOrbit(event) {
    const rect = this.canvas.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    this.rotateY = nx * Math.PI * 0.9;
    this.rotateX = ny * Math.PI * 0.9;
  }

  project(x, y, z) {
    const cosY = Math.cos(this.rotateY);
    const sinY = Math.sin(this.rotateY);
    const cosX = Math.cos(this.rotateX);
    const sinX = Math.sin(this.rotateX);

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX + 340; // Camera offset.

    const f = 400 / (400 + z2);
    return {
      x: this.canvas.width / 2 + x1 * f,
      y: this.canvas.height / 2 + y1 * f,
      depth: z2
    };
  }

  draw(grids, metrics, lensText) {
    this.time += 1;
    const ctx = this.ctx;
    const { bg, stroke, pointSize } = this.rendererConfig;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const renderGrid = (grid, hueOffset, alphaScale) => {
      const len = grid.plasma.length;
      for (let i = 0, p = 0; i < len; i++, p += 3) {
        const pos = this.project(this.positions[p], this.positions[p + 1], this.positions[p + 2]);
        const plasma = grid.plasma[i];
        const hue = (this.time * 0.0015 + hueOffset + plasma) % 1;
        const r = Math.sin(hue * TWO_PI) * 127 + 128;
        const g = Math.sin(hue * TWO_PI + 2) * 127 + 128;
        const b = Math.sin(hue * TWO_PI + 4) * 127 + 128;
        const alpha = 0.22 + plasma * alphaScale;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${alpha.toFixed(3)})`;
        ctx.arc(pos.x, pos.y, pointSize + plasma * 4, 0, TWO_PI);
        ctx.fill();
      }
    };

    // Back-to-front ordering is approximate; each grid uses a different hue offset for legibility.
    renderGrid(grids.scout, 0.05, 0.5);
    renderGrid(grids.echo, 0.25, 0.45);
    renderGrid(grids.core, 0.55, 0.6);

    ctx.fillStyle = stroke;
    ctx.font = '14px monospace';
    const lines = [
      `Delta ${DELTA_ID} — Lens-Modulated Tri-Swarm`,
      `Core Energy: ${metrics.core.energy.toFixed(3)} | Coherence: ${metrics.core.coherence.toFixed(3)}`,
      `Echo Energy: ${metrics.echo.energy.toFixed(3)} | Coherence: ${metrics.echo.coherence.toFixed(3)}`,
      `Scout Energy: ${metrics.scout.energy.toFixed(3)} | Coherence: ${metrics.scout.coherence.toFixed(3)}`,
      `Divergence: ${metrics.divergence.toFixed(3)} | History Bias: ${metrics.historyBias.toFixed(3)}`,
      `Active Pulses: ${metrics.pulses}`,
      lensText
    ];
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 12, 20 + i * 16);
    }
  }
}
