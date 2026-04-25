"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit2,
  Link2,
  Play, 
  Settings, 
  Users, 
  Trophy,
  MoreVertical,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { getQuizzes, deleteQuiz } from '@/firebase/api';
import { Quiz } from '@/types';

export default function AdminQuizPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch quizzes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (err: any) {
      alert("Failed to delete quiz: " + err.message);
    }
  };

  const getStatusBadge = (status: Quiz['status']) => {
    const styles = {
      idle: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      registering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      in_progress: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      finished: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
    
    const labels = {
      idle: "Draft",
      registering: "Joining Phase",
      in_progress: "Live Now",
      finished: "Completed"
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">Quiz Management</h1>
            <p className="text-slate-500">Create, monitor, and control your live MCQ sessions.</p>
          </div>
          <Link 
            href="/admin/quiz/new" 
            className="flex items-center justify-center gap-2 bg-white text-black h-12 px-6 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={18} /> Create New Quiz
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <GlassCard className="p-12 flex flex-col items-center justify-center text-center border-slate-800/50">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 text-slate-600">
              <Zap size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">No quizzes found</h2>
            <p className="text-slate-500 mb-6 max-w-sm">You haven't created any quizzes yet. Click the button above to get started.</p>
            <Link 
              href="/admin/quiz/new" 
              className="text-white hover:text-purple-400 font-bold transition-colors flex items-center gap-2"
            >
              Start your first quiz <Plus size={16} />
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full flex flex-col p-6 border-slate-800/50 hover:border-slate-700/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      {getStatusBadge(quiz.status)}
                      <div className="flex gap-1">
                        <Link 
                          href={`/admin/quiz/${quiz.id}/edit`}
                          className="p-2 text-slate-600 hover:text-blue-400 transition-colors"
                          title="Edit Quiz"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => {
                            const url = `${window.location.origin}/quiz/${quiz.id}`;
                            navigator.clipboard.writeText(url);
                            alert("Quiz link copied to clipboard!");
                          }}
                          className="p-2 text-slate-600 hover:text-emerald-400 transition-colors"
                          title="Copy Share Link"
                        >
                          <Link2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(quiz.id!)}
                          className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                          title="Delete Quiz"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{quiz.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-grow">{quiz.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={14} className="text-blue-400/60" />
                        <span>{quiz.defaultQuestionTime}s per Q</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Zap size={14} className="text-yellow-400/60" />
                        <span className="capitalize">{quiz.mode} Mode</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <HelpCircle size={14} className="text-purple-400/60" />
                        <span>{quiz.questions.length} Questions</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link 
                        href={`/admin/quiz/${quiz.id}/control`}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white h-10 rounded-lg text-sm font-bold border border-slate-800 hover:bg-slate-800 transition-all"
                      >
                        <Play size={14} className={quiz.status === 'in_progress' ? 'text-emerald-400 animate-pulse' : ''} />
                        Control
                      </Link>
                      <Link 
                        href={`/admin/quiz/${quiz.id}/results`}
                        className="p-2 bg-slate-900 text-slate-400 h-10 w-10 flex items-center justify-center rounded-lg border border-slate-800 hover:text-white transition-all"
                        title="View Results"
                      >
                        <Trophy size={16} />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
