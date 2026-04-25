"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  Trophy,
  ArrowRight,
  ChevronRight,
  Timer,
  AlertCircle,
  Play
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getQuizzes, submitQuizResult } from '@/firebase/api';
import { Quiz, Question } from '@/types';

export default function QuizPlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStatus, setQuizStatus] = useState<'intro' | 'active' | 'completed'>('intro');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchQuiz();
    const savedUser = localStorage.getItem('boc_quiz_user');
    if (!savedUser) {
      router.push('/quiz');
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const allQuizzes = await getQuizzes();
      const targetQuiz = allQuizzes.find(q => q.id === id);
      
      if (targetQuiz) {
        if (!targetQuiz.isActive) {
          // If not active, find the active quiz for the same session
          const activeForSession = allQuizzes.find(q => q.sessionId === targetQuiz.sessionId && q.isActive);
          if (activeForSession) {
            router.push(`/quiz/${activeForSession.id}`);
            return;
          } else {
            setError("This quiz is currently inactive.");
            return;
          }
        }
        setQuiz(targetQuiz);
        setTimeLeft(targetQuiz.timeLimit * 60);
      } else {
        setError("Quiz not found.");
      }
    } catch (err) {
      setError("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStatus('active');
    setQuizStartTime(Date.now());
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOptionSelect = (index: number) => {
    if (quizStatus !== 'active') return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
    } else {
      handleQuizComplete(newAnswers);
    }
  };

  const handleQuizComplete = async (finalAnswers = answers) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuizStatus('completed');
    
    const savedUser = JSON.parse(localStorage.getItem('boc_quiz_user') || '{}');
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    // Calculate score
    let score = 0;
    quiz!.questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctOptionIndex) {
        score += q.points;
      }
    });

    try {
      await submitQuizResult({
        quizId: id as string,
        userName: savedUser.name || "Anonymous",
        userEmail: savedUser.email || "anonymous@example.com",
        score,
        totalQuestions: quiz!.questions.length,
        timeTaken
      });
    } catch (err) {
      console.error("Error submitting quiz results:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Preparing your quiz...</p>
    </div>
  );

  if (error || !quiz) return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={64} className="text-rose-500 mb-6" />
      <h2 className="text-3xl font-bold text-white mb-2">Oops!</h2>
      <p className="text-slate-500 mb-8">{error || "Something went wrong."}</p>
      <button onClick={() => router.push('/quiz')} className="px-8 py-3 bg-white text-black rounded-xl font-bold">Back to Selection</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 min-h-screen flex flex-col">
        {quizStatus === 'intro' && (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl"
            >
              <GlassCard className="p-12 border-purple-500/20">
                <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 mx-auto mb-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  <Play size={40} className="ml-1" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{quiz.title}</h1>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">{quiz.description}</p>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Time Limit</p>
                    <p className="text-2xl font-bold text-white">{quiz.timeLimit}m</p>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Questions</p>
                    <p className="text-2xl font-bold text-white">{quiz.questions.length}</p>
                  </div>
                </div>

                <button 
                  onClick={startQuiz}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xl hover:bg-purple-500 hover:text-white transition-all shadow-2xl"
                >
                  Confirm and Start
                </button>
              </GlassCard>
            </motion.div>
          </div>
        )}

        {quizStatus === 'active' && (
          <>
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-purple-400 font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Question</p>
                  <p className="text-sm font-semibold text-white">of {quiz.questions.length}</p>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border backdrop-blur-md transition-colors ${
                timeLeft < 30 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-900/50 border-slate-800 text-white'
              }`}>
                <Timer size={20} className={timeLeft < 30 ? 'animate-pulse' : ''} />
                <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-12 border border-slate-800 shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                 className="h-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
               />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white leading-tight">{quiz.questions[currentQuestionIndex].text}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${
                        selectedOption === index 
                          ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold transition-colors ${
                          selectedOption === index 
                            ? 'bg-purple-500 text-white border-purple-400' 
                            : 'bg-slate-950/50 border-slate-800 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className={`text-lg font-medium ${selectedOption === index ? 'text-white' : 'text-slate-400'}`}>
                          {option}
                        </span>
                      </div>
                      {selectedOption === index && (
                        <motion.div 
                          layoutId="active-bg"
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-12 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="group flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-purple-500 hover:text-white transition-all shadow-2xl disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
              >
                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}

        {quizStatus === 'completed' && (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl"
            >
              <GlassCard className="p-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-blue-500" />
                
                <div className="w-24 h-24 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mx-auto mb-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                  <Trophy size={48} />
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed!</h1>
                <p className="text-slate-500 text-lg mb-10">Excellent work. Your results have been submitted to the leaderboard.</p>
                
                <div className="flex flex-col gap-4 mb-12">
                  <button 
                    onClick={() => router.push('/quiz')}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-lg"
                  >
                    Done <ArrowRight size={18} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
