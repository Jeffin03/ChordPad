import { noteToIndex, noteWithOctave } from './notes.js';

// ─── Voicing Overview ─────────────────────────────────────────────────────────
//
// A "voicing" is the final list of Tone.js-ready note strings, e.g. ["C3","G3","E4","G4"]
// Input: a chord object (with optional bassNote and inversion from variations.js)
// Output: { left: ["C3","G3"], right: ["E4","G4"] }
//
// Right hand: mid-high octave, notes spread across one octave
// Left hand: defaults to root + fifth below right hand, or bassNote if slash chord

// ─── Constants ────────────────────────────────────────────────────────────────

const RIGHT_BASE_OCTAVE = 4; // right hand starts around octave 4
const LEFT_BASE_OCTAVE = 3; // left hand sits an octave below

// ─── Right Hand ───────────────────────────────────────────────────────────────

// Assigns octaves to the notes array so they ascend without jumping.
// The first note gets the base octave; each subsequent note increments
// the octave if it's lower than the previous note (i.e. it wrapped around).
function assignOctaves(notes, baseOctave) {
  let octave = baseOctave;
  let prevIndex = -1;
  return notes.map(note => {
    const idx = noteToIndex(note);
    if (idx <= prevIndex) octave += 1; // wrapped — bump up
    prevIndex = idx;
    return noteWithOctave(note, octave);
  });
}

function buildRightHand(chord) {
  return assignOctaves(chord.notes, RIGHT_BASE_OCTAVE);
}

// ─── Left Hand ────────────────────────────────────────────────────────────────

// Default left hand: root + fifth (power chord), one octave below right hand.
// If the chord has a bassNote (slash chord), use that as a single bass note instead.
function buildLeftHand(chord) {
  if (chord.bassNote) {
    return [noteWithOctave(chord.bassNote, LEFT_BASE_OCTAVE)];
  }

  const root = chord.notes[0]; // first note in the (possibly inverted) array is the chord root name
  const fifth = chord.notes.find((n, i) => i > 0 && noteToIndex(n) - noteToIndex(chord.notes[0]) === 7);

  if (fifth) {
    return [
      noteWithOctave(root, LEFT_BASE_OCTAVE),
      noteWithOctave(fifth, LEFT_BASE_OCTAVE),
    ];
  }

  // Fallback: root only (e.g. diminished or augmented where fifth is non-perfect)
  return [noteWithOctave(root, LEFT_BASE_OCTAVE)];
}

// ─── Main Export ──────────────────────────────────────────────────────────────

// voiceChord({ root:"G", quality:"major", notes:["G","B","D"] })
// → { left: ["G3","D3"], right: ["G4","B4","D5"] }
export function voiceChord(chord) {
  return {
    left: buildLeftHand(chord),
    right: buildRightHand(chord),
  };
}
