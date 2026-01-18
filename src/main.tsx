import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Mount helper that ensures a `#root` exists and mounts React
const mount = () => {
  let container = document.getElementById('root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Global handlers to show a minimal error UI if an error occurs before React mounts
window.addEventListener('error', (ev) => {
  console.error('Global error caught:', ev.error || ev.message);
  const rootEl = document.getElementById('root');
  if (!rootEl || !rootEl.hasChildNodes()) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui;background:#fff;">
        <div style="max-width:720px;text-align:center;">
          <h2 style="font-size:20px;margin-bottom:8px;color:#111">An error occurred</h2>
          <pre style="white-space:pre-wrap;color:#444">${String(ev.error || ev.message)}</pre>
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">
            <button id="__rl" style="padding:8px 12px;background:#059669;color:white;border-radius:6px;border:none;cursor:pointer">Reload</button>
          </div>
        </div>
      </div>
    `;
    const btn = document.getElementById('__rl');
    if (btn) btn.addEventListener('click', () => location.reload());
  }
});

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled rejection:', ev.reason);
  const rootEl = document.getElementById('root');
  if (!rootEl || !rootEl.hasChildNodes()) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui;background:#fff;">
        <div style="max-width:720px;text-align:center;">
          <h2 style="font-size:20px;margin-bottom:8px;color:#111">An error occurred</h2>
          <pre style="white-space:pre-wrap;color:#444">${String(ev.reason)}</pre>
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">
            <button id="__rl" style="padding:8px 12px;background:#059669;color:white;border-radius:6px;border:none;cursor:pointer">Reload</button>
          </div>
        </div>
      </div>
    `;
    const btn = document.getElementById('__rl');
    if (btn) btn.addEventListener('click', () => location.reload());
  }
});

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

