"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
/* ─── data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "500+", label: "Registered Participants" },
  { value: "3rd", label: "Annual Edition" },
  { value: "20+", label: "Industry Partners" },
  { value: "48H", label: "Competition Duration" },
];

/* ─── stat card ─────────────────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group flex flex-col items-center justify-center py-10 px-4 border border-blue-500/20 bg-[#080c16] overflow-hidden min-w-0"
    >
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />
      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-500" />
      <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
        {value}
      </span>
      <span className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 text-center">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── main section ──────────────────────────────────────────────────────────── */
export function AboutNew() {
  const headingRef = useRef(null);
  const headingView = useInView(headingRef, { once: true });

  return (
    <section
      id="about-us"
      className="w-full bg-[#050812] relative overflow-x-hidden py-24 md:py-32"
    >
      {/* Background Pattern with Fade */}
      <div 
        className="absolute inset-0 bg-pattern-cube pointer-events-none" 
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
        }}
      />
      {/* Ambient glows */}
      {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/4 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" /> */}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Section label + headline ── */}
        <div ref={headingRef} className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headingView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.35em] text-blue-500 mb-5"
          >
            Who We Are
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              /* FIX: start at text-4xl on mobile so it doesn't blow past viewport */
              className="font-reglo text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-none min-w-0 bg-[linear-gradient(180deg,#0077FF_0%,#00336E_100%)] bg-clip-text text-transparent"
            >
              About <br />
              <span>Beauty of Cloud 2.0</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="font-uncut text-slate-400 text-base sm:text-lg leading-relaxed min-w-0"
            >
              Beauty of Cloud 2.0 is Sri Lanka&apos;s first and premier
              undergraduate cloud computing competition — a platform where the
              next generation of engineers design, deploy, and defend real cloud
              infrastructure under pressure.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headingView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="h-px bg-gradient-to-r from-blue-500/60 via-blue-500/20 to-transparent mt-12 origin-left"
          />
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-blue-500/10 mb-20 md:mb-24">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
