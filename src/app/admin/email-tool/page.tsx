'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, Send, Inbox, Archive, Trash2, Search, Plus, Loader2, ChevronRight, Check, AlertCircle, Ticket, User, ExternalLink, RefreshCw, Trophy, Activity, Reply, ReplyAll, Paperclip } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getMessages, sendMail, markAsRead, updateMailFolder, deleteMailMessageAction } from '@/app/actions/mailbox';
import { MailMessage, MailFolder, getQuizzes, getQuizSubmissions } from '@/firebase/api';
import { getBaseTemplate, getLightTemplate } from '@/lib/email/templates';
import { Quiz, QuizSubmission } from '@/types';
import { format } from 'date-fns';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

export const getAWSTemplate = (name: string, code: string) => `Dear ${name},

Congratulations!

You have been selected as one of the top performers in the quiz conducted during the session “Getting into the Cloud with AWS” by Mr. Tharindu Kalhara, as a part of Beauty of Cloud 2.0.

As a recognition of your performance, you have been awarded an AWS credit voucher.

<div class="voucher-code">${code}</div>

You can redeem your voucher using the link below:
https://aws.amazon.com/awscredits/

Please note:

* Each voucher can be used only once.
* We recommend redeeming your voucher at your earliest convenience.

If you have any questions or face any issues during the redemption process, feel free to reach out via WhatsApp: https://wa.me/94785147452

Best regards,
Waruna Udara and Kavindu Nimesha
Co-Chairs — Beauty of Cloud 2.0
Senindu Ravihara
Programming Committee Head
IEEE CS Chapter USJ`;

export const getInquiryTemplate = (name: string) => `Dear ${name},

Subject: Inquiry Regarding AWS Credit Redemption Status – Beauty of Cloud 2.0

Dear Participant,

We are following up regarding the AWS promotional credit vouchers recently distributed as part of the "Getting into the Cloud with AWS" session.

It has come to our attention that several participants are encountering a system error ("Something went wrong") during the redemption process. To ensure all awardees can successfully claim their credits, we are currently investigating whether this is a systemic issue with the voucher batch or an isolated account configuration matter.

As this is an automated, no-reply email address, kindly reach out to us via WhatsApp at https://wa.me/94785147452 at your earliest convenience and confirm the following:

1. **Redemption Status:** Were you able to successfully redeem your AWS credit voucher?
2. **Error Details:** If you encountered an error, please provide a brief description or a screenshot of the error message.
3. **Account Status:** Is your AWS account newly registered (created within the last 48 hours)?

If you have not yet successfully redeemed your voucher, we recommend verifying the following standard requirements before your next attempt:

* Confirm that your AWS account billing information and identity verification processes are fully completed.
* Attempt the redemption process using an incognito or private browsing window to eliminate potential browser caching conflicts.

We appreciate your cooperation and patience as we work to resolve this matter promptly.

Best regards,

Waruna Udara and Kavindu Nimesha
Co-Chairs — Beauty of Cloud 2.0
Senindu Ravihara
Programming Committee Head
IEEE CS Chapter USJ`;

const cleanMessageForQuote = (text: string): string => {
  if (!text) return '';
  let cleaned = text;

  // List of standard lines to remove from quotes to avoid duplication
  const linesToRemove = [
    /Co-Chairs\s*—\s*Beauty of Cloud 2\.0/gi,
    /Senindu Ravihara/gi,
    /Programming Committee Head/gi,
    /IEEE CS Chapter USJ/gi,
    /IEEE Computer Society - Student Branch Chapter of the University of Sri Jayewardenepura/gi,
    /Organizing Committee\s*·\s*University of Sri Jayewardenepura/gi,
    /©\s*\d{4}\s*Beauty of Cloud 2\.0/gi,
    /No\. 123, Business Avenue, Colombo, Sri Lanka/gi,
    /Privacy Policy/gi,
    /Terms of Service/gi,
    /https:\/\/www\.beautyofcloud\.com/gi,
    /https:\/\/wa\.me\/94785147452/gi,
    /Waruna Udara and Kavindu Nimesha/gi
  ];

  for (const regex of linesToRemove) {
    cleaned = cleaned.replace(regex, '');
  }

  // Remove duplicate quoted block headers or excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
};

const formatContentForPreview = (content: string): string => {
  if (!content) return '';
  
  // Escape HTML tags to prevent layout hijack or XSS in preview
  let escaped = content.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Now parse blockquotes (lines starting with &gt; or >)
  const lines = escaped.split('\n');
  let inBlockquote = false;
  const resultLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('&gt;')) {
      const quoteText = trimmed.substring(4).trim();
      if (!inBlockquote) {
        resultLines.push('<blockquote style="border-left: 2px solid #3b82f6; padding-left: 15px; margin: 10px 0; color: #64748b; font-style: italic;">');
        inBlockquote = true;
      }
      resultLines.push(quoteText + '<br/>');
    } else {
      if (inBlockquote) {
        resultLines.push('</blockquote>');
        inBlockquote = false;
      }
      resultLines.push(line + '<br/>');
    }
  }
  
  if (inBlockquote) {
    resultLines.push('</blockquote>');
  }

  return resultLines.join('\n');
};

