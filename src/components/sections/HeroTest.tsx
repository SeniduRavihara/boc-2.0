'use client';

import React from 'react';
import { motion, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import { CreationOfAdamNodes } from "@/components/ui/CreationOfAdamNodes";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, ChevronRight } from "lucide-react";

interface HeroTestProps {
  scrollYProgress?: any;
}

export const HeroTest: React.FC<HeroTestProps> = ({ scrollYProgress: externalProgress }) => {
  const { scrollYProgress: internalProgress } = useScroll();
  const scrollY = externalProgress || internalProgress;

  const yParallax = useTransform(scrollY, [0, 0.2], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 0.2], [1, 0.95]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/Earth.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Advanced Gradient Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px]" />
      </div>

      <CreationOfAdamNodes />
      
      <div className="relative z-10 container mx-auto px-6 pt-20">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: yParallax }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-md mb-10">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-400 text-[10px] font-bold tracking-[0.4em] uppercase font-mono">
                System Online // Phase 2.0
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.8] tracking-tighter uppercase mb-8">
              <span className="block text-white/90">Beauty Of</span>
              <span className="block text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">Cloud.</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-white/60 mb-16 uppercase tracking-widest font-mono">
              The premier inter-university cloud ideathon. <br className="hidden md:block" />
              Redefining the digital horizon through architectural excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/register/compitition">
                <GlassCard className="group p-1 border-blue-500/20 hover:border-blue-500 transition-all cursor-pointer rounded-2xl overflow-hidden">
                  <div className="relative px-8 py-5 bg-[#0f172a] rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-lg tracking-tight">Join Ideathon</p>
                      <p className="text-[10px] opacity-40 uppercase font-mono tracking-widest">Initialization Required</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </GlassCard>
              </Link>

              <Link href="/quiz">
                <GlassCard className="group p-1 border-white/5 hover:border-white/20 transition-all cursor-pointer rounded-2xl overflow-hidden">
                  <div className="relative px-8 py-5 bg-white/5 backdrop-blur-xl rounded-xl flex items-center gap-4">
                    <div className="text-left">
                      <p className="font-bold text-white/80 text-lg tracking-tight">Take Quiz</p>
                      <p className="text-[10px] opacity-40 uppercase font-mono tracking-widest">Skill Assessment</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity cursor-pointer font-mono"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] uppercase tracking-[0.5em]">Explore Repository</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent" />
      </motion.div>

      {/* Side HUD Decorations */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-20 opacity-20">
        <div className="rotate-90 origin-left text-[10px] tracking-[1em] uppercase font-mono text-white/50">
          BEAUTY_OF_CLOUD_v2.0
        </div>
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-20 opacity-20">
        <div className="-rotate-90 origin-right text-[10px] tracking-[1em] uppercase font-mono text-white/50">
          SRI_LANKA_INTER_UNIVERSITY
        </div>
      </div>
    </section>
  );
};
