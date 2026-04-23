'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Inbox, Archive, Trash2, Search, Plus, Loader2, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getMessages, sendMail, markAsRead } from '@/app/actions/mailbox';
import { MailMessage, MailFolder } from '@/firebase/api';
import { format } from 'date-fns';

export default function EmailToolPage() {
  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [activeFolder]);

  const loadMessages = async () => {
    setLoading(true);
    const data = await getMessages(activeFolder);
    setMessages(data);
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const result = await sendMail({
      to: composeTo,
      subject: composeSubject,
      content: composeContent
    });

    if (result.success) {
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeContent('');
      if (activeFolder === 'sent') loadMessages();
    } else {
      alert("Protocol Failure: " + result.error);
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

  const filteredMessages = messages.filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.to_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Administrative <span className="text-blue-500">Mailbox</span></h1>
          <p className="text-slate-400 text-sm">Secure communications protocol v2.0</p>
        </div>
        <button 
          onClick={() => setIsComposeOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus size={18} />
          COMPOSE MESSAGE
        </button>
      </div>

      {/* Main Mailbox Interface */}
      <GlassCard className="flex-1 flex overflow-hidden border-white/5 rounded-[2.5rem]">
        
        {/* Navigation Sidebar */}
        <div className="w-64 border-r border-white/5 bg-white/[0.02] flex flex-col p-6 gap-2">
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
        </div>

        {/* Message List */}
        <div className="w-96 border-r border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search encrypted mail..." 
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] group relative ${selectedMessage?.id === msg.id ? 'bg-blue-500/[0.05]' : ''}`}
                >
                  {!msg.is_read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />}
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-black truncate max-w-[150px] ${!msg.is_read ? 'text-blue-400' : 'text-slate-400'}`}>
                      {msg.direction === 'incoming' ? msg.from_email : `To: ${msg.to_email}`}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {msg.createdAt && format(msg.createdAt.toDate(), 'HH:mm')}
                    </span>
                  </div>
                  <h4 className={`text-sm mb-1 truncate ${!msg.is_read ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {msg.content_text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content View */}
        <div className="flex-1 bg-white/[0.01] flex flex-col">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-10 border-b border-white/5 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-4">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black">
                      {selectedMessage.from_email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedMessage.from_email}</p>
                      <p className="text-xs text-slate-500">to {selectedMessage.to_email} · {selectedMessage.createdAt && format(selectedMessage.createdAt.toDate(), 'PPP p')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Archive size={18} /></button>
                  <button className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400 hover:text-red-400 transition-all"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div 
                  className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.content_html }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center mb-6">
                <Mail size={40} />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.3em]">Select a transmission to view content</p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
          <GlassCard className="w-full max-w-2xl rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Plus size={18} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">New Transmission</h2>
              </div>
              <button onClick={() => setIsComposeOpen(false)} className="text-slate-500 hover:text-white transition-all">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Recipient Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="delegate@example.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject Protocol</label>
                <input 
                  type="text" 
                  required
                  placeholder="RE: Cloud Ideathon Registration"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message Content</label>
                <textarea 
                  required
                  rows={8}
                  placeholder="Type your secure message here..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-6 text-white outline-none focus:border-blue-500/50 transition-all resize-none"
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button 
                  type="submit" 
                  disabled={sending}
                  className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Execute Transmission
                </button>
              </div>
            </form>
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
      className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all group ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300 border border-transparent'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />}
    </button>
  );
}