export default function EmailToolPage() {
  const [activeFolder, setActiveFolder] = useState<MailFolder | 'aws_vouchers'>('inbox');
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeSender, setComposeSender] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [attachInvitation, setAttachInvitation] = useState(false);
  const [sending, setSending] = useState(false);
  const [filterSender, setFilterSender] = useState('');
  const [customAttachments, setCustomAttachments] = useState<{ filename: string; url: string }[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; filename: string; progress: number }[]>([]);
  const uploadIdRef = useRef(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const MAX_FILE_BYTES = 25 * 1024 * 1024;
  const MAX_ATTACHMENTS = 5;
  const [attachmentError, setAttachmentError] = useState('');
  const [sendError, setSendError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fbStorage = storage;
    if (!fbStorage) {
      setAttachmentError('Firebase Storage is not available.');
      return;
    }
    setAttachmentError('');

    const files = Array.from(e.target.files);

    const oversized = files.find(f => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setAttachmentError(`"${oversized.name}" is ${(oversized.size / 1024 / 1024).toFixed(1)} MB — maximum is 25 MB per file.`);
      return;
    }

    if (customAttachments.length + uploadingFiles.length + files.length > MAX_ATTACHMENTS) {
      setAttachmentError('Maximum 5 attachments allowed per email.');
      return;
    }

    files.forEach(file => {
      const uploadId = String(++uploadIdRef.current);
      const storageRef = ref(fbStorage, `email-attachments/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadingFiles(prev => [...prev, { id: uploadId, filename: file.name, progress: 0 }]);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingFiles(prev =>
            prev.map(f => f.id === uploadId ? { ...f, progress } : f)
          );
        },
        (error) => {
          console.error(`[Upload] Failed to upload ${file.name}:`, error);
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
          setAttachmentError(`Failed to upload "${file.name}". Please try again.`);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setCustomAttachments(prev => [...prev, { filename: file.name, url: downloadUrl }]);
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }
      );
    });
  };

  const removeAttachment = (index: number) => {
    setCustomAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const IR_MEMBERS = [
    "Shanki Tharusha",
    "Chanupa Diwyanjala",
    "Senumi Waidyalankara",
    "Kaushan Munasingha",
    "Kavinya Peiris",
    "Bakeerathan Karthigan",
    "Wiraji Wijewardana",
    "Amasha Malindi",
    "Himasha Ranasooriya",
    "Inuka Karunasiri",
    "Charutha Palihawadana"
  ];

  // AWS Vouchers State
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [topSubmissions, setTopSubmissions] = useState<(QuizSubmission & { voucher: string })[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testBcc, setTestBcc] = useState('');
  const [batchBcc, setBatchBcc] = useState('tharindukalhara73@gmail.com, warunaudarasam2003@gmail.com');
  const [sentCount, setSentCount] = useState(0);
  const [batchProgress, setBatchProgress] = useState<{ current: number, total: number, sending: boolean }>({ current: 0, total: 0, sending: false });
  const [emailType, setEmailType] = useState<'voucher' | 'inquiry'>('voucher');

  const VOUCHER_CODES = [
    "PCOLDJQ6FVXE8D", "PC1QFHSAPWRI6GL", "PC3M6DCVOP936MS", "PC2OPR2XF9HLIGL", "PC1LFZCB9ERW8Q8",
    "PC2RM0R8PEFZ5FT", "PC138E72GMA5VU6", "PC1UDSS0IE4Z07F", "PC35JX0INEPQV4F", "PC7TVV9B64HWUU",
    "PC3UR297PM21ZN6", "PC24GDDM5ELJIOV", "PC1IJLG0M6NBPP7", "PC226LZW3LNPYL8", "PC2ICJF1CZ9476O",
    "PCVYSHS8Z64ITX", "PC26ULXPW3AW61U", "PC1JJ40T4X79347", "PCIF6IM1FAPJHD", "PCPDYF3R3DKCQA",
    "PC18YZ7VZCXVX9H", "PCAFNPS6R6ZRZU", "PCUJJ9GXX81OQ9", "PC379H2FCJE223S", "PC1SJ2OLQ5O40S8",
    "PC4Z2OWII8WJY0", "PC2E10F6QWKVK2Z", "PC2DCXMK4ZEYW30", "PC1S6D0XCCO3V1S", "PCDK0XLUGP78X5"
  ];

  useEffect(() => {
    if (activeFolder === 'aws_vouchers') {
      loadQuizzes();
    } else {
      loadMessages();
    }
  }, [activeFolder]);

  const loadQuizzes = async () => {
    setLoading(true);
    const data = await getQuizzes();
    setQuizzes(data);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedQuizId) {
      loadTopPerformers();
      setSentCount(0);
      setBatchProgress({ current: 0, total: 0, sending: false });
    }
  }, [selectedQuizId]);

  const loadTopPerformers = async () => {
    setLoadingVouchers(true);
    const submissions = await getQuizSubmissions(selectedQuizId);
    
    // Deduplicate and take top 30
    const unique = new Map<string, QuizSubmission>();
    submissions.forEach(sub => {
      const existing = unique.get(sub.userEmail);
      if (!existing || sub.totalScore > existing.totalScore) {
        unique.set(sub.userEmail, sub);
      } else if (sub.totalScore === existing.totalScore) {
        const subTime = (sub.completedAt as any)?.toMillis?.() || Number(sub.completedAt) || 0;
        const existingTime = (existing.completedAt as any)?.toMillis?.() || Number(existing.completedAt) || 0;
        if ((subTime as number) < (existingTime as number)) {
          unique.set(sub.userEmail, sub);
        }
      }
    });

    const sorted = Array.from(unique.values()).sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      const timeA = (a.completedAt as any)?.toMillis?.() || Number(a.completedAt) || 0;
      const timeB = (b.completedAt as any)?.toMillis?.() || Number(b.completedAt) || 0;
      return (timeA as number) - (timeB as number);
    }).slice(0, 30);

    const mapped = sorted.map((sub, i) => ({
      ...sub,
      voucher: VOUCHER_CODES[i] || 'N/A'
    }));

    setTopSubmissions(mapped);
    setLoadingVouchers(false);
  };

  const handleTestSend = async () => {
    if (!testEmail) return alert("Please enter a test email address");
    setSending(true);
    const bccList = testBcc.split(',').map(e => e.trim()).filter(e => e !== "");
    const result = await sendMail({
      to: testEmail,
      bcc: bccList,
      subject: emailType === 'voucher' ? "Congratulations! Your AWS Credit Voucher is Here" : "Inquiry Regarding AWS Credit Redemption Status – Beauty of Cloud 2.0",
      content: emailType === 'voucher' ? getAWSTemplate("Test User", "TEST-VOUCHER-123") : getInquiryTemplate("Test User")
    });
    if (result.success) alert("Test email sent successfully!");
    else alert("Failed to send test email: " + result.error);
    setSending(false);
  };

  const handleBatchSend = async () => {
    if (topSubmissions.length === 0) return alert("No students to send to.");
    if (sentCount >= topSubmissions.length) return alert("All vouchers have already been sent!");

    const bccList = batchBcc.split(',').map(e => e.trim()).filter(e => e !== "");
    const nextBatch = topSubmissions.slice(sentCount, sentCount + 5);
    
    if (!confirm(`Confirm transmission of next ${nextBatch.length} vouchers? (BCC: ${bccList.join(', ') || 'None'})`)) return;

    setBatchProgress({ current: sentCount, total: topSubmissions.length, sending: true });

    let successInThisBatch = 0;
    await Promise.all(nextBatch.map(async (sub) => {
      try {
        const result = await sendMail({
          to: sub.userEmail,
          bcc: bccList,
          subject: emailType === 'voucher' ? "Congratulations! Your AWS Credit Voucher is Here" : "Inquiry Regarding AWS Credit Redemption Status – Beauty of Cloud 2.0",
          content: emailType === 'voucher' ? getAWSTemplate(sub.userName, sub.voucher) : getInquiryTemplate(sub.userName)
        });
        if (result.success) successInThisBatch++;
      } catch (error) {
        console.error(`Failed to send to ${sub.userEmail}`, error);
      }
    }));

    setSentCount(prev => prev + successInThisBatch);
    setBatchProgress(prev => ({ 
      current: prev.current + successInThisBatch, 
      total: topSubmissions.length, 
      sending: false 
    }));

    if (sentCount + successInThisBatch >= topSubmissions.length) {
      alert("All 30 vouchers have been successfully distributed!");
    } else {
      alert(`Batch of ${successInThisBatch} sent. Total progress: ${sentCount + successInThisBatch}/30. You can update BCCs for the next batch.`);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    setSelectedIds(new Set());
    const data = await getMessages(activeFolder as MailFolder);
    setMessages(data);
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    
    const ccList = composeCc.split(',').map(e => e.trim()).filter(e => e !== "");
    const bccList = composeBcc.split(',').map(e => e.trim()).filter(e => e !== "");
    
    const result = await sendMail({
      to: composeTo,
      subject: composeSubject,
      content: composeContent,
      cc: ccList.length > 0 ? ccList : undefined,
      bcc: bccList.length > 0 ? bccList : undefined,
      attachInvitation: attachInvitation,
      senderName: composeSender || undefined,
      customAttachments: customAttachments
    });

    if (result.success) {
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeCc('');
      setComposeBcc('');
      setComposeSubject('');
      setComposeContent('');
      setCustomAttachments([]);
      setUploadingFiles([]);
      setShowPreview(false);
      if (activeFolder === 'sent') loadMessages();
    } else {
      setSendError(result.error || 'Unknown error');
    }
    setSending(false);
  };

  const handleSelectMessage = async (msg: MailMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await markAsRead(msg.id);
      setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const handleArchive = async (id: string) => {
    const result = await updateMailFolder(id, 'archive');
    if (result.success) {
      setSelectedMessage(null);
      setSelectedIds(new Set());
      loadMessages();
    } else {
      alert("Failed to archive: " + result.error);
    }
  };

  const handleTrash = async (id: string) => {
    const result = await updateMailFolder(id, 'trash');
    if (result.success) {
      setSelectedMessage(null);
      setSelectedIds(new Set());
      loadMessages();
    } else {
      alert("Failed to move to trash: " + result.error);
    }
  };

  const handleDeletePermanently = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this transmission?")) return;
    const result = await deleteMailMessageAction(id);
    if (result.success) {
      setSelectedMessage(null);
      setSelectedIds(new Set());
      loadMessages();
    } else {
      alert("Failed to delete: " + result.error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMessages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMessages.map(m => m.id)));
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;
    await Promise.all(Array.from(selectedIds).map(id => updateMailFolder(id, 'archive')));
    setSelectedIds(new Set());
    setSelectedMessage(null);
    loadMessages();
  };

  const handleBulkTrash = async () => {
    if (selectedIds.size === 0) return;
    await Promise.all(Array.from(selectedIds).map(id => updateMailFolder(id, 'trash')));
    setSelectedIds(new Set());
    setSelectedMessage(null);
    loadMessages();
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    setComposeTo(selectedMessage.from_email);
    setComposeSubject(selectedMessage.subject.startsWith('Re:') ? selectedMessage.subject : `Re: ${selectedMessage.subject}`);
    
    // Clean original text
    const cleanedText = cleanMessageForQuote(selectedMessage.content_text);
    
    setComposeContent(`\n\nOn ${selectedMessage.createdAt ? format(new Date(selectedMessage.createdAt), 'PPP p') : ''}, ${selectedMessage.from_email} wrote:\n> ${cleanedText.split('\n').join('\n> ')}`);
    
    // Auto-detect matching sender
    const fromEmailLower = selectedMessage.from_email.toLowerCase();
    const toEmailLower = selectedMessage.to_email.toLowerCase();
    const matchedMember = IR_MEMBERS.find(member => 
      toEmailLower.includes(member.toLowerCase().replace(/\s+/g, '.')) ||
      fromEmailLower.includes(member.toLowerCase().replace(/\s+/g, '.'))
    );
    setComposeSender(matchedMember || filterSender || '');

    setAttachInvitation(false);
    setComposeCc('');
    setComposeBcc('');
    setIsComposeOpen(true);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      msg.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.to_email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterSender) {
      const memberEmail = `${filterSender.toLowerCase().replace(/\s+/g, '.')}@beautyofcloud.com`;
      const isFromMember = msg.from_email.toLowerCase().includes(memberEmail.toLowerCase()) || 
                           msg.metadata?.senderName === filterSender;
      const isToMember = msg.to_email.toLowerCase().includes(memberEmail.toLowerCase());
      return isFromMember || isToMember;
    }

    return true;
  });

  return (
    <div className="min-h-[800px] h-auto lg:h-[calc(100vh-120px)] flex flex-col gap-6">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Administrative <span className="text-blue-500">Mailbox</span></h1>
          <p className="text-slate-400 text-sm">Secure communications protocol v2.0</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Global Member Filter Dropdown */}
          <div className="relative w-full sm:min-w-[220px] sm:w-auto">
            <select
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white pl-10 pr-10 py-3 rounded-none text-sm font-bold border border-white/5 shadow-xl transition-all appearance-none cursor-pointer outline-none focus:border-blue-500/50"
            >
              <option value="" className="bg-slate-900 text-slate-300">All Members</option>
              {IR_MEMBERS.map((member) => (
                <option key={member} value={member} className="bg-slate-900 text-white">
                  {member}
                </option>
              ))}
            </select>
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => {
              setComposeSender(filterSender);
              setComposeSubject("Official Invitation: Beauty of Cloud 2.0");
              setComposeContent(`Dear Mr. Tharindu Kalhara,

As discussed previously, on behalf of the Organizing Committee of Beauty of Cloud 2.0, we are pleased to invite you to serve as the speaker for the session titled “Getting into the Cloud with AWS,” organized by the IEEE Computer Society - Student Branch Chapter of the University of Sri Jayewardenepura.

Your expertise in this field would be of great value to our participants, and we believe your contribution will greatly benefit the session.

Please find the attached official invitation letter containing event details, including the scheduled date and time. The session access link and any further information will be shared with you in due course.

We sincerely appreciate your support and look forward to your participation in Beauty of Cloud 2.0.

Thank you.

Warm regards,

• Event Co-chair - Nimesha Kavindu - +94 77 488 8701
• Event Co-chair - Waruna Udara - +94 78 514 7452
• Chair of CS Chapter - Rusira Sandul - +94 70 517 0403`);
              setAttachInvitation(true);
              setIsComposeOpen(true);
            }}
            className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-5 py-3 rounded-none flex items-center gap-2 transition-all font-bold text-sm border border-blue-500/30 w-full sm:w-auto justify-center"
          >
            <Check size={18} />
            SPEAKER TEMPLATE
          </button>
          <button 
            onClick={() => {
              setComposeSender(filterSender);
              setComposeSubject('');
              setComposeContent('');
              setComposeTo('');
              setAttachInvitation(false);
              setIsComposeOpen(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-none flex items-center gap-2 transition-all font-bold text-sm border border-white/5 shadow-xl w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            COMPOSE
          </button>
        </div>
      </div>

      {/* Main Mailbox Interface */}
      <GlassCard className="flex-1 flex flex-col lg:flex-row overflow-hidden border-white/5 rounded-none">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02] flex flex-col p-6 gap-2 overflow-y-auto custom-scrollbar">
          <NavItem 
            icon={<Inbox size={18} />} 
            label="Inbox" 
            active={activeFolder === 'inbox'} 
            onClick={() => setActiveFolder('inbox')} 
          />
          <NavItem 
            icon={<Send size={18} />} 
            label="Sent" 
            active={activeFolder === 'sent'} 
            onClick={() => setActiveFolder('sent')} 
          />
          <NavItem 
            icon={<Archive size={18} />} 
            label="Archive" 
            active={activeFolder === 'archive'} 
            onClick={() => setActiveFolder('archive')} 
          />
          <NavItem 
            icon={<Trash2 size={18} />} 
            label="Trash" 
            active={activeFolder === 'trash'} 
            onClick={() => setActiveFolder('trash')} 
          />
          <div className="mt-6 pt-6 border-t border-white/5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 block px-4">Special Operations</label>
            <NavItem 
              icon={<Ticket size={18} />} 
              label="AWS Vouchers" 
              active={activeFolder === 'aws_vouchers'} 
              onClick={() => setActiveFolder('aws_vouchers')} 
            />
          </div>
        </div>

        {/* Message List or AWS Voucher Interface */}
        {activeFolder === 'aws_vouchers' ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01]">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">AWS Voucher <span className="text-blue-500">Distribution</span></h2>
                <p className="text-slate-400 text-sm mt-1">Distribute 30 vouchers to top quiz performers</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative min-w-[240px]">
                  <select 
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-none px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-slate-900">Select a Quiz Leaderboard</option>
                    {quizzes.map(q => (
                      <option key={q.id} value={q.id} className="bg-slate-900">{q.title}</option>
                    ))}
                  </select>
                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" />
                </div>
                <div className="relative min-w-[200px]">
                  <select 
                    value={emailType}
                    onChange={(e) => setEmailType(e.target.value as any)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-none px-4 py-2.5 text-sm text-blue-400 font-bold outline-none focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="voucher" className="bg-slate-900">Email: AWS Voucher</option>
                    <option value="inquiry" className="bg-slate-900">Email: Redemption Inquiry</option>
                  </select>
                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" />
                </div>
                <button 
                  onClick={loadTopPerformers}
                  disabled={!selectedQuizId || loadingVouchers}
                  className="p-2.5 bg-white/[0.03] border border-white/5 rounded-none text-slate-400 hover:text-white transition-all disabled:opacity-30"
                >
                  <RefreshCw size={18} className={loadingVouchers ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
              {/* List of mapped students */}
              <div className="flex-1 border-b xl:border-b-0 xl:border-r border-white/5 flex flex-col">
                <div className="p-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mapped Performers ({topSubmissions.length}/30)</span>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-32 bg-white/5 rounded-none overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${(sentCount / topSubmissions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-blue-400">{sentCount}/{topSubmissions.length}</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {loadingVouchers ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                      <p className="text-xs font-black uppercase tracking-[0.2em]">Analyzing Leaderboard...</p>
                    </div>
                  ) : topSubmissions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
                      <Trophy size={48} className="mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest mb-2">No quiz selected</p>
                      <p className="text-xs text-slate-500 max-w-[200px]">Select a quiz from the dropdown to fetch top performers</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {topSubmissions.map((sub, i) => (
                        <div key={i} className="p-4 rounded-none bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all group">
                          <div className="w-8 h-8 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{sub.userName}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{sub.userEmail}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono text-blue-400 font-bold bg-blue-500/5 px-2 py-1 rounded-none border border-blue-500/10">
                              {sub.voucher}
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1 uppercase font-black tracking-tighter">{sub.totalScore} PTS</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Template Preview */}
              <div className="w-full xl:w-96 flex flex-col p-6 md:p-8 gap-8">
                {/* Testing Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <Activity size={14} /> Protocol Testing
                  </h3>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="test-recipient@example.com"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-none px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="BCC (comma separated)..."
                      className="w-full bg-white/[0.03] border border-white/5 rounded-none px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                      value={testBcc}
                      onChange={(e) => setTestBcc(e.target.value)}
                    />
                    <button 
                      onClick={handleTestSend}
                      disabled={sending || !testEmail}
                      className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-none text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                      {sending ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                      Execute Test Send
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Bulk Actions */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <Send size={14} /> Controlled Distribution
                  </h3>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Distribution BCCs</label>
                    <input 
                      type="text" 
                      placeholder="Admin BCCs (comma separated)..."
                      className="w-full bg-white/[0.03] border border-white/5 rounded-none px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                      value={batchBcc}
                      onChange={(e) => setBatchBcc(e.target.value)}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">
                    Transmit in steps of 5. You can modify BCCs between each batch.
                  </p>
                  <button 
                    onClick={handleBatchSend}
                    disabled={batchProgress.sending || topSubmissions.length === 0 || sentCount >= topSubmissions.length}
                    className="w-full h-14 bg-blue-600 text-white rounded-none text-sm font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    {batchProgress.sending ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Transmitting Batch...
                      </>
                    ) : sentCount >= topSubmissions.length && topSubmissions.length > 0 ? (
                      <>
                        <Check size={20} />
                        Distribution Complete
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Transmit Next 5 Vouchers
                      </>
                    )}
                  </button>
                  {sentCount > 0 && sentCount < topSubmissions.length && (
                    <button 
                      onClick={() => setSentCount(0)}
                      className="w-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all"
                    >
                      Reset Progress
                    </button>
                  )}
                </div>

                <div className="mt-auto p-5 rounded-none bg-blue-500/5 border border-blue-500/10 text-center">
                  <AlertCircle size={24} className="mx-auto mb-3 text-blue-400 opacity-50" />
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Security Notice</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Each voucher code is unique and can only be used once. Please verify the leaderboard data before initiating the distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Message List */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search encrypted mail..." 
                className="w-full bg-white/[0.03] border border-white/5 rounded-none pl-12 pr-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex-1">{selectedIds.size} selected</span>
                <button onClick={handleBulkArchive} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1.5">
                  <Archive size={12} /> Archive All
                </button>
                <button onClick={handleBulkTrash} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-all flex items-center gap-1.5">
                  <Trash2 size={12} /> Trash All
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                <Loader2 className="animate-spin text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Decrypting Inbox...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center opacity-30">
                <Mail className="mx-auto mb-4" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">No transmissions found</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex items-start p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] group relative ${selectedMessage?.id === msg.id ? 'bg-blue-500/[0.05]' : ''}`}
                >
                  <div className="pt-0.5 pr-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(msg.id)}
                      onChange={() => toggleSelect(msg.id)}
                      className="w-4 h-4 rounded-none border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => handleSelectMessage(msg)}>
                    {!msg.is_read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-none" />}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-black truncate max-w-[150px] ${!msg.is_read ? 'text-blue-400' : 'text-slate-400'}`}>
                        {msg.direction === 'incoming' ? msg.from_email : `To: ${msg.to_email}`}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {msg.createdAt && format(new Date(msg.createdAt), 'HH:mm')}
                      </span>
                    </div>
                    <h4 className={`text-sm mb-1 truncate ${!msg.is_read ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                      {msg.subject}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {msg.content_text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content View */}
        <div className="flex-1 bg-white/[0.01] flex flex-col">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-10 border-b border-white/5 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-4">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black">
                      {selectedMessage.from_email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedMessage.from_email}</p>
                      <p className="text-xs text-slate-500">to {selectedMessage.to_email} · {selectedMessage.createdAt && format(new Date(selectedMessage.createdAt), 'PPP p')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={handleReply}
                    className="px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded-none transition-all flex items-center gap-2 font-bold text-xs"
                  >
                    <Reply size={14} /> REPLY
                  </button>
                  {selectedMessage.folder !== 'archive' && (
                    <button 
                      onClick={() => handleArchive(selectedMessage.id)}
                      className="p-3 bg-white/[0.03] border border-white/5 rounded-none text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                      title="Archive message"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                  {selectedMessage.folder === 'trash' ? (
                    <button 
                      onClick={() => handleDeletePermanently(selectedMessage.id)}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-none text-red-400 hover:bg-red-500/20 transition-all"
                      title="Delete permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleTrash(selectedMessage.id)}
                      className="p-3 bg-white/[0.03] border border-white/5 rounded-none text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all"
                      title="Move to trash"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 custom-scrollbar">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          ::-webkit-scrollbar {
                            width: 8px;
                            height: 8px;
                          }
                          ::-webkit-scrollbar-track {
                            background: #020617;
                          }
                          ::-webkit-scrollbar-thumb {
                            background: #1e293b;
                            border-radius: 9999px;
                          }
                          ::-webkit-scrollbar-thumb:hover {
                            background: #334155;
                          }
                          body {
                            margin: 0;
                            padding: 0;
                            background-color: #020617;
                            color: #cbd5e1;
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            font-size: 14px;
                          }
                          /* Ensure images do not overflow and behave responsively */
                          img {
                            max-width: 100%;
                            height: auto;
                          }
                          /* Scope template elements inside the iframe */
                          .container {
                            max-width: 100%;
                            margin: 0 auto;
                            background: #0f172a;
                            border-radius: 16px;
                            overflow: hidden;
                            border: 1px solid rgba(255, 255, 255, 0.08);
                          }
                          .header {
                            background: radial-gradient(circle at top right, #1e40af 0%, #020617 80%);
                            padding: 20px;
                            text-align: center;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                          }
                          .logo {
                            max-width: 120px;
                          }
                          .content {
                            padding: 25px;
                            color: #f1f5f9;
                          }
                          .footer {
                            background: #020617;
                            padding: 30px 20px;
                            text-align: center;
                            color: #475569;
                            border-top: 1px solid rgba(255, 255, 255, 0.05);
                          }
                          .footer-logo {
                            height: 24px;
                            margin: 0 10px;
                            opacity: 0.4;
                          }
                          blockquote {
                            border-left: 2px solid #3b82f6;
                            padding-left: 15px;
                            margin: 10px 0;
                            color: #64748b;
                          }
                          /* Hide standard email client quoted reply history */
                          .gmail_quote,
                          blockquote[type="cite"],
                          .yahoo_quoted,
                          .ms-outlook-ios-signature,
                          div[id="appendonsend"] {
                            display: none !important;
                          }
                        </style>
                      </head>
                      <body>
                        ${selectedMessage.content_html || `<pre style="white-space: pre-wrap; font-family: sans-serif; color: #cbd5e1; line-height: 1.6; margin: 0;">${selectedMessage.content_text}</pre>`}
                      </body>
                    </html>
                  `}
                  className="w-full h-[420px] sm:h-[520px] lg:h-[550px] border border-white/5 rounded-none bg-[#020617] mb-6 shadow-inner"
                  title="Email Transmission Body"
                />

                {/* Attachments rendering */}
                {selectedMessage.metadata?.attachments && Array.isArray(selectedMessage.metadata.attachments) && selectedMessage.metadata.attachments.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <Paperclip size={14} /> Attachments ({selectedMessage.metadata.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedMessage.metadata.attachments.map((att: any, idx: number) => (
                        <a 
                          key={idx}
                          href={att.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 rounded-none bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center text-slate-400">
                              <Paperclip size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-300 truncate">{att.name || att.filename}</p>
                              <p className="text-[10px] text-slate-500">{(att.size / 1024).toFixed(1)} KB · {att.contentType || att.mimeType || 'unknown'}</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Reply Form */}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <div 
                    onClick={handleReply}
                    className="border border-dashed border-white/10 rounded-none bg-white/[0.01] hover:bg-white/[0.02] hover:border-blue-500/30 transition-all p-5 flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all text-slate-400">
                      <Reply size={18} />
                    </div>
                    <span className="text-sm text-slate-400 font-medium">Click here to <span className="text-blue-400 font-bold">Reply</span> to this message...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
              <div className="w-24 h-24 rounded-none border-4 border-dashed border-white/20 flex items-center justify-center mb-6">
                <Mail size={40} />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.3em]">Select a transmission to view content</p>
            </div>
          )}
        </div>
        </>
        )}
      </GlassCard>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-black/60">
          <GlassCard className="w-full max-w-2xl rounded-none border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-none text-blue-400">
                  <Plus size={18} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">New Transmission</h2>
              </div>
              <button onClick={() => { setIsComposeOpen(false); setCustomAttachments([]); setUploadingFiles([]); setSendError(''); }} className="text-slate-500 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">
                Cancel
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {/* Switch between Editor and Preview */}
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-none mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Mode</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`px-3 py-1.5 rounded-none text-xs font-black uppercase tracking-wide transition-all ${!showPreview ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={`px-3 py-1.5 rounded-none text-xs font-black uppercase tracking-wide transition-all ${showPreview ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Branded Preview
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Sender (IR Committee Member)</label>
                <select
                  className="w-full bg-white/[0.03] border border-white/5 rounded-none px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                  value={composeSender}
                  onChange={(e) => setComposeSender(e.target.value)}
                >
                  <option value="" className="bg-slate-900 text-slate-300">Default (Beauty of Cloud 2.0)</option>
                  {IR_MEMBERS.map((member) => (
                    <option key={member} value={member} className="bg-slate-900 text-white">
                      {member} ({member.toLowerCase().replace(/\s+/g, '.')}@beautyofcloud.com)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Recipient Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="delegate@example.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-none px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                />
              </div>

              {/* Optional CC/BCC Fields */}
              <div className="pt-2">
                <button 
                  type="button"
                  onClick={() => setShowCcBcc(!showCcBcc)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-all flex items-center gap-1 mb-2"
                >
                  {showCcBcc ? 'Hide CC / BCC' : 'Show CC / BCC'}
                </button>
                
                {showCcBcc && (
                  <div className="space-y-4 border-l border-white/5 pl-4 ml-1 my-3 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CC Addresses (comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="cc-recipient@example.com"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-none px-6 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        value={composeCc}
                        onChange={(e) => setComposeCc(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">BCC Addresses (comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="bcc-recipient@example.com"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-none px-6 py-3.5 text-white outline-none focus:border-blue-500/50 transition-all"
                        value={composeBcc}
                        onChange={(e) => setComposeBcc(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject Protocol</label>
                <input 
                  type="text" 
                  required
                  placeholder="RE: Cloud Ideathon Registration"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-none px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all font-bold"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message Content</label>
                {showPreview ? (
                  <div className="rounded-none border border-white/5 overflow-hidden bg-[#020617]" style={{ height: '420px' }}>
                    <iframe
                      srcDoc={composeSender ? getLightTemplate(formatContentForPreview(composeContent), composeSender, typeof window !== 'undefined' ? window.location.origin : undefined) : getBaseTemplate(formatContentForPreview(composeContent), typeof window !== 'undefined' ? window.location.origin : undefined)}
                      sandbox="allow-same-origin"
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                      title="Email Preview"
                    />
                  </div>
                ) : (
                  <textarea 
                    required
                    rows={8}
                    placeholder="Type your secure message here..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-none px-6 py-6 text-white outline-none focus:border-blue-500/50 transition-all resize-none leading-relaxed"
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                  />
                )}
              </div>

              <div className="flex items-center gap-3 px-2">
                <input 
                  type="checkbox" 
                  id="attachInvitation"
                  className="w-4 h-4 rounded-none border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500 transition-all"
                  checked={attachInvitation}
                  onChange={(e) => setAttachInvitation(e.target.checked)}
                />
                <label htmlFor="attachInvitation" className="text-xs font-bold text-slate-400 cursor-pointer hover:text-white transition-all">
                  Attach Official Invitation (Speaker Image)
                </label>
              </div>

              {/* Dynamic File Attachments Selector */}
              <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom Attachments</span>
                  </div>
                  <label className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-all cursor-pointer flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-none">
                    <Plus size={14} />
                    <span>Upload File</span>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>

                {attachmentError && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-2">
                    <AlertCircle size={12} />
                    {attachmentError}
                  </p>
                )}

                {uploadingFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {uploadingFiles.map(f => (
                      <div key={f.id} className="flex items-center justify-between bg-blue-500/5 border border-blue-500/10 px-3 py-2 rounded-none text-xs">
                        <span className="text-slate-300 font-medium truncate max-w-[180px]">{f.filename}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 bg-white/5 rounded-none overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${f.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-blue-400 w-8 text-right">{Math.round(f.progress)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {customAttachments.length > 0 && (
                  <div className="space-y-2 mt-2 max-h-36 overflow-y-auto custom-scrollbar">
                    {customAttachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/[0.03] border border-white/5 px-3 py-2 rounded-none text-xs">
                        <span className="text-slate-300 font-medium truncate max-w-[280px]">{file.filename}</span>
                        <button 
                          type="button" 
                          onClick={() => removeAttachment(idx)} 
                          className="text-slate-500 hover:text-red-400 transition-all font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadingFiles.length === 0 && customAttachments.length === 0 && (
                  <div className="text-[11px] text-slate-500 italic mt-1 pl-1">
                    No custom attachments added
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {sendError && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1.5">
                    <AlertCircle size={12} />
                    {sendError}
                  </p>
                )}
                <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={sending || uploadingFiles.length > 0}
                  className="bg-white text-black px-10 py-4 rounded-none font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Execute Transmission
                </button>
                </div>
              </div>
                </form>
              </div>
            </GlassCard>
          </div>
      )}

    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-none transition-all group ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300 border border-transparent'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-none bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />}
    </button>
  );
}
