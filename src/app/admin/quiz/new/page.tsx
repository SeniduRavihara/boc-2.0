"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { addQuiz } from '@/firebase/api';
import { Question } from '@/types';

export default function NewQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      points: 10
    }
  ]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      points: 10
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleOptionChange = (qId: string, oIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[oIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim() || !description.trim()) {
      setError("Please fill in the title and description.");
      return;
    }

    const invalidQuestion = questions.find(q => !q.text.trim() || q.options.some(o => !o.trim()));
    if (invalidQuestion) {
      setError("Please ensure all questions and options are filled out.");
      return;
    }

    try {
      setLoading(true);
      await addQuiz({
        title,
        description,
        timeLimit,
        questions,
        isActive: true
      });
      router.push('/admin/quiz');
    } catch (err: any) {
      setError(err.message || "Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <Link href="/admin/quiz" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Quizzes
          </Link>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Create New Quiz</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
          {/* General Info */}
          <GlassCard className="p-8 border-slate-800/50">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-purple-400" size={20} /> General Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Quiz Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Cloud Fundamentals 2024"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What is this quiz about?"
                  rows={3}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 transition-all font-medium resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Time Limit (Minutes)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    value={timeLimit}
                    onChange={e => setTimeLimit(parseInt(e.target.value))}
                    min={1}
                    className="w-32 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                  <span className="text-slate-500">minutes for the whole quiz</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Questions */}
          <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="text-blue-400" size={20} /> Questions ({questions.length})
              </h2>
              <button 
                type="button" 
                onClick={handleAddQuestion}
                className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <PlusCircle size={18} /> Add Question
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {questions.map((question, qIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-8 border-slate-800/50 relative">
                    <button 
                      type="button"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="absolute top-6 right-6 p-2 text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="mb-6 pr-12">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Question {qIndex + 1}</label>
                      <input 
                        type="text" 
                        value={question.text}
                        onChange={e => handleQuestionChange(question.id, 'text', e.target.value)}
                        placeholder="Enter your question here..."
                        className="w-full bg-transparent border-b border-slate-800 p-2 text-xl font-semibold text-white outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="relative">
                          <input 
                            type="text" 
                            value={option}
                            onChange={e => handleOptionChange(question.id, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className={`w-full bg-slate-950/50 border rounded-xl p-4 pr-12 text-sm outline-none transition-all ${
                              question.correctOptionIndex === oIndex 
                                ? 'border-emerald-500/50 text-emerald-400' 
                                : 'border-slate-800 text-slate-400 focus:border-slate-600'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleQuestionChange(question.id, 'correctOptionIndex', oIndex)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                              question.correctOptionIndex === oIndex ? 'text-emerald-500' : 'text-slate-700 hover:text-slate-500'
                            }`}
                          >
                            <CheckCircle2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Points:</label>
                      <input 
                        type="number" 
                        value={question.points}
                        onChange={e => handleQuestionChange(question.id, 'points', parseInt(e.target.value))}
                        className="w-20 bg-slate-950/50 border border-slate-800 rounded-lg p-2 text-sm text-center outline-none"
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl flex items-center gap-3 text-rose-400">
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-4xl w-[calc(100%-48px)] z-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Save and Publish Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
