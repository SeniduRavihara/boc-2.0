"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Mail, 
  Users, 
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const dashboardCards = [
  { 
    title: 'Task Tracking', 
    description: 'Manage development tasks and team progress.', 
    href: '/admin/task-tracking', 
    icon: CheckSquare, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  { 
    title: 'Quiz Management', 
    description: 'Create and organize interactive competitions.', 
    href: '/admin/quiz', 
    icon: Trophy, 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  { 
    title: 'Email Tool', 
    description: 'Deploy announcements and session updates.', 
    href: '/admin/email-tool', 
    icon: Mail, 
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20'
  },
  { 
    title: 'Attendance', 
    description: 'Monitor session participation in real-time.', 
    href: '/admin/attendance', 
    icon: Users, 
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-8 md:p-12 space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white tracking-tight"
          >
            Management Center
          </motion.h1>
          <p className="text-slate-500 font-medium mt-2">Welcome back. Everything is running smoothly.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Activity size={14} /> LIVE STATUS
          </div>
          <div className="flex items-center gap-2 px-4 py-2 text-slate-400 text-xs font-bold">
            <TrendingUp size={14} /> 124 ACTIVE TEAMS
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={card.href} className="block group">
              <GlassCard className={`p-8 border-slate-800/50 hover:bg-slate-900/30 transition-all duration-500 flex flex-col h-full group-hover:${card.border}`}>
                <div className={`w-14 h-14 ${card.bg} ${card.border} rounded-2xl flex items-center justify-center ${card.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <card.icon size={28} />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-black text-white">{card.title}</h2>
                    <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                  Open Controller <ChevronRight size={12} />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Secondary Tools section could go here */}
      <div className="pt-8 opacity-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Internal Monitoring</h3>
        <div className="h-64 bg-slate-900/20 border border-slate-900 border-dashed rounded-3xl flex items-center justify-center">
          <p className="text-slate-700 text-sm font-bold">TELEMETRY DATA UNAVAILABLE</p>
        </div>
      </div>
    </div>
  );
}

// Re-using icon for footer consistency
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
