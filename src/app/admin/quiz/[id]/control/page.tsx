"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  SkipForward, 
  Users, 
  Zap, 
  Link2,
  Clock, 
  Trophy,
  ArrowLeft,
  Settings,
  Activity,
  CheckCircle2,
  AlertCircle,
  Pause
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/firebase/config';
import { doc, onSnapshot, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { getQuizById, updateQuiz } from '@/firebase/api';
import { Quiz, QuizSubmission } from '@/types';

export default function QuizControlPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
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

  // Sync Participants
  useEffect(() => {
    if (!id || !db) return;
    const q = query(collection(db, "quiz_participants"), where("quizId", "==", id));
    const unsubscribe = onSnapshot(q, (snap) => {
      setParticipantsCount(snap.size);
    });
    return () => unsubscribe();
  }, [id]);

  // Sync Submissions
  useEffect(() => {
    if (!id || !db) return;
    const q = query(collection(db, "quiz_submissions"), where("quizId", "==", id));
    const unsubscribe = onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map(doc => doc.data() as QuizSubmission));
    });
    return () => unsubscribe();
  }, [id]);

  // Derived State for Automatic Mode
  const { activeQuestionIndex, activeTimeLeft, isAutoFinished } = useMemo(() => {
    if (!quiz || quiz.status !== 'in_progress' || !quiz.startTime) {
      return { activeQuestionIndex: quiz?.currentQuestionIndex || 0, activeTimeLeft: null, isAutoFinished: false };
    }

    if (quiz.mode === 'manual') {
      const now = Date.now();
      const start = quiz.startTime.toDate().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, quiz.defaultQuestionTime - elapsed);
      return { activeQuestionIndex: quiz.currentQuestionIndex, activeTimeLeft: remaining, isAutoFinished: false };
    }

    // Automatic Mode: Calculate based on global start time
    const now = Date.now();
    const start = quiz.startTime.toDate().getTime();
    const elapsedTotal = Math.floor((now - start) / 1000);
    const index = Math.floor(elapsedTotal / quiz.defaultQuestionTime);
    const remaining = Math.max(0, quiz.defaultQuestionTime - (elapsedTotal % quiz.defaultQuestionTime));
    
    const isFinished = index >= quiz.questions.length;
    return { 
      activeQuestionIndex: Math.min(index, quiz.questions.length - 1), 
      activeTimeLeft: remaining,
      isAutoFinished: isFinished
    };
  }, [quiz, timeLeft]); // timeLeft acts as a 1s ticker

  // Timer Ticker
  useEffect(() => {
    if (!quiz || quiz.status !== 'in_progress') return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev === null ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz?.status]);

  // Handle Automatic Finish
  useEffect(() => {
    if (isAutoFinished && quiz?.status === 'in_progress' && quiz.mode === 'automatic') {
      updateQuiz(id, { status: 'finished' });
    }
  }, [isAutoFinished, quiz?.status, quiz?.mode]);

  const handleStartRegistration = async () => {
    if (!quiz) return;
    await updateQuiz(id, { 
      status: 'registering',
      startTime: serverTimestamp() as any
    });
  };

  const handleStartQuiz = async () => {
    if (!quiz) return;
    await updateQuiz(id, { 
      status: 'in_progress',
      currentQuestionIndex: 0,
      startTime: serverTimestamp() as any
    });
  };

  const handleNextQuestion = async () => {
    if (!quiz) return;
    
    if (quiz.mode === 'automatic') {
      // In automatic mode, "Next" just skips ahead by adjusting the startTime
      const now = Date.now();
      const targetIndex = activeQuestionIndex + 1;
      
      if (targetIndex >= quiz.questions.length) {
        await updateQuiz(id, { status: 'finished' });
      } else {
        const newStartTime = new Date(now - targetIndex * quiz.defaultQuestionTime * 1000);
        await updateQuiz(id, { 
          currentQuestionIndex: targetIndex,
          startTime: newStartTime as any
        });
      }
    } else {
      if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
        await updateQuiz(id, { 
          currentQuestionIndex: quiz.currentQuestionIndex + 1,
          startTime: serverTimestamp() as any
        });
      } else {
        await updateQuiz(id, { status: 'finished' });
      }
    }
  };

  const handleToggleMode = async () => {
    if (!quiz) return;
    const newMode = quiz.mode === 'manual' ? 'automatic' : 'manual';
    const updates: any = { mode: newMode };
    
    if (newMode === 'manual') {
      // Sync manual index to current automatic position
      updates.currentQuestionIndex = activeQuestionIndex;
      updates.startTime = serverTimestamp() as any; // Reset timer for the current question
    } else {
      // Sync automatic start time to current manual position
      const now = Date.now();
      const newStartTime = new Date(now - quiz.currentQuestionIndex * quiz.defaultQuestionTime * 1000);
      updates.startTime = newStartTime as any;
    }

    await updateQuiz(id, updates);
  };

  const handleResetQuiz = async () => {
    if (!confirm("Are you sure? This will reset the quiz to idle state.")) return;
    await updateQuiz(id, { 
      status: 'idle',
      currentQuestionIndex: 0,
      startTime: null as any
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) return <div>Quiz not found</div>;

  const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  const submissionForCurrentQ = submissions.filter(s => 
    s.answers.some(a => a.questionId === currentQuestion?.id)
  ).length;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <Link href="/admin/quiz" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2 text-sm group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to List
            </Link>
            <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                quiz.status === 'in_progress' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                quiz.status === 'registering' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {quiz.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Settings size={12} /> {quiz.mode.toUpperCase()} Mode
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                const url = `${window.location.origin}/quiz/${id}`;
                navigator.clipboard.writeText(url);
                alert("Quiz link copied to clipboard!");
              }}
              className="flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Link2 size={16} className="text-emerald-400" /> Copy Share Link
            </button>
            <Link 
              href={`/quiz/${id}/leaderboard`}
              target="_blank"
              className="flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Trophy size={16} className="text-yellow-400" /> Open Leaderboard
            </Link>
            <button 
              onClick={handleToggleMode}
              className="flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all"
            >
              {quiz.mode === 'manual' ? <Zap size={16} /> : <Settings size={16} />}
              Switch to {quiz.mode === 'manual' ? 'Automatic' : 'Manual'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <GlassCard className="p-8 border-slate-800/50">
              {quiz.status === 'idle' && (
                <div className="text-center py-8">
                  <Activity size={48} className="mx-auto mb-4 text-slate-700" />
                  <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                    Once you start the registration, users can join the quiz with their emails.
                  </p>
                  <button 
                    onClick={handleStartRegistration}
                    className="h-14 px-8 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Start Registration Phase
                  </button>
                </div>
              )}

              {quiz.status === 'registering' && (
                <div className="text-center py-8">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-blue-400">
                      {participantsCount}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Registration Open</h2>
                  <p className="text-slate-500 mb-8">Waiting for participants to join...</p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={handleStartQuiz}
                      className="h-14 px-8 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-3"
                    >
                      <Play size={20} /> Start Quiz ({quiz.questions.length} Qs)
                    </button>
                    <button 
                      onClick={handleResetQuiz}
                      className="h-14 px-6 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {quiz.status === 'in_progress' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Currently Playing</span>
                      <h2 className="text-2xl font-bold text-white">Question {activeQuestionIndex + 1} of {quiz.questions.length}</h2>
                    </div>
                    {activeTimeLeft !== null && (
                      <div className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center border-2 ${activeTimeLeft < 10 ? 'border-rose-500 text-rose-500 animate-pulse' : 'border-blue-500 text-blue-400'}`}>
                        <span className="text-xl font-mono font-bold leading-none">{activeTimeLeft}</span>
                        <span className="text-[10px] uppercase font-bold opacity-60">Secs</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl mb-8">
                    <p className="text-xl font-medium text-white mb-6">"{quiz.questions[activeQuestionIndex]?.text}"</p>
                    <div className="grid grid-cols-2 gap-3">
                      {quiz.questions[activeQuestionIndex]?.options.map((opt, i) => (
                        <div key={i} className={`p-3 rounded-lg text-sm border ${i === quiz.questions[activeQuestionIndex].correctOptionIndex ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleNextQuestion}
                      className="flex-1 h-14 bg-white text-black rounded-xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <SkipForward size={20} /> 
                      {activeQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                    <button 
                      onClick={handleResetQuiz}
                      className="h-14 px-6 bg-slate-900 text-rose-500 border border-rose-500/20 rounded-xl font-bold hover:bg-rose-500/10 transition-all"
                      title="Reset Quiz"
                    >
                      <Square size={20} />
                    </button>
                  </div>

                  {quiz.mode === 'automatic' && (
                    <p className="mt-4 text-xs text-center text-blue-400/60 font-medium">
                      Automatic mode active. Advancing when timer hits 0.
                    </p>
                  )}
                </div>
              )}

              {quiz.status === 'finished' && (
                <div className="text-center py-8">
                  <Trophy size={48} className="mx-auto mb-4 text-yellow-400" />
                  <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                  <p className="text-slate-500 mb-8">The final results are now locked.</p>
                  <div className="flex gap-4 justify-center">
                    <Link 
                      href={`/admin/quiz/${id}/results`}
                      className="h-14 px-8 bg-purple-500 text-white rounded-xl font-bold text-lg hover:bg-purple-600 transition-all"
                    >
                      View Final Rankings
                    </Link>
                    <button 
                      onClick={handleResetQuiz}
                      className="h-14 px-6 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Restart Quiz
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <GlassCard className="p-6 border-slate-800/50">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <Users size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Joined</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono">{participantsCount}</div>
              </GlassCard>
              <GlassCard className="p-6 border-slate-800/50">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Answered</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono">{submissionForCurrentQ}</div>
              </GlassCard>
              <GlassCard className="p-6 border-slate-800/50 hidden md:block">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <Activity size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Progress</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {Math.round(((quiz.currentQuestionIndex + (quiz.status === 'finished' ? 1 : 0)) / quiz.questions.length) * 100)}%
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Sidebar - Submissions List */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users size={18} className="text-blue-400" /> Live Feed
            </h3>
            <GlassCard className="p-4 border-slate-800/50 h-[600px] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <div className="text-center py-20 text-slate-600 text-sm italic">
                    Waiting for submissions...
                  </div>
                ) : (
                  submissions.slice().reverse().map((sub, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-slate-950/30 border border-slate-800/50 flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-300 truncate max-w-[120px]">{sub.userName}</span>
                        <span className="text-[10px] font-mono text-slate-500">{sub.totalScore} pts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${(sub.answers.length / quiz.questions.length) * 100}%` }} 
                          />
                        </div>
                        <span className="text-[10px] text-slate-600 italic">Q{sub.answers.length}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
