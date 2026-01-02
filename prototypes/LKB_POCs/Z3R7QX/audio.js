// Audio ingestion for PhaseCube DeltaID Z3R7QX.
// The bridge is optional: when unavailable, the simulation still runs with internal noise.

import { CONFIG } from './config.js';

export class AudioBridge {
  constructor() {
    this.audioCtx = null;
    this.analyserL = null;
    this.analyserR = null;
    this.source = null;
  }

  async ensureContext() {
    if (this.audioCtx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error('Web Audio API not available');

    this.audioCtx = new Ctx();
    this.analyserL = this.audioCtx.createAnalyser();
    this.analyserR = this.audioCtx.createAnalyser();
    this.analyserL.fftSize = this.analyserR.fftSize = CONFIG.binCount * 2 * 2; // modest size.
    this.analyserL.smoothingTimeConstant = this.analyserR.smoothingTimeConstant = 0.85;
  }

  async useLiveInput() {
    await this.ensureContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 2 } });
    const src = this.audioCtx.createMediaStreamSource(stream);
    this.attachSource(src);
  }

  async useFile(file) {
    await this.ensureContext();
    const data = await file.arrayBuffer();
    const buffer = await this.audioCtx.decodeAudioData(data);
    const src = this.audioCtx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    this.attachSource(src);
    src.start();
  }

  async useSynth({ type = 'sine', frequency = 220, pan = 0 } = {}) {
    await this.ensureContext();
    const osc = this.audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.25;

    const panner = this.audioCtx.createStereoPanner();
    panner.pan.value = pan;

    osc.connect(gain).connect(panner);
    this.attachSource(panner);
    osc.start();
  }

  attachSource(node) {
    if (!this.audioCtx) return;
    if (this.source) this.source.disconnect();
    this.source = node;

    const splitter = this.audioCtx.createChannelSplitter(2);
    node.connect(splitter);
    splitter.connect(this.analyserL, 0);
    splitter.connect(this.analyserR, 1);

    // TODO: Offer a mute toggle, for demos that should influence the field without audible output.
    node.connect(this.audioCtx.destination);
  }

  sampleBins() {
    if (!this.audioCtx || !this.analyserL || !this.analyserR) return null;
    if (this.audioCtx.state === 'suspended') return null;

    const take = (analyser) => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const bands = new Float32Array(CONFIG.binCount);
      const sr = this.audioCtx.sampleRate || 44100;

      for (let i = 0; i < CONFIG.binCount; i++) {
        const freq = 20 * Math.pow(20000 / 20, i / (CONFIG.binCount - 1));
        const bin = Math.floor((freq / (sr / 2)) * data.length);
        bands[i] = data[Math.min(data.length - 1, bin)] / 255;
      }
      return bands;
    };

    return { left: take(this.analyserL), right: take(this.analyserR) };
  }
}
