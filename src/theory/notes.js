// ----------Notes Foundation---------------

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// "C#" -> 1, "F" -> 5, etc.

export function noteToIndex(note) {
  const i = NOTES.indexOf(note);
  if (i === -1) throw new Error(`Unknown note: "${note}"`);
  return i;
}

// 1 -> "C#", 5 -> "F", etc.

export function indexToNote(index) {
  return NOTES[((index % 12) + 12) % 12]; //handles negatives safely

}

// transposeNote("A", 3) -> "C"
export function transposeNote(note, semitones) {
  return indexToNote(noteToIndex(note) + semitones);
}

// noteWithOctave("#C", 4) -> "C#4" -Tone.js format 
export function noteWithOctave(note, octave) {
  return `${note}${octave}`;
}

const SHARP_TO_FLAT = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
};

// "C#4" -> "Db4", "C4" -> "C4"

export function sharpToFlat(noteWithOctave) {
  //Split at the boundary between note name and octave number
  const match = noteWithOctave.match(/^([A-G]#?)(\d+)$/);
  if (!match) throw new Error(`Invalid note string: "${noteWithOctave}"`);
  const [, note, octave] = match;
  return `${SHARP_TO_FLAT[note] ?? note}${octave}`;
}

