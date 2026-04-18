import { useState } from 'react';
import Header from './components/layout/Header.jsx';
import Pad from './components/pad/Pad.jsx';
import Footer from './components/layout/Footer.jsx';

export default function App() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex flex-col h-dvh bg-zinc-950 text-white overflow-hidden">
      <Header editMode={editMode} onToggleEdit={() => setEditMode(e => !e)} />
      <main className="flex-1 overflow-hidden">
        <Pad editMode={editMode} />
      </main>
      <Footer />
    </div>
  );
}
