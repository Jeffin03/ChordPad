import { useState } from 'react';
import { useStore } from '../../store/index.js';
import ChordSlot from './ChordSlot.jsx';
import SlotEditor from './SlotEditor.jsx';

export default function Pad({ editMode }) {
  const slots = useStore(s => s.slots);
  const [editingSlot, setEditingSlot] = useState(null);

  function handleSlotTap(slot) {
    if (editMode) {
      setEditingSlot(prev => prev?.degree === slot.degree ? null : slot);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full justify-center">
      {slots.map(slot => (
        <ChordSlot
          key={slot.degree}
          slot={slot}
          editMode={editMode}
          onEdit={() => handleSlotTap(slot)}
        />
      ))}

      {editingSlot && (
        <SlotEditor
          slot={slots.find(s => s.degree === editingSlot.degree)}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </div>
  );
}
