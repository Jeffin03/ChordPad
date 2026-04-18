import { useStore } from '../../store/index.js';
import VariationPicker from '../editor/VariationPicker.jsx';
import VoicingPreview from '../editor/VoicingPreview.jsx';
import MiniPiano from '../editor/MiniPiano.jsx';
import { applyVariation } from '../../theory/variations.js';
import { voiceChord } from '../../theory/voicing.js';
import { transposeNote } from '../../theory/notes.js';

export default function SlotEditor({ slot, onClose }) {
  const setVariation = useStore(s => s.setVariation);
  const transpose = useStore(s => s.transpose);
  const root = useStore(s => s.root);
  const scaleType = useStore(s => s.scaleType);

  if (!slot) return null;

  // Resolve voicing for preview
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

  const voicing = voiceChord(chord);

  function handleVariation(variation) {
    setVariation(slot.degree, variation);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-zinc-900 border-t border-zinc-700 rounded-t-2xl p-5 flex flex-col gap-5 z-10">

        {/* Title */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold text-lg">
            {chord.root}
            <span className="text-zinc-400 text-sm ml-2">{slot.variation ?? 'triad'}</span>
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 text-sm px-3 py-1 rounded bg-zinc-800 border border-zinc-700"
          >
            Done
          </button>
        </div>

        <VariationPicker
          slot={slot}
          root={root}
          scaleType={scaleType}
          onSelect={handleVariation}
        />

        <VoicingPreview voicing={voicing} />

        <MiniPiano voicing={voicing} />

      </div>
    </div>
  );
}
