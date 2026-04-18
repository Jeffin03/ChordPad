import { useRef } from 'react';
import { useStore } from '../../store/index.js';
import { chordLabel } from '../../theory/chords.js';


export default function ChordSlot({ slot, editMode, onEdit }) {
  const tapSlot = useStore(s => s.tapSlot);
  const holdSlot = useStore(s => s.holdSlot);
  const releaseSlot = useStore(s => s.releaseSlot);

  const holdTimer = useRef(null);
  const isHolding = useRef(false);
  const HOLD_THRESHOLD = 180;

  function onPointerDown() {
    if (editMode) return;
    isHolding.current = false;
    holdTimer.current = setTimeout(() => {
      isHolding.current = true;
      holdSlot(slot.degree);
    }, HOLD_THRESHOLD);
  }

  function onPointerUp() {
    if (editMode) {
      onEdit();
      return;
    }
    clearTimeout(holdTimer.current);
    if (isHolding.current) {
      releaseSlot(slot.degree);
    } else {
      tapSlot(slot.degree);
    }
    isHolding.current = false;
  }

  function onPointerLeave() {
    if (editMode) return;
    if (isHolding.current) {
      releaseSlot(slot.degree);
      isHolding.current = false;
    }
    clearTimeout(holdTimer.current);
  }

  const label = chordLabel(slot.chord.quality, slot.degree);
  const name = slot.chord.root;
  const variant = slot.variation ?? '';

  return (
    <button
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      className={`
        flex-1 w-full rounded-xl
        border flex items-center justify-between px-5
        select-none touch-none transition-colors duration-75
        ${editMode
          ? 'bg-zinc-800/60 border-indigo-800 active:bg-zinc-700'
          : 'bg-zinc-800 border-zinc-700 active:bg-zinc-700 active:border-zinc-500'
        }
      `}
    >
      <span className="text-zinc-500 text-sm w-10 text-left">{label}</span>
      <span className="text-white text-2xl font-semibold tracking-wide">{name}</span>
      <span className="text-zinc-400 text-sm w-10 text-right">{variant}</span>
    </button>
  );
}
