'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function MissionPillars() {
  // Manual background controls
  const BG_CONFIG = {
    desktop: { opacity: 0.6, top: 0 },
    mobile:  { opacity: 0.5, top: 0 },
  };

  return (
    <section className="w-full py-32 bg-[#050812] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="relative w-full h-full"
          style={{ top: `${BG_CONFIG.desktop.top}px` }}
        >
          {/* Desktop BG */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src="/background_img.webp"
              alt="Mission Background"
              fill
              className="object-cover"
              style={{ opacity: BG_CONFIG.desktop.opacity }}
              priority
            />
          </div>
          {/* Mobile BG */}
          <div 
            className="block md:hidden absolute inset-0"
            style={{ top: `${BG_CONFIG.mobile.top}px` }}
          >
            <Image
              src="/background_img.webp"
              alt="Mission Background"
              fill
              className="object-cover"
              style={{ opacity: BG_CONFIG.mobile.opacity }}
              priority
            />
          </div>
        </div>
        
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050812] via-transparent to-[#050812]" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
            To build Sri Lanka&apos;s next generation of <span className="text-blue-500">cloud-native engineers</span> by bridging academic learning and industry infrastructure.
          </h2>
          <p className="mt-8 text-slate-300 font-mono text-xs uppercase tracking-[0.4em] drop-shadow-lg">
            Founded under IEEE Student Branch - University of Sri Jayewardenepura
          </p>
        </motion.div>
      </div>
    </section>
  );
}
