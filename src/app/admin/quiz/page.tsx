"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Pause,
  Clock,
  HelpCircle,
  ChevronRight,
  List
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { deleteQuiz, updateQuiz, subscribeToQuizzes } from '@/firebase/api';
import { Quiz } from '@/types';

export default function QuizAdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToQuizzes((data) => {
      setQuizzes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const toggleActive = async (quiz: Quiz) => {
    try {
      await updateQuiz(quiz.id!, { isActive: !quiz.isActive });
      setQuizzes(quizzes.map(q => q.id === quiz.id ? { ...q, isActive: !q.isActive } : q));
    } catch (error) {
      console.error("Error updating quiz status:", error);
    }
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2"
            >
              Quiz Management
            </motion.h1>
            <p className="text-slate-500 text-lg">Create and manage interactive quizzes for delegates.</p>
          </div>

          <Link href="/admin/quiz/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Plus size={18} />
              Create New Quiz
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 animate-pulse">Loading quizzes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="h-full flex flex-col group border-slate-800/50 hover:border-purple-500/30 transition-all duration-500">
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${quiz.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                          <HelpCircle size={20} />
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleActive(quiz)}
                            className={`p-2 rounded-lg transition-all ${quiz.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-600 hover:bg-slate-800'}`}
                            title={quiz.isActive ? "Deactivate" : "Activate"}
                          >
                            {quiz.isActive ? <Play size={18} /> : <Pause size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(quiz.id!)}
                            className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{quiz.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6">{quiz.description}</p>

                      <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <List size={14} className="text-purple-400" />
                          {quiz.questions.length} Questions
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock size={14} className="text-blue-400" />
                          {quiz.timeLimit} Minutes
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-800/50 p-4">
                      <Link href={`/quiz/${quiz.id}`} target="_blank">
                        <button className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
                          Preview Quiz <ChevronRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {quizzes.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                  <Trophy size={40} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">No quizzes found</h3>
                <p className="text-slate-600 mt-2">Get started by creating your first interactive quiz.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
