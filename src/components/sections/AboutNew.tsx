"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { OrbitingCircles } from "@/components/ui/OrbitingCircles";
import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";
/* ─── data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "500+", label: "Registered Participants" },
  { value: "3rd", label: "Annual Edition" },
  { value: "20+", label: "Industry Partners" },
  { value: "48H", label: "Competition Duration" },
];

const OrbitIcons = {
  notion: () => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
      <path d="M6.017 4.313 61.35.226c6.797-.583 8.543-.19 12.817 2.917L91.83 15.586c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193l-64.256 3.89c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94C.967 76.827 0 74.497 0 71.773V11.113c0-3.497 1.553-6.413 6.017-6.8Z" fill="#fff"/>
      <path d="M61.35.227 6.017 4.313C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.433-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.143C69.894.036 68.147-.357 61.35.227Z" fill="#000"/>
    </svg>
  ),
  openai: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" className="fill-white">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944z" />
    </svg>
  ),
  drive: () => (
    <svg width="40" height="40" viewBox="0 0 87.3 78" fill="none">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  ),
  whatsapp: () => (
    <svg width="40" height="40" viewBox="0 0 175.216 175.552" fill="none">
      <circle cx="88" cy="88" r="72" fill="url(#wa)" />
      <path d="M123.5 103.4c-.46-.77-1.69-1.23-3.53-2.15-1.84-.92-10.88-5.36-12.56-5.97-1.69-.62-2.91-.92-4.14.92-1.22 1.84-4.74 5.98-5.81 7.2-1.08 1.23-2.15 1.39-3.99.47-1.84-.92-7.76-2.87-14.79-9.13-5.46-4.87-9.15-10.88-10.22-12.72-1.08-1.84-.12-2.84.8-3.76.83-.82 1.84-2.14 2.76-3.21.92-1.08 1.23-1.84 1.84-3.07.61-1.23.3-2.3-.16-3.22-.46-.92-4.03-9.99-5.66-13.64-1.38-3.06-2.83-3.13-4.14-3.18l-3.53-.04c-1.22 0-3.22.46-4.9 2.3-1.68 1.84-6.44 6.29-6.44 15.34 0 9.05 6.6 17.78 7.51 19.01.92 1.22 12.72 20.37 31.41 27.75 15.52 6.12 18.69 4.9 22.06 4.6 3.37-.3 10.88-4.45 12.41-8.74 1.54-4.29 1.54-7.97 1.08-8.74Z" fill="#fff"/>
      <defs>
        <linearGradient id="wa" x1="88" y1="16" x2="88" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#57d163" />
          <stop offset="1" stopColor="#23b33a" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

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
              className="font-reglo text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-none min-w-0"
            >
              <GradientShinyTitle text="About" className="block" speed={2.2} delay={0.6} />
              <GradientShinyTitle
                text="Beauty of Cloud 2.0"
                className="block"
                speed={2.2}
                delay={0.9}
              />
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

        <div className="relative mx-auto mt-8 h-44 w-full max-w-3xl overflow-hidden">
          <div className="absolute inset-x-0 bottom-[-160px] h-[360px]">
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050812] via-[#050812]/70 to-transparent z-20" />
              <OrbitingCircles iconSize={40} radius={118} speed={0.9} className="text-white/80">
                <div className="rounded-full bg-[#0b1324] p-3 shadow-[0_0_25px_rgba(59,130,246,0.18)]"><OrbitIcons.whatsapp /></div>
                <div className="rounded-full bg-[#0b1324] p-3 shadow-[0_0_25px_rgba(59,130,246,0.18)]"><OrbitIcons.notion /></div>
                <div className="rounded-full bg-[#0b1324] p-3 shadow-[0_0_25px_rgba(59,130,246,0.18)]"><OrbitIcons.openai /></div>
                <div className="rounded-full bg-[#0b1324] p-3 shadow-[0_0_25px_rgba(59,130,246,0.18)]"><OrbitIcons.drive /></div>
                <div className="rounded-full bg-[#0b1324] p-3 shadow-[0_0_25px_rgba(59,130,246,0.18)]"><OrbitIcons.whatsapp /></div>
              </OrbitingCircles>
              <OrbitingCircles iconSize={30} radius={78} reverse speed={1.6} className="text-white/70">
                <div className="rounded-full bg-[#07101f] p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.14)]"><OrbitIcons.notion /></div>
                <div className="rounded-full bg-[#07101f] p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.14)]"><OrbitIcons.openai /></div>
                <div className="rounded-full bg-[#07101f] p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.14)]"><OrbitIcons.drive /></div>
                <div className="rounded-full bg-[#07101f] p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.14)]"><OrbitIcons.whatsapp /></div>
              </OrbitingCircles>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
