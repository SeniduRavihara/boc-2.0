'use client';

import { useState, useEffect } from 'react';
import { 
  getSessions, 
  createSession, 
  updateSession, 
  removeSession, 
  checkAndInitializeUser 
} from "@/firebase/api";
import { useAuth } from "@/context/AuthContext";
import { Session } from "@/types";
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
  Tag
} from "lucide-react";
import Link from 'next/link';

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  aws: { label: 'AWS Workshop', color: 'text-orange-500 border-orange-500/30 bg-orange-500/5' },
  gcp: { label: 'GCP Workshop', color: 'text-blue-500 border-blue-500/30 bg-blue-500/5' },
  comp: { label: 'Competition', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' },
  'dmz-light': { label: 'DMZ Light Activity', color: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5' },
  dmz: { label: 'Exam Blackout', color: 'text-rose-500 border-rose-500/30 bg-rose-500/5' },
  finale: { label: 'Finale', color: 'text-purple-500 border-purple-500/30 bg-purple-500/5' },
};

const DEFAULT_TYPE_COLOR = 'text-slate-400 border-slate-700 bg-slate-800/20';

const COMMON_MODES = ['Online', 'Physical', 'Hybrid', 'Blocked'];

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
    date: new Date().toLocaleDateString(),
    time: '07:00 PM',
    mode: 'Online',
    title: ''
  });

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const role = await checkAndInitializeUser(user.uid, user.email, user.displayName);
        if (role === 'admin') {
          setIsAdmin(true);
          const data = await getSessions();
          setSessions(data.sort((a, b) => a.date.localeCompare(b.date)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  const handleAddSession = async () => {
    if (!newSession.title) return;
    setActionLoading('adding');
    try {
      const docRef = await createSession(newSession);
      const addedSession = { id: docRef.id, ...newSession };
      setSessions(prev => [...prev, addedSession].sort((a, b) => a.date.localeCompare(b.date)));
      setIsAdding(false);
      setNewSession({
        type: 'aws',
        ref: 'S1',
        date: new Date().toLocaleDateString(),
        time: '07:00 PM',
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
      setSessions(prev => prev.filter(s => s.id !== id));
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

  const handleUpdateField = async (id: string, field: keyof Session, value: string) => {
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
    return TYPE_CONFIG[type.toLowerCase()]?.color || DEFAULT_TYPE_COLOR;
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
        <p className="text-slate-400 text-center max-w-md">You do not have administrative privileges to manage the event schedule.</p>
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
          <p className="text-slate-400 text-sm mt-1">Manage event timelines using text inputs for maximum flexibility.</p>
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

      <datalist id="session-types">
        {Object.entries(TYPE_CONFIG).map(([key, info]) => (
          <option key={key} value={key}>{info.label}</option>
        ))}
      </datalist>

      <datalist id="session-modes">
        {COMMON_MODES.map(mode => (
          <option key={mode} value={mode} />
        ))}
      </datalist>

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
                placeholder="e.g. AWS Workshop - Intro to S3"
                value={newSession.title}
                onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Type (Type anything or select)</label>
              <input 
                list="session-types"
                value={newSession.type}
                onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Reference (e.g. S1, W2)</label>
              <input 
                type="text" 
                value={newSession.ref}
                onChange={(e) => setNewSession({...newSession, ref: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Date (Textual)</label>
              <input 
                type="text" 
                placeholder="e.g. May 12, 2026"
                value={newSession.date}
                onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Time (Textual)</label>
              <input 
                type="text" 
                placeholder="e.g. 07:00 PM"
                value={newSession.time}
                onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Mode</label>
              <input 
                list="session-modes"
                value={newSession.mode}
                onChange={(e) => setNewSession({...newSession, mode: e.target.value})}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
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
                title="Reference ID"
              />
              <div className="relative">
                <input 
                  list="session-types"
                  value={session.type}
                  onChange={(e) => handleUpdateField(session.id, 'type', e.target.value)}
                  className={`w-32 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-transparent focus:outline-none focus:border-blue-500 transition-colors ${getTypeStyle(session.type)}`}
                  title="Session Type (Type anything)"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <input 
                className="w-full bg-transparent border-none text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-lg px-2 -mx-2 transition-all"
                value={session.title}
                onChange={(e) => handleUpdateField(session.id, 'title', e.target.value)}
                placeholder="Session Title"
              />
              <div className="flex flex-wrap items-center gap-6 text-slate-500">
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group/input">
                  <Calendar size={14} className="text-slate-600 group-hover/input:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    value={session.date}
                    onChange={(e) => handleUpdateField(session.id, 'date', e.target.value)}
                    className="bg-transparent border-none text-slate-400 focus:outline-none p-0 text-xs w-32"
                    placeholder="Date..."
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group/input">
                  <Clock size={14} className="text-slate-600 group-hover/input:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    value={session.time}
                    onChange={(e) => handleUpdateField(session.id, 'time', e.target.value)}
                    className="bg-transparent border-none text-slate-400 focus:outline-none p-0 text-xs w-24"
                    placeholder="Time..."
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group/input">
                  <MapPin size={14} className="text-slate-600 group-hover/input:text-blue-500 transition-colors" />
                  <input 
                    list="session-modes"
                    value={session.mode}
                    onChange={(e) => handleUpdateField(session.id, 'mode', e.target.value)}
                    className="bg-transparent border-none text-slate-400 focus:outline-none p-0 text-xs w-24 cursor-text"
                    placeholder="Mode..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => handleDeleteSession(session.id)}
                className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Delete Session"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {sessions.length === 0 && !loading && (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
            <Calendar className="mx-auto h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">No sessions found</h3>
            <p className="text-slate-600 text-sm mt-1">Start by adding your first event session.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-bold text-sm"
            >
              Add First Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
