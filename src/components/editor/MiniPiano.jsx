// Two octaves: C3 to B4
// White keys: C D E F G A B (7 per octave, 14 total)
// Black keys: C# D# F# G# A# (5 per octave, 10 total)

const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES = { 0: 'C#', 1: 'D#', 3: 'F#', 4: 'G#', 5: 'A#' }; // index into white key row

const OCTAVES = [3, 4];

export default function MiniPiano({ voicing }) {
  const activeNotes = new Set([...voicing.left, ...voicing.right]);

  function isActive(note, octave) {
    return activeNotes.has(`${note}${octave}`);
  }

  return (
    <div className="flex gap-0 relative select-none">
      {OCTAVES.map(octave => (
        <div key={octave} className="flex relative">
          {WHITE_NOTES.map((note, i) => {
            const active = isActive(note, octave);
            const blackNote = BLACK_NOTES[i];
            return (
              <div key={note} className="relative">
                {/* White key */}
                <div className={`w-8 h-24 border border-zinc-600 rounded-b-sm ${active ? 'bg-indigo-400' : 'bg-zinc-200'
                  }`} />

                {/* Black key */}
                {blackNote && (
                  <div className={`
                    absolute top-0 right-0 translate-x-1/2 z-10
                    w-5 h-14 rounded-b-sm border border-zinc-900
                    ${isActive(blackNote, octave) ? 'bg-indigo-500' : 'bg-zinc-900'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
