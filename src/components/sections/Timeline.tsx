'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientShinyTitle } from '@/components/ui/GradientShinyTitle';
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp, Laptop, Users, Rocket, Trophy, BookOpen, AlertCircle } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  mode: string;
  desc: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: React.ReactNode;
  sessions?: Session[];
  side: 'left' | 'right';
  color: string;
}

const SESSIONS: Session[] = [
  { id: 'S1', title: 'Cloud Fundamentals & AWS Core Services', date: 'Apr 26', time: '19:00', type: 'AWS', mode: 'Online', desc: 'IAM, EC2, S3, VPC' },
  { id: 'S2', title: 'Cloud Compute & Networking', date: 'May 7', time: '19:00', type: 'GCP', mode: 'Online', desc: 'GCE, Cloud Run, VPC, Load Balancing' },
  { id: 'S3', title: 'Serverless & Cloud-Native Architecture', date: 'May 16', time: '10:00', type: 'AWS', mode: 'Physical', desc: 'Lambda, API Gateway, Containers' },
  { id: 'S4', title: 'Cloud Data & Storage Solutions', date: 'May 23', time: '10:00', type: 'GCP', mode: 'Physical', desc: 'BigQuery, Cloud Storage, Databases' },
  { id: 'S5', title: 'DevOps, SRE & Platform Engineering', date: 'Jun 2', time: '19:00', type: 'AWS', mode: 'Online', desc: 'CI/CD, IaC, Observability' },
  { id: 'S6', title: 'Cloud Security & Production Best Practices', date: 'Jun 7', time: '10:00', type: 'GCP', mode: 'Physical', desc: 'IAM, Monitoring, Cost' },
];

