import { noteToIndex, indexToNote } from './notes.js';
import { getScale } from './scales.js';

//------Chord Intervals---------------

// Intervals in semitones from the root for each chord quality
const CHORD_INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
};

//-------Diatonic Quality Map--------

// which quality each scale degree naturally gets 
const DIATONIC_QUALITY = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
};

//--------Core Builders---------------

// buildChord("C" , "major") -> ["C","E","G"]
// buildChord("D" , "minor") -> ["D", "F", "A"]
export function buildChord(root, quality) {
  const intervals = CHORD_INTERVALS[quality];
  if (!intervals) throw new Error(`Unknown chord quality: "${quality}"`);
  const rootIndex = noteToIndex(root);
  return intervals.map(i => indexToNote(rootIndex + i));
}

// diatonicChord("C", "major", 1) → { root: "C", quality: "major", notes: ["C","E","G"] }
// diatonicChord("C", "major", 2) → { root: "D", quality: "minor", notes: ["D","F","A"] }
export function diatonicChord(scaleRoot, scaleType, degree) {
  if (degree < 1 || degree > 7) throw new Error(`Degree must be 1–7, got ${degree}`);
  const scale = getScale(scaleRoot, scaleType);
  const root = scale[degree - 1];
  const quality = DIATONIC_QUALITY[scaleType][degree - 1];
  const notes = buildChord(root, quality);
  return { root, quality, notes };
}

// All seven diatonic chords for a key
// diatonicChords("C", "major") → array of 7 chord objects
export function diatonicChords(scaleRoot, scaleType) {
  return Array.from({ length: 7 }, (_, i) => diatonicChord(scaleRoot, scaleType, i + 1));
}

// ─── Chord Label ─────────────────────────────────────────────────────────────

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// chordLabel("major", 1) → "I"
// chordLabel("minor", 2) → "ii"
// chordLabel("diminished", 7) → "vii°"
export function chordLabel(quality, degree) {
  const roman = ROMAN[degree - 1];
  if (quality === 'major') return roman;
  if (quality === 'minor') return roman.toLowerCase();
  if (quality === 'diminished') return roman.toLowerCase() + '°';
  if (quality === 'augmented') return roman + '+';
  return roman;
}
