'use client';

import React from 'react';
import { motion } from 'framer-motion';

const EVENTS = [
  {
    id: 1,
    title: "Launch & Registration",
    date: "15th May 2026",
    description: "Official launch of BOC 2.0 and opening of registrations for all undergraduates.",
    side: 'right'
  },
  {
    id: 2,
    title: "Awareness Sessions",
    date: "20th May 2026",
    description: "Deep dive into the competition format, rules, and technical requirements.",
    side: 'left'
  },
  {
    id: 3,
    title: "Initial Screening",
    date: "5th June 2026",
    description: "Proposal submission and initial evaluation of teams based on their cloud architectures.",
    side: 'right'
  },
  {
    id: 4,
    title: "Pre-Competition Workshop",
    date: "15th June 2026",
    description: "Hands-on training sessions with industry experts on AWS, GCP, and Azure.",
    side: 'left'
  },
  {
    id: 5,
    title: "The Main Event",
    date: "25th - 27th June 2026",
    description: "48-hour non-stop cloud hackathon and infrastructure defense challenge.",
    side: 'right'
  },
  {
    id: 6,
    title: "Grand Finale",
    date: "10th July 2026",
    description: "Final presentations, judging, and the awarding ceremony for the winners.",
    side: 'left'
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="py-32 bg-[#050812] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter bg-[linear-gradient(180deg,#0077FF_0%,#00336E_100%)] bg-clip-text text-transparent"
          >
            Event Timeline
          </motion.h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto mt-6 rounded-full" />
        </div>

        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {EVENTS.map((event, index) => (
              <div key={event.id} className="relative flex items-center md:justify-between group">
                {/* Horizontal branch line for desktop */}
                <div 
                  className={`absolute top-1/2 w-8 h-px bg-blue-500/40 hidden md:block ${
                    event.side === 'left' ? 'right-1/2' : 'left-1/2'
                  }`}
                />

                {/* Number Box */}
                <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    {event.id}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] ${event.side === 'left' ? 'md:text-right' : 'md:ml-auto'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: event.side === 'left' ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="p-8 bg-white/[0.02] border border-white/10 rounded-xl hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden group/card"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-2">{event.date}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 uppercase tracking-tight">{event.title}</h3>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Mobile Number Box */}
                    <div className="absolute top-4 right-4 md:hidden w-6 h-6 bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                      {event.id}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
