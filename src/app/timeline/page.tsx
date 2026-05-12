'use client';

import { useEffect, useState } from 'react';
import { Sora, DM_Mono } from 'next/font/google';
import { checkAndInitializeUser, subscribeToSessions } from "@/firebase/api";
import { useAuth } from "@/context/AuthContext";
import { Session } from "@/types";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Loader2,
  Trophy,
  Table as TableIcon,
  GitCommit,
  Settings
} from "lucide-react";
import Link from 'next/link';

const sora = Sora({ subsets: ['latin'], weight: ['300', '400', '600', '800'], display: 'swap' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

// Style mapping for keywords found in type strings
const TYPE_STYLES: Record<string, { label: string; color: string; icon: string }> = {
  aws: { label: 'AWS Workshop', color: 'bg-orange-500', icon: '☁️' },
  gcp: { label: 'GCP Workshop', color: 'bg-blue-500', icon: '🌐' },
  comp: { label: 'Competition', color: 'bg-emerald-500', icon: '🏆' },
  'dmz-light': { label: 'DMZ Activity', color: 'bg-yellow-500', icon: '⚡' },
  dmz: { label: 'Exam Blackout', color: 'bg-rose-500', icon: '🔒' },
  finale: { label: 'Grand Finale', color: 'bg-purple-500', icon: '⭐' },
};

type ViewMode = 'timeline' | 'table';

export default function TimelinePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToSessions((data) => {
      setSessions(data.sort((a, b) => a.date.localeCompare(b.date)));
      setLoading(false);
    });

    const checkRole = async () => {
      if (user) {
        try {
          const role = await checkAndInitializeUser(user.uid, user.email, user.displayName);
          if (role === 'admin') setIsAdmin(true);
        } catch (err) {
          console.error("Error checking role:", err);
        }
      }
    };
    
    checkRole();
    return () => unsubscribe();
  }, [user]);

  const getStyleForType = (type: string) => {
    const key = type.toLowerCase();
    for (const [k, style] of Object.entries(TYPE_STYLES)) {
      if (key.includes(k)) return style;
    }
    return { label: type, color: 'bg-slate-700', icon: '🗓️' };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#020617]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing roadmap...</p>
      </div>
    );
  }

  return (
    <main className={`${sora.className} min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 pb-20`}>
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        {/* Header Section */}
        <div className="mb-16 sm:mb-24 text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-4">
            <Trophy size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Beauty of Cloud 2.0</span>
          </div>
          
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Roadmap</span>
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Follow the evolution of Beauty of Cloud 2.0. From foundational workshops to the grand finale of excellence.
          </p>

          {/* View Toggle */}
          <div className="flex justify-center pt-8 sm:pt-12">
            <div className="inline-flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl shadow-xl backdrop-blur-sm">
              <button 
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <GitCommit size={14} />
                Timeline
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <TableIcon size={14} />
                Table View
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'timeline' ? (
          /* TIMELINE VIEW */
          <div className="relative space-y-12 sm:space-y-16">
            <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-800 to-transparent left-[17px] md:left-1/2 md:-translate-x-px" />

            {sessions.map((session, idx) => {
              const style = getStyleForType(session.type);
              return (
                <div 
                  key={session.id} 
                  className={`relative flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-6 sm:gap-8`}
                >
                  <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-[24px] sm:top-[32px] w-4 h-4 rounded-full border-4 border-[#020617] bg-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />

                  <div className="w-full md:w-[45%] pl-10 md:pl-0">
                    <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 text-6xl sm:text-7xl opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                        {style.icon}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className={`${dmMono.className} text-[9px] sm:text-[10px] font-black px-2 py-1 bg-white/5 rounded border border-white/10 text-blue-400`}>
                          {session.ref}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full ${style.color} text-white shadow-sm shadow-black/20`}>
                          {session.type}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-5 sm:mb-8 group-hover:text-blue-400 transition-colors">
                        {session.title}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-bold text-slate-400">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500">
                            <Calendar size={14} />
                          </div>
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-bold text-slate-400">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500">
                            <Clock size={14} />
                          </div>
                          {session.time}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-bold text-slate-400">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500">
                            <MapPin size={14} />
                          </div>
                          {session.mode}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="hidden lg:block bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ref</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Event Session</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Date & Time</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Type</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sessions.map((session) => {
                      const style = getStyleForType(session.type);
                      return (
                        <tr key={session.id} className="group hover:bg-white/[0.03] transition-colors">
                          <td className="px-8 py-6">
                            <span className={`${dmMono.className} text-xs font-black text-blue-500 px-2.5 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20`}>
                              {session.ref}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{session.title}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <div className="text-[13px] font-bold text-slate-400 flex items-center gap-2">
                                <Calendar size={14} className="text-slate-600" />
                                {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                <Clock size={14} className="text-slate-600" />
                                {session.time}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${style.color} shadow-lg shadow-black/20`}>
                              {session.type}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                              <MapPin size={14} className="text-slate-600" />
                              {session.mode}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-4 px-2">
              {sessions.map((session) => {
                const style = getStyleForType(session.type);
                return (
                  <div key={session.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`${dmMono.className} text-[10px] font-black px-2 py-1 bg-white/5 rounded border border-white/10 text-blue-400`}>
                        {session.ref}
                      </span>
                      <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${style.color}`}>
                        {session.type}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-200">{session.title}</h4>
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <Calendar size={12} className="text-blue-500" />
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <Clock size={12} className="text-blue-500" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <MapPin size={12} className="text-blue-500" />
                        {session.mode}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
