'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Users } from 'lucide-react';

export function FallingScene() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // scrollYProgress: 0 when top of section hits top of viewport,
  //                  1 when bottom of section hits bottom of viewport.
  // Because the section is 400vh tall and the viewport is sticky,
  // this gives us 300vh of actual scroll travel to animate through.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Background: the image is very tall (portrait).
  // We start showing the TOP of the image (dark sky) and pan down
  // to reveal the BOTTOM (dense clouds) as we scroll.
  // translateY goes from 0% → -50% of its own height to pan through it.
  const bgY = useTransform(smooth, [0, 1], ['0%', '-50%']);

  // Person: starts ABOVE the viewport (out of frame) and falls into view
  const personY = useTransform(smooth, [0, 0.8], ['-10vh', '0vh']);
  const personRotate = useTransform(smooth, [0, 0.4, 0.8], [-10, 5, -2]);
  const personScale = useTransform(smooth, [0, 0.8], [0.6, 1.3]);
  const personOpacity = 1; // Always visible — enters/exits via position, not opacity

  // Mission text fades in at the end
  const textOpacity = useTransform(smooth, [0.8, 0.95], [0, 1]);
  const textY = useTransform(smooth, [0.8, 0.95], [30, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '400vh' }}
    >
      {/* Sticky viewport — stays fixed while scroll drives the animation */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Full-height cloud background ── */}
        <motion.div
          className="absolute inset-x-0 top-0 z-0 w-full"
          style={{ y: bgY }}
        >
          {/* Desktop Background */}
          <Image
            src="/falling_background.webp"
            alt="Cloud sky background"
            width={1080}
            height={1920}
            className="hidden md:block w-full h-auto object-cover"
            style={{ minHeight: '220vh' }}
          />
          {/* Mobile Background */}
          <Image
            src="/falling_background_mobile.webp"
            alt="Cloud sky background mobile"
            width={720}
            height={1280}
            className="block md:hidden w-full h-auto object-cover"
            style={{ minHeight: '220vh' }}
          />
        </motion.div>

        {/* Top edge blend */}
        <div className="absolute inset-x-0 top-0 h-40 z-30 bg-gradient-to-b from-[#050812] to-transparent pointer-events-none" />

        {/* Bottom edge blend */}
        <div className="absolute inset-x-0 bottom-0 h-40 z-30 bg-gradient-to-t from-[#050812] to-transparent pointer-events-none" />

        {/* Gradual darkness overlay */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none bg-black/40"
          style={{ opacity: useTransform(smooth, [0.5, 0.9], [0, 0.4]) }}
        />

        {/* ── Enhanced Motion streaks (as seen in reference image) ── */}
        <motion.div
          className="absolute inset-0 z-15 pointer-events-none"
          style={{ opacity: useTransform(smooth, [0.1, 0.4, 0.9], [0, 0.4, 0.2]) }}
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent blur-sm" />
          <div className="absolute left-[calc(50%-60px)] top-0 w-[1px] h-[full] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="absolute left-[calc(50%+60px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="absolute left-[calc(50%-120px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
          <div className="absolute left-[calc(50%+120px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
          
          {/* Broad light beams from the image */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[300px] h-full bg-gradient-to-b from-transparent via-blue-400/5 to-transparent blur-[60px]" />
        </motion.div>

        {/* ── Falling person ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-visible">
          <motion.div
            className="relative w-[85vw] md:w-[50vw] max-w-[650px]"
            style={{
              y: personY,
              rotate: personRotate,
              scale: personScale,
              opacity: personOpacity,
              aspectRatio: '1 / 1',
            }}
          >
            <Image
              src="/falling_person1.webp"
              alt="Falling person"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 85vw, 650px"
            />
          </motion.div>
        </div>

        {/* ── Mission text (appearing at bottom) ── */}
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex justify-center pointer-events-none"
          style={{ opacity: textOpacity }}
        >
          <motion.div
            className="max-w-[1000px] mx-auto px-6 text-center pointer-events-auto"
            style={{ y: textY }}
          >
            <h2 className="font-reglo text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] drop-shadow-2xl text-white">
              To build Sri Lanka&apos;s next generation of cloud-native engineers by bridging academic learning and industry infrastructure.
            </h2>
            <p className="mt-6 text-slate-300 font-mono text-xs uppercase tracking-[0.4em] drop-shadow-lg mb-10">
              Founded under IEEE Student Branch - University of Sri Jayewardenepura
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full sm:w-auto px-8 py-4 bg-blue-700/45 text-white/65 border border-white/40 font-bold tracking-widest uppercase text-xs rounded-full transition-all shadow-[0_0_20px_rgba(30,144,255,0.2)] flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
              >
                <Users size={14} />
                Team Registration
                <span className="ml-1 rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[10px] tracking-[0.2em] text-white/80">
                  Open Soon
                </span>
              </button>
              
              {/* <a 
                href="/Delegate_Booklet.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold tracking-widest uppercase text-xs rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Download size={14} /> Download Delegate Booklet
              </a> */}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
