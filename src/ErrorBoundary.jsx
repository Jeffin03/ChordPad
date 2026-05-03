import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[ChordPad] Crash:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-dvh bg-zinc-950 text-white gap-4 p-8">
          <span className="text-4xl">🎹</span>
          <p className="text-zinc-400 text-center">Something went wrong. Tap below to reset.</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
          >
            Reset App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
