'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

/**
 * Experience — Horizontal Scroll Section
 * Pins the section while cards scroll horizontally left.
 * Framer Motion port of the hyper-scroll sample's card-track effect.
 */

const CARDS = [
  {
    id: '01',
    tag: '[CLOUD_CORE]',
    title: 'BOC\n1.0',
    subtitle: 'The Beginning',
    desc: 'Sri Lanka\'s first ever inter-university cloud ideathon — launched to spark the next generation of cloud engineers.',
    stat: '200+ Participants',
    year: '2024',
    accent: '#3b82f6',
  },
  {
    id: '02',
    tag: '[AWS_TRACK]',
    title: 'AWS\nIGNITE',
    subtitle: 'Serverless at Scale',
    desc: 'Architecting serverless ecosystems and Lambda-driven rhythm. Real-world AWS challenges for undergrads.',
    stat: 'Lambda · EC2 · S3',
    year: '2024',
    accent: '#0ea5e9',
  },
  {
    id: '03',
    tag: '[GCP_STREAM]',
    title: 'GCP\nFLOW',
    subtitle: 'Cloud Native',
    desc: 'Google Cloud Platform hackathon — multi-university teams solving real-world problems in 24-hour sprints.',
    stat: 'BigQuery · GKE · Pub/Sub',
    year: '2024',
    accent: '#6366f1',
  },
  {
    id: '04',
    tag: '[NEURAL_SYNC]',
    title: 'AI\nLAYER',
    subtitle: 'Machine Intelligence',
    desc: 'AI & ML sessions integrating cloud intelligence — from model training to production deployment pipelines.',
    stat: 'Vertex AI · SageMaker',
    year: '2025',
    accent: '#8b5cf6',
  },
  {
    id: '05',
    tag: '[HYPER_SCALE]',
    title: 'BOC\n2.0',
    subtitle: 'Level Up Reality',
    desc: 'Second edition. Bigger venues, more universities, deeper cloud challenges. The multiverse expands.',
    stat: '10+ Universities',
    year: '2025',
    accent: '#3b82f6',
  },
];

const Card: React.FC<{ card: typeof CARDS[0]; index: number }> = ({ card, index }) => {
  return (
    <div
      className="relative flex-shrink-0 w-[320px] md:w-[380px] h-[500px] rounded-2xl border border-white/10 bg-[rgba(10,18,38,0.85)] backdrop-blur-md p-8 flex flex-col justify-between group transition-all duration-500 hover:border-blue-500/40 cursor-default select-none"
      style={{ boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.6)` }}
    >
      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 group-hover:border-blue-400 transition-colors" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 group-hover:border-blue-400 transition-colors" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-5">
        <span className="font-mono text-[11px] tracking-widest" style={{ color: card.accent }}>
          {card.tag}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-white/30">{index + 1 < 10 ? `0${index + 1}` : index + 1} / {CARDS.length < 10 ? `0${CARDS.length}` : CARDS.length}</span>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: card.accent }} />
        </div>
      </div>

      {/* Title */}
      <div className="flex-1">
        <h3
          className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] uppercase text-white mb-4 whitespace-pre-line"
        >
          {card.title}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/30 mb-6">
          {card.subtitle}
        </p>
        <p className="text-sm text-white/50 leading-relaxed max-w-[280px]">
          {card.desc}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between mt-6 pt-5 border-t border-white/10">
        <div>
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Stack</div>
          <div className="font-mono text-[11px] mt-1" style={{ color: card.accent }}>{card.stat}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Year</div>
          <div className="font-mono text-[11px] text-white/50 mt-1">{card.year}</div>
        </div>
        {/* Large ghost number */}
        <div
          className="absolute bottom-6 right-10 text-[5rem] font-black text-white/[0.04] leading-none pointer-events-none select-none"
        >
          {card.id}
        </div>
      </div>
    </div>
  );
};

// Marquee strip (top/bottom borders)
const marqueeItems = ['BEAUTY OF CLOUD', '☁', 'BOC 2.0', '⚡', 'IDEATHON 2025', '☁', 'SRI LANKA', '⚡'];
const MarqueeStrip: React.FC<{ dir?: 'left' | 'right' }> = ({ dir = 'left' }) => (
  <div className="overflow-hidden border-y border-white/5">
    <motion.div
      className="inline-flex gap-12 py-4 text-[10px] font-mono tracking-[0.4em] uppercase text-white/15 whitespace-nowrap"
      animate={{ x: dir === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
    >
      {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
        <span key={i} className={t === '☁' || t === '⚡' ? 'text-blue-500/30' : ''}>{t}</span>
      ))}
    </motion.div>
  </div>
);

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Total scroll distance = (cards - 1) * card width + gaps
  const cardW = 400; // approx card width + gap
  const totalScroll = cardW * (CARDS.length - 1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Maps scroll 0→1 to horizontal translation 0 → -totalScroll
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalScroll]);

  // Heading parallax (scroll-linked)
  const headingX = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const counterX = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section id="experience" className="bg-[#020617] relative">

      <MarqueeStrip dir="left" />

      {/* Pinned horizontal scroll container */}
      {/* Height = 100vh * (number of cards + 1) to give scroll room */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${(CARDS.length + 1) * 100}vh` }}
      >
        {/* Sticky viewport — everything inside here is pinned */}
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

          {/* Section heading overlay */}
          <div className="relative z-10 px-8 md:px-16 pt-12 pb-8 flex items-end justify-between">
            <motion.div style={{ x: headingX }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-500 font-mono text-[10px] tracking-[0.5em] uppercase">History</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                Cloud<br />
                <span className="text-white/20">Journey.</span>
              </h2>
            </motion.div>
            <motion.div style={{ x: counterX }} className="font-mono text-[10px] text-white/20 text-right">
              <div>Scroll to explore</div>
              <div className="text-blue-500/40 mt-1">→</div>
            </motion.div>
          </div>

          {/* Horizontal track */}
          <div className="flex-1 flex items-center overflow-visible">
            <motion.div
              style={{ x }}
              className="flex gap-6 pl-8 md:pl-16 pr-32"
            >
              {CARDS.map((card, i) => (
                <Card key={card.id} card={card} index={i} />
              ))}

              {/* End card — CTA */}
              <div className="flex-shrink-0 w-[320px] md:w-[380px] h-[500px] rounded-2xl border border-blue-500/20 bg-blue-950/20 flex flex-col items-center justify-center gap-6 px-10 text-center">
                <div className="text-blue-400 font-mono text-[10px] tracking-widest uppercase">BOC 2.0 // 2025</div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-tight">
                  Ready to<br />
                  <span className="text-blue-400">Join the</span><br />
                  Cloud?
                </h3>
                <p className="text-white/30 text-xs font-mono leading-relaxed">
                  Register now for Sri Lanka&apos;s biggest cloud ideathon.
                </p>
                <Link href="/register/compitition">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                  >
                    Register Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="px-8 md:px-16 pb-10">
            <div className="h-[1px] bg-white/5 relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-blue-500"
                style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <span className="font-mono text-[10px] text-white/20">BOC 1.0 — 2024</span>
              <span className="font-mono text-[10px] text-white/20">BOC 2.0 — 2025</span>
            </div>
          </div>
        </div>
      </div>

      <MarqueeStrip dir="right" />
    </section>
  );
};
