// Renderer for PhaseCube DeltaID Z3R7QX.
// Responsible solely for projection and drawing; no simulation logic is embedded here.

import { CONFIG } from './config.js';
import { clamp01 } from './simulation.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rotX = 0;
    this.rotY = Math.PI / 4;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    this.canvas.width = this.canvas.clientWidth * this.dpr;
    this.canvas.height = this.canvas.clientHeight * this.dpr;
  }

  setRotationFromPointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.rotX = ((event.clientY - rect.top) / rect.height) * Math.PI - Math.PI / 2;
    this.rotY = ((event.clientX - rect.left) / rect.width) * Math.PI * 2;
  }

  projectPositions(positions) {
    const points = [];
    const camZ = CONFIG.cameraZ;
    const fov = CONFIG.fov;
    const f = 1 / Math.tan(fov / 2);
    const aspect = this.canvas.width / this.canvas.height;

    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);

    for (let i = 0; i < positions.length; i += 3) {
      let x = positions[i];
      let y = positions[i + 1];
      let z = positions[i + 2];

      // Rotate Y then X.
      const rx = cosY * x + sinY * z;
      const rz = -sinY * x + cosY * z;

      const ry = cosX * y - sinX * rz;
      const rz2 = sinX * y + cosX * rz;

      const cz = camZ - rz2;
      if (Math.abs(cz) < 0.001) continue; // Avoid division blow-ups.

      const ndcX = (f / aspect) * (rx / cz);
      const ndcY = f * (ry / cz);

      points.push({
        idx: i / 3,
        z: cz,
        x: (ndcX * 0.5 + 0.5) * this.canvas.width,
        y: (ndcY * 0.5 + 0.5) * this.canvas.height,
      });
    }

    return points.sort((a, b) => b.z - a.z);
  }

  draw(points, grid, time) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const hueBase = time * 0.08;

    for (const pt of points) {
      const l = grid.liquid[pt.idx];
      if (l < CONFIG.visThreshold) continue;

      const plasma = grid.plasma[pt.idx];
      const parity = grid.parity[pt.idx];

      const hue = (hueBase + parity * 0.33 + plasma) % 1;
      const theta = hue * Math.PI * 2;
      const r = Math.abs(Math.sin(theta));
      const g = Math.abs(Math.sin(theta + 2));
      const b = Math.abs(Math.sin(theta + 4));

      const alpha = clamp01(0.32 + 0.68 * l);
      const radius = CONFIG.pointSize + 8 * l;

      this.ctx.fillStyle = `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
