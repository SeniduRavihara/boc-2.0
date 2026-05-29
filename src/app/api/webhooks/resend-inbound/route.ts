import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addMailMessage, addSystemLog } from "@/firebase/api";
import { MEMBER_SIGNATURES } from "@/lib/email/templates";

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

    // 3. Redirect / Forward Notification to Member's Private Email (Single Source of Truth)
    const extractEmailAddress = (emailStr: string): string => {
      const match = emailStr.match(/<([^>]+)>/);
      return (match ? match[1] : emailStr).trim().toLowerCase();
    };

    const targetEmail = extractEmailAddress(toVal);
    
    // Find matching member by business email
    const matchingMember = Object.values(MEMBER_SIGNATURES).find(
      (m) => m.email.toLowerCase() === targetEmail
    );

    let recipients: string[] = [];
    let isDirectForward = false;
    let memberName = "";

    if (matchingMember) {
      recipients = [matchingMember.privateEmail];
      isDirectForward = true;
      const entry = Object.entries(MEMBER_SIGNATURES).find(([_, m]) => m.email.toLowerCase() === targetEmail);
      memberName = entry ? entry[0] : "";
    } else {
      // General email fallback: forward to all members' private emails
      recipients = Object.values(MEMBER_SIGNATURES).map((m) => m.privateEmail);
    }

    try {
      if (recipients.length > 0) {
        console.log(`[Mailbox Webhook] Forwarding inbound email to: ${recipients.join(", ")}`);
        
        const emailBody = emailContent.html || emailContent.text || "(No content)";
        const forwardSubject = isDirectForward 
          ? `[Direct Forward to ${memberName}] Inbound Email: ${subject}`
          : `[BOC 2.0 Notification] General Inbound Email: ${subject}`;

        await resend.emails.send({
          from: "Beauty of Cloud Inbox <info@beautyofcloud.com>",
          to: recipients,
          subject: forwardSubject,
          html: `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; margin: 20px auto;">
              <div style="border-bottom: 1px solid #cbd5e1; padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">
                  ${isDirectForward ? `Direct Email Forwarded to ${memberName}` : 'New Inbound Email Received'}
                </h2>
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                  ${isDirectForward 
                    ? `This email was sent to your business address (${targetEmail}) and forwarded to your private email.` 
                    : 'This is a general inbound email forwarded to the entire IR committee.'}
                </p>
              </div>
              
              <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 14px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #475569; width: 80px; vertical-align: top;">From:</td>
                    <td style="padding: 6px 0; color: #0f172a; word-break: break-all;">${fromVal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #475569; vertical-align: top;">To:</td>
                    <td style="padding: 6px 0; color: #0f172a; word-break: break-all;">${toVal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #475569; vertical-align: top;">Subject:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${subject}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px; min-height: 150px; font-size: 15px; line-height: 1.6; color: #334155; word-wrap: break-word;">
                ${emailBody}
              </div>
              
              <div style="text-align: center; border-top: 1px solid #cbd5e1; padding-top: 20px; margin-top: 20px;">
                <a href="https://www.beautyofcloud.com/admin/email-tool" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: background-color 0.2s;">
                  View in Admin Dashboard
                </a>
              </div>
            </div>
          `
        });

        console.log("[Mailbox Webhook] Notification forwarded successfully.");
      }
    } catch (sendErr) {
      console.error("[Mailbox Webhook] Failed to forward email notification:", sendErr);
    }

    return NextResponse.json({ success: true, message: "Email received, archived and notifications sent" });
  } catch (error: any) {
    console.error("Resend Inbound Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
