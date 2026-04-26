"use client";

import React, { useEffect, useState, useRef } from 'react';
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
import { doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
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

  // Timer Logic
  useEffect(() => {
    if (!quiz || quiz.status !== 'in_progress' || !quiz.startTime) {
      setTimeLeft(null);
      return;
    }

    // Reset submission state when question changes
    setIsSubmitted(false);
    setSelectedOption(null);

    const interval = setInterval(() => {
      const now = Date.now();
      const start = quiz.startTime!.toDate().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, quiz.defaultQuestionTime - elapsed);
      
      setTimeLeft(remaining);

      // Auto-submit if time runs out and an option is selected
      if (remaining === 0 && !isSubmitted && selectedOption !== null) {
        handleSubmitAnswer();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz?.currentQuestionIndex, quiz?.status, quiz?.startTime]);

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
    if (selectedOption === null || isSubmitted || !user || !quiz) return;

    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
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
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`quiz_user_${id}`);
    setUser(null);
    setEmail("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) return <div>Quiz not found</div>;

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

  // 3. Active Quiz
  if (quiz.status === 'in_progress') {
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-[#030712] text-slate-200 p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-bold text-sm">
                {quiz.currentQuestionIndex + 1}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Question</div>
                <div className="text-xs font-bold">Of {quiz.questions.length}</div>
              </div>
            </div>

            {timeLeft !== null && (
              <div className={`flex flex-col items-center ${timeLeft < 10 ? 'text-rose-500' : 'text-blue-400'}`}>
                <div className="flex items-center gap-2 font-mono text-2xl font-bold">
                  <Timer size={24} /> {timeLeft}s
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
              key={quiz.currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 border-slate-800/50 mb-8">
                <h2 className="text-2xl font-bold text-white mb-8 leading-tight">
                  {currentQuestion.text}
                </h2>

                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      disabled={isSubmitted || timeLeft === 0}
                      onClick={() => setSelectedOption(index)}
                      className={`w-full p-5 rounded-2xl border text-left font-medium transition-all flex items-center justify-between group ${
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
                disabled={isSubmitted || selectedOption === null || timeLeft === 0}
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
                  Waiting for the next question...
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // 4. Finished State
  if (quiz.status === 'finished') {
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
                <div className="text-2xl font-bold text-emerald-400 font-mono">#--</div>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/quiz/${id}/leaderboard`)}
              className="w-full h-14 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              See Full Leaderboard <ArrowRight size={20} />
            </button>
          </GlassCard>
        </div>
      </div>
    );
  }

  return null;
}
