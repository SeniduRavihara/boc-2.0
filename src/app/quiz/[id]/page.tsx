"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Trophy,
  ArrowRight,
  LogOut,
  Timer
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { db } from '@/firebase/config';
import { doc, onSnapshot, serverTimestamp, collection, query, where, orderBy } from 'firebase/firestore';
import { checkUserRegistration, joinQuiz, submitQuizAnswer, getQuizById } from '@/firebase/api';
import { Quiz, Question, QuizSubmission, Registration } from '@/types';

export default function UserQuizPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [user, setUser] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [mySubmission, setMySubmission] = useState<QuizSubmission | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Hydration Guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem(`quiz_user_${id}`);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Check if they just came from registration
      const lastReg = localStorage.getItem('last_registered_user');
      if (lastReg) {
        const regData = JSON.parse(lastReg);
        setUser(regData);
        localStorage.setItem(`quiz_user_${id}`, lastReg);
        localStorage.removeItem('last_registered_user');
        // Join the quiz automatically
        joinQuiz(id, regData);
      }
    }
  }, [id]);

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

  const [localQuestionIndex, setLocalQuestionIndex] = useState<number | null>(null);

  // Persistence: Load progress from local storage
  useEffect(() => {
    const savedIndex = localStorage.getItem(`quiz_progress_${id}`);
    if (savedIndex !== null) {
      setLocalQuestionIndex(parseInt(savedIndex));
    }
  }, [id]);

  // Persistence: Save progress to local storage
  useEffect(() => {
    if (localQuestionIndex !== null) {
      localStorage.setItem(`quiz_progress_${id}`, localQuestionIndex.toString());
      
      // Also recover submission state for this specific question
      const alreadySubmitted = localStorage.getItem(`quiz_submitted_${id}_${localQuestionIndex}`);
      if (alreadySubmitted === "true") {
        setIsSubmitted(true);
      }
    }
  }, [localQuestionIndex, id]);

  // Derived State for Self-Paced Flow
  const { activeQuestionIndex, activeTimeLeft } = useMemo(() => {
    if (!quiz || quiz.status !== 'in_progress') {
      return { activeQuestionIndex: 0, activeTimeLeft: null };
    }

    // If we haven't started our local journey yet, start at 0
    const index = localQuestionIndex ?? 0;
    
    return { 
      activeQuestionIndex: index, 
      activeTimeLeft: timeLeft
    };
  }, [quiz, localQuestionIndex, timeLeft]);

  // Handle Global Stop or Restart (Clear Local Storage)
  useEffect(() => {
    if (quiz?.status === 'finished' || quiz?.status === 'registering') {
      // Clear local progress when quiz is over or being prepared for a new start
      localStorage.removeItem(`quiz_progress_${id}`);
      // Also clear all submission flags for this quiz
      if (quiz.questions) {
        quiz.questions.forEach((_, i) => {
          localStorage.removeItem(`quiz_submitted_${id}_${i}`);
        });
      }
      
      // If we are back in registration, also reset local state for a TOTAL restart
      if (quiz?.status === 'registering') {
        setLocalQuestionIndex(null);
        setIsSubmitted(false);
        setSelectedOption(null);
        setScore(0);
        setMySubmission(null);
        setRank(null);
      }
    }
  }, [quiz?.status, id, quiz?.questions]);

  // Initialize local journey (The Starting Pistol & Late-Join Catch-up)
  useEffect(() => {
    if (quiz?.status === 'in_progress' && localQuestionIndex === null) {
      // If we are joining late (and have no saved progress), sync with the admin's current question
      // Otherwise, start at 0
      const syncIndex = quiz.currentQuestionIndex || 0;
      setLocalQuestionIndex(syncIndex);
    }
  }, [quiz?.status, quiz?.currentQuestionIndex]);

  // Local Timer Logic
  useEffect(() => {
    if (!quiz || quiz.status !== 'in_progress' || localQuestionIndex === null) {
      setTimeLeft(null);
      return;
    }

    // Reset local timer for each new local question
    setTimeLeft(quiz.defaultQuestionTime);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz?.status, localQuestionIndex]);

  // Auto-submit and Local Progression
  useEffect(() => {
    // If time is up, auto-submit and move to next
    if (activeTimeLeft === 0 && quiz?.status === 'in_progress' && localQuestionIndex !== null) {
      handleLocalNext();
    }
  }, [activeTimeLeft]);

  const handleLocalNext = async () => {
    // If we haven't submitted yet, submit whatever we have (or skip)
    if (!isSubmitted) {
      await handleSubmitAnswer();
    }

    // Delay slightly for visual feedback
    setTimeout(() => {
      if (quiz && localQuestionIndex !== null) {
        if (localQuestionIndex + 1 < quiz.questions.length) {
          setLocalQuestionIndex(prev => (prev !== null ? prev + 1 : null));
          setIsSubmitted(false);
          setSelectedOption(null);
        } else {
          // Finished locally!
          setLocalQuestionIndex(quiz.questions.length);
        }
      }
    }, 1000);
  };

  // Sync Rank and Total Participants
  useEffect(() => {
    if (!id || !db || !user?.email) return;

    const q = query(
      collection(db, "quiz_submissions"), 
      where("quizId", "==", id),
      orderBy("score", "desc"),
      orderBy("completedAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const allSubmissions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizSubmission));
      
      // Deduplicate by email (same logic as leaderboard)
      const unique = new Map<string, QuizSubmission>();
      allSubmissions.forEach(sub => {
        const existing = unique.get(sub.userEmail);
        if (!existing || sub.score > existing.score) {
          unique.set(sub.userEmail, sub);
        } else if (sub.score === existing.score) {
          const subTime = (sub.completedAt as any)?.toMillis?.() || Number(sub.completedAt) || 0;
          const existingTime = (existing.completedAt as any)?.toMillis?.() || Number(existing.completedAt) || 0;
          if ((subTime as number) < (existingTime as number)) unique.set(sub.userEmail, sub);
        }
      });

      const sorted = Array.from(unique.values()).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const timeA = (a.completedAt as any)?.toMillis?.() || Number(a.completedAt) || 0;
        const timeB = (b.completedAt as any)?.toMillis?.() || Number(b.completedAt) || 0;
        return (timeA as number) - (timeB as number);
      });

      setTotalParticipants(sorted.length);
      
      const myIndex = sorted.findIndex(sub => sub.userEmail === user.email);
      if (myIndex !== -1) {
        setRank(myIndex + 1);
        // Also sync local score just in case
        setScore(sorted[myIndex].score);
      }
    });

    return () => unsubscribe();
  }, [id, user?.email]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setCheckingEmail(true);
      setError(null);
      
      const registration = await checkUserRegistration(email.trim().toLowerCase());
      
      if (registration) {
        // User is registered
        setUser(registration);
        localStorage.setItem(`quiz_user_${id}`, JSON.stringify(registration));
        await joinQuiz(id, registration);
      } else {
        // Not registered
        setError("Email not found. Redirecting to registration...");
        setTimeout(() => {
          router.push(`/register/session/1?redirect=${encodeURIComponent(window.location.href)}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || isSubmitted || !user || !quiz || localQuestionIndex === null) return;

    const currentQuestion = quiz.questions[localQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const points = isCorrect ? currentQuestion.points : 0;
    
    setIsSubmitted(true);
    
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: selectedOption,
      isCorrect,
      points,
      timeTaken: quiz.defaultQuestionTime - (timeLeft || 0)
    };

    // Update local score
    const newScore = score + points;
    setScore(newScore);

    // Prepare full submission
    const submission: Omit<QuizSubmission, "id" | "completedAt"> = {
      quizId: id,
      userEmail: user.email,
      userName: user.name,
      organization: user.organization,
      answers: [...(mySubmission?.answers || []), newAnswer],
      score: newScore,
      totalScore: newScore,
      timeTaken: (mySubmission?.timeTaken || 0) + newAnswer.timeTaken
    };

    try {
      await submitQuizAnswer(submission);
      setMySubmission(submission as any);
      
      // Persist submission state for current question
      localStorage.setItem(`quiz_submitted_${id}_${localQuestionIndex}`, "true");
      
      // Auto-advance to next question after submission
      setTimeout(() => {
        if (localQuestionIndex + 1 < quiz.questions.length) {
          // Clear current submitted state before moving
          localStorage.removeItem(`quiz_submitted_${id}_${localQuestionIndex}`);
          setLocalQuestionIndex(prev => (prev !== null ? prev + 1 : null));
          setIsSubmitted(false);
          setSelectedOption(null);
        } else {
          setLocalQuestionIndex(quiz.questions.length);
        }
      }, 1500);
    } catch (err) {
      console.error("Failed to submit answer:", err);
      setIsSubmitted(false); // Let them try again if it fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`quiz_user_${id}`);
    setUser(null);
    setEmail("");
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) return <div className="text-white text-center py-20">Quiz data initializing...</div>;

  // 1. Join State
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-6">
        <GlassCard className="w-full max-w-md p-8 border-slate-800/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Zap size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Join the Quiz</h1>
            <p className="text-slate-500 text-sm">Enter the email you used for registration.</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                required
              />
            </div>

            {error && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${error.includes('Redirecting') ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {error.includes('Redirecting') ? <Clock size={14} /> : <AlertCircle size={14} />}
                {error}
              </div>
            )}

            <button 
              disabled={checkingEmail}
              className="w-full h-12 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {checkingEmail ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <>Join Quiz <ArrowRight size={18} /></>}
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  // 2. Waiting Room
  if (quiz.status === 'idle' || quiz.status === 'registering') {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <GlassCard className="p-10 border-slate-800/50 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-400"
            >
              <Users size={40} />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">You're In, {user.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 mb-8">
              {quiz.status === 'idle' ? "Waiting for the admin to open registration." : "The quiz will start soon. Stay on this page!"}
            </p>

            <div className="p-4 bg-slate-950/30 rounded-xl border border-slate-800/50 text-left mb-8">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Quiz Information</div>
              <div className="text-sm font-medium text-slate-300">{quiz.title}</div>
              <div className="mt-3 flex gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={14} /> {quiz.questions.length} Questions
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Zap size={14} /> {quiz.defaultQuestionTime}s per Q
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold animate-pulse text-sm">
              <CheckCircle2 size={16} /> Ready to start...
            </div>
          </GlassCard>
          
          <button onClick={handleLogout} className="mt-6 flex items-center gap-2 mx-auto text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <LogOut size={14} /> Log out as {user.email}
          </button>
        </div>
      </div>
    );
  }

  // 3. Finished State (Global or Local)
  if (quiz.status === 'finished' || (localQuestionIndex !== null && localQuestionIndex >= quiz.questions.length)) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <GlassCard className="p-10 border-slate-800/50 text-center">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
              <Trophy size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Finished!</h2>
            <p className="text-slate-500 mb-8">Excellent effort, {user.name.split(' ')[0]}!</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Final Score</div>
                <div className="text-2xl font-bold text-white font-mono">{score}</div>
              </div>
              <div className="p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Rank</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">#{rank || '--'}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">
                Quiz Participation Complete
              </p>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-bold text-xs">
                🎉 Attendance Marked Successfully
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // 4. Active Quiz
  if (quiz.status === 'in_progress') {
    const currentQuestion = quiz.questions[activeQuestionIndex];
    if (!currentQuestion) return <div className="text-white text-center py-20">Preparing next question...</div>;
    
    return (
      <div className="min-h-screen bg-[#030712] text-slate-200 p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-bold text-sm">
                {activeQuestionIndex + 1}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Question</div>
                <div className="text-xs font-bold">Of {quiz.questions.length}</div>
              </div>
            </div>

            {activeTimeLeft !== null && (
              <div className={`flex flex-col items-center ${activeTimeLeft < 10 ? 'text-rose-500' : 'text-blue-400'}`}>
                <div className="flex items-center gap-2 font-mono text-2xl font-bold">
                  <Timer size={24} /> {activeTimeLeft}s
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Time Left</div>
              </div>
            )}

            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Score</div>
              <div className="text-sm font-bold text-emerald-400">{score} Points</div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-5 md:p-8 border-slate-800/50 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 leading-tight">
                  {quiz.questions[activeQuestionIndex].text}
                </h2>

                <div className="space-y-4">
                  {quiz.questions[activeQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      disabled={isSubmitted || activeTimeLeft === 0}
                      onClick={() => setSelectedOption(index)}
                      className={`w-full p-4 md:p-5 rounded-2xl border text-left font-medium transition-all flex items-center justify-between group ${
                        selectedOption === index 
                          ? 'bg-blue-500/20 border-blue-500/50 text-white ring-1 ring-blue-500/30' 
                          : 'bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700'
                      } ${isSubmitted ? 'opacity-80' : ''}`}
                    >
                      <span>{option}</span>
                      <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                        selectedOption === index ? 'bg-blue-500 border-blue-400' : 'border-slate-800'
                      }`}>
                        {selectedOption === index && <div className="h-2 w-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </GlassCard>

              <button
                disabled={isSubmitted || selectedOption === null || activeTimeLeft === 0}
                onClick={handleSubmitAnswer}
                className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-2xl disabled:opacity-30"
              >
                {isSubmitted ? (
                  <>Answer Submitted <CheckCircle2 size={20} className="text-emerald-600" /></>
                ) : (
                  <>Submit Answer <Send size={20} /></>
                )}
              </button>
              
              {isSubmitted && (
                <p className="mt-4 text-center text-slate-500 text-sm italic font-medium">
                  Saving and moving to next...
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
}
