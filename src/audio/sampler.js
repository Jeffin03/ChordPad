import * as Tone from 'tone';

const SAMPLE_NOTES = ['C', 'Eb', 'Gb', 'A'];
const SAMPLE_OCTAVES = [0, 1, 2, 3, 4, 5, 6];

function buildSampleMap() {
  const map = {};
  for (const octave of SAMPLE_OCTAVES) {
    for (const note of SAMPLE_NOTES) {
      const key = `${note}${octave}`;
      map[key] = `/samples/${key}.mp3`;
    }
  }
  return map;
}

let sampler = null;
let loadPromise = null;

export function getSampler() {
  if (sampler) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    sampler = new Tone.Sampler({
      urls: buildSampleMap(),
      release: 1.2,
      onload: resolve,
      onerror: reject,
    });
    sampler.toDestination();
  });

  return loadPromise;
}

export function getSamplerInstance() {
  return sampler;
}
