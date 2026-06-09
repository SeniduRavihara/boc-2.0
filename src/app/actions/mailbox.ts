'use server';

import { resend } from '@/lib/resend';
import { addMailMessage, MailFolder, fetchMailboxMessages, updateMailMessageStatus, deleteMailMessage } from '@/firebase/api';
import { revalidatePath } from 'next/cache';
import { getBaseTemplate, getLightTemplate } from '@/lib/email/templates';
import fs from 'fs';
import path from 'path';

const FROM_EMAIL = 'Beauty of Cloud 2.0 <info@beautyofcloud.com>';

export async function sendMail(params: {
  to: string | string[];
  subject: string;
  content: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachInvitation?: boolean;
  senderName?: string;
  metadata?: Record<string, unknown>;
  fontFamily?: string;
  customAttachments?: {
    filename: string;
    url: string;
  }[];
}) {
  const { to, subject, content, cc, bcc, attachInvitation = false, senderName, metadata, fontFamily, customAttachments = [] } = params;

  try {
    console.log(`[Mailbox] Starting sendMail process for ${to}...`);
    
    // Determine template and sender based on whether an IR member was selected
    const htmlContent = senderName ? getLightTemplate(content, senderName) : getBaseTemplate(content, 'https://www.beautyofcloud.com', fontFamily ? { fontFamily } : undefined);
    
    const senderEmail = senderName 
      ? `${senderName.toLowerCase().replace(/\s+/g, '.')}@beautyofcloud.com`
      : 'info@beautyofcloud.com';
      
    const fromAddress = senderName
      ? `${senderName} (IR Committee) <${senderEmail}>`
      : FROM_EMAIL;

    const attachments = [];
    if (attachInvitation) {
      try {
        const invitationPath = path.join(process.cwd(), 'public', 'invitation.png');
        console.log(`[Mailbox] Loading attachment from: ${invitationPath}`);
        if (fs.existsSync(invitationPath)) {
          const invitationBuffer = fs.readFileSync(invitationPath);
          attachments.push({
            filename: 'invitation.png',
            content: invitationBuffer,
          });
        }

        const invitation2Path = path.join(process.cwd(), 'public', 'invitation2.png');
        console.log(`[Mailbox] Loading attachment from: ${invitation2Path}`);
        if (fs.existsSync(invitation2Path)) {
          const invitation2Buffer = fs.readFileSync(invitation2Path);
          attachments.push({
            filename: 'invitation2.png',
            content: invitation2Buffer,
          });
        }
      } catch (err) {
        console.error('[Mailbox] Failed to read invitation attachments:', err);
      }
    }

    if (customAttachments && customAttachments.length > 0) {
      console.log(`[Mailbox] Passing ${customAttachments.length} custom attachment URL(s) directly to Resend...`);
      for (const att of customAttachments) {
        attachments.push({
          filename: att.filename,
          path: att.url,
        });
      }
    }

    // 1. Prepare Payload
    const emailPayload: any = {
      from: fromAddress,
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
        from_email: fromAddress,
        to_email: typeof to === 'string' ? to : to.join(', '),
        subject: subject,
        content_text: content,
        content_html: htmlContent,
        folder: 'sent',
        is_read: true,
        metadata: { 
          source: metadata?.source ?? 'admin_mailbox',
          cc: (typeof cc === 'string' ? cc : cc?.join(', ')) || null,
          bcc: (typeof bcc === 'string' ? bcc : bcc?.join(', ')) || null,
          senderName: senderName || 'System Default',
          ...metadata
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
    const rawMessages = await fetchMailboxMessages(folder);
    return rawMessages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt ? (typeof msg.createdAt.toDate === 'function' ? msg.createdAt.toDate().toISOString() : new Date(msg.createdAt.seconds * 1000).toISOString()) : new Date().toISOString()
    }));
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

export async function updateMailFolder(id: string, folder: MailFolder) {
  try {
    await updateMailMessageStatus(id, { folder });
    revalidatePath('/admin/email-tool');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMailMessageAction(id: string) {
  try {
    await deleteMailMessage(id);
    revalidatePath('/admin/email-tool');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
