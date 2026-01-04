import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Inject firebase config and app id at build time from Vite env variables.
// Set these in Vercel as `VITE_FIREBASE_CONFIG` (stringified JSON) and `VITE_APP_ID`.
try {
  const cfg = import.meta.env.VITE_FIREBASE_CONFIG;
  if (cfg) {
    // keep as string so App can JSON.parse when needed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__firebase_config = cfg;
  }
  const aid = import.meta.env.VITE_APP_ID;
  if (aid) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__app_id = aid;
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Failed to inject Vite env vars for firebase:', e);
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
