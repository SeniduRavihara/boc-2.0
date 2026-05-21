import { getAuth } from "firebase-admin/auth";
import { getAdminFirestore } from "@/lib/firebase-admin";

const USERS_COLLECTION = "users";

export class AdminAuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export async function verifyAdmin(
  idToken: string
): Promise<{ uid: string; email?: string }> {
  if (!idToken?.trim()) {
    throw new AdminAuthError("Missing authentication token");
  }

  getAdminFirestore();

  let decoded;
  try {
    decoded = await getAuth().verifyIdToken(idToken);
  } catch {
    throw new AdminAuthError("Invalid or expired token");
  }

  const userSnap = await getAdminFirestore()
    .collection(USERS_COLLECTION)
    .doc(decoded.uid)
    .get();

  if (!userSnap.exists || userSnap.data()?.role !== "admin") {
    throw new AdminAuthError("Access denied");
  }

  return { uid: decoded.uid, email: decoded.email };
}
