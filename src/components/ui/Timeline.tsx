'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Cloud, Cpu, Network, Shield, Database, Trophy } from 'lucide-react';

const SESSIONS = [
  { id: '01', time: '09:00 AM', title: 'AWS_IGNITE', tag: 'CLOUD_CORE', desc: 'Architecting serverless ecosystems and lambda-driven rhythm.', icon: Zap, accent: '#3b82f6' },
  { id: '02', time: '10:30 AM', title: 'GCP_FLOW', tag: 'DATA_OPS', desc: 'Mastering BigQuery and visual data intelligence.', icon: Cloud, accent: '#0ea5e9' },
  { id: '03', time: '12:00 PM', title: 'NEURAL_SYNC', tag: 'AI_ML', desc: 'Integrating generative AI and latent space protocols.', icon: Cpu, accent: '#6366f1' },
  { id: '04', time: '02:00 PM', title: 'HYPER_SCALE', tag: 'INFRA', desc: 'Scaling digital architecture for the global multiverse.', icon: Network, accent: '#8b5cf6' },
  { id: '05', time: '03:30 PM', title: 'CYBER_SHIELD', tag: 'SECURITY', desc: 'Security audit systems and zero-trust cloud nodes.', icon: Shield, accent: '#0ea5e9' },
  { id: '06', time: '05:00 PM', title: 'ORCHESTRATE', tag: 'OPERATIONS', desc: 'Linking human logic with cloud randomness.', icon: Database, accent: '#3b82f6' },
  { id: '07', time: '06:30 PM', title: 'PRIZE_POOL', tag: 'GRAND_FINALE', desc: 'The ultimate reward for architectural excellence.', icon: Trophy, accent: '#f59e0b' },
];

/**
 * Timeline — Sticky-Side + Scroll Content (Apple-style)
 * This was selected as the final design from the 5 available options.
 */
export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section id="schedule" className="bg-[#020617]" ref={containerRef} style={{ height: `${SESSIONS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex overflow-hidden">

        {/* LEFT — sticky label */}
        <div className="w-1/2 flex flex-col justify-center px-16 border-r border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-500 font-mono text-[10px] tracking-[0.5em] uppercase">Event Timeline</span>
          </div>
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.1], [1, 1]),
            }}
          >
            {SESSIONS.map((s, i) => (
              <motion.div
                key={s.id}
                style={{
                  opacity: useTransform(scrollYProgress,
                    [
                      Math.max(0, (i - 0.5) / SESSIONS.length),
                      Math.max(0, i / SESSIONS.length),
                      Math.min(1, (i + 0.5) / SESSIONS.length),
                      Math.min(1, (i + 1) / SESSIONS.length)
                    ],
                    [0, 1, 1, 0]
                  ),
                  y: useTransform(scrollYProgress,
                    [
                      Math.max(0, (i - 0.5) / SESSIONS.length),
                      Math.max(0, i / SESSIONS.length),
                      Math.min(1, (i + 0.5) / SESSIONS.length)
                    ],
                    [60, 0, -60]
                  ),
                  position: 'absolute' as const,
                }}
              >
                <div className="font-mono text-[10px] mb-3 tracking-widest" style={{ color: s.accent }}>{s.tag} // {s.time}</div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85] mb-6">{s.title}</h2>
                <p className="text-white/40 font-mono text-sm leading-relaxed max-w-sm">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — scrolling visual */}
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="relative w-full">
            {/* Progress spine */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5">
              <motion.div
                className="absolute top-0 left-0 w-full bg-blue-500"
                style={{ height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
              />
            </div>
            <div className="pl-8 flex flex-col gap-6">
              {SESSIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.id}
                    style={{
                      opacity: useTransform(scrollYProgress,
                        [
                          Math.max(0, (i - 1) / SESSIONS.length),
                          Math.max(0, i / SESSIONS.length),
                          Math.min(1, (i + 1) / SESSIONS.length)
                        ],
                        [0.2, 1, 0.2]
                      ),
                      scale: useTransform(scrollYProgress,
                        [
                          Math.max(0, (i - 1) / SESSIONS.length),
                          Math.max(0, i / SESSIONS.length),
                          Math.min(1, (i + 1) / SESSIONS.length)
                        ],
                        [0.9, 1, 0.9]
                      ),
                    }}
                    className="flex items-center gap-4 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                      <Icon className="w-4 h-4" style={{ color: s.accent }} />
                    </div>
                    <span className="font-black uppercase tracking-tight text-white text-lg">{s.title}</span>
                    <span className="font-mono text-[10px] text-white/20 ml-auto">{s.id}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
