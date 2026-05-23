'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GradientShinyTitle } from '@/components/ui/GradientShinyTitle';

const MILESTONES = [
  { id: 'M1', title: "Workshop\nSeries Start", date: "2026.04.26", left: "10%", mobileTop: 40 },
  { id: 'M2', title: "Ideathon Registrations\nOpen", date: "2026.05.24", left: "30%", mobileTop: 310 },
  { id: 'M3', title: "Problem Statement\nRelease", date: "2026.05.24", left: "50%", mobileTop: 520 },
  { id: 'M4', title: "Competition\nRounds (R1 Ends)", date: "2026.07.20", left: "70%", mobileTop: 720 },
  { id: 'M5', title: "Grand\nFinale", date: "2026.08.02", left: "90%", mobileTop: 920 },
];

const SESSIONS = [
  { id: 'S1', title: "Session 1:\nGetting Into the Cloud with AWS", date: "2026.04.26", left: "20%", mobileTop: 130, link: "/sessions" },
  { id: 'S2', title: "Session 2:\nFrom IDE to Production with Google Cloud", date: "2026.05.24", left: "40%", mobileTop: 220, link: "/register/session/2" },
  { id: 'S3', title: "Upcoming\nSessions...", date: "TBA", left: "60%", isGhost: true, mobileTop: 400 },
];

