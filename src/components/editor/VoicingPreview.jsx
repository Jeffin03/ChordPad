export default function VoicingPreview({ voicing }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-zinc-500 text-xs uppercase tracking-wider">Left</span>
        <div className="flex gap-2">
          {voicing.left.map(n => (
            <span key={n} className="text-sm text-indigo-300 bg-zinc-800 rounded px-2 py-1 border border-zinc-700">
              {n}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-zinc-500 text-xs uppercase tracking-wider">Right</span>
        <div className="flex gap-2">
          {voicing.right.map(n => (
            <span key={n} className="text-sm text-indigo-300 bg-zinc-800 rounded px-2 py-1 border border-zinc-700">
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
