"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ArrowRight, 
  Mail,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { checkUserRegistration, markAttendance, checkAttendanceExists, getGlobalSettings } from '@/firebase/api';
import { Registration } from '@/types';

export default function AttendancePage() {
  const router = useRouter();
  const { sessionId } = useParams() as { sessionId: string };

  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState<Registration | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  // Load user from local storage and check session lock
  useEffect(() => {
    const checkSession = async () => {
      try {
        const settings = await getGlobalSettings();
        if (settings && settings.activeAttendanceSession && settings.activeAttendanceSession !== sessionId) {
          setIsLocked(true);
          setLoading(false);
          return;
        }

        const savedUser = localStorage.getItem(`quiz_user_general`) || localStorage.getItem(`last_registered_user`);
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // CRITICAL: Verify they are actually registered for THIS session
          const isRegistered = 
            userData.sessionIds?.includes(sessionId) || 
            userData.sessionId === sessionId;

          if (isRegistered) {
            setUser(userData);
            await checkExistingAttendance(userData.email);
          } else {
            // Not registered for this one, but pre-fill email for convenience
            setEmail(userData.email);
            setUser(null);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    checkSession();
  }, [sessionId]);

  const checkExistingAttendance = async (userEmail: string) => {
    try {
      const exists = await checkAttendanceExists(userEmail, sessionId);
      if (exists) {
        setAlreadyMarked(true);
      }
    } catch (err) {
      console.error("Error checking attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setChecking(true);
      setError(null);
      
      const registration = await checkUserRegistration(email.trim().toLowerCase());
      
      if (registration) {
        // ALWAYS update local storage so other pages know who we are now
        localStorage.setItem(`quiz_user_general`, JSON.stringify(registration));
        localStorage.setItem(`last_registered_user`, JSON.stringify(registration));

        // Check if user is registered for THIS specific session
        const isRegisteredForThisSession = 
          registration.sessionIds?.includes(sessionId) || 
          registration.sessionId === sessionId;

        if (!isRegisteredForThisSession) {
          setError(`You are registered for previous sessions, but not for Session ${sessionId}. Please register for this session first.`);
          return;
        }

        setUser(registration);
        await checkExistingAttendance(registration.email);
      } else {
        setError("Email not found in our registration list.");
        // Clear local storage if they entered a completely unknown email
        localStorage.removeItem(`quiz_user_general`);
        localStorage.removeItem(`last_registered_user`);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setChecking(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!user) return;

    try {
      setChecking(true);
      await markAttendance({
        sessionId,
        email: user.email,
        userName: user.name,
        organization: user.organization,
        feedback: feedback.trim() || undefined
      });
      setSuccess(true);
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      setError("Failed to record attendance. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`quiz_user_general`);
    setUser(null);
    setEmail("");
    setAlreadyMarked(false);
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <header className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6"
          >
            <UserCheck size={14} /> Session Attendance
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
            Mark your presence for today's session.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <GlassCard className="p-10 border-rose-500/20 bg-rose-500/5">
                <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30 text-rose-500">
                  <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Session Closed</h2>
                <p className="text-slate-400 text-sm mb-0">
                  Attendance marking for Session {sessionId} is not currently active. Please wait for the admin to open this session.
                </p>
              </GlassCard>
            </motion.div>
          ) : success || alreadyMarked ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <GlassCard className="p-10 border-emerald-500/20 bg-emerald-500/5">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                  <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {alreadyMarked ? "Already Marked!" : "Attendance Marked!"}
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  Thank you for joining us, <span className="text-white font-bold">{user?.name}</span>. Your presence has been recorded for Session {sessionId}.
                </p>
                <div className="mt-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">
                    Session Logged Successfully
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ) : !user ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlassCard className="p-8 border-slate-800/50 shadow-2xl">
                <form onSubmit={handleLookup} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Identification</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 text-white outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                        <AlertCircle size={14} /> {error}
                      </div>
                      <button 
                        type="button"
                        onClick={() => router.push(`/register/session/${sessionId}?redirect=/attendance/${sessionId}&email=${encodeURIComponent(email)}`)}
                        className="w-full h-10 bg-rose-500 text-white rounded-xl font-bold text-xs hover:bg-rose-600 transition-all"
                      >
                        Register Now
                      </button>
                    </motion.div>
                  )}

                  <button 
                    disabled={checking}
                    className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {checking ? <Loader2 size={24} className="animate-spin" /> : <>Verify Identity <ArrowRight size={20} /></>}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="mark"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-8 border-slate-800/50 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{user.name}</h3>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Clock size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-300">Session {sessionId} Participation</div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <MapPin size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-300">Live Workshop Portal</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Optional Feedback</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Any thoughts or suggestions for this session?"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all font-medium text-sm min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  onClick={handleMarkAttendance}
                  disabled={checking}
                  className="w-full h-16 bg-white text-black rounded-2xl font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 mb-6"
                >
                  {checking ? <Loader2 size={24} className="animate-spin text-black" /> : <>Mark Presence <CheckCircle2 size={24} /></>}
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <ArrowLeft size={14} /> Not {user.name.split(' ')[0]}? Switch account
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Beauty of Cloud · Node-Attendance-Secure
          </p>
        </footer>
      </div>
    </div>
  );
}