export function Timeline() {
  const router = useRouter();
  const [desktopWidth, setDesktopWidth] = useState(1000);
  const [mobileWidth, setMobileWidth] = useState(350);

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  // Motion Values for Milestones
  const m1x = useMotionValue(0); const m1y = useMotionValue(0);
  const m2x = useMotionValue(0); const m2y = useMotionValue(0);
  const m3x = useMotionValue(0); const m3y = useMotionValue(0);
  const m4x = useMotionValue(0); const m4y = useMotionValue(0);
  const m5x = useMotionValue(0); const m5y = useMotionValue(0);

  // Motion Values for Sessions
  const s1x = useMotionValue(0); const s1y = useMotionValue(0);
  const s2x = useMotionValue(0); const s2y = useMotionValue(0);
  const s3x = useMotionValue(0); const s3y = useMotionValue(0);

  // Motion Values for responsive widths
  const widthMV = useMotionValue(1000);
  const mobileWidthMV = useMotionValue(350);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === desktopContainerRef.current) {
          const w = entry.contentRect.width;
          setDesktopWidth(w);
          widthMV.set(w);
        } else if (entry.target === mobileContainerRef.current) {
          const w = entry.contentRect.width;
          setMobileWidth(w);
          mobileWidthMV.set(w);
        }
      }
    });

    if (desktopContainerRef.current) observer.observe(desktopContainerRef.current);
    if (mobileContainerRef.current) observer.observe(mobileContainerRef.current);

    return () => observer.disconnect();
  }, [widthMV, mobileWidthMV]);

  // Desktop paths mapping
  const dMainTrackPath = useTransform(
    [widthMV, m1x, m1y, m2x, m2y, m3x, m3y, m4x, m4y, m5x, m5y],
    (latest: any[]) => {
      const [w, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5] = latest;
      return `M ${0.05 * w} 280 ` +
        `L ${0.10 * w + x1} ${280 + y1} ` +
        `L ${0.30 * w + x2} ${280 + y2} ` +
        `L ${0.50 * w + x3} ${280 + y3} ` +
        `L ${0.70 * w + x4} ${280 + y4} ` +
        `L ${0.90 * w + x5} ${280 + y5} ` +
        `L ${0.95 * w} 280`;
    }
  );

  const dBranchTrackPath = useTransform(
    [widthMV, m1x, m1y, s1x, s1y, s2x, s2y, s3x, s3y],
    (latest: any[]) => {
      const [w, x1, y1, sx1, sy1, sx2, sy2, sx3, sy3] = latest;
      return `M ${0.10 * w + x1} ${280 + y1} ` +
        `Q ${0.10 * w + x1} ${120 + sy1} ${0.20 * w + sx1} ${120 + sy1} ` +
        `L ${0.40 * w + sx2} ${120 + sy2} ` +
        `L ${0.60 * w + sx3} ${120 + sy3} ` +
        `L ${0.70 * w} 120`;
    }
  );

  // Mobile paths mapping
  const mobMainTrackPath = useTransform(
    [mobileWidthMV, m1x, m1y, m2x, m2y, m3x, m3y, m4x, m4y, m5x, m5y],
    (latest: any[]) => {
      const [w, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5] = latest;
      return `M ${0.45 * w} 0 ` +
        `L ${0.45 * w + x1} ${40 + y1} ` +
        `L ${0.45 * w + x2} ${310 + y2} ` +
        `L ${0.45 * w + x3} ${520 + y3} ` +
        `L ${0.45 * w + x4} ${720 + y4} ` +
        `L ${0.45 * w + x5} ${920 + y5} ` +
        `L ${0.45 * w} 1010`;
    }
  );

  const mobBranchTrackPath = useTransform(
    [mobileWidthMV, m1x, m1y, s1x, s1y, s2x, s2y, s3x, s3y],
    (latest: any[]) => {
      const [w, x1, y1, sx1, sy1, sx2, sy2, sx3, sy3] = latest;
      return `M ${0.45 * w + x1} ${40 + y1} ` +
        `Q ${0.45 * w + 42} ${40 + y1} ${0.45 * w + 42 + sx1} ${130 + sy1} ` +
        `L ${0.45 * w + 42 + sx2} ${220 + sy2} ` +
        `L ${0.45 * w + 42 + sx3} ${400 + sy3} ` +
        `L ${0.45 * w + 42} 480`;
    }
  );

  // Group motion values for clean lookup
  const milestoneMVs = {
    M1: { x: m1x, y: m1y },
    M2: { x: m2x, y: m2y },
    M3: { x: m3x, y: m3y },
    M4: { x: m4x, y: m4y },
    M5: { x: m5x, y: m5y },
  };

  const sessionMVs = {
    S1: { x: s1x, y: s1y },
    S2: { x: s2x, y: s2y },
    S3: { x: s3x, y: s3y },
  };

  return (
    <section id="competition" className="relative w-full bg-[#050812] py-24 md:py-32 overflow-hidden border-y border-white/5">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,144,255,0.15),transparent_60%)] pointer-events-none" />

      {/* Background Dotted Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(30, 144, 255, 0.45) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

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
        <div 
          ref={desktopContainerRef}
          className="hidden md:block relative w-full max-w-6xl mx-auto overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="min-w-[1000px] md:min-w-full relative h-[450px]">
            
            {/* SVG Track System */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
              {/* Main Track Line */}
              <motion.path 
                d={dMainTrackPath}
                fill="none" 
                stroke="#1E90FF" 
                strokeWidth="3" 
                strokeDasharray="5 5" 
                strokeOpacity="0.8"
                className="drop-shadow-[0_0_8px_rgba(30,144,255,0.6)]"
              />
              {/* Branch Track Curve */}
              <motion.path 
                d={dBranchTrackPath}
                fill="none" 
                stroke="#1E90FF" 
                strokeWidth="3" 
                strokeDasharray="5 5" 
                strokeOpacity="0.4"
                className="drop-shadow-[0_0_6px_rgba(30,144,255,0.4)]"
                style={{ maskImage: "linear-gradient(to right, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)" }}
              />
            </svg>

            {/* 3. SESSION NODES (Top Branch) */}
            {SESSIONS.map((item, index) => {
              const mv = sessionMVs[item.id as keyof typeof sessionMVs];
              return (
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
                  <div className="absolute bottom-[20px] text-center w-full select-none pointer-events-none">
                    <h3 className="text-white font-bold text-[13px] md:text-sm leading-tight mb-2 group-hover:text-[#1E90FF] transition-colors whitespace-pre-line">{item.title}</h3>
                    <p className="text-[#1E90FF] font-mono text-[10px] md:text-xs tracking-widest font-semibold bg-[#1E90FF]/10 inline-block px-2 py-1 rounded-full border border-[#1E90FF]/20 group-hover:border-[#1E90FF]/50 transition-colors">
                      {item.date}
                    </p>
                  </div>
                  
                  {/* Commit Dot */}
                  <motion.div 
                    drag
                    style={{ x: mv.x, y: mv.y }}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.8}
                    dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
                    whileDrag={{ scale: 1.3, zIndex: 50 }}
                    onClick={() => item.link && router.push(item.link)}
                    className={`absolute top-0 -translate-y-1/2 w-5 h-5 rounded-full bg-[#050812] border-[3px] border-[#1E90FF] shadow-[0_0_15px_rgba(30,144,255,0.6)] group-hover:scale-125 transition-transform duration-300 ${item.link ? 'cursor-pointer hover:bg-[#1E90FF]/20' : 'cursor-grab active:cursor-grabbing'}`}
                  />
                </motion.div>
              );
            })}

            {/* 4. MILESTONE PINS (Main Track) */}
            {MILESTONES.map((item, index) => {
              const mv = milestoneMVs[item.id as keyof typeof milestoneMVs];
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="absolute top-[256px] -translate-x-1/2 flex flex-col items-center w-[160px] group"
                  style={{ left: item.left }}
                >
                  {/* Pin Icon */}
                  <motion.div 
                    drag
                    style={{ x: mv.x, y: mv.y }}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.8}
                    dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
                    whileDrag={{ scale: 1.2, zIndex: 50 }}
                    className="relative z-10 cursor-grab active:cursor-grabbing mb-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-14 h-14 md:w-16 md:h-16 text-[#1E90FF] drop-shadow-[0_0_15px_rgba(30,144,255,0.6)]" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="3.5" fill="#050812" />
                    </svg>
                  </motion.div>
                  
                  {/* Text Below */}
                  <div className="text-center mt-2 select-none pointer-events-none">
                    <h3 className="text-white font-bold text-[13px] md:text-base lg:text-lg leading-tight md:leading-snug whitespace-pre-line mb-3 group-hover:text-[#1E90FF] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/80 font-mono text-[11px] md:text-sm tracking-widest font-semibold bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10 group-hover:border-[#1E90FF]/30 transition-colors duration-300">
                      {item.date}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>


        {/* ========================================================= */}
        {/* MOBILE TIMELINE GRAPHIC (Vertical, Hidden on Desktop)     */}
        {/* ========================================================= */}
        <div 
          ref={mobileContainerRef}
          className="md:hidden relative w-full h-[1050px] mt-4"
        >
          {/* SVG Track System */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            {/* Main Track Line */}
            <motion.path 
              d={mobMainTrackPath}
              fill="none" 
              stroke="#1E90FF" 
              strokeWidth="3" 
              strokeDasharray="5 5" 
              strokeOpacity="0.8"
              className="drop-shadow-[0_0_8px_rgba(30,144,255,0.6)]"
            />
            {/* Branch Track Curve */}
            <motion.path 
              d={mobBranchTrackPath}
              fill="none" 
              stroke="#1E90FF" 
              strokeWidth="3" 
              strokeDasharray="5 5" 
              strokeOpacity="0.4"
              className="drop-shadow-[0_0_6px_rgba(30,144,255,0.4)]"
              style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
            />
          </svg>

          {/* 3. SESSION NODES (Branch Track) */}
          {SESSIONS.map((item, index) => {
            const mv = sessionMVs[item.id as keyof typeof sessionMVs];
            return (
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
                <motion.div 
                  drag
                  style={{ x: mv.x, y: mv.y }}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.8}
                  dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
                  whileDrag={{ scale: 1.3, zIndex: 50 }}
                  onClick={() => item.link && router.push(item.link)}
                  className={`shrink-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050812] border-[2.5px] border-[#1E90FF] shadow-[0_0_10px_rgba(30,144,255,0.6)] z-10 mt-[2px] ${item.link ? 'cursor-pointer hover:bg-[#1E90FF]/20' : 'cursor-grab active:cursor-grabbing'}`} 
                />
                
                {/* Text to the RIGHT */}
                <div className="pr-4 pl-1 select-none pointer-events-none">
                  <h3 className="text-white font-bold text-[12px] leading-tight mb-1.5 group-hover:text-[#1E90FF] transition-colors whitespace-pre-line">{item.title}</h3>
                  <p className="text-[#1E90FF] font-mono text-[9px] tracking-widest font-semibold bg-[#1E90FF]/10 inline-block px-2 py-0.5 rounded-full border border-[#1E90FF]/20">
                    {item.date}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* 4. MILESTONE PINS (Main Track) */}
          {MILESTONES.map((item, index) => {
            const mv = milestoneMVs[item.id as keyof typeof milestoneMVs];
            return (
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
                <div className="pr-[20px] md:pr-[24px] text-right flex flex-col items-end select-none pointer-events-none">
                  <h3 className="text-white font-bold text-[13px] sm:text-[14px] leading-tight mb-1.5 group-hover:text-[#1E90FF] transition-colors duration-300 whitespace-pre-line">
                    {item.title}
                  </h3>
                  <p className="text-white/80 font-mono text-[10px] tracking-widest font-semibold bg-white/5 inline-block px-2 py-0.5 rounded-full border border-white/10">
                    {item.date}
                  </p>
                </div>

                {/* Pin Icon (Centered on left=45%) */}
                <motion.div 
                  drag
                  style={{ x: mv.x, y: mv.y }}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.8}
                  dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
                  whileDrag={{ scale: 1.2, zIndex: 50 }}
                  className="absolute left-[45%] -translate-x-1/2 z-10 cursor-grab active:cursor-grabbing mt-[-7px]"
                >
                  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 text-[#1E90FF] drop-shadow-[0_0_15px_rgba(30,144,255,0.6)]" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="3.5" fill="#050812" />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}