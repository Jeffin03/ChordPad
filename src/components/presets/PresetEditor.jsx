import { useState, useRef } from 'react';
import { useStore } from '../../store/index.js';

export default function PresetEditor({ preset, onClose }) {
  const savePreset = useStore(s => s.savePreset);
  const deletePreset = useStore(s => s.deletePreset);
  const exportPreset = useStore(s => s.exportPreset);
  const importPreset = useStore(s => s.importPreset);

  const isNew = !preset;
  const [name, setName] = useState(preset?.name ?? '');
  const fileRef = useRef(null);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    savePreset(trimmed);
    onClose();
  }

  function handleDelete() {
    deletePreset(preset.name);
    onClose();
  }

  function handleExport() {
    exportPreset(preset.name);
    onClose();
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      importPreset(ev.target.result);
      onClose();
    };
    reader.readAsText(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-zinc-900 border-t border-zinc-700 rounded-t-2xl p-5 flex flex-col gap-4 z-10">

        <div className="flex items-center justify-between">
          <span className="text-white font-semibold text-lg">
            {isNew ? 'Save Preset' : 'Edit Preset'}
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 text-sm px-3 py-1 rounded bg-zinc-800 border border-zinc-700"
          >
            Cancel
          </button>
        </div>

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Preset name..."
          autoFocus
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
        />

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-40"
        >
          Save
        </button>

        {/* Existing preset actions */}
        {!isNew && (
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm"
            >
              Export
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 rounded-lg bg-red-900/40 border border-red-800 text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        )}

        {/* Import */}
        <div className="flex items-center gap-3 pt-1 border-t border-zinc-800">
          <span className="text-zinc-500 text-xs">Import a preset file</span>
          <button
            onClick={() => fileRef.current.click()}
            className="text-xs px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300"
          >
            Choose file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

      </div>
    </div>
  );
}
