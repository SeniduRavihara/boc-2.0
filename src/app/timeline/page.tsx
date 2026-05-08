'use client';
// import './page.module.css'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { DM_Mono, Sora } from 'next/font/google';
import { checkAndInitializeUser, createSession, getSessions, removeSession, updateSession } from "@/firebase/api";
import { useAuth } from "@/context/AuthContext";

type SessionType = 'aws' | 'gcp' | 'comp' | 'dmz-light' | 'dmz' | 'finale';
type Mode = 'Online' | 'Physical' | 'Hybrid' | 'Blocked';
type ExportType = 'readme' | 'json' | 'markdown' | null;
type Role = 'admin' | 'user';

interface Session {
  id: string;
  type: SessionType;
  ref: string;
  date: string;
  time: string;
  mode: Mode;
  title: string;
}

const TYPES: Record<SessionType, { label: string; color: string; modeDefault: Mode }> = {
  aws: { label: 'AWS Workshop', color: 'badge-aws', modeDefault: 'Online' },
  gcp: { label: 'GCP Workshop', color: 'badge-gcp', modeDefault: 'Physical' },
  comp: { label: 'Competition', color: 'badge-comp', modeDefault: 'Online' },
  'dmz-light': { label: 'DMZ Light Activity', color: 'badge-dmz-light', modeDefault: 'Online' },
  dmz: { label: 'Exam Blackout', color: 'badge-dmz', modeDefault: 'Blocked' },
  finale: { label: 'Finale', color: 'badge-finale', modeDefault: 'Physical' },
};

const DEFAULT_SESSIONS: Session[] = [];


const MODE_OPTIONS: Mode[] = ['Online', 'Physical', 'Hybrid', 'Blocked'];

