"use server";

import { revalidatePath } from "next/cache";
import { sendMail } from "@/app/actions/mailbox";
import { AdminAuthError, verifyAdmin } from "@/lib/auth/verify-admin";
import {
  getFlyerEmailHtml,
  getFlyerEmailSubject,
  getFlyerGeneratorUrl,
} from "@/lib/email/flyer-campaign";
import {
  buildFlyerEmailQueueServer,
  getFlyerEmailQueueServer,
  markFlyerEmailsSentServer,
} from "@/lib/flyer-queue/server";
import { isAfter8pmIST } from "@/lib/time/ist";

function canRefreshQueue(force?: boolean): boolean {
  return (
    force === true ||
    process.env.FLYER_QUEUE_DEV_OVERRIDE === "true" ||
    isAfter8pmIST()
  );
}

function actionError(error: unknown): string {
  if (error instanceof AdminAuthError) return error.message;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

export type FlyerBatchSendResult = {
  email: string;
  success: boolean;
  error?: string;
};

export async function refreshFlyerQueue(
  idToken: string,
  force?: boolean
): Promise<{
  success: boolean;
  error?: string;
  recipientCount?: number;
  status?: string;
  sentCount?: number;
}> {
  try {
    await verifyAdmin(idToken);

    if (!canRefreshQueue(force)) {
      return {
        success: false,
        error: "Queue can only be built after 8:00 PM IST (or with dev override).",
      };
    }

    const queue = await buildFlyerEmailQueueServer({ force: force ?? false });
    revalidatePath("/admin/flyer-emails");

    return {
      success: true,
      recipientCount: queue.recipients.length,
      status: queue.status,
      sentCount: queue.sentEmails?.length ?? 0,
    };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function sendFlyerBatch(
  batchIndex: number,
  idToken: string
): Promise<{
  success: boolean;
  error?: string;
  sent?: number;
  failed?: number;
  skipped?: number;
  results?: FlyerBatchSendResult[];
}> {
  try {
    await verifyAdmin(idToken);

    if (!Number.isInteger(batchIndex) || batchIndex < 0 || batchIndex > 9) {
      return { success: false, error: "Invalid batch index (must be 0–9)." };
    }

    const queue = await getFlyerEmailQueueServer();
    if (!queue) {
      return {
        success: false,
        error: "Flyer email queue has not been built yet.",
      };
    }

    const start = batchIndex * 10;
    const slice = queue.recipients.slice(start, start + 10);
    const sentSet = new Set(
      (queue.sentEmails ?? []).map((e) => e.toLowerCase().trim())
    );
    const pending = slice.filter((r) => !sentSet.has(r.email));

    if (pending.length === 0) {
      return {
        success: true,
        sent: 0,
        failed: 0,
        skipped: slice.length,
        results: [],
      };
    }

    const results: FlyerBatchSendResult[] = [];
    const successEmails: string[] = [];

    await Promise.all(
      pending.map(async (recipient) => {
        const flyerUrl = getFlyerGeneratorUrl(
          recipient.teamName,
          recipient.memberName
        );
        const content = getFlyerEmailHtml(
          recipient.memberName,
          recipient.teamName,
          flyerUrl
        );

        const mailResult = await sendMail({
          to: recipient.email,
          subject: getFlyerEmailSubject(),
          content,
          metadata: {
            source: "flyer_campaign",
            batchIndex,
            teamName: recipient.teamName,
            memberName: recipient.memberName,
          },
        });

        if (mailResult.success) {
          successEmails.push(recipient.email);
          results.push({ email: recipient.email, success: true });
        } else {
          results.push({
            email: recipient.email,
            success: false,
            error: mailResult.error ?? "Send failed",
          });
        }
      })
    );

    if (successEmails.length > 0) {
      await markFlyerEmailsSentServer(successEmails);
    }

    revalidatePath("/admin/flyer-emails");

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      success: sent > 0,
      sent,
      failed,
      skipped: slice.length - pending.length,
      results,
      error:
        sent === 0 && failed > 0
          ? "No emails were sent in this batch."
          : undefined,
    };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}
