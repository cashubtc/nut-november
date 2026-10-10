// Synthesised sticker-peel audio. Everything is generated with WebAudio so
// there are no sound files to ship, and nothing plays until the visitor
// actually grabs a sticker (browsers require a gesture anyway).

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    // One second of white noise, reused by every sound.
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export interface PeelVoice {
  /** Feed the current drag speed (px per frame) to drive the crackle. */
  update(speed: number): void;
  stop(): void;
}

/** Continuous adhesive crackle whose loudness follows how fast you peel. */
export function startPeel(): PeelVoice | null {
  const ac = audio();
  if (!ac || !noise) return null;

  const src = ac.createBufferSource();
  src.buffer = noise;
  src.loop = true;

  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2600;
  band.Q.value = 0.8;

  const gain = ac.createGain();
  gain.gain.value = 0;

  src.connect(band).connect(gain).connect(ac.destination);
  src.start();

  return {
    update(speed) {
      const now = ac.currentTime;
      // Random flutter on top of the speed makes it crackle rather than hiss.
      const level = Math.min(0.22, speed * 0.012) * (0.45 + Math.random() * 0.55);
      gain.gain.setTargetAtTime(level, now, 0.015);
      band.frequency.setTargetAtTime(1800 + Math.min(speed, 40) * 60, now, 0.05);
    },
    stop() {
      const now = ac.currentTime;
      gain.gain.setTargetAtTime(0, now, 0.03);
      src.stop(now + 0.2);
    },
  };
}

/** Soft slap when the sticker lands back on the card. */
export function playSnap(strength = 1) {
  const ac = audio();
  if (!ac || !noise) return;
  const now = ac.currentTime;
  const s = Math.max(0.15, Math.min(1, strength));

  const thump = ac.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(170, now);
  thump.frequency.exponentialRampToValueAtTime(60, now + 0.09);
  const thumpGain = ac.createGain();
  thumpGain.gain.setValueAtTime(0.35 * s, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  thump.connect(thumpGain).connect(ac.destination);
  thump.start(now);
  thump.stop(now + 0.13);

  const slap = ac.createBufferSource();
  slap.buffer = noise;
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  const slapGain = ac.createGain();
  slapGain.gain.setValueAtTime(0.18 * s, now);
  slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  slap.connect(hp).connect(slapGain).connect(ac.destination);
  slap.start(now);
  slap.stop(now + 0.07);
}
