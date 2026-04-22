import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Firebase configuration loaded from environment variables.
// For local dev: copy .env.example to .env.local and fill in your values.
// For Vercel: add these in Project Settings → Environment Variables.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

// Firebase is only initialized when a valid API key exists.
// This prevents build-time SSR prerendering errors when env vars aren't set.
function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) return null;
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

// Null-safe direct exports — existing code uses `auth`, `db`, `storage`
// They are null during SSR prerendering (no env vars), truthy in the browser.
const _app = getFirebaseApp();
export const app = _app;
export const auth: Auth | null = _app ? getAuth(_app) : null;
export const db: Firestore | null = _app ? getFirestore(_app) : null;
export const storage: FirebaseStorage | null = _app ? getStorage(_app) : null;
