import * as Tone from 'tone';
import { sharpToFlat } from '../theory/notes.js';

// ─── Sample Map ───────────────────────────────────────────────────────────────

// Tone.js needs a map of { "C4": "/samples/C4.mp3", ... }
// We have A, C, Eb, Gb across octaves 0–6 (24 files)
// File naming uses flats, Tone.js uses sharps internally — sharpToFlat bridges them

const SAMPLE_NOTES = ['C', 'Eb', 'Gb', 'A'];
const SAMPLE_OCTAVES = [0, 1, 2, 3, 4, 5, 6];

function buildSampleMap() {
  const map = {};
  for (const octave of SAMPLE_OCTAVES) {
    for (const note of SAMPLE_NOTES) {
      const toneKey = `${note}${octave}`;               // "Eb4" — key Tone.js uses
      const filename = `${sharpToFlat(toneKey)}.mp3`;    // "Eb4.mp3" — actual file
      map[toneKey] = `/samples/${filename}`;
    }
  }
  return map;
}

// ─── Sampler Singleton ────────────────────────────────────────────────────────

let sampler = null;
let loadPromise = null;

export function getSampler() {
  if (sampler) return loadPromise;

  sampler = new Tone.Sampler({
    urls: buildSampleMap(),
    release: 1.2,
    onload: () => console.log('[ChordPad] Sampler loaded'),
    onerror: (err) => console.error('[ChordPad] Sampler error', err),
  });

  sampler.toDestination();

  loadPromise = Tone.loaded();
  return loadPromise;
}

export function getSamplerInstance() {
  return sampler;
}
