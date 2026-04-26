"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Zap, 
  Medal, 
  Star,
  Activity,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/firebase/config';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { Quiz, QuizSubmission } from '@/types';

export default function LeaderboardPage() {
  const { id } = useParams() as { id: string };
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Sync Quiz Data
  useEffect(() => {
    if (!id || !db) return;
    const unsubscribe = onSnapshot(doc(db, "quizzes", id), (docSnap) => {
      if (docSnap.exists()) {
        setQuiz({ id: docSnap.id, ...docSnap.data() } as Quiz);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  // Sync Submissions
  useEffect(() => {
    if (!id || !db) return;
    const q = query(
      collection(db, "quiz_submissions"), 
      where("quizId", "==", id),
      orderBy("totalScore", "desc"),
      orderBy("completedAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizSubmission)));
    });
    return () => unsubscribe();
  }, [id]);

  // Timer Logic
  useEffect(() => {
    if (!quiz || quiz.status !== 'in_progress' || !quiz.startTime) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const start = quiz.startTime!.toDate().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, quiz.defaultQuestionTime - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) return <div className="text-white text-center py-20">Quiz not found</div>;

  const topThree = submissions.slice(0, 3);
  const others = submissions.slice(3, 10); // Show top 10

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-8 md:p-16 font-sans overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-widest">
                Live Leaderboard
              </span>
              {quiz.status === 'in_progress' && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                  <Activity size={14} /> Question {quiz.currentQuestionIndex + 1} / {quiz.questions.length}
                </span>
              )}
            </div>
            <h1 className="text-6xl font-black text-white tracking-tight">{quiz.title}</h1>
          </div>

          <div className="flex gap-12 text-right">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Participants</span>
              <span className="text-5xl font-black text-white font-mono">{submissions.length}</span>
            </div>
            {timeLeft !== null && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Time Left</span>
                <span className={`text-5xl font-black font-mono ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-blue-400'}`}>
                  {timeLeft}s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Podium Section */}
        <div className="grid grid-cols-3 gap-8 items-end mb-16 h-[400px]">
          {/* 2nd Place */}
          <div className="h-full flex flex-col justify-end">
            <AnimatePresence mode="popLayout">
              {topThree[1] && (
                <motion.div
                  key={topThree[1].id || topThree[1].userEmail}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-400/50 relative">
                      <Medal className="text-slate-400" size={32} />
                      <div className="absolute -top-2 -right-2 bg-slate-400 text-black text-xs font-bold h-7 w-7 rounded-full flex items-center justify-center border-4 border-[#030712]">2</div>
                    </div>
                    <div className="text-2xl font-bold text-white truncate px-4">{topThree[1].userName}</div>
                    <div className="text-slate-500 text-sm font-medium">{topThree[1].organization}</div>
                  </div>
                  <div className="h-48 bg-gradient-to-t from-slate-400/20 to-slate-400/5 rounded-t-3xl border-x border-t border-slate-400/20 flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl font-black text-white font-mono">{topThree[1].score}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Points</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 1st Place */}
          <div className="h-full flex flex-col justify-end">
            <AnimatePresence mode="popLayout">
              {topThree[0] && (
                <motion.div
                  key={topThree[0].id || topThree[0].userEmail}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center relative">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-500/20 blur-[40px] rounded-full pointer-events-none" 
                    />
                    <div className="w-28 h-28 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-500 relative shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                      <Trophy className="text-yellow-500" size={48} />
                      <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-lg font-black h-10 w-10 rounded-full flex items-center justify-center border-4 border-[#030712]">1</div>
                    </div>
                    <div className="text-4xl font-black text-white truncate px-4 drop-shadow-2xl">{topThree[0].userName}</div>
                    <div className="text-yellow-500/70 text-lg font-bold">{topThree[0].organization}</div>
                  </div>
                  <div className="h-64 bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 rounded-t-3xl border-x border-t border-yellow-500/30 flex flex-col items-center justify-center gap-2">
                    <span className="text-6xl font-black text-white font-mono drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{topThree[0].score}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-500/60">Points</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3rd Place */}
          <div className="h-full flex flex-col justify-end">
            <AnimatePresence mode="popLayout">
              {topThree[2] && (
                <motion.div
                  key={topThree[2].id || topThree[2].userEmail}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-700/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-700/50 relative">
                      <Medal className="text-orange-700" size={32} />
                      <div className="absolute -top-2 -right-2 bg-orange-700 text-black text-xs font-bold h-7 w-7 rounded-full flex items-center justify-center border-4 border-[#030712]">3</div>
                    </div>
                    <div className="text-2xl font-bold text-white truncate px-4">{topThree[2].userName}</div>
                    <div className="text-slate-500 text-sm font-medium">{topThree[2].organization}</div>
                  </div>
                  <div className="h-36 bg-gradient-to-t from-orange-700/20 to-orange-700/5 rounded-t-3xl border-x border-t border-orange-700/20 flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl font-black text-white font-mono">{topThree[2].score}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-700/60">Points</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* List Section */}
        <div className="flex-grow pb-12">
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {others.map((sub, i) => (
                <motion.div
                  key={sub.id || sub.userEmail}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <GlassCard className="relative p-5 border-slate-800/40 flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-500">
                      {i + 4}
                    </div>
                    <div className="flex-grow">
                      <div className="text-xl font-bold text-white">{sub.userName}</div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">{sub.organization || "Independent"}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-black text-white font-mono">{sub.score}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Points</div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
