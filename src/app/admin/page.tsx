"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Mail, 
  Users, 
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Calendar,
  UserPlus,
  Award,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';


const dashboardCards = [
  { 
    title: 'Ideathon Teams', 
    description: 'Manage registered competition teams and members.', 
    href: '/admin/teams', 
    icon: Award, 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  { 
    title: 'Registrations', 
    description: 'Monitor delegate profiles and registrations.', 
    href: '/admin/registrations', 
    icon: UserPlus, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  { 
    title: 'Quiz Management', 
    description: 'Create and organize interactive competitions.', 
    href: '/admin/quiz', 
    icon: Trophy, 
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  { 
    title: 'Email Tool', 
    description: 'Deploy announcements and session updates.', 
    href: '/admin/email-tool', 
    icon: Mail, 
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20'
  },
  { 
    title: 'Attendance', 
    description: 'Monitor session participation in real-time.', 
    href: '/admin/attendance', 
    icon: Users, 
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  { 
    title: 'Schedule', 
    description: 'Manage event timelines and sessions.', 
    href: '/admin/schedule', 
    icon: Calendar, 
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  { 
    title: 'Task Tracking', 
    description: 'Manage development tasks and team progress.', 
    href: '/admin/task-tracking', 
    icon: CheckSquare, 
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20'
  },
];

export default function AdminDashboardPage() {
  const [sessionNum, setSessionNum] = React.useState("1");
  const [zoomUrl, setZoomUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [message, setMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleUpdateZoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoomUrl.trim()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);
      
      // Generate attendance link using current origin with meetingUrl as query parameter
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://boc.ieeeusj.lk';
      const attendanceLink = `${origin}/attendance/${sessionNum}?meetingUrl=${encodeURIComponent(zoomUrl.trim())}`;
      setGeneratedLink(attendanceLink);
      
      setMessage({ type: 'success', text: `Stateless shareable URL generated successfully!` });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to generate URL. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 md:p-12 space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white tracking-tight"
          >
            Management Center
          </motion.h1>
          <p className="text-slate-500 font-medium mt-2">Welcome back. Everything is running smoothly.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Activity size={14} /> LIVE STATUS
          </div>
          <div className="flex items-center gap-2 px-4 py-2 text-slate-400 text-xs font-bold">
            <TrendingUp size={14} /> 124 ACTIVE TEAMS
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={card.href} className="block group">
              <GlassCard className={`p-8 border-slate-800/50 hover:bg-slate-900/30 transition-all duration-500 flex flex-col h-full group-hover:${card.border}`}>
                <div className={`w-14 h-14 ${card.bg} ${card.border} rounded-2xl flex items-center justify-center ${card.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <card.icon size={28} />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-black text-white">{card.title}</h2>
                    <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                  Open Controller <ChevronRight size={12} />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Secondary Tools - Interactive Zoom Link Uplink */}
      <div className="pt-8 space-y-6">
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Quick Access Tools</h3>
          <h4 className="text-2xl font-black text-white uppercase tracking-tight">Attendance Link Generator</h4>
        </div>

        <GlassCard className="p-8 md:p-12 border-slate-800/50 max-w-4xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <form onSubmit={handleUpdateZoom} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Session Number</label>
              <select
                value={sessionNum}
                onChange={(e) => setSessionNum(e.target.value)}
                className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 text-white outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="1">Session 1</option>
                <option value="2">Session 2</option>
                <option value="3">Session 3</option>
                <option value="4">Session 4</option>
                <option value="5">Session 5</option>
                <option value="6">Session 6</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Paste Zoom / Meeting URL</label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  value={zoomUrl}
                  onChange={(e) => setZoomUrl(e.target.value)}
                  className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 text-white outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <button 
                type="submit"
                disabled={isSubmitting || !zoomUrl.trim()}
                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>Generate Link</>
                )}
              </button>
            </div>
          </form>

          {/* Messages & Shareable link rendering */}
          {message && (
            <div className={`mt-6 p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <CheckCircle2 size={14} className="shrink-0" />
              {message.text}
            </div>
          )}

          {generatedLink && (
            <div className="mt-8 pt-8 border-t border-slate-900 space-y-4">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Shareable Student Attendance Portal Link</h5>
                <p className="text-slate-400 text-xs mt-1">Provide this link to students. They will be auto-marked and redirected straight to the Zoom meeting.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex-1 bg-slate-950/50 border border-slate-900 rounded-2xl px-6 py-4 flex items-center text-blue-400 font-mono text-sm break-all">
                  {generatedLink}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={handleCopyLink}
                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 transition-colors text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    {copied ? (
                      <><Check size={16} className="text-emerald-400" /> Copied</>
                    ) : (
                      <><Copy size={16} /> Copy Link</>
                    )}
                  </button>

                  <a 
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white rounded-2xl flex items-center justify-center"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

// Re-using icon for footer consistency
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
