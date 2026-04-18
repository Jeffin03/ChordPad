import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { diatonicChords } from '../theory/chords.js';
import { applyVariation } from '../theory/variations.js';
import { voiceChord } from '../theory/voicing.js';
import { playChord, startChord, stopChord } from '../audio/player.js';
import { transposeNote } from '../theory/notes.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSlots(root, type) {
  return diatonicChords(root, type).map((chord, i) => ({
    degree: i + 1,
    chord,           // { root, quality, notes }
    variation: null, // variation string e.g. "7", "sus4", "/E" — null means triad
  }));
}


function resolveSlot(slot, transpose) {
  let chord = slot.variation
    ? applyVariation(slot.chord, slot.variation)
    : slot.chord;

  if (transpose !== 0) {
    chord = {
      ...chord,
      root: transposeNote(chord.root, transpose),
      notes: chord.notes.map(n => transposeNote(n, transpose)),
      bassNote: chord.bassNote ? transposeNote(chord.bassNote, transpose) : undefined,
    };
  }

  return voiceChord(chord);
}// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create(
  persist(
    (set, get) => ({

      // ─── Key ────────────────────────────────────────────────────────────
      root: 'C',
      scaleType: 'major',

      setKey(root, scaleType) {
        set({
          root,
          scaleType,
          slots: buildSlots(root, scaleType),
        });
      },

      // ─── Transpose ──────────────────────────────────────────────────────
      transpose: 0,

      setTranspose(semitones) {
        set({ transpose: semitones });
      },

      // ─── Velocity ───────────────────────────────────────────────────────
      velocityMode: 'medium',

      setVelocityMode(mode) {
        set({ velocityMode: mode });
      },

      // ─── Slots ──────────────────────────────────────────────────────────
      slots: buildSlots('C', 'major'),

      setVariation(degree, variation) {
        set(state => ({
          slots: state.slots.map(slot =>
            slot.degree === degree
              ? { ...slot, variation: variation === 'triad' ? null : variation }
              : slot
          ),
        }));
      },

      // ─── Playback ───────────────────────────────────────────────────────
      tapSlot(degree) {
        const { slots, velocityMode, transpose } = get();
        const slot = slots.find(s => s.degree === degree);
        if (!slot) return;
        playChord(resolveSlot(slot, transpose), velocityMode);
      },

      holdSlot(degree) {
        const { slots, velocityMode, transpose } = get();
        const slot = slots.find(s => s.degree === degree);
        if (!slot) return;
        startChord(resolveSlot(slot, transpose), velocityMode);
      },

      releaseSlot(degree) {
        const { slots, transpose } = get();
        const slot = slots.find(s => s.degree === degree);
        if (!slot) return;
        stopChord(resolveSlot(slot, transpose));
      },

      // ─── Presets ────────────────────────────────────────────────────────
      activePreset: null,
      presets: {},

      savePreset(name) {
        const { root, scaleType, transpose, velocityMode, slots } = get();
        const preset = {
          name,
          root,
          scaleType,
          transpose,
          velocityMode,
          slots: slots.map(s => ({ degree: s.degree, variation: s.variation })),
        };
        set(state => ({
          presets: { ...state.presets, [name]: preset },
          activePreset: name,
        }));
      },

      loadPreset(name) {
        const { presets } = get();
        const preset = presets[name];
        if (!preset) return;

        const baseslots = buildSlots(preset.root, preset.scaleType);
        const slots = baseslots.map(slot => ({
          ...slot,
          variation: preset.slots.find(s => s.degree === slot.degree)?.variation ?? null,
        }));

        set({
          root: preset.root,
          scaleType: preset.scaleType,
          transpose: preset.transpose,
          velocityMode: preset.velocityMode,
          slots,
          activePreset: name,
        });
      },

      deletePreset(name) {
        set(state => {
          const presets = { ...state.presets };
          delete presets[name];
          return {
            presets,
            activePreset: state.activePreset === name ? null : state.activePreset,
          };
        });
      },

      exportPreset(name) {
        const { presets } = get();
        const preset = presets[name];
        if (!preset) return;
        const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      importPreset(json) {
        try {
          const preset = JSON.parse(json);
          if (!preset.name || !preset.root || !preset.scaleType) throw new Error('Invalid preset');
          set(state => ({
            presets: { ...state.presets, [preset.name]: preset },
          }));
        } catch {
          console.error('[ChordPad] Invalid preset file');
        }
      },

    }),
    {
      name: 'chordpad-store',
      partialize: (state) => ({
        root: state.root,
        scaleType: state.scaleType,
        transpose: state.transpose,
        velocityMode: state.velocityMode,
        slots: state.slots.map(s => ({ degree: s.degree, variation: s.variation })),
        activePreset: state.activePreset,
        presets: state.presets,
      }),
    }
  )
);
