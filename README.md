# ChordPad

A mobile-first chord pad app built for choir practice sessions. Press a button, hear a full two-hand piano voicing. No instrument room trips required.

---

## What This Is

ChordPad is a PWA built for music directors and keyboardists who need a quick, reliable way to run chord progressions during practice — especially when the actual instrument isn't available. It's not a full piano. It's a smart, configurable chord trigger built around how you actually use a keyboard in a choir setting.

---

## Features

- Full two-hand voicings per chord slot — right and left hand independently configurable
- Music theory engine that suggests voicings automatically based on key and scale
- Chord variations — inversions, 7ths, sus2, sus4, slash chords
- Sustain and staccato via tap vs. hold
- Velocity modes — Soft, Medium, Hard, Fixed
- Global key selector with semitone transpose
- Song presets — save and load full chord configurations per song
- Preset export and import as JSON
- Works on mobile, installable as a PWA

---

## Stack

- **Framework** — React + Vite
- **Audio** — Tone.js
- **Styling** — Tailwind CSS + shadcn/ui
- **State** — Zustand
- **Storage** — localStorage

---

## Getting Started

​```bash
git clone https://github.com/your-org/chordpad.git
cd chordpad
npm install
npm run dev
​```

Open on mobile for the best experience. For PWA install, open in Chrome and tap "Add to Home Screen."

---

## Documentation

Full architecture, feature breakdown, and design decisions in the [project wiki](../../wiki).

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.
