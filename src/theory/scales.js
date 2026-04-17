import { noteToIndex, indexToNote } from './notes.js';

// ----------Scale Intervals-------------

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],

};

// getScale("C", "major") → ["C","D","E","F","G","A","B"]
// getScale("A", "minor") → ["A","B","C","D","E","F","G"]

export function getScale(root, type = 'major') {
  const intervals = SCALE_INTERVALS[type];
  if (!intervals) throw new Error(`Unknown scale type: "${type}"`);
  const rootIndex = noteToIndex(root);
  return intervals.map(interval => indexToNote(rootIndex + interval));
}

// Degree is 1-based (I=1 … VII=7)
// getDegree("G", "major", 5) → "D"
export function getDegree(root, type, degree) {
  if (degree < 1 || degree > 7) throw new Error(`Degree must be 1–7, got ${degree}`);
  return getScale(root, type)[degree - 1];
}

// Which scale degree is this note? Returns 1-based index or null.
// getDegreeOf("E", "C", "major") → 3
export function getDegreeOf(note, root, type) {
  const scale = getScale(root, type);
  const i = scale.indexOf(note);
  return i === -1 ? null : i + 1;
}

// Is this note diatonic to the scale?
export function isDiatonic(note, root, type) {
  return getDegreeOf(note, root, type) !== null;
}
