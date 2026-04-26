"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Search, 
  ArrowLeft, 
  Clock,
  Award,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Volume2,
  VolumeX,
  Target,
  Maximize2,
  Minimize2,
  User
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { subscribeToLeaderboard } from '@/firebase/api';
import { QuizSubmission } from '@/types';

type CompetitionMember = QuizSubmission & {
  rank: number;
  change: number;
};

// Colors from Sample Design
const COLORS = {
  darkest: "#030712", // Custom deep dark matching project
  darker: "#111827",  // bg-slate-900
  dark: "#1f2937",    // bg-slate-800
  medium: "#374151",  // bg-slate-700
  light: "#4b5563",   // bg-slate-600
  accent: "#a855f7"   // purple-500
};

export default function LeaderboardPage() {
  const [submissions, setSubmissions] = useState<CompetitionMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  
  const prevRankingsRef = useRef<Record<string, number>>({});
  const rankUpSoundRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      rankUpSoundRef.current = new Audio('/sounds/rank-up.mp3');
      rankUpSoundRef.current.volume = 0.3;
    }

    setLoading(true);
    const unsubscribe = subscribeToLeaderboard((rawData) => {
      processSubmissions(rawData);
      setLoading(false);
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') toggleProjectorMode();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleProjectorMode = () => {
    if (!isProjectorMode) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsProjectorMode(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const processSubmissions = (data: QuizSubmission[]) => {
    const nextRankings: Record<string, number> = {};
    let playsRankUpSound = false;

    // Deduplicate by email (Keep highest score)
    const unique = new Map<string, QuizSubmission>();
    data.forEach(sub => {
      const existing = unique.get(sub.userEmail);
      if (!existing || sub.totalScore > existing.totalScore) {
        unique.set(sub.userEmail, sub);
      } else if (sub.totalScore === existing.totalScore) {
        const subTime = (sub.completedAt as any)?.toMillis?.() || Number(sub.completedAt) || 0;
        const existingTime = (existing.completedAt as any)?.toMillis?.() || Number(existing.completedAt) || 0;
        if ((subTime as number) < (existingTime as number)) unique.set(sub.userEmail, sub);
      }
    });

    const uniqueData = Array.from(unique.values()).sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      const timeA = (a.completedAt as any)?.toMillis?.() || Number(a.completedAt) || 0;
      const timeB = (b.completedAt as any)?.toMillis?.() || Number(b.completedAt) || 0;
      return (timeA as number) - (timeB as number);
    });

    const processed = uniqueData.map((sub, index) => {
      const currentRank = index + 1;
      const prevRank = prevRankingsRef.current[sub.userEmail];
      let change = 0;

      if (prevRank) {
        change = prevRank - currentRank;
        if (change > 0) playsRankUpSound = true;
      }

      nextRankings[sub.userEmail] = currentRank;
      return { ...sub, rank: currentRank, change } as CompetitionMember;
    });

    if (playsRankUpSound && !isMuted && rankUpSoundRef.current) {
      rankUpSoundRef.current.play().catch(() => {});
    }

    prevRankingsRef.current = nextRankings;
    setSubmissions(processed);
  };

  const filteredSubmissions = submissions.filter(s => 
    s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const TopTeam = submissions[0];
  const BestTime = submissions.length > 0 ? Math.min(...submissions.map(s => s.timeTaken)) : null;

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-[#030712] text-slate-200 font-sans transition-all duration-500 overflow-y-auto px-4 py-10 md:px-10`}
    >
      <div className={`max-w-5xl mx-auto relative z-10 ${isProjectorMode ? 'mt-10' : ''}`}>
        
        {/* Controls Overlay (Projector Friendly) */}
        <div className="absolute top-0 right-0 flex items-center gap-3 z-50">
           {!isProjectorMode && (
              <Link href="/quiz" className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all mr-2">
                <ArrowLeft size={20} />
              </Link>
           )}
           <button 
             onClick={toggleProjectorMode} 
             className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
             title="Toggle Fullscreen (F)"
            >
             {isProjectorMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
           </button>
           <button 
             onClick={() => setIsMuted(!isMuted)} 
             className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
           >
             {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
        </div>

        {/* Header - Aligned with Sample */}
        <div className="flex items-center gap-3 mb-8">
           <Crown className="text-amber-500" size={32} />
           <h1 className="text-3xl font-black text-white tracking-tight">QUIZ LEADERBOARD</h1>
        </div>

        {/* Stats Grid - Exact Sample Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
                <Trophy size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Top Delegate</p>
                <p className="text-xl font-bold text-white truncate max-w-[150px]">{TopTeam?.userName || "N/A"}</p>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Best Time</p>
                <p className="text-xl font-bold text-white">{BestTime ? formatTime(BestTime) : "N/A"}</p>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <Award size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Competition</p>
                <p className="text-xl font-bold text-white">{submissions.length} Active</p>
              </div>
           </div>
        </div>

        {/* Main Ranking Table - Logic-wise following grid-cols-12 from sample */}
        <div className="bg-slate-950/50 border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
           {/* Table Header */}
           <div className="grid grid-cols-12 px-8 py-5 bg-slate-900/80 border-b border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Delegate</div>
              <div className="col-span-2 text-center">Progress</div>
              <div className="col-span-2 text-right px-4">Time</div>
              <div className="col-span-2 text-center">Trend</div>
           </div>

           {/* Table Body */}
           <div className="divide-y divide-slate-800/30 max-h-[600px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-20 text-center animate-pulse text-slate-600 font-bold uppercase tracking-widest">Synchronizing Leaderboard...</div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest">No results detected yet</div>
              ) : (
                <AnimatePresence mode="popLayout">
                   {filteredSubmissions.map((sub) => (
                      <motion.div 
                        key={sub.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`grid grid-cols-12 items-center px-8 py-6 transition-all group ${
                           sub.rank <= 3 ? 'bg-slate-900/30' : 'hover:bg-slate-900/20'
                        }`}
                      >
                         {/* Rank Column */}
                         <div className="col-span-1 flex justify-center">
                            {sub.rank === 1 ? <Crown size={24} className="text-amber-500" /> :
                             sub.rank === 2 ? <Medal size={24} className="text-slate-400" /> :
                             sub.rank === 3 ? <Medal size={24} className="text-orange-500" /> :
                             <span className="text-xl font-black text-slate-700 group-hover:text-purple-400 transition-colors">#{sub.rank}</span>}
                         </div>

                         {/* Delegate Column */}
                         <div className="col-span-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:border-purple-500/30 group-hover:text-white transition-all">
                               <User size={20} />
                            </div>
                            <div className="min-w-0">
                               <p className="font-bold text-white truncate pr-4">{sub.userName}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-slate-500 font-mono tracking-tighter truncate">{sub.userEmail}</span>
                               </div>
                            </div>
                         </div>

                         {/* Progress/Score Column */}
                         <div className="col-span-2 text-center flex flex-col items-center">
                            <span className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors leading-none">{sub.score}</span>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">POINTS</span>
                         </div>

                         {/* Time Column */}
                         <div className="col-span-2 text-right px-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950/50 border border-slate-800 rounded-lg">
                               <Clock size={12} className="text-blue-500" />
                               <span className="text-xs font-mono font-bold text-slate-400">{formatTime(sub.timeTaken)}</span>
                            </div>
                         </div>

                         {/* Trend Column */}
                         <div className="col-span-2 flex justify-center">
                            <motion.div 
                               key={sub.change}
                               initial={{ scale: 0.8, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                                 sub.change > 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                 sub.change < 0 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                                 'bg-slate-800/50 text-slate-700'
                               }`}
                            >
                               {sub.change > 0 ? <TrendingUp size={14} /> : sub.change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                               {sub.change !== 0 && Math.abs(sub.change)}
                               {sub.change === 0 && "-"}
                            </motion.div>
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
              )}
           </div>
        </div>

        {/* Search - Subtle Footer in Projector Mode */}
        {!isProjectorMode && (
          <div className="mt-8 max-w-sm ml-auto">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="text" 
                  placeholder="Focus Hero Scan..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 pl-10 text-sm text-white outline-none focus:border-purple-500/50 transition-all backdrop-blur-md"
                />
             </div>
          </div>
        )}

      </div>
      
      {/* Sample Style Footer */}
      <footer className="max-w-5xl mx-auto mt-16 text-center text-slate-700 font-bold text-[10px] uppercase tracking-[0.4em] mb-10">
         Data Synchronized Real-time | Beauty of Cloud 2.0 Official
      </footer>
    </div>
  );
}
