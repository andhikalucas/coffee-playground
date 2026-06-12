/**
 * Tiny Web Audio synth — every sound in the playground is cooked from
 * oscillators and noise, no audio files. The context is created/resumed
 * strictly inside a user gesture (autoplay-policy + iOS safe).
 */

export type SfxName = 'click' | 'pop' | 'thump' | 'pour' | 'swish' | 'ding'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
let muted = false
let volume = 0.7
let primed = false

function targetGain() {
  return muted ? 0 : volume
}

function ensure(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = targetGain()
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return master ? { ctx, master } : null
}

/** One-time pointerdown listener so the context exists before the first sound. */
export function primeAudio() {
  if (primed || typeof window === 'undefined') return
  primed = true
  window.addEventListener('pointerdown', () => ensure(), { once: true, capture: true })
}

export function setSfxMuted(m: boolean) {
  muted = m
  if (ctx && master) master.gain.linearRampToValueAtTime(targetGain(), ctx.currentTime + 0.02)
}

export function setSfxVolume(v: number) {
  volume = Math.min(1, Math.max(0, v))
  if (!muted && ctx && master) master.gain.linearRampToValueAtTime(targetGain(), ctx.currentTime + 0.02)
}

function getNoise(c: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

interface NoiseOpts {
  duration: number
  filterType: BiquadFilterType
  freqFrom: number
  freqTo?: number
  q?: number
  peak: number
  attack?: number
}

function playNoise(c: AudioContext, out: GainNode, t0: number, opts: NoiseOpts) {
  const src = c.createBufferSource()
  src.buffer = getNoise(c)
  src.loop = true
  const filter = c.createBiquadFilter()
  filter.type = opts.filterType
  filter.frequency.setValueAtTime(opts.freqFrom, t0)
  if (opts.freqTo !== undefined) {
    filter.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqTo), t0 + opts.duration)
  }
  filter.Q.value = opts.q ?? 0.9
  const gain = c.createGain()
  const attack = opts.attack ?? 0.005
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(opts.peak, t0 + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration)
  src.connect(filter).connect(gain).connect(out)
  src.start(t0)
  src.stop(t0 + opts.duration + 0.05)
}

interface ToneOpts {
  type: OscillatorType
  freqFrom: number
  freqTo?: number
  duration: number
  peak: number
  attack?: number
}

function playTone(c: AudioContext, out: GainNode, t0: number, opts: ToneOpts) {
  const osc = c.createOscillator()
  osc.type = opts.type
  osc.frequency.setValueAtTime(opts.freqFrom, t0)
  if (opts.freqTo !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqTo), t0 + opts.duration)
  }
  const gain = c.createGain()
  const attack = opts.attack ?? 0.003
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(opts.peak, t0 + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration)
  osc.connect(gain).connect(out)
  osc.start(t0)
  osc.stop(t0 + opts.duration + 0.05)
}

export function playSfx(name: SfxName) {
  if (muted) return
  const nodes = ensure()
  if (!nodes) return
  const { ctx: c, master: out } = nodes
  const t0 = c.currentTime

  switch (name) {
    case 'click':
      playTone(c, out, t0, { type: 'square', freqFrom: 880, freqTo: 440, duration: 0.05, peak: 0.12 })
      break
    case 'pop':
      playTone(c, out, t0, { type: 'sine', freqFrom: 300, freqTo: 620, duration: 0.07, peak: 0.22 })
      playNoise(c, out, t0, { duration: 0.04, filterType: 'lowpass', freqFrom: 2000, peak: 0.08 })
      break
    case 'thump':
      playTone(c, out, t0, { type: 'sine', freqFrom: 150, freqTo: 70, duration: 0.16, peak: 0.4 })
      playNoise(c, out, t0, { duration: 0.08, filterType: 'lowpass', freqFrom: 400, peak: 0.1 })
      break
    case 'pour':
      playNoise(c, out, t0, {
        duration: 0.6,
        filterType: 'bandpass',
        freqFrom: 1800,
        freqTo: 700,
        q: 1.3,
        peak: 0.18,
        attack: 0.12,
      })
      break
    case 'swish':
      playNoise(c, out, t0, { duration: 0.09, filterType: 'highpass', freqFrom: 3000, peak: 0.1 })
      break
    case 'ding':
      playTone(c, out, t0, { type: 'triangle', freqFrom: 1320, duration: 0.35, peak: 0.16 })
      playTone(c, out, t0 + 0.01, { type: 'sine', freqFrom: 1980, duration: 0.18, peak: 0.05 })
      break
  }
}
