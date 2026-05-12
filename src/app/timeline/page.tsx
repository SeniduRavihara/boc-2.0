'use client';

import { useEffect, useState } from 'react';
import { Sora, DM_Mono } from 'next/font/google';
import { getSessions, checkAndInitializeUser } from "@/firebase/api";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { LayoutDashboard, Loader2 } from 'lucide-react';

const sora = Sora({ subsets: ['latin'], weight: ['400', '600', '700', '800'], display: 'swap' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

export default function PublicTimelinePage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSessions();
        setSessions(data.sort((a, b) => a.date.localeCompare(b.date)));
        
        if (user) {
          const role = await checkAndInitializeUser(user.uid, user.email, user.displayName);
          if (role === 'admin') setIsAdmin(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className={`${sora.className} min-h-screen bg-[#020617] text-slate-200 py-12 px-4 md:px-8`}>
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Event Timeline</h1>
            <p className="text-slate-500 mt-2 font-medium">Official schedule for Beauty of Cloud 2.0</p>
          </div>
        </div>

        {/* Timeline Table */}
        <div className="relative overflow-x-auto border border-slate-800 rounded-3xl bg-slate-900/20 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ref</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Date & Time</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Session Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mode</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-6">
                    <span className={`${dmMono.className} text-blue-500 font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20`}>
                      {session.ref}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{session.date}</span>
                      <span className="text-slate-500 text-sm font-medium">{session.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="max-w-md">
                      <h3 className="font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                        {session.title}
                      </h3>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-semibold text-slate-400">
                      {session.mode}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400">
                      {session.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sessions.length === 0 && (
            <div className="py-20 text-center text-slate-600 font-bold">
              NO EVENTS SCHEDULED YET
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex justify-center pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
            © 2025 Beauty of Cloud · IEEE Student Branch of UoM
          </p>
        </div>
      </div>
    </main>
  );
}
