'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '../ui/BackgroundBeams';
import { cn } from '@/lib/utils';

const PARTNERS = [
  { name: 'Nebula Solutions' },
  { name: 'Quantum Systems' },
  { name: 'Vertex Digital' },
  { name: 'Nova Dynamics' },
  { name: 'Stratosphere AI' },
  { name: 'Zenith Labs' },
  { name: 'Prism Tech' },
  { name: 'Ethereal Cloud' },
];

const PartnerCard: React.FC<{ partner: typeof PARTNERS[0] }> = ({ partner }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Create decorative dots grid (simplified for card)
  const dots = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      dots.push(
        <div
          key={`${i}-${j}`}
          className={cn(
            "absolute w-[2px] h-[2px] bg-blue-500/20 rounded-full transition-opacity duration-700",
            isHovered ? "opacity-100" : "opacity-40"
          )}
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + j * 20}%`,
            transitionDelay: `${(i + j) * 50}ms`,
          }}
        />
      );
    }
  }

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex-shrink-0 w-64 md:w-72 h-80 rounded-3xl border border-white/5 bg-[#0a1220]/50 backdrop-blur-md p-10 flex flex-col items-center group transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0a1220] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.08] pointer-events-none" />
      <BackgroundBeams className="opacity-80 transition-opacity duration-500" />
      
      {/* Decorative dots grid */}
      <div className="absolute inset-0 pointer-events-none">
        {dots}
      </div>

      {/* Accent border lines */}
      <div className={cn(
        "absolute top-10 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent transition-all duration-1000",
        isHovered ? "w-full" : "w-0"
      )} />
      <div className={cn(
        "absolute bottom-10 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent transition-all duration-1000",
        isHovered ? "w-full" : "w-0"
      )} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full justify-center">
        {/* Logo Placeholder */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="relative w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm group-hover:border-blue-500/30 transition-all">
             <span className="text-white/20 font-black text-[10px] uppercase tracking-tighter group-hover:text-blue-400/50 transition-colors">LOGO</span>
          </div>
        </div>

        <h4 className="text-white font-black text-center text-sm uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors">
          {partner.name}
        </h4>
      </div>
    </motion.div>
  );
};

export const Partners: React.FC = () => {
  return (
    <section id="partners" className="py-32 bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10 mb-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-tight">
            Our <span className="text-blue-500">Valued</span> Partners
          </h2>
          <div className="w-16 h-[2px] bg-blue-500/30 mt-6 mb-8" />
          <p className="text-white/40 font-mono text-xs max-w-xl leading-relaxed">
            We extend our heartfelt gratitude to our partners who make BOC 2.0 possible.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Track */}
      <div className="relative flex overflow-hidden py-20">
        <motion.div 
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: [0, -1920] }} // Adjust based on content width
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
          style={{ width: 'fit-content' }}
        >
          {/* Repeat content for seamless loop */}
          {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
            <PartnerCard key={i} partner={partner} />
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="mt-32 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-500 transition-colors"
        >
           <div className="relative flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              Become a Partner <span className="group-hover:translate-x-1 transition-transform">→</span>
           </div>
        </motion.button>
      </div>
    </section>
  );
};
