import { noteToIndex, indexToNote } from './notes.js';

// ─── Variation Types ──────────────────────────────────────────────────────────

// A variation takes a base chord object { root, quality, notes }
// and returns a new { root, quality, variant, notes } object.
// "notes" is always a flat array of note names, no octaves yet —
// octave assignment happens in voicing.js.

// ─── 7ths ─────────────────────────────────────────────────────────────────────

// Semitones above root for each 7th type
const SEVENTH_INTERVALS = {
  major7: 11, // maj7  — major third above the 5th
  dominant7: 10, // 7     — minor third above the 5th
  minor7: 10, // m7    — same interval, different quality context
  halfDim7: 10, // ø7    — used over diminished chords
  dim7: 9, // °7    — fully diminished
};

// Which 7th each chord quality naturally gets
const NATURAL_SEVENTH = {
  major: 'major7',
  minor: 'minor7',
  diminished: 'halfDim7',
  augmented: 'major7',
};

// add7({ root:"G", quality:"major", notes:["G","B","D"] })
// → { root:"G", quality:"major", variant:"7", notes:["G","B","D","F"] }
export function add7(chord, seventhType) {
  const type = seventhType ?? NATURAL_SEVENTH[chord.quality];
  const interval = SEVENTH_INTERVALS[type];
  const seventh = indexToNote(noteToIndex(chord.root) + interval);
  return {
    ...chord,
    variant: variantLabel(type),
    notes: [...chord.notes, seventh],
  };
}

// ─── Suspensions ─────────────────────────────────────────────────────────────

// sus2: replace the 3rd with the 2nd (2 semitones above root)
// sus4: replace the 3rd with the 4th (5 semitones above root)
export function sus2(chord) {
  const second = indexToNote(noteToIndex(chord.root) + 2);
  return {
    ...chord,
    variant: 'sus2',
    notes: [chord.notes[0], second, chord.notes[2]], // root, 2nd, 5th
  };
}

export function sus4(chord) {
  const fourth = indexToNote(noteToIndex(chord.root) + 5);
  return {
    ...chord,
    variant: 'sus4',
    notes: [chord.notes[0], fourth, chord.notes[2]], // root, 4th, 5th
  };
}

// ─── Inversions ──────────────────────────────────────────────────────────────

// Inversion rotates the notes array — octave placement handled in voicing.js
// invert(chord, 1) → 1st inversion (3rd in bass)
// invert(chord, 2) → 2nd inversion (5th in bass)
// invert(chord, 3) → 3rd inversion (7th in bass, only valid on 7th chords)
export function invert(chord, n = 1) {
  const notes = [...chord.notes];
  if (n < 1 || n >= notes.length) throw new Error(`Invalid inversion ${n} for ${notes.length}-note chord`);
  const rotated = [...notes.slice(n), ...notes.slice(0, n)];
  return {
    ...chord,
    variant: `inv${n}`,
    notes: rotated,
  };
}

// ─── Slash Chords ─────────────────────────────────────────────────────────────

// Slash chord: right hand plays the chord, left hand plays a specific bass note.
// The bass note is stored separately — voicing.js uses it to override the left hand.
// slashChord(chord, "E") → F major over E bass (F/E)
export function slashChord(chord, bassNote) {
  return {
    ...chord,
    variant: `/${bassNote}`,
    bassNote, // voicing.js reads this to set the left hand independently
  };
}

// ─── Variant Label Helper ─────────────────────────────────────────────────────

function variantLabel(seventhType) {
  const labels = {
    major7: 'maj7',
    dominant7: '7',
    minor7: 'm7',
    halfDim7: 'ø7',
    dim7: '°7',
  };
  return labels[seventhType] ?? seventhType;
}

// ─── Apply Variation by Name ──────────────────────────────────────────────────

// Convenience dispatcher used by the editor UI
// applyVariation(chord, "sus4") → sus4 chord
// applyVariation(chord, "7")    → natural 7th for the chord's quality
// applyVariation(chord, "maj7") → major 7th forced
// applyVariation(chord, "inv1") → first inversion
// applyVariation(chord, "/E")   → slash chord with E bass
export function applyVariation(chord, variation) {
  if (variation === 'triad') return { ...chord, variant: 'triad', bassNote: undefined };
  if (variation === 'sus2') return sus2(chord);
  if (variation === 'sus4') return sus4(chord);
  if (variation === '7') return add7(chord);
  if (variation === 'maj7') return add7(chord, 'major7');
  if (variation === 'm7') return add7(chord, 'minor7');
  if (variation === 'ø7') return add7(chord, 'halfDim7');
  if (variation === '°7') return add7(chord, 'dim7');
  if (/^inv[123]$/.test(variation)) return invert(chord, parseInt(variation[3]));
  if (variation.startsWith('/')) return slashChord(chord, variation.slice(1));
  throw new Error(`Unknown variation: "${variation}"`);
}
