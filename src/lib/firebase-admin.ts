import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function initAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set. Provide the Firebase service account JSON string."
    );
  }

  const serviceAccount = JSON.parse(keyJson) as {
    project_id?: string;
    client_email?: string;
    private_key?: string;
  };

  return initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    projectId:
      serviceAccount.project_id ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export function getAdminFirestore(): Firestore {
  initAdminApp();
  return getFirestore();
}
