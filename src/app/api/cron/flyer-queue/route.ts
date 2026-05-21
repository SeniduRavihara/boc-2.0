import { NextRequest, NextResponse } from "next/server";
import { buildFlyerEmailQueueServer } from "@/lib/flyer-queue/server";

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const force =
      request.nextUrl.searchParams.get("force") === "1" ||
      process.env.FLYER_QUEUE_DEV_OVERRIDE === "true";

    const queue = await buildFlyerEmailQueueServer({ force });
    return NextResponse.json({
      ok: true,
      status: queue.status,
      recipientCount: queue.recipients.length,
      builtAt: queue.builtAt ?? null,
    });
  } catch (error) {
    console.error("[cron/flyer-queue]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
