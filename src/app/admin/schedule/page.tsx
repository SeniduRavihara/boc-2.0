'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getSessions, 
  createSession, 
  updateSession, 
  removeSession, 
  checkAndInitializeUser,
  subscribeToSessions
} from "@/firebase/api";
import { useAuth } from "@/context/AuthContext";
import { Session, SessionMode } from "@/types";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Type
} from "lucide-react";
import Link from 'next/link';

// Predefined styles for known type keywords
const TYPE_STYLES: Record<string, { color: string }> = {
  aws: { color: 'text-orange-500 border-orange-500/30 bg-orange-500/5' },
  gcp: { color: 'text-blue-500 border-blue-500/30 bg-blue-500/5' },
  comp: { color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' },
  'dmz-light': { color: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5' },
  dmz: { color: 'text-rose-500 border-rose-500/30 bg-rose-500/5' },
  finale: { color: 'text-purple-500 border-purple-500/30 bg-purple-500/5' },
};

const MODES: SessionMode[] = ['Online', 'Physical', 'Blocked'];

export default function AdminSchedulePage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Form State for adding
  const [isAdding, setIsAdding] = useState(false);
  const [newSession, setNewSession] = useState<Omit<Session, 'id'>>({
    type: 'aws',
    ref: 'S1',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    mode: 'Online',
    title: ''
  });

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      if (!user) return;
      try {
        const role = await checkAndInitializeUser(user.uid, user.email, user.displayName);
        if (role === 'admin') {
          setIsAdmin(true);
          unsubscribe = subscribeToSessions((data) => {
            setSessions(data.sort((a, b) => a.date.localeCompare(b.date)));
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleAddSession = async () => {
    if (!newSession.title) return;
    setActionLoading('adding');
    try {
      const docRef = await createSession(newSession);
      setIsAdding(false);
      setNewSession({
        type: 'aws',
        ref: 'S1',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        mode: 'Online',
        title: ''
      });
      showSavedIndicator(docRef.id);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    setActionLoading(id);
    try {
      await removeSession(id);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const showSavedIndicator = (id: string) => {
    setLastSaved(id);
    setTimeout(() => setLastSaved(null), 2000);
  };

  const handleUpdateField = async (id: string, field: keyof Session, value: any) => {
    // Optimistic update
    setSessions(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    
    try {
      await updateSession(id, { [field]: value });
      showSavedIndicator(id);
    } catch (err) {
      console.error(err);
      const data = await getSessions();
      setSessions(data.sort((a, b) => a.date.localeCompare(b.date)));
    }
  };

  const getTypeStyle = (type: string) => {
    const key = type.toLowerCase();
    for (const [k, style] of Object.entries(TYPE_STYLES)) {
      if (key.includes(k)) return style.color;
    }
    return 'text-slate-400 border-slate-700 bg-slate-800/50';
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h1 className="text-xl font-bold text-white">Access Denied</h1>
        <Link href="/" className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Schedule Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Manage event timelines and sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/timeline" 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-all font-bold text-sm"
          >
            <ExternalLink size={16} />
            Public Link
          </Link>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black text-sm shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            New Session
          </button>
        </div>
      </div>

      {/* Add Session Form */}
      {isAdding && (
        <div className="bg-[#0f172a] border border-blue-500/30 rounded-3xl p-8 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="text-blue-500" />
              Add New Session
            </h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Session Title</label>
              <input 
                type="text" 
                value={newSession.title}
                onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Type (e.g. AWS Workshop, Finale)</label>
              <input 
                type="text" 
                value={newSession.type}
                onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Reference (e.g. S1)</label>
              <input 
                type="text" 
                value={newSession.ref}
                onChange={(e) => setNewSession({...newSession, ref: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Date</label>
              <input 
                type="date" 
                value={newSession.date}
                onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Time</label>
              <input 
                type="time" 
                value={newSession.time}
                onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Mode</label>
              <select 
                value={newSession.mode}
                onChange={(e) => setNewSession({...newSession, mode: e.target.value as SessionMode})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              >
                {MODES.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleAddSession}
              disabled={actionLoading === 'adding'}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black"
            >
              {actionLoading === 'adding' ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Save Session
            </button>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`group bg-[#0f172a]/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center gap-6 relative ${actionLoading === session.id ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {lastSaved === session.id && (
              <div className="absolute top-2 right-12 flex items-center gap-1 text-[10px] font-bold text-emerald-500 animate-in fade-in slide-in-from-right-2 duration-300">
                <CheckCircle2 size={12} /> SAVED
              </div>
            )}

            <div className="flex items-center gap-4 min-w-[140px]">
              <input 
                type="text"
                value={session.ref}
                onChange={(e) => handleUpdateField(session.id, 'ref', e.target.value)}
                className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-blue-500 border border-slate-700 text-center focus:outline-none focus:border-blue-500 transition-colors"
              />
              <div className="relative">
                <input 
                  type="text"
                  value={session.type}
                  onChange={(e) => handleUpdateField(session.id, 'type', e.target.value)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-transparent focus:outline-none focus:border-blue-500 transition-all min-w-[100px] text-center ${getTypeStyle(session.type)}`}
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <input 
                className="w-full bg-transparent border-none text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-lg px-2 -mx-2 transition-all"
                value={session.title}
                onChange={(e) => handleUpdateField(session.id, 'title', e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-6 text-slate-500">
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
                  <Calendar size={14} className="text-slate-600" />
                  <input 
                    type="date"
                    value={session.date}
                    onChange={(e) => handleUpdateField(session.id, 'date', e.target.value)}
                    className="bg-transparent border-none text-slate-400 focus:outline-none p-0 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
                  <Clock size={14} className="text-slate-600" />
                  <input 
                    type="time"
                    value={session.time}
                    onChange={(e) => handleUpdateField(session.id, 'time', e.target.value)}
                    className="bg-transparent border-none text-slate-400 focus:outline-none p-0 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
                  <MapPin size={14} className="text-slate-600" />
                  <select 
                    value={session.mode}
                    onChange={(e) => handleUpdateField(session.id, 'mode', e.target.value)}
                    className="bg-transparent border-none text-slate-400 focus:outline-none p-0 text-xs cursor-pointer"
                  >
                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => handleDeleteSession(session.id)}
                className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
