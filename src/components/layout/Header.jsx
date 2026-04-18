import { useStore } from '../../store/index.js';
import { NOTES } from '../../theory/notes.js';

const SCALE_TYPES = ['major', 'minor'];

const VELOCITY_MODES = ['soft', 'medium', 'hard', 'fixed'];

export default function Header({ editMode, onToggleEdit }) {
  const root = useStore(s => s.root);
  const scaleType = useStore(s => s.scaleType);
  const transpose = useStore(s => s.transpose);
  const velocityMode = useStore(s => s.velocityMode);
  const setKey = useStore(s => s.setKey);
  const setTranspose = useStore(s => s.setTranspose);
  const setVelocityMode = useStore(s => s.setVelocityMode);

  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800 overflow-x-auto">

      {/* Root note */}
      <select
        value={root}
        onChange={e => setKey(e.target.value, scaleType)}
        className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
      >
        {NOTES.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Scale type */}
      <select
        value={scaleType}
        onChange={e => setKey(root, e.target.value)}
        className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
      >
        {SCALE_TYPES.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Transpose */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => setTranspose(transpose - 1)}
          className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
        >−</button>
        <span className="text-sm text-zinc-400 w-8 text-center">
          {transpose === 0 ? '0' : transpose > 0 ? `+${transpose}` : transpose}
        </span>
        <button
          onClick={() => setTranspose(transpose + 1)}
          className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
        >+</button>
      </div>

      {/* Velocity */}
      <div className="flex gap-1 ml-2">
        {VELOCITY_MODES.map(mode => (
          <button
            key={mode}
            onClick={() => setVelocityMode(mode)}
            className={`text-xs rounded px-2 py-1 border capitalize ${velocityMode === mode
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Edit mode toggle */}
      <button
        onClick={onToggleEdit}
        className={`ml-auto text-sm rounded px-3 py-1 border ${editMode
          ? 'bg-indigo-600 border-indigo-500 text-white'
          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
          }`}
      >
        {editMode ? 'Done' : 'Edit'}
      </button>

    </header>
  );
}
