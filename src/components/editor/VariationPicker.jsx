import { getScale } from '../../theory/scales.js';

const VARIATIONS = ['triad', '7', 'maj7', 'm7', 'sus2', 'sus4', 'inv1', 'inv2'];

export default function VariationPicker({ slot, root, scaleType, onSelect }) {
  const current = slot.variation ?? 'triad';
  const scaleNotes = getScale(root, scaleType);

  return (
    <div className="flex flex-col gap-3">

      {/* Standard variations */}
      <div className="flex flex-wrap gap-2">
        {VARIATIONS.map(v => (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={`text-sm rounded-lg px-3 py-2 border ${current === v
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Slash chord picker */}
      <div className="flex flex-col gap-2">
        <span className="text-zinc-500 text-xs uppercase tracking-wider">Slash bass note</span>
        <div className="flex flex-wrap gap-2">
          {scaleNotes.map(note => {
            const v = `/${note}`;
            return (
              <button
                key={note}
                onClick={() => onSelect(v)}
                className={`text-sm rounded-lg px-3 py-2 border ${current === v
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
