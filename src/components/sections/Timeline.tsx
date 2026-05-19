'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GradientShinyTitle } from '@/components/ui/GradientShinyTitle';

const MILESTONES = [
  { id: 'M1', title: "Workshop\nSeries Start", date: "2026.04.26", left: "10%", mobileTop: 40 },
  { id: 'M2', title: "Ideathon Registrations\nOpen", date: "2026.05.23", left: "30%", mobileTop: 310 },
  { id: 'M3', title: "Problem Statement\nRelease", date: "2026.05.24", left: "50%", mobileTop: 520 },
  { id: 'M4', title: "Competition\nRounds (R1 Ends)", date: "2026.07.20", left: "70%", mobileTop: 720 },
  { id: 'M5', title: "Grand\nFinale", date: "2026.08.02", left: "90%", mobileTop: 920 },
];

const SESSIONS = [
  { id: 'S1', title: "Session 1:\nGetting Into the Cloud with AWS", date: "2026.04.26", left: "20%", mobileTop: 130 },
  { id: 'S2', title: "Session 2:\nCloud Compute & Networking on GCP", date: "2026.05.23", left: "40%", mobileTop: 220 },
  { id: 'S3', title: "Upcoming\nSessions...", date: "TBA", left: "60%", isGhost: true, mobileTop: 400 },
];

