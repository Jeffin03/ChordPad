import * as Tone from 'tone';
import { sharpToFlat } from '../theory/notes.js';
import { getSampler, getSamplerInstance } from './sampler.js';

// ─── Velocity Maps ────────────────────────────────────────────────────────────

const VELOCITY = {
  soft: 0.3,
  medium: 0.6,
  hard: 0.9,
  fixed: 0.7,
};

// ─── Note Conversion ──────────────────────────────────────────────────────────

// Tone.js Sampler accepts both sharps and flats, but our sample map
// keys are flat-named. Converting keeps lookups unambiguous.
function toToneNote(noteWithOctave) {
  return sharpToFlat(noteWithOctave);
}

// ─── Core Trigger ─────────────────────────────────────────────────────────────

// notes: array of Tone.js note strings e.g. ["C3","G3","E4","G4"]
// duration: Tone.js duration string — "8n" for staccato, held via stopChord for sustain
// velocityMode: "soft" | "medium" | "hard" | "fixed"
function triggerNotes(notes, duration, velocityMode) {
  const sampler = getSamplerInstance();
  if (!sampler) return;

  const velocity = VELOCITY[velocityMode] ?? VELOCITY.medium;
  const converted = notes.map(toToneNote);

  sampler.triggerAttackRelease(converted, duration, Tone.now(), velocity);
}

// ─── Public API ───────────────────────────────────────────────────────────────

// Staccato — short hit, releases automatically
export function playChord(voicing, velocityMode = 'medium') {
  const notes = [...voicing.left, ...voicing.right];
  triggerNotes(notes, '8n', velocityMode);
}

// Sustain start — holds until stopChord is called
export function startChord(voicing, velocityMode = 'medium') {
  const sampler = getSamplerInstance();
  if (!sampler) return;

  const notes = [...voicing.left, ...voicing.right].map(toToneNote);
  const velocity = VELOCITY[velocityMode] ?? VELOCITY.medium;

  sampler.triggerAttack(notes, Tone.now(), velocity);
}

// Sustain stop — releases all held notes
export function stopChord(voicing) {
  const sampler = getSamplerInstance();
  if (!sampler) return;

  const notes = [...voicing.left, ...voicing.right].map(toToneNote);
  sampler.triggerRelease(notes, Tone.now());
}

// Called once on app load — ensures AudioContext is resumed and sampler is ready
export async function initAudio() {
  await Tone.start();
  await getSampler();
}
