'use server';

import { resend } from '@/lib/resend';
import { addMailMessage, MailFolder, fetchMailboxMessages, updateMailMessageStatus } from '@/firebase/api';
import { revalidatePath } from 'next/cache';
import { getBaseTemplate } from '@/lib/email/templates';
import fs from 'fs';
import path from 'path';

const FROM_EMAIL = 'Beauty of Cloud 2.0 <noreply@beautyofcloud.com>';

export async function sendMail(params: {
  to: string | string[];
  subject: string;
  content: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachInvitation?: boolean;
}) {
  const { to, subject, content, cc, bcc, attachInvitation = false } = params;

  try {
    console.log(`[Mailbox] Starting sendMail process for ${to}...`);
    const htmlContent = getBaseTemplate(content);

    const attachments = [];
    if (attachInvitation) {
      try {
        const invitationPath = path.join(process.cwd(), 'public', 'invitation.jpeg');
        console.log(`[Mailbox] Loading attachment from: ${invitationPath}`);
        const invitationBuffer = fs.readFileSync(invitationPath);
        attachments.push({
          filename: 'invitation.jpeg',
          content: invitationBuffer,
        });
      } catch (err) {
        console.error('[Mailbox] Failed to read invitation attachment:', err);
      }
    }

    // 1. Prepare Payload
    const emailPayload: any = {
      from: FROM_EMAIL,
      to: typeof to === 'string' ? [to] : to,
      subject: subject,
      html: htmlContent,
    };

    if (cc && (Array.isArray(cc) ? cc.length > 0 : true)) emailPayload.cc = cc;
    if (bcc && (Array.isArray(bcc) ? bcc.length > 0 : true)) emailPayload.bcc = bcc;
    if (attachments.length > 0) emailPayload.attachments = attachments;

    console.log(`[Mailbox] Payload prepared. Sending via Resend...`);
    
    // 2. Send via Resend
    const { data: resendData, error: resendError } = await resend.emails.send(emailPayload);

    if (resendError) {
      console.error('[Mailbox] Resend Error:', resendError);
      return { success: false, error: `Resend Error: ${resendError.message}` };
    }

    console.log(`[Mailbox] Resend success. ID: ${resendData?.id}. Recording to Firestore...`);

    // 3. Record in Firestore
    try {
      await addMailMessage({
        resend_id: resendData?.id || '',
        direction: 'outgoing',
        from_email: FROM_EMAIL,
        to_email: typeof to === 'string' ? to : to.join(', '),
        subject: subject,
        content_text: content,
        content_html: htmlContent,
        folder: 'sent',
        is_read: true,
        metadata: { 
          source: 'admin_mailbox',
          cc: (typeof cc === 'string' ? cc : cc?.join(', ')) || null,
          bcc: (typeof bcc === 'string' ? bcc : bcc?.join(', ')) || null
        }
      });
      console.log(`[Mailbox] Firestore record created.`);
    } catch (fsError: any) {
      console.error('[Mailbox] Firestore Error:', fsError);
      // We still return success: true because the email WAS sent
      return { success: true, id: resendData?.id, warning: 'Email sent but failed to log in history' };
    }

    revalidatePath('/admin/email-tool');
    return { success: true, id: resendData?.id };
  } catch (error: any) {
    console.error('[Mailbox] Fatal sendMail error:', error);
    return { success: false, error: `Internal System Error: ${error.message || 'Unknown'}` };
  }
}

export async function getMessages(folder: MailFolder = 'inbox') {
  try {
    return await fetchMailboxMessages(folder);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function markAsRead(id: string) {
  try {
    await updateMailMessageStatus(id, { is_read: true });
    revalidatePath('/admin/email-tool');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
