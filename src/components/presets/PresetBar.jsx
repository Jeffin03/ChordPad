import { useState, useRef } from 'react';
import { useStore } from '../../store/index.js';
import PresetEditor from './PresetEditor.jsx';

export default function PresetBar({ onPresetLoad }) {
  const presets = useStore(s => s.presets);
  const activePreset = useStore(s => s.activePreset);
  const loadPreset = useStore(s => s.loadPreset);

  const [editorPreset, setEditorPreset] = useState(undefined); // undefined = closed
  const holdTimers = useRef({});

  function handlePointerDown(name) {
    holdTimers.current[name] = setTimeout(() => {
      setEditorPreset(presets[name]);
    }, 400);
  }

  function handlePointerUp(name) {
    const timerStillPending = holdTimers.current[name];
    clearTimeout(holdTimers.current[name]);
    holdTimers.current[name] = null;
    if (timerStillPending) handleTap(name);
  }

  function handleTap(name) {
    loadPreset(name);
    onPresetLoad();
  }

  const presetList = Object.values(presets);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800 overflow-x-auto">

      {/* Preset chips */}
      {presetList.map(p => (
        <button
          key={p.name}
          onPointerDown={() => handlePointerDown(p.name)}
          onPointerUp={() => handlePointerUp(p.name)}
          onPointerLeave={() => handlePointerUp(p.name)}
          className={`whitespace-nowrap text-sm px-3 py-1 rounded-full border ${activePreset === p.name
            ? 'bg-indigo-600 border-indigo-500 text-white'
            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
        >
          {p.name}
        </button>
      ))}

      {/* Save new preset */}
      <button
        onClick={() => setEditorPreset(null)}
        className="whitespace-nowrap text-sm px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 ml-auto"
      >
        + Save
      </button>

      {/* Editor modal */}
      {editorPreset !== undefined && (
        <PresetEditor
          preset={editorPreset}
          onClose={() => setEditorPreset(undefined)}
        />
      )}

    </div>
  );
}
