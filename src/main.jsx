import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAudio } from './audio/player.js';
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx';


// Unlock AudioContext on first user gesture anywhere in the app 
document.addEventListener('click', () => initAudio(), { once: true });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      < App />
    </ErrorBoundary>
  </StrictMode>,
)
