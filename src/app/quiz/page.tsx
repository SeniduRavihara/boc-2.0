"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Play, 
  Clock, 
  HelpCircle, 
  User, 
  Mail,
  ArrowRight,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { subscribeToQuizzes } from '@/firebase/api';
import { Quiz } from '@/types';

export default function QuizSelectionPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({ name: "", email: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem('boc_quiz_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setShowLogin(true);
    }
    
    setLoading(true);
    const unsubscribe = subscribeToQuizzes((data) => {
      setQuizzes(data.filter(q => q.isActive));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.name && loginData.email) {
      localStorage.setItem('boc_quiz_user', JSON.stringify(loginData));
      setUser(loginData);
      setShowLogin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('boc_quiz_user');
    setUser(null);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2"
            >
              Beauty of Cloud Quiz
            </motion.h1>
            <p className="text-slate-500 text-lg">Test your knowledge and climb the leaderboard.</p>
          </div>

          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl font-semibold hover:bg-purple-500/30 transition-all"
            >
              <Trophy size={18} />
              View Leaderboard
            </motion.button>
          </Link>
        </div>

        {user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl mb-8 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors"
            >
              <LogOut size={14} /> Change User
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 animate-pulse">Loading active quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 rounded-3xl border border-dashed border-slate-800">
             <HelpCircle size={64} className="mx-auto text-slate-800 mb-6" />
             <p className="text-xl font-bold text-slate-500">No active quizzes right now</p>
             <p className="text-slate-600 mt-2">Check back later or view the results on the leaderboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full flex flex-col group hover:border-purple-500/40 transition-all duration-500 cursor-pointer overflow-hidden relative">
                    <div className="p-8 pb-32">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{quiz.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">{quiz.description}</p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-400">
                          <HelpCircle size={14} className="text-purple-400" />
                          {quiz.questions.length} Questions
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-400">
                          <Clock size={14} className="text-blue-400" />
                          {quiz.timeLimit} Minutes
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 pt-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent">
                      <Link href={`/quiz/${quiz.id}`}>
                        <button className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-xl group-hover:shadow-purple-500/20">
                          Start Quiz <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Simplified Auth Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                    <Trophy size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
                  <p className="text-slate-500">Enter your details to take quizzes and appear on the leaderboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        required
                        type="text" 
                        value={loginData.name}
                        onChange={e => setLoginData({...loginData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 pl-12 text-white outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        required
                        type="email" 
                        value={loginData.email}
                        onChange={e => setLoginData({...loginData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 pl-12 text-white outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-xl"
                  >
                    Enter Platform
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