export function Timeline() {
  return (
    <section id="competition" className="relative w-full bg-[#050812] py-24 md:py-32 overflow-hidden border-y border-white/5">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,144,255,0.15),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center max-w-4xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-reglo text-5xl md:text-7xl font-black tracking-tighter mb-8 text-center uppercase"
          >
            <GradientShinyTitle text="Event Timeline" speed={2} delay={0.1} />
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-8"
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed md:leading-loose font-mono text-center"
          >
            Beauty of Cloud 2.0 is the second edition of Sri Lanka&apos;s first inter-university student-led
            cloud computing workshop series and competition. This edition expands to a structured
            4-month program with 6 progressive sessions, and a competitive architectural cloud
            solution challenge.
          </motion.p>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP TIMELINE GRAPHIC (Hidden on Mobile)               */}
        {/* ========================================================= */}
        <div className="hidden md:block relative w-full max-w-6xl mx-auto overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-w-[1000px] md:min-w-full relative h-[450px]">
            
            {/* 1. MAIN TRACK (Y = 280px) */}
            <div className="absolute top-[280px] left-[5%] right-[5%] h-[3px] border-t-[3px] border-dashed border-[#1E90FF]/80" />

            {/* 2. BRANCH TRACK (Y = 120px) */}
            {/* React Flow style SmoothStep curve coming up from M1 to the branch line */}
            <svg 
              className="absolute top-[120px] left-[10%] w-[5%] h-[160px] pointer-events-none overflow-visible translate-y-[1.5px]" 
              viewBox="0 0 100 160" 
              preserveAspectRatio="none"
            >
              <path 
                d="M 0 160 L 0 50 Q 0 0 50 0 L 100 0" 
                fill="none" 
                stroke="#1E90FF" 
                strokeWidth="3" 
                strokeDasharray="5 5" 
                strokeOpacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            
            {/* The horizontal top branch line fading out */}
            <div 
              className="absolute top-[120px] left-[15%] w-[55%] h-[3px] border-t-[3px] border-dashed border-[#1E90FF]/40"
              style={{ maskImage: "linear-gradient(to right, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)" }}
            />

            {/* 3. SESSION NODES (Top Branch) */}
            {SESSIONS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className={`absolute top-[120px] -translate-x-1/2 flex flex-col items-center w-[160px] group ${item.isGhost ? 'opacity-50' : ''}`}
                style={{ left: item.left }}
              >
                {/* Text Above the Dot */}
                <div className="absolute bottom-[20px] text-center w-full">
                  <h3 className="text-white font-bold text-[13px] md:text-sm leading-tight mb-2 group-hover:text-[#1E90FF] transition-colors whitespace-pre-line">{item.title}</h3>
                  <p className="text-[#1E90FF] font-mono text-[10px] md:text-xs tracking-widest font-semibold bg-[#1E90FF]/10 inline-block px-2 py-1 rounded-full border border-[#1E90FF]/20 group-hover:border-[#1E90FF]/50 transition-colors">
                    {item.date}
                  </p>
                </div>
                
                {/* Commit Dot */}
                <div className="absolute top-0 -translate-y-1/2 w-5 h-5 rounded-full bg-[#050812] border-[3px] border-[#1E90FF] shadow-[0_0_15px_rgba(30,144,255,0.6)] group-hover:scale-125 transition-transform duration-300" />
              </motion.div>
            ))}

            {/* 4. MILESTONE PINS (Main Track) */}
            {MILESTONES.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="absolute top-[256px] -translate-x-1/2 flex flex-col items-center w-[160px] group"
                style={{ left: item.left }}
              >
                {/* Pin Icon (Y=256 aligns its visual center (24px down) with Y=280 main track) */}
                <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110 mb-2">
                  <svg viewBox="0 0 24 24" className="w-14 h-14 md:w-16 md:h-16 text-[#1E90FF] drop-shadow-[0_0_15px_rgba(30,144,255,0.6)]" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="3.5" fill="#050812" />
                  </svg>
                </div>
                
                {/* Text Below */}
                <div className="text-center mt-2">
                  <h3 className="text-white font-bold text-[13px] md:text-base lg:text-lg leading-tight md:leading-snug whitespace-pre-line mb-3 group-hover:text-[#1E90FF] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/80 font-mono text-[11px] md:text-sm tracking-widest font-semibold bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10 group-hover:border-[#1E90FF]/30 transition-colors duration-300">
                    {item.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* ========================================================= */}
        {/* MOBILE TIMELINE GRAPHIC (Vertical, Hidden on Desktop)     */}
        {/* ========================================================= */}
        <div className="md:hidden relative w-full h-[1050px] mt-4">
          
          {/* 1. MAIN TRACK (Left = 45%) */}
          <div className="absolute left-[45%] top-0 bottom-[40px] w-[3px] border-l-[3px] border-dashed border-[#1E90FF]/80 -translate-x-[1.5px]" />

          {/* 2. BRANCH TRACK (Starts at 45%, goes right) */}
          {/* React Flow style SmoothStep curve from M1 to the right */}
          <svg className="absolute top-[40px] left-[45%] w-[42px] h-[40px] pointer-events-none overflow-visible" viewBox="0 0 42 40">
            <path 
              d="M 0 0 C 0 20, 42 20, 42 40" 
              fill="none" 
              stroke="#1E90FF" 
              strokeWidth="3" 
              strokeDasharray="5 5" 
              strokeOpacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          
          {/* Vertical branch line fading down */}
          <div 
            className="absolute top-[80px] left-[calc(45%+42px)] w-[3px] h-[400px] border-l-[3px] border-dashed border-[#1E90FF]/40 -translate-x-[1.5px]"
            style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
          />

          {/* 3. SESSION NODES (Branch Track) */}
          {SESSIONS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className={`absolute left-[calc(45%+42px)] w-[calc(55%-42px)] flex items-start group ${item.isGhost ? 'opacity-50' : ''}`}
              style={{ top: item.mobileTop, transform: 'translateY(-8px)' }}
            >
              {/* Commit Dot (Centered on branch line) */}
              <div className="shrink-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050812] border-[2.5px] border-[#1E90FF] shadow-[0_0_10px_rgba(30,144,255,0.6)] group-hover:scale-125 transition-transform duration-300 z-10 mt-[2px]" />
              
              {/* Text to the RIGHT */}
              <div className="pr-4 pl-1">
                <h3 className="text-white font-bold text-[12px] leading-tight mb-1.5 group-hover:text-[#1E90FF] transition-colors whitespace-pre-line">{item.title}</h3>
                <p className="text-[#1E90FF] font-mono text-[9px] tracking-widest font-semibold bg-[#1E90FF]/10 inline-block px-2 py-0.5 rounded-full border border-[#1E90FF]/20">
                  {item.date}
                </p>
              </div>
            </motion.div>
          ))}

          {/* 4. MILESTONE PINS (Main Track) */}
          {MILESTONES.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute left-0 w-full flex items-start justify-end pr-[55%] group"
              style={{ top: item.mobileTop, transform: 'translateY(-8px)' }}
            >
              {/* Text to the LEFT */}
              <div className="pr-[20px] md:pr-[24px] text-right flex flex-col items-end">
                <h3 className="text-white font-bold text-[13px] sm:text-[14px] leading-tight mb-1.5 group-hover:text-[#1E90FF] transition-colors duration-300 whitespace-pre-line">
                  {item.title}
                </h3>
                <p className="text-white/80 font-mono text-[10px] tracking-widest font-semibold bg-white/5 inline-block px-2 py-0.5 rounded-full border border-white/10">
                  {item.date}
                </p>
              </div>

              {/* Pin Icon (Centered on left=45%) */}
              <div className="absolute left-[45%] -translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110 mt-[-7px]">
                <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 text-[#1E90FF] drop-shadow-[0_0_15px_rgba(30,144,255,0.6)]" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="3.5" fill="#050812" />
                </svg>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}