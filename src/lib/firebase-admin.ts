import { readFileSync } from "fs";
import { resolve } from "path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin/app";

function stripEnvQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadServiceAccount(): ServiceAccount {
  const fromPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (fromPath) {
    const absolute = resolve(process.cwd(), fromPath);
    const raw = readFileSync(absolute, "utf8");
    return JSON.parse(raw) as ServiceAccount;
  }

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64?.trim();
  if (base64) {
    const raw = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(raw) as ServiceAccount;
  }

  const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (keyJson) {
    return JSON.parse(stripEnvQuotes(keyJson)) as ServiceAccount;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim();

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    };
  }

  throw new Error(
    "Firebase Admin credentials missing. Set one of: " +
      "FIREBASE_SERVICE_ACCOUNT_KEY (JSON one-line in .env.local), " +
      "FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, " +
      "FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file), or " +
      "FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY. " +
      "Use .env.local (not .env.example) and restart `npm run dev`."
  );
}

function initAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccount = loadServiceAccount();

  return initializeApp({
    credential: cert(serviceAccount),
    projectId:
      serviceAccount.projectId ??
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export function getAdminFirestore(): Firestore {
  initAdminApp();
  return getFirestore();
}
