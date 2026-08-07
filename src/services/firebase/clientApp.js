import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const runtimeEnv = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env) {
      return import.meta.env;
    }
  } catch {
    // ignore and fall back to process.env
  }

  return process.env || {};
})();

const ENV_FIREBASE_CONFIG = {
  apiKey: runtimeEnv.VITE_FIREBASE_API_KEY,
  authDomain: runtimeEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: runtimeEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: runtimeEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: runtimeEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeEnv.VITE_FIREBASE_APP_ID,
  measurementId: runtimeEnv.VITE_FIREBASE_MEASUREMENT_ID
};

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyClJ-CKsT1SB3FqOR2D8fFyDZ9LSvcOYjc',
  authDomain: 'el-mouloukia-bc-39f12.firebaseapp.com',
  projectId: 'el-mouloukia-bc-39f12',
  storageBucket: 'el-mouloukia-bc-39f12.firebasestorage.app',
  messagingSenderId: '576072990406',
  appId: '1:576072990406:web:2032c1b15162db5a2521c7',
  measurementId: 'G-C4KR0VMTX5'
};

export const firebaseConfig = {
  apiKey: ENV_FIREBASE_CONFIG.apiKey || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: ENV_FIREBASE_CONFIG.authDomain || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: ENV_FIREBASE_CONFIG.projectId || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: ENV_FIREBASE_CONFIG.storageBucket || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: ENV_FIREBASE_CONFIG.messagingSenderId || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: ENV_FIREBASE_CONFIG.appId || DEFAULT_FIREBASE_CONFIG.appId,
  measurementId: ENV_FIREBASE_CONFIG.measurementId || DEFAULT_FIREBASE_CONFIG.measurementId
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'el-mouloukia-bc';
