'use server';

import { resend } from '@/lib/resend';
import { addMailMessage, MailFolder, fetchMailboxMessages, updateMailMessageStatus } from '@/firebase/api';
import { revalidatePath } from 'next/cache';
import { getBaseTemplate } from '@/lib/email/templates';
import fs from 'fs';
import path from 'path';

const FROM_EMAIL = 'Beauty of Cloud 2.0 <noreply@beautyofcloud.com>';

export async function sendMail(params: {
  to: string;
  subject: string;
  content: string;
}) {
  const { to, subject, content } = params;

  try {
    const htmlContent = getBaseTemplate(content);

    // Read the invitation image as a buffer for attachment
    const invitationPath = path.join(process.cwd(), 'public', 'invitation.jpeg');
    const invitationBuffer = fs.readFileSync(invitationPath);

    // 1. Send via Resend with Attachment
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: 'invitation.jpeg',
          content: invitationBuffer,
        },
      ],
    });

    if (resendError) {
      console.error('Resend Error:', resendError);
      return { success: false, error: resendError.message };
    }

    // 2. Record in Firestore
    await addMailMessage({
      resend_id: resendData?.id || '',
      direction: 'outgoing',
      from_email: FROM_EMAIL,
      to_email: to,
      subject: subject,
      content_text: content,
      content_html: htmlContent,
      folder: 'sent',
      is_read: true,
      metadata: { source: 'admin_mailbox' }
    });

    revalidatePath('/admin/email-tool');
    return { success: true, id: resendData?.id };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message || 'Unexpected error' };
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
