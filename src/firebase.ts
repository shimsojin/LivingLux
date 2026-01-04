import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const buildConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN || undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID || undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET || undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID || undefined,
    appId: import.meta.env.VITE_FIREBASE_APPID || undefined,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID || undefined,
  };
};

let _app = null;
let _auth = null;
let _db = null;

export function initFirebase() {
  if (_app) return { app: _app, auth: _auth, db: _db };
  const cfg = buildConfig();
  if (!cfg) return null;
  // Avoid duplicate init when hot-reloading
  if (getApps().length) {
    _app = getApps()[0];
  } else {
    _app = initializeApp(cfg);
  }
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  return { app: _app, auth: _auth, db: _db };
}

export function getFirebase() {
  return { app: _app, auth: _auth, db: _db };
}

export default initFirebase;
