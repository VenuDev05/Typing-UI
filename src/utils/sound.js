// Crisp "tik" keystroke sound built with the Web Audio API — no audio files.
// A short filtered noise burst gives a clock-like tick; errors get a lower, softer tik.

let ctx = null;
let noiseBuffer = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Cache a small buffer of white noise to shape into ticks.
function getNoise(audio) {
  if (noiseBuffer) return noiseBuffer;
  const len = Math.floor(audio.sampleRate * 0.05); // 50ms of noise
  noiseBuffer = audio.createBuffer(1, len, audio.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

/**
 * Play a single "tik".
 * @param {'ok'|'error'|'space'} type
 * @param {boolean} enabled
 */
export function playKey(type = 'ok', enabled = true) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;

  // Tuning per key type.
  let center = 2400;   // bandpass centre — high = sharp "tik"
  let dur = 0.028;     // very short
  let peak = 0.35;
  if (type === 'error') { center = 900; dur = 0.045; peak = 0.4; }
  else if (type === 'space') { center = 1600; dur = 0.03; peak = 0.32; }

  // Noise burst -> bandpass -> quick gain envelope = a dry tick.
  const src = audio.createBufferSource();
  src.buffer = getNoise(audio);

  const band = audio.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = center;
  band.Q.value = 6;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  src.connect(band).connect(gain).connect(audio.destination);
  src.start(now);
  src.stop(now + dur + 0.02);
}