const sora = Sora({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

const SESSION_TYPE_CLASSES: Record<SessionType, string> = {
  aws: 'bg-[linear-gradient(90deg,rgba(255,153,0,0.12)_0_6px,#141920_6px)] border-[#FF9900]/35',
  gcp: 'bg-[linear-gradient(90deg,rgba(66,133,244,0.12)_0_6px,#141920_6px)] border-[#4285F4]/35',
  comp: 'bg-[linear-gradient(90deg,rgba(52,168,83,0.12)_0_6px,#141920_6px)] border-[#34A853]/35',
  'dmz-light': 'bg-[linear-gradient(90deg,rgba(251,188,4,0.10)_0_6px,#141920_6px)] border-[#FBBC04]/35',
  dmz: 'bg-[linear-gradient(90deg,rgba(234,67,53,0.10)_0_6px,#141920_6px)] border-[#EA4335]/35',
  finale: 'bg-[linear-gradient(90deg,rgba(155,93,229,0.12)_0_6px,#141920_6px)] border-[#9b5de5]/35',
};

function cloneSessions(sessions: Session[]) {
  return JSON.parse(JSON.stringify(sessions)) as Session[];
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr || dateStr === "Click to edit") return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split('T')[0];
}

function formatTimeForInput(timeStr: string): string {
  if (!timeStr || timeStr === "7:00 PM") return "";
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    let hour = parseInt(match[1]);
    const min = match[2];
    if (match[3].toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (match[3].toUpperCase() === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${min}`;
  }
  return timeStr;
}

function generateMarkdown(sessions: Session[]) {
  let md = `# Beauty of Cloud 2.0 — Cloud Ideathon\n`;
  md += `**Sri Lanka's Inter-University Cloud Computing Competition**\n\n`;
  md += `> April – September 2025 · AWS + GCP · 6 Workshops + Competition\n\n`;
  md += `---\n\n## Event Schedule\n\n`;
  md += `| # | Date | Time | Mode | Session / Activity | Type |\n`;
  md += `|---|------|------|------|--------------------|------|\n`;
  sessions.forEach((s) => {
    md += `| ${s.ref} | ${s.date} | ${s.time} | ${s.mode} | ${s.title} | ${TYPES[s.type].label} |\n`;
  });
  md += `\n---\n\n## Legend\n\n`;
  md += `- **AWS Workshop** — Online sessions covering AWS cloud services\n`;
  md += `- **GCP Workshop** — Physical sessions covering Google Cloud Platform\n`;
  md += `- **Competition** — Ideathon competition rounds\n`;
  md += `- **DMZ Light Activity** — Low-intensity online engagement during exam period\n`;
  md += `- **Exam Blackout** — No events scheduled (exam conflict)\n`;
  md += `- **Finale** — Grand finale event with awards\n`;
  return md;
}

function generateReadme(sessions: Session[]) {
  const sessionsAws = sessions.filter((s) => s.type === 'aws');
  const sessionsGcp = sessions.filter((s) => s.type === 'gcp');
  const sessionsComp = sessions.filter((s) => s.type === 'comp');
  const sessionsDmz = sessions.filter((s) => s.type === 'dmz-light');

  return `# Beauty of Cloud 2.0 — Cloud Ideathon`
}

function generateJSON(sessions: Session[]) {
  return JSON.stringify({ event: 'Beauty of Cloud 2.0', year: 2025, sessions }, null, 2);
}

//let role: Role = 'user';

export default function TimelinePage() {
  // const isAdmin = role === 'admin';
  const [exportType, setExportType] = useState<ExportType>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragSrcRef = useRef<number | null>(null);
  const debounceRef = useRef<Record<string, NodeJS.Timeout>>({});
  const pendingUpdates = useRef<Record<string, Partial<Session>>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingSession, setAddingSession] = useState(false);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [updatingSession, setUpdatingSession] = useState<string | null>(null);
  const [role, setRole] = useState<Role>('user');
  const { user } = useAuth();
  const isAdmin = role === 'admin';


  useEffect(() => {
    const initRole = async () => {
      if (!user) {
        setRole('user');
        return;
      }

      try {
        const currentRole = await checkAndInitializeUser(user.uid, user.email, user.displayName);
        setRole(currentRole as Role);
      } catch (err) {
        console.error("Error checking user role:", err);
        setRole('user');
      }
    };

    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        console.error("Error loading sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    initRole();
  }, [user]);

  const counts = useMemo(() => {
    return sessions.reduce(
      (acc, s) => ({
        ...acc,
        [s.type]: (acc[s.type] ?? 0) + 1,
      }),
      {
        aws: 0,
        gcp: 0,
        comp: 0,
        'dmz-light': 0,
        dmz: 0,
        finale: 0,
      } as Record<SessionType, number>,
    );
  }, [sessions]);

  const exportContent = useMemo(() => {
    if (exportType === 'readme') return generateReadme(sessions);
    if (exportType === 'json') return generateJSON(sessions);
    if (exportType === 'markdown') return generateMarkdown(sessions);
    return '';
  }, [exportType, sessions]);

  const addSession = useCallback(async (type: SessionType) => {
    if (!isAdmin || addingSession) return;

    setAddingSession(true);
    try {
      const newSession = {
        type,
        ref: "—",
        date: "Click to edit",
        time: "7:00 PM",
        mode: TYPES[type].modeDefault as any,
        title: `New ${TYPES[type].label}`,
      };

      const docRef = await createSession(newSession);

      setSessions((prev) => [
        ...prev,
        { id: docRef.id, ...newSession },
      ]);
    } catch (err) {
      console.error("Error adding session:", err);
    } finally {
      setAddingSession(false);
    }
  }, [isAdmin, addingSession]);

  const deleteSession = useCallback(async (id: string) => {
    if (!isAdmin || deletingSession) return;

    setDeletingSession(id);
    try {
      await removeSession(id);

      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting session:", err);
    } finally {
      setDeletingSession(null);
    }
  }, [isAdmin, deletingSession]);

  const updateField = useCallback(<K extends keyof Session>(
    id: string,
    field: K,
    value: Session[K]
  ) => {
    if (!isAdmin) return;

    // Update local state immediately
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, [field]: value } : session
      )
    );

    // Batch pending updates
    pendingUpdates.current[id] = { ...pendingUpdates.current[id], [field]: value };

    // Debounce the DB update
    if (debounceRef.current[id]) clearTimeout(debounceRef.current[id]);
    debounceRef.current[id] = setTimeout(async () => {
      const data = pendingUpdates.current[id];
      if (!data) {
        delete debounceRef.current[id];
        return;
      }

      setUpdatingSession(id);
      try {
        await updateSession(id, data as any);
        delete pendingUpdates.current[id];
      } catch (err) {
        console.error("Error updating session:", err);
      } finally {
        setUpdatingSession(null);
        delete debounceRef.current[id];
      }
    }, 500);
  }, [isAdmin]);

  const handleDragStart = (idx: number) => {
    if (!isAdmin) return;
    dragSrcRef.current = idx;
  };

  const handleDragEnd = () => {
    if (!isAdmin) return;
    dragSrcRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, idx: number) => {
    if (!isAdmin) return;
    event.preventDefault();
    setDragOverIndex(idx);
  };

  const handleDragLeave = () => {
    if (!isAdmin) return;
    setDragOverIndex(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, idx: number) => {
    if (!isAdmin) return;
    event.preventDefault();
    const source = dragSrcRef.current;
    if (source !== null && source !== idx) {
      setSessions((prev) => {
        const next = [...prev];
        const [moved] = next.splice(source, 1);
        next.splice(idx, 0, moved);
        return next;
      });
    }
    setDragOverIndex(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-transparent">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 animate-pulse">
          Fetching meeting records...
        </p>
      </div>
    );
  }

  const resetDefault = () => {
    if (!isAdmin) return;
    if (confirm('Reset to default plan? All edits will be lost.')) {
      setSessions(cloneSessions(DEFAULT_SESSIONS));
    }
  };

  const openExport = (type: ExportType) => {
    setExportType(type);
    setPanelOpen(true);
  };

  const closeExport = () => setPanelOpen(false);

  const copyExport = async () => {
    await navigator.clipboard.writeText(exportContent);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 1500);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(generateMarkdown(sessions));
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 1500);
  };

  return (
    <main className={`${sora.className}  min-h-screen bg-[#0c0f14] text-[#e8edf5]`}>
      <div className="px-12 pt-8 pb-6 border-b border-[#2a3547] flex flex-wrap gap-5 justify-between items-start">
        <div className="p-2">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">☁ Beauty of Cloud 2.0 — Cloud Ideathon</h1>
          <p className={`${dmMono.className} text-[11px] text-[#7a8ba6] mt-1`}>
            Sri Lanka · Inter-University Cloud Competition · April – September 2025 · Editable Event Planner
          </p>
        </div>

        <div className="flex flex-wrap p-2 gap-2.5 items-center">
          <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#374560] bg-[#1c2330] text-[#e8edf5] transition-all duration-150 tracking-[0.03em] hover:bg-[#2a3547] hover:border-[#374560]`} type="button" onClick={resetDefault}>
            ↺ Reset to default
          </button>
          <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#374560] bg-[#1c2330] text-[#e8edf5] transition-all duration-150 tracking-[0.03em] hover:bg-[#2a3547] hover:border-[#374560]`} type="button" onClick={() => openExport('readme')}>
            Export README
          </button>
          <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#374560] bg-[#1c2330] text-[#e8edf5] transition-all duration-150 tracking-[0.03em] hover:bg-[#2a3547] hover:border-[#374560]`} type="button" onClick={() => openExport('json')}>
            Export JSON
          </button>
          <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#374560] bg-[#1c2330] text-[#e8edf5] transition-all duration-150 tracking-[0.03em] hover:bg-[#2a3547] hover:border-[#374560]`} type="button" onClick={() => openExport('markdown')}>
            Export Markdown
          </button>
          <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#FF9900] bg-[#FF9900] text-black font-medium transition-all duration-150 tracking-[0.03em] hover:bg-[#e68a00]`} type="button" onClick={copyAll}>
            {copyStatus === 'copied' ? '✓ Copied!' : 'Copy all'}
          </button>
        </div>
      </div>

      <div className="px-12 py-3  border-b border-[#2a3547] flex flex-wrap gap-8">
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#FF9900' }}>{counts.aws}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">AWS Sessions</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#4285F4' }}>{counts.gcp}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">GCP Sessions</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#34A853' }}>{counts.comp}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">Competition Rounds</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#FBBC04' }}>{counts['dmz-light']}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">DMZ Activities</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#EA4335' }}>{counts.dmz}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">Blocked Periods</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#9b5de5' }}>{counts.finale}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">Finale Days</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${dmMono.className} text-[18px] font-semibold`} style={{ color: '#e8edf5' }}>{sessions.length}</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-[#4a5870]">Total Events</div>
        </div>
      </div>

      {isAdmin && (

        <div className="px-10 py-4 border-b border-[#2a3547] flex flex-wrap gap-5 items-center">
          <span className={`${dmMono.className} text-[11px] text-[#4a5870]`}>TYPE:</span>
          {Object.entries(TYPES).map(([key, type]) => (
            <div key={key} className={`${dmMono.className} flex items-center gap-1.5 text-[11px] text-[#7a8ba6]`}>
              <div className="w-2.5 h-2.5 rounded-[3px] flex-shrink-0" style={{ background: key === 'aws' ? '#FF9900' : key === 'gcp' ? '#4285F4' : key === 'comp' ? '#34A853' : key === 'dmz-light' ? '#FBBC04' : key === 'dmz' ? '#EA4335' : '#9b5de5' }} />
              {type.label}
            </div>
          ))}
          <div className="w-px h-4 bg-[#2a3547] mx-1" />
          <span className={`${dmMono.className} text-[11px] text-[#4a5870]`}>MODE:</span>
          <div className={`${dmMono.className} flex items-center gap-1.5 text-[11px] text-[#7a8ba6]`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" /> Online
          </div>
          <div className={`${dmMono.className} flex items-center gap-1.5 text-[11px] text-[#7a8ba6]`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" /> Physical
          </div>
          <div className={`${dmMono.className} flex items-center gap-1.5 text-[11px] text-[#7a8ba6]`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" /> Blocked
          </div>
        </div>
      )}

      {isAdmin && (

        <div className="px-10 py-3.5 border-b border-[#2a3547] flex flex-wrap gap-2.5 items-center">
          <span className={`${dmMono.className} text-[11px] text-[#4a5870]`}>+ ADD ROW:</span>
          <button className={`${dmMono.className} text-[11px] px-3 py-1.5 rounded-[5px] border border-[#FF9900] bg-transparent text-[#FF9900] transition-all duration-150 tracking-[0.02em] hover:bg-[rgba(255,153,0,0.12)] disabled:opacity-50 disabled:cursor-not-allowed`} type="button" disabled={addingSession} onClick={() => addSession('aws')}>
            {addingSession ? 'Adding...' : 'AWS Workshop'}
          </button>
          <button className={`${dmMono.className} text-[11px] px-3 py-1.5 rounded-[5px] border border-[#4285F4] bg-transparent text-[#4285F4] transition-all duration-150 tracking-[0.02em] hover:bg-[rgba(66,133,244,0.12)] disabled:opacity-50 disabled:cursor-not-allowed`} type="button" disabled={addingSession} onClick={() => addSession('gcp')}>
            {addingSession ? 'Adding...' : 'GCP Workshop'}
          </button>
          <button className={`${dmMono.className} text-[11px] px-3 py-1.5 rounded-[5px] border border-[#34A853] bg-transparent text-[#34A853] transition-all duration-150 tracking-[0.02em] hover:bg-[rgba(52,168,83,0.12)] disabled:opacity-50 disabled:cursor-not-allowed`} type="button" disabled={addingSession} onClick={() => addSession('comp')}>
            {addingSession ? 'Adding...' : 'Competition Round'}
          </button>
          <button className={`${dmMono.className} text-[11px] px-3 py-1.5 rounded-[5px] border border-[#FBBC04] bg-transparent text-[#FBBC04] transition-all duration-150 tracking-[0.02em] hover:bg-[rgba(251,188,4,0.10)] disabled:opacity-50 disabled:cursor-not-allowed`} type="button" disabled={addingSession} onClick={() => addSession('dmz-light')}>
            {addingSession ? 'Adding...' : 'DMZ Light Activity'}
          </button>
          <button className={`${dmMono.className} text-[11px] px-3 py-1.5 rounded-[5px] border border-[#EA4335] bg-transparent text-[#EA4335] transition-all duration-150 tracking-[0.02em] hover:bg-[rgba(234,67,53,0.10)] disabled:opacity-50 disabled:cursor-not-allowed`} type="button" disabled={addingSession} onClick={() => addSession('dmz')}>
            {addingSession ? 'Adding...' : 'Exam Blackout'}
          </button>
          <button className={`${dmMono.className} text-[11px] px-3 py-1.5 rounded-[5px] border border-[#9b5de5] bg-transparent text-[#9b5de5] transition-all duration-150 tracking-[0.02em] hover:bg-[rgba(155,93,229,0.12)] disabled:opacity-50 disabled:cursor-not-allowed`} type="button" disabled={addingSession} onClick={() => addSession('finale')}>
            {addingSession ? 'Adding...' : 'Finale'}
          </button>
        </div>
      )}

      <div className="px-12 pb-10 pt-5 flex flex-col gap-4">
        <div className="grid grid-cols-[36px_90px_140px_90px_120px_minmax(0,1fr)_110px_38px] mt-8 gap-[10px] mb-[6px]">
          <div />
          <div className={`${dmMono.className} text-[10px] uppercase tracking-[0.08em] text-[#4a5870] px-3 py-1`}>Ref#</div>
          <div className={`${dmMono.className} text-[10px] uppercase tracking-[0.08em] text-[#4a5870] px-3 py-1`}>Date</div>
          <div className={`${dmMono.className} text-[10px] uppercase tracking-[0.08em] text-[#4a5870] px-3 py-1`}>Time</div>
          <div className={`${dmMono.className} text-[10px] uppercase tracking-[0.08em] text-[#4a5870] px-3 py-1`}>Mode</div>
          <div className={`${dmMono.className} text-[10px] uppercase tracking-[0.08em] text-[#4a5870] px-3 py-1`}>Session / Activity</div>
          <div className={`${dmMono.className} text-[10px] uppercase tracking-[0.08em] text-[#4a5870] px-3 py-1`}>Type</div>
          <div />
        </div>
        <div id="timeline" className="flex flex-col gap-6 p-10 mt-[-30px] align-items-center justify-content-center">
          {[...sessions]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((session, idx) => (
              <div
                key={session.id}
                className={`grid grid-cols-[36px_minmax(0,1fr)] mb-2 rounded-[8px] border border-[#2a3547] bg-[#141920] transition-colors duration-150 relative hover:border-[#374560] ${SESSION_TYPE_CLASSES[session.type]} ${dragOverIndex === idx ? 'border-[#FF9900] shadow-[0_0_0_1px_rgba(255,153,0,0.35)]' : ''}`}
                draggable={isAdmin}
                onDragStart={isAdmin ? () => handleDragStart(idx) : undefined}
                onDragEnd={isAdmin ? handleDragEnd : undefined}
                onDragOver={isAdmin ? (event) => handleDragOver(event, idx) : undefined}
                onDragLeave={isAdmin ? handleDragLeave : undefined}
                onDrop={isAdmin ? (event) => handleDrop(event, idx) : undefined}
              >
                {isAdmin ? (
                  <div className="flex items-center justify-center cursor-grab text-[#4a5870] text-base border-r border-[#2a3547] rounded-l-[8px] transition-colors duration-150 hover:bg-[#1c2330] hover:text-[#7a8ba6]" title="Drag to reorder">
                    ⠿
                  </div>
                ) : (
                  <div className="w-[36px]" />
                )}
                <div className="grid grid-cols-[90px_140px_90px_120px_minmax(0,1fr)_110px_38px] items-center min-h-[52px]">
                  <div className="px-3 py-2 border-r border-[#2a3547] h-full flex items-center">
                    <input
                      className={`${dmMono.className} w-full bg-transparent border-none outline-none text-[11px] text-[#e8edf5] resize-none cursor-text focus:bg-[#1c2330] focus:rounded-[4px] focus:px-1 focus:py-1`}
                      readOnly={!isAdmin}
                      value={session.ref}
                      placeholder="S1"
                      title="Reference ID"
                      onChange={(event) => updateField(session.id, 'ref', event.target.value)}
                    />
                  </div>
                  <div className="px-3 py-2 border-r border-[#2a3547] h-full flex items-center">
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className={`${dmMono.className} w-full bg-transparent border-none outline-none text-[11px] text-[#e8edf5] resize-none cursor-text focus:bg-[#1c2330] focus:rounded-[4px] focus:px-1 focus:py-1`}
                      readOnly={!isAdmin}
                      value={formatDateForInput(session.date)}
                      placeholder="Mon, Jan 1"
                      title="Date"
                      onChange={(event) =>
                        updateField(
                          session.id,
                          'date',
                          event.target.value || "Click to edit"
                        )
                      }
                    />
                  </div>
                  <div className="px-3 py-2 border-r border-[#2a3547] h-full flex items-center">
                    <input
                      type="time"
                      className={`${dmMono.className} w-full bg-transparent border-none outline-none text-[11px] text-[#e8edf5] resize-none cursor-text focus:bg-[#1c2330] focus:rounded-[4px] focus:px-1 focus:py-1`}
                      readOnly={!isAdmin}
                      value={formatTimeForInput(session.time)}
                      placeholder="7:00 PM"
                      title="Time"
                      onChange={(event) => updateField(session.id, 'time', event.target.value || "7:00 PM")}
                    />
                  </div>
                  <div className="px-3 py-2 border-r border-[#2a3547] h-full flex items-center">
                    <select
                      className={`${dmMono.className} w-full bg-transparent border-none outline-none text-[11px] text-[#e8edf5] cursor-pointer focus:bg-[#1c2330] focus:rounded-[4px] focus:px-1 focus:py-1`}
                      disabled={!isAdmin}
                      title="Mode"
                      value={session.mode}
                      onChange={(event) => updateField(session.id, 'mode', event.target.value as Mode)}
                    >
                      {MODE_OPTIONS.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="px-3 py-2 border-r border-[#2a3547] h-full flex items-center">
                    <input
                      className={`${dmMono.className} w-full bg-transparent border-none outline-none text-[11px] text-[#e8edf5] resize-none cursor-text focus:bg-[#1c2330] focus:rounded-[4px] focus:px-1 focus:py-1 font-sans text-[13px] font-medium`}
                      readOnly={!isAdmin}
                      value={session.title}
                      placeholder="Session title..."
                      title="Session title"
                      onChange={(event) => updateField(session.id, 'title', event.target.value)}
                    />
                  </div>
                  <div className="px-3 py-2 border-r border-[#2a3547] h-full flex items-center">
                    <select
                      className={`${dmMono.className} w-full bg-transparent border-none outline-none text-[11px] text-[#e8edf5] cursor-pointer focus:bg-[#1c2330] focus:rounded-[4px] focus:px-1 focus:py-1`}
                      disabled={!isAdmin}
                      title="Type"
                      value={session.type}
                      onChange={(event) => updateField(session.id, 'type', event.target.value as SessionType)}
                    >
                      {Object.entries(TYPES).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-center cursor-pointer text-[#4a5870] transition-colors duration-150 p-2 hover:text-[#EA4335]" title={isAdmin ? 'Delete row' : undefined} onClick={isAdmin ? () => deleteSession(session.id) : undefined}>
                    {isAdmin ? (deletingSession === session.id ? '⏳' : '✕') : ''}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={`fixed inset-0 z-50 p-5 bg-black/75 ${panelOpen ? 'flex' : 'hidden'} items-center justify-center`} onClick={(event) => event.target === event.currentTarget && closeExport()}>
        <div className="bg-[#141920] border border-[#374560] rounded-[12px] p-6 max-w-[700px] w-full max-h-[80vh] overflow-y-auto">
          <h3 className="text-[15px] font-semibold mb-1">{exportType === 'readme' ? 'README.md' : exportType === 'json' ? 'event-plan.json' : 'timeline.md'}</h3>
          <p className="text-[12px] text-[#7a8ba6] mb-4">
            {exportType === 'readme'
              ? 'Paste into your project root as README.md'
              : exportType === 'json'
                ? 'Full session data as JSON — import into other tools'
                : 'Markdown table — paste into any doc or GitHub wiki'}
          </p>
          <pre className={`${dmMono.className} bg-[#0c0f14] border border-[#2a3547] rounded-[6px] p-4 text-[11px] text-[#e8edf5] whitespace-pre-wrap overflow-y-auto max-h-[400px] leading-7`}>{exportContent}</pre>
          <div className="flex gap-2.5 mt-4 justify-end">
            <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#374560] bg-[#1c2330] text-[#e8edf5] transition-all duration-150 tracking-[0.03em] hover:bg-[#2a3547] hover:border-[#374560]`} type="button" onClick={copyExport}>
              {copyStatus === 'copied' ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
            <button className={`${dmMono.className} text-[11px] px-3.5 py-2 rounded-[6px] border border-[#FF9900] bg-[#FF9900] text-black font-medium transition-all duration-150 tracking-[0.03em] hover:bg-[#e68a00]`} type="button" onClick={closeExport}>
              Close
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
