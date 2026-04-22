'use client';

import React from 'react';
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import Link from "next/link";
import { CreationOfAdamNodes } from "@/components/ui/CreationOfAdamNodes";
import { DitheredLogo } from "@/components/ui/DitheredLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap } from "lucide-react";

interface HeroProps {
  scrollYProgress: any;
}

export const Hero: React.FC<HeroProps> = ({ scrollYProgress }) => {
  const yParallax = useTransform(scrollYProgress, [0, 0.2], [0, -300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-32">
      <div className="absolute inset-0 z-0 backdrop-blur-[100px] pointer-events-none opacity-30" />
      <CreationOfAdamNodes />
      
      <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="lg:col-span-6 flex flex-col items-start"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-accent text-[12px] font-bold tracking-[0.6em] uppercase mb-8 block font-mono">Sri Lanka's Elite Ideathon</span>
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] xl:text-[9.5rem] font-bold leading-[0.85] tracking-tighter uppercase mb-12">
              Beauty Of <br />
              <span className="text-blue-500">Cloud.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-white/50 mb-16 uppercase tracking-wide font-mono">
              Translating digital chaos into high-fidelity architectural rhythm. Join the vanguard of cloud computing.
            </p>
            
            <div className="flex gap-8">
              <Link href="/register/compitition">
                <GlassCard className="p-6 px-10 border-blue-500/20 bg-[#0f172a] group hover:border-blue-500 transition-all cursor-pointer rounded-2xl">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <Zap className="w-7 h-7 text-blue-500" />
                    </div>
                    <div className="text-[12px] uppercase tracking-widest font-mono">
                      <p className="font-black text-white text-lg">Initialize Protocol</p>
                      <p className="opacity-40">Registration Open for Batch 09</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="lg:col-span-6 relative aspect-square flex items-center justify-center"
          style={{ y: yParallax, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-aws/10 rounded-full blur-[180px] opacity-30 animate-pulse" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
            <div className="relative w-4/5 h-4/5">
              <DitheredLogo 
                src="/logo.png"
                className="w-full h-full"
                pixelSize={4}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Call to Action */}
      <motion.div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-30 hover:opacity-100 transition-opacity cursor-pointer font-mono"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.6em]">Scroll to Enter</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
};
