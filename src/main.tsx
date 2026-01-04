import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Strategy: at runtime try (1) fetch `/config.json` from `public/` (easy for you to drop
// a file there), (2) fall back to Vite env vars (`VITE_FIREBASE_CONFIG`, `VITE_APP_ID`).
// After these attempts, render the app.
const root = createRoot(document.getElementById('root')!);

;(async () => {
  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (res.ok) {
      const obj = await res.json();
      // App expects window.__firebase_config as a JSON string, so stringify here.
      // @ts-ignore
      window.__firebase_config = JSON.stringify(obj);
      // @ts-ignore
      window.__app_id = obj.appId || obj.app_id || import.meta.env.VITE_APP_ID || 'default-app-id';
      // eslint-disable-next-line no-console
      console.info('Loaded firebase config from /config.json');
    }
  } catch (e) {
    // no config.json found or parse error — we will try env vars next
    // eslint-disable-next-line no-console
    console.info('No /config.json or failed to load it, falling back to env vars');
  }

  try {
    // If not set by config.json, use Vite env vars (stringified JSON expected)
    // @ts-ignore
    if (typeof window.__firebase_config === 'undefined' || window.__firebase_config === null) {
      const cfg = import.meta.env.VITE_FIREBASE_CONFIG;
      if (cfg) {
        // @ts-ignore
        window.__firebase_config = cfg;
        // eslint-disable-next-line no-console
        console.info('Loaded firebase config from Vite env');
      }
    }
    // @ts-ignore
    if (typeof window.__app_id === 'undefined' || !window.__app_id) {
      const aid = import.meta.env.VITE_APP_ID;
      if (aid) {
        // @ts-ignore
        window.__app_id = aid;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Error while reading Vite env vars for firebase:', e);
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
