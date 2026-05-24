"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  ArrowRight, 
  Mail,
  Loader2,
  Video,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import MainFooter from '@/components/layout/MainFooter';
import { checkUserRegistration, markAttendance, checkAttendanceExists } from '@/firebase/api';

type PageState = 'init' | 'input' | 'checking' | 'confirmed' | 'redirecting';

export default function AttendancePage() {
  const { sessionId } = useParams() as { sessionId: string };
  const searchParams = useSearchParams();
  const meetingUrl = searchParams.get('meetingUrl') || "";

  const [pageState, setPageState] = useState<PageState>('init');
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  // On mount — check localStorage. If user is already known and registered, skip the form entirely.
  useEffect(() => {
    const autoCheck = async () => {
      try {
        const saved = localStorage.getItem('last_registered_user') || localStorage.getItem('quiz_user_general');
        if (!saved) {
          setPageState('input');
          return;
        }

        const localData = JSON.parse(saved);
        if (!localData.email) {
          setPageState('input');
          return;
        }

        // Robust check: always verify with Firestore to ensure the user still exists and is registered
        const registration = await checkUserRegistration(localData.email);
        if (!registration) {
          // User was deleted from DB
          localStorage.removeItem('last_registered_user');
          localStorage.removeItem('quiz_user_general');
          setPageState('input');
          return;
        }

        const isRegistered =
          registration.sessionIds?.includes(sessionId) ||
          registration.sessionId === sessionId;

        if (!isRegistered) {
          // Known user but not registered for this session — pre-fill email and show form
          setEmail(registration.email || "");
          setPageState('input');
          return;
        }

        // Refresh local cache with latest DB data
        localStorage.setItem('last_registered_user', JSON.stringify(registration));

        // Registered — mark attendance silently
        setEmail(registration.email);
        setUserName(registration.name || "");

        const exists = await checkAttendanceExists(registration.email, sessionId);
        if (exists) {
          setAlreadyMarked(true);
        } else {
          await markAttendance({
            sessionId,
            email: registration.email,
            userName: registration.name,
            organization: registration.organization || "",
          });
        }

        // Show confirmed card with button — user clicks to join
        setPageState('confirmed');
      } catch (err) {
        console.error("Auto-check failed:", err);
        setPageState('input');
      }
    };

    autoCheck();
  }, [sessionId]);

  // Build the register redirect callback with meetingUrl preserved
  const buildRegisterUrl = (emailVal: string) => {
    const callback = `/attendance/${sessionId}${meetingUrl ? `?meetingUrl=${encodeURIComponent(meetingUrl)}` : ''}`;
    return `/register/session/${sessionId}?redirect=${encodeURIComponent(callback)}&email=${encodeURIComponent(emailVal)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    setError(null);
    setPageState('checking');

    try {
      const registration = await checkUserRegistration(trimmedEmail);

      if (!registration) {
        // Not in system — go register
        window.location.href = buildRegisterUrl(trimmedEmail);
        return;
      }

      const isRegisteredForSession =
        registration.sessionIds?.includes(sessionId) ||
        registration.sessionId === sessionId;

      if (!isRegisteredForSession) {
        // In system but not for this session — go register
        window.location.href = buildRegisterUrl(trimmedEmail);
        return;
      }

      // Registered — mark attendance
      const exists = await checkAttendanceExists(registration.email, sessionId);
      if (exists) {
        setAlreadyMarked(true);
      } else {
        await markAttendance({
          sessionId,
          email: registration.email,
          userName: registration.name,
          organization: registration.organization || "",
        });
      }

      // Cache for future visits
      localStorage.setItem('last_registered_user', JSON.stringify(registration));
      localStorage.setItem('quiz_user_general', JSON.stringify(registration));

      setUserName(registration.name || "");
      setPageState('confirmed');

    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setPageState('input');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md py-12">
          {/* Header */}
          <header className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6"
            >
              <UserCheck size={14} /> Session Attendance & Uplink
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-white uppercase tracking-tighter mb-2"
            >
              Session <span className="text-blue-500">{sessionId}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-sm font-medium"
            >
              Enter your email to mark attendance and join the live session.
            </motion.p>
          </header>

          <AnimatePresence mode="wait">
            {/* Init loading spinner */}
            {pageState === 'init' && (
              <motion.div
                key="init"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-16"
              >
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </motion.div>
            )}

            {/* Confirmed — show user name + join button */}
            {pageState === 'confirmed' && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <GlassCard className="p-8 border-slate-800/50 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                  {/* Avatar + name */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0">
                      {userName ? userName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                        {alreadyMarked ? 'Already Verified' : 'Attendance Marked ✓'}
                      </p>
                      <h3 className="text-xl font-black text-white leading-tight">{userName || email}</h3>
                      <p className="text-xs text-slate-500 truncate max-w-[220px]">{email}</p>
                    </div>
                  </div>

                  <div className="mb-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <p className="text-xs font-bold text-emerald-400">
                      {alreadyMarked
                        ? `Your attendance for Session ${sessionId} was already recorded.`
                        : `Your attendance for Session ${sessionId} has been recorded.`}
                    </p>
                  </div>

                  {meetingUrl ? (
                    <a
                      href={meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-16 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                    >
                      <Video size={22} /> Join the Meeting
                    </a>
                  ) : (
                    <div className="w-full h-14 bg-slate-800 text-slate-400 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                      <Video size={18} /> No meeting link configured
                    </div>
                  )}

                  <button
                    onClick={() => {
                      localStorage.removeItem('last_registered_user');
                      localStorage.removeItem('quiz_user_general');
                      setEmail("");
                      setUserName("");
                      setAlreadyMarked(false);
                      setPageState('input');
                    }}
                    className="w-full mt-4 text-slate-600 hover:text-slate-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                    Not {userName.split(' ')[0] || 'you'}? Switch account
                  </button>
                </GlassCard>
              </motion.div>
            )}

            {/* Redirecting state (used only by registration form flow) */}
            {pageState === 'redirecting' && (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <GlassCard className="p-10 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 text-blue-400 animate-pulse">
                    <Video size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Attendance Marked!</h2>
                  <p className="text-slate-400 text-sm mb-6">
                    {alreadyMarked ? 'Attendance already verified.' : 'Attendance successfully marked.'}
                  </p>
                  {meetingUrl && (
                    <a
                      href={meetingUrl}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/20"
                    >
                      Join Meeting <ExternalLink size={14} />
                    </a>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {/* Email input form */}
            {(pageState === 'input' || pageState === 'checking') && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-8 border-slate-800/50 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Your Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 text-white outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all font-medium"
                          disabled={pageState === 'checking'}
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-rose-400 text-xs font-bold p-3 bg-rose-500/10 rounded-xl border border-rose-500/20"
                      >
                        <AlertCircle size={14} className="shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={pageState === 'checking' || !email.trim()}
                      className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      {pageState === 'checking' ? (
                        <><Loader2 size={20} className="animate-spin" /> Verifying...</>
                      ) : (
                        <>Verify & Join Session <ArrowRight size={18} /></>
                      )}
                    </button>

                    <p className="text-center text-slate-600 text-xs">
                      Not registered?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = buildRegisterUrl(email.trim().toLowerCase());
                        }}
                        className="text-blue-500 hover:text-blue-400 font-bold transition-colors"
                      >
                        Register here
                      </button>
                    </p>
                  </form>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10">
        <MainFooter />
      </div>
    </div>
  );
}
