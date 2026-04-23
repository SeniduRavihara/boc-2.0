import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addMailMessage, addSystemLog } from "@/firebase/api";

/**
 * Handle Inbound Emails from Resend
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data: webhookData } = payload;
    
    if (type !== "email.received" || !webhookData?.email_id) {
      return NextResponse.json({ message: "Not an inbound email event" }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Fetch full content
    const { data: emailContent, error: fetchError } = await resend.emails.receiving.get(
      webhookData.email_id
    );

    if (fetchError || !emailContent) {
      console.error("Error fetching email content from Resend:", fetchError);
      return NextResponse.json({ error: "Failed to fetch email content" }, { status: 500 });
    }

    const fromVal = emailContent.from || "unknown";
    const subject = emailContent.subject || "(No Subject)";
    const toVal = Array.isArray(emailContent.to) ? emailContent.to[0] : (emailContent.to || "unknown");

    // 1. Save to mailbox_messages
    await addMailMessage({
      resend_id: webhookData.email_id,
      direction: "incoming",
      from_email: fromVal,
      to_email: toVal as string,
      subject: subject,
      content_text: emailContent.text || '',
      content_html: emailContent.html || '',
      folder: "inbox",
      is_read: false,
      metadata: {
        headers: emailContent.headers,
        attachments: emailContent.attachments,
        webhook_type: type
      }
    });

    // 2. Audit log
    await addSystemLog({
      log_type: "resend_inbound",
      severity: "info",
      message: `Mailbox received: "${subject}" from ${fromVal}`,
      resource_id: webhookData.email_id,
      resource_type: "email"
    });

    return NextResponse.json({ success: true, message: "Email received and archived to mailbox" });
  } catch (error: any) {
    console.error("Resend Inbound Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
