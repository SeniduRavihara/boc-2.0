"use server";

import { revalidatePath } from "next/cache";
import { sendMail } from "@/app/actions/mailbox";
import { AdminAuthError, verifyAdmin } from "@/lib/auth/verify-admin";
import { getFlyerGeneratorUrl } from "@/lib/email/flyer-campaign";
import {
  FLYER_CAMPAIGN_SUBJECT,
  FLYER_EMAIL_FONT_FAMILY,
  getFlyerCampaignTemplate,
} from "@/lib/email/templates";
import {
  getFirstCompetitionRecipients,
  getFlyerSentEmails,
  markFlyerEmailsSent,
} from "@/firebase/api";
import {
  delay,
  isRateLimitError,
  RESEND_MIN_INTERVAL_MS,
} from "@/lib/email/send-sequential";

const BATCH_SIZE = 10;
const RATE_LIMIT_RETRY_DELAY_MS = 1500;

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

    const [recipients, sentEmails] = await Promise.all([
      getFirstCompetitionRecipients(100),
      getFlyerSentEmails(),
    ]);

    const sentSet = new Set(sentEmails.map((e) => e.toLowerCase().trim()));
    const start = batchIndex * BATCH_SIZE;
    const slice = recipients.slice(start, start + BATCH_SIZE);
    const pending = slice.filter((r) => !sentSet.has(r.email.toLowerCase().trim()));

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

    // One admin click sends the full batch sequentially with a delay between each Resend call.
    for (let i = 0; i < pending.length; i++) {
      const recipient = pending[i];
      const flyerUrl = getFlyerGeneratorUrl(
        recipient.teamName,
        recipient.memberName
      );
      const content = getFlyerCampaignTemplate(
        recipient.memberName,
        recipient.teamName,
        flyerUrl
      );

      const mailPayload = {
        to: recipient.email,
        subject: FLYER_CAMPAIGN_SUBJECT,
        content,
        fontFamily: FLYER_EMAIL_FONT_FAMILY,
        metadata: {
          source: "flyer_campaign",
          batchIndex,
          teamName: recipient.teamName,
          memberName: recipient.memberName,
        },
      };

      let mailResult = await sendMail(mailPayload);

      if (!mailResult.success && isRateLimitError(mailResult.error)) {
        await delay(RATE_LIMIT_RETRY_DELAY_MS);
        mailResult = await sendMail(mailPayload);
      }

      if (mailResult.success) {
        results.push({ email: recipient.email, success: true });
        await markFlyerEmailsSent([recipient.email]);
      } else {
        results.push({
          email: recipient.email,
          success: false,
          error: mailResult.error ?? "Send failed",
        });
      }

      if (i < pending.length - 1) {
        await delay(RESEND_MIN_INTERVAL_MS);
      }
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
