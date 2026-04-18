import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAudio } from './audio/player.js';
import './index.css'
import App from './App.jsx'


// Unlock AudioContext on first user gesture anywhere in the app 
document.addEventListener('click', () => initAudio(), { once: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
