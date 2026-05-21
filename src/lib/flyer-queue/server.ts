import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { isSameISTCalendarDay } from "@/lib/time/ist";
import type { FlyerEmailQueue } from "@/types";
import {
  flattenCompetitionRecipients,
  type CompetitionTeamRow,
} from "@/lib/flyer-queue/recipients";

const COMPETITION_TEAMS_COLLECTION = "competition_teams";
const FLYER_EMAIL_QUEUE_COLLECTION = "flyer_email_queue";
const FLYER_EMAIL_QUEUE_DOC_ID = "current";

function parseBuiltAt(builtAt: FlyerEmailQueue["builtAt"]): Date | null {
  if (!builtAt) return null;
  if (builtAt instanceof Timestamp) return builtAt.toDate();
  if (typeof (builtAt as { toDate?: () => Date }).toDate === "function") {
    return (builtAt as { toDate: () => Date }).toDate();
  }
  return new Date(builtAt as unknown as string);
}

export async function getFlyerEmailQueueServer(): Promise<FlyerEmailQueue | null> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(FLYER_EMAIL_QUEUE_COLLECTION)
    .doc(FLYER_EMAIL_QUEUE_DOC_ID)
    .get();

  if (!snap.exists) return null;
  return snap.data() as FlyerEmailQueue;
}

async function getFirstCompetitionRecipientsServer(limitCount = 100) {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(COMPETITION_TEAMS_COLLECTION)
    .orderBy("createdAt", "asc")
    .get();

  const teams: CompetitionTeamRow[] = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<CompetitionTeamRow, "id">),
  }));

  return flattenCompetitionRecipients(teams, limitCount);
}

/** Build or refresh the flyer email queue (server / cron). */
export async function buildFlyerEmailQueueServer(options?: {
  force?: boolean;
}): Promise<FlyerEmailQueue> {
  const force = options?.force ?? false;
  const existing = await getFlyerEmailQueueServer();

  if (!force && existing?.builtAt) {
    const builtDate = parseBuiltAt(existing.builtAt);
    if (builtDate && isSameISTCalendarDay(builtDate, new Date())) {
      return existing;
    }
  }

  const recipients = await getFirstCompetitionRecipientsServer(100);
  const db = getAdminFirestore();
  const queueRef = db
    .collection(FLYER_EMAIL_QUEUE_COLLECTION)
    .doc(FLYER_EMAIL_QUEUE_DOC_ID);

  await queueRef.set({
    timezone: "Asia/Kolkata",
    recipients,
    sentEmails: [],
    status: recipients.length > 0 ? "ready" : "pending",
    builtAt: FieldValue.serverTimestamp(),
  });

  const built = await getFlyerEmailQueueServer();
  if (!built) {
    throw new Error("Failed to read flyer email queue after build.");
  }
  return built;
}

export async function markFlyerEmailsSentServer(emails: string[]): Promise<void> {
  const normalized = emails.map((e) => e.toLowerCase().trim()).filter(Boolean);
  if (normalized.length === 0) return;

  const existing = await getFlyerEmailQueueServer();
  if (!existing) {
    throw new Error("Flyer email queue does not exist.");
  }

  const db = getAdminFirestore();
  const queueRef = db
    .collection(FLYER_EMAIL_QUEUE_COLLECTION)
    .doc(FLYER_EMAIL_QUEUE_DOC_ID);

  await queueRef.update({
    sentEmails: FieldValue.arrayUnion(...normalized),
  });

  const sentSet = new Set([...(existing.sentEmails ?? []), ...normalized]);
  const allSent = existing.recipients.every((r) => sentSet.has(r.email));
  if (allSent && existing.recipients.length > 0) {
    await queueRef.update({ status: "complete" });
  }
}
