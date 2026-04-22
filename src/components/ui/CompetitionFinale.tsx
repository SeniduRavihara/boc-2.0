'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Download, Trophy, Medal, Crown, ArrowRight } from 'lucide-react';

const PRIZES = [
  {
    rank: "1ST PLACE",
    title: "GOLD_SURGE",
    value: "50,000 LKR",
    cloud: " + $3000 CREDITS",
    color: "text-aws",
    glow: "via-aws/20",
    icon: <Crown className="w-12 h-12 text-aws" />,
    featured: true
  },
  {
    rank: "2ND PLACE",
    title: "SILVER_TIER",
    value: "30,000 LKR",
    cloud: " + $1500 CREDITS",
    color: "text-white/80",
    glow: "via-white/5",
    icon: <Trophy className="w-10 h-10 text-white/60" />,
    featured: false
  },
  {
    rank: "3RD PLACE",
    title: "BRONZE_CORE",
    value: "20,000 LKR",
    cloud: " + $1000 CREDITS",
    color: "text-accent",
    glow: "via-accent/10",
    icon: <Medal className="w-10 h-10 text-accent" />,
    featured: false
  }
];

export const CompetitionFinale: React.FC = () => {
  return (
    <section id="competition" className="relative z-20 py-40 border-t border-white/5 bg-background overflow-hidden px-6 md:px-12">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          
          {/* Left Side: Competition Details */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent text-[12px] font-black tracking-[1em] uppercase mb-12 block font-mono">
                FINAL_STATION // THE_COMPETITION
              </span>
              <h2 className="text-6xl md:text-[9rem] font-bold tracking-tighter uppercase leading-[0.75] mb-12">
                Elevate <br />
                <span className="text-outline italic">Innovation.</span>
              </h2>
              <p className="text-xl text-white/40 uppercase tracking-[0.2em] leading-loose font-mono max-w-xl mb-16">
                36 hours of pure technical evolution. Over 20 universities, 1 mission: Build the future of cloud architectural rhythm.
              </p>

              <div className="flex flex-col sm:flex-row gap-8">
                <motion.button 
                  className="group relative px-10 py-5 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] rounded-xl overflow-hidden glow-accent shadow-2xl flex items-center justify-center gap-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Download Booklet</span>
                  <Download className="w-4 h-4 relative z-10 group-hover:translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>
                
                <div className="flex items-center gap-4 text-white/40 font-mono text-[11px] tracking-widest uppercase">
                  <div className="w-8 h-[1px] bg-white/20" />
                  VERSION_2.0.4.DOC
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Prize Pool (Icon-based) */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 gap-6">
              {PRIZES.map((prize, index) => (
                <motion.div
                  key={prize.rank}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard 
                    variant="dark"
                    className={`p-8 flex items-center gap-10 group hyper-border relative overflow-hidden ${prize.featured ? 'border-aws/20 bg-aws/5' : 'border-white/5 opacity-80'}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${prize.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                    
                    <div className="shrink-0 relative z-10">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {prize.icon}
                      </div>
                    </div>

                    <div className="flex-1 relative z-10">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase font-mono">
                          {prize.rank}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-accent group-hover:translate-x-2 transition-all" />
                      </div>
                      <h3 className={`text-4xl font-black tracking-tighter uppercase mb-1 ${prize.color}`}>
                        {prize.value}
                      </h3>
                      <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase font-mono">
                        {prize.title} {prize.cloud}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
