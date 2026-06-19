import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ emailId: string; attachmentId: string }> }
) {
  try {
    const { emailId, attachmentId } = await params;

    if (!emailId || !attachmentId) {
      return new Response("Missing dynamic routing parameters (emailId, attachmentId)", { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return new Response("Server configuration error: RESEND_API_KEY is not configured", { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Fetch dynamic attachment credentials from Resend API
    const { data, error } = await resend.emails.receiving.attachments.get({
      emailId,
      id: attachmentId,
    });

    if (error || !data || !data.download_url) {
      return new Response(error?.message || "Attachment not found or the Resend download link has expired (1 hour limit)", { status: 404 });
    }

    // Redirect user to the secure S3 download URL
    return NextResponse.redirect(data.download_url);
  } catch (error: any) {
    console.error("[Attachment Download API] Error retrieving attachment details:", error);
    return new Response(error.message || "Failed to retrieve attachment download credentials", { status: 500 });
  }
}