const DMZ_EVENTS: Session[] = [
  { id: 'D1', title: 'Office Hours', date: 'Jul 2', time: '19:00', type: 'Q&A', mode: 'Online', desc: 'Optional async Q&A on quizizz(wayground)' },
  { id: 'D2', title: 'Architecture Review', date: 'Jul 9', time: '19:00', type: 'Review', mode: 'Online', desc: 'Drop drafts in #arch-review with knowledge partners' },
  { id: 'D3', title: 'Cloud Article series', date: 'Jul 16', time: '19:00', type: 'Article', mode: 'Online', desc: 'Weekly deep-dives into advanced cloud topics' },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'workshops',
    title: 'Skill Up Workshop Series',
    date: 'Apr 26 – Jun 7',
    description: '6 intensive sessions transitioning from Cloud fundamentals to production best practices.',
    icon: <BookOpen className="w-5 h-5" />,
    sessions: SESSIONS,
    side: 'right',
    color: '#3b82f6'
  },
  {
    id: 'reg',
    title: 'Team Registrations Open',
    date: 'May 8',
    description: 'Form your crew (up to 4 members) and claim your spot. (2-week window)',
    icon: <Users className="w-5 h-5" />,
    side: 'left',
    color: '#60a5fa'
  },
  {
    id: 'ps1',
    title: 'Problem Statement Release',
    date: 'May 24',
    description: 'Round 1 architecture challenge drops. The battle officially begins.',
    icon: <Rocket className="w-5 h-5" />,
    side: 'right',
    color: '#10b981'
  },
  {
    id: 'exam',
    title: 'Exam Blackout',
    date: 'Jun 29',
    description: 'No workshops. Focus on your university exams while brainstorming async.',
    icon: <AlertCircle className="w-5 h-5" />,
    side: 'left',
    color: '#64748b'
  },
  {
    id: 'dmz',
    title: 'DMZ (The Knowledge Hub)',
    date: 'Jul 2 – Jul 16',
    description: 'Light activity period: Office hours, architecture reviews, and technical articles.',
    icon: <Laptop className="w-5 h-5" />,
    sessions: DMZ_EVENTS,
    side: 'right',
    color: '#a855f7'
  },
  {
    id: 'r1',
    title: 'Round 1 Submission',
    date: 'Jul 20',
    description: 'Deadline for Architecture & Proposal Submission. Show us your cloud-native vision.',
    icon: <Rocket className="w-5 h-5" />,
    side: 'left',
    color: '#f43f5e'
  },
  {
    id: 'r1r',
    title: 'Shortlist Announcement',
    date: 'Jul 23',
    description: 'Round 1 results are out. Top teams move to the live prototype defense.',
    icon: <Users className="w-5 h-5" />,
    side: 'right',
    color: '#fbbf24'
  },
  {
    id: 'r2',
    title: 'Live Prototype Demo',
    date: 'Jul 26',
    description: 'Shortlisted teams present their working prototypes live to the industry panel.',
    icon: <Laptop className="w-5 h-5" />,
    side: 'left',
    color: '#f97316'
  },
  {
    id: 'finale',
    title: 'Grand Finale',
    date: 'Aug 2',
    description: 'Final pitches, judging, and the prestigious Awarding Ceremony.',
    icon: <Trophy className="w-5 h-5" />,
    side: 'right',
    color: '#eab308'
  }
];

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSessions = event.sessions && event.sessions.length > 0;

  return (
    <div className={`relative flex items-center md:justify-between group w-full ${event.side === 'left' ? 'md:flex-row-reverse' : ''}`}>
      {/* Horizontal branch line for desktop */}
      <div
        className={`absolute top-1/2 h-px bg-blue-500/20 hidden md:block ${
          event.side === 'left' ? 'left-[calc(50%+1.5rem)]' : 'right-[calc(50%+1.5rem)]'
        }`}
        style={{ width: 'calc(45% - 5rem)' }}
      />

      {/* Icon Node */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center">
        <div 
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-[#050812]"
          style={{ 
            borderColor: `${event.color}40`,
            boxShadow: `0 0 20px ${event.color}20`
          }}
        >
          <div style={{ color: event.color }}>
            {event.icon}
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className={`w-full md:w-[45%] ${event.side === 'left' ? 'md:text-right' : 'md:text-left'}`}>
        <motion.div
          initial={{ opacity: 0, x: event.side === 'left' ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
          className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 relative overflow-hidden group/card"
          onClick={() => hasSessions && setIsExpanded(!isExpanded)}
          style={{ cursor: hasSessions ? 'pointer' : 'default' }}
        >
          {/* Accent glow */}
          <div 
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"
            style={{ background: event.color }}
          />
          
          <div className="relative z-10">
            <div className={`flex items-center gap-3 mb-3 ${event.side === 'left' ? 'md:flex-row-reverse' : ''}`}>
              <span 
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded border border-white/5 bg-white/5"
                style={{ color: event.color }}
              >
                {event.date}
              </span>
              {hasSessions && (
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                  {event.sessions?.length} Events
                </span>
              )}
            </div>

            <h3 className="font-reglo text-xl md:text-2xl text-white mb-2 tracking-tight group-hover/card:text-blue-400 transition-colors">
              {event.title}
            </h3>
            
            <p className="font-uncut text-slate-400 text-sm leading-relaxed mb-4">
              {event.description}
            </p>

            {hasSessions && (
              <div className={`flex items-center gap-2 text-xs font-mono text-blue-500 mt-2 ${event.side === 'left' ? 'md:justify-end' : ''}`}>
                <span>{isExpanded ? 'Hide Schedule' : 'View Full Schedule'}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && hasSessions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                  {event.sessions?.map((session, sIdx) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sIdx * 0.05 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          {session.id}
                        </span>
                        <div className="flex gap-3 items-center text-[10px] text-white/40 font-mono">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {session.date}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {session.time}</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{session.title}</h4>
                      <p className="text-[11px] text-slate-500 mb-2">{session.desc}</p>
                      <div className="flex gap-4 items-center mt-2">
                        <span className="text-[10px] text-white/30 flex items-center gap-1 uppercase tracking-tighter">
                          <MapPin size={10} /> {session.mode}
                        </span>
                        <span className="text-[10px] text-white/30 flex items-center gap-1 uppercase tracking-tighter">
                          <Laptop size={10} /> {session.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Icon */}
          <div className="md:hidden absolute top-6 right-6" style={{ color: event.color }}>
            {event.icon}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Timeline() {
  return (
    <section id="timeline" className="py-32 bg-[#050812] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm"
          >
            <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-[0.3em]">
              Roadmap 2026
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-reglo text-5xl md:text-7xl font-black tracking-tighter"
          >
            <GradientShinyTitle text="The Journey" speed={2} delay={0.6} />
          </motion.h2>
          <p className="mt-6 text-slate-400 font-uncut max-w-xl mx-auto">
            From technical mastery to the grand stage. Follow the path of the next generation of cloud-native engineers.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {TIMELINE_EVENTS.map((event, index) => (
              <TimelineCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* Final CTA/Finish decoration */}
        <div className="mt-32 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-8 animate-spin-slow">
            <Trophy className="w-8 h-8 text-white/20" />
          </div>
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">End of Roadmap</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default Timeline;
