'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TEAM_DATA = {
  executives: [
    { name: 'Alex Rivera', role: 'EVENT CO-CHAIR', image: 'https://i.pravatar.cc/400?u=alex' },
    { name: 'Jordan Chen', role: 'EVENT CO-CHAIR', image: 'https://i.pravatar.cc/400?u=jordan' },
  ],
  categories: [
    {
      title: 'Programming & Web Development',
      lead: { name: 'Lead Dev', image: 'https://i.pravatar.cc/400?u=dev' },
      members: Array.from({ length: 10 }).map((_, i) => `https://i.pravatar.cc/100?u=dev${i}`)
    },
    {
      title: 'Design & Marketing',
      lead: { name: 'Lead Designer', image: 'https://i.pravatar.cc/400?u=design' },
      members: Array.from({ length: 10 }).map((_, i) => `https://i.pravatar.cc/100?u=design${i}`)
    },
    {
      title: 'Logistics & Coordination',
      lead: { name: 'Logistics Lead', image: 'https://i.pravatar.cc/400?u=logistics' },
      members: Array.from({ length: 10 }).map((_, i) => `https://i.pravatar.cc/100?u=logistics${i}`)
    },
    {
      title: 'Industry Relations',
      lead: { name: 'Relations Lead', image: 'https://i.pravatar.cc/400?u=relations' },
      members: Array.from({ length: 10 }).map((_, i) => `https://i.pravatar.cc/100?u=relations${i}`)
    }
  ]
};

const CategoryGroup: React.FC<{ category: typeof TEAM_DATA.categories[0] }> = ({ category }) => (
  <div className="flex flex-col items-center p-8 rounded-3xl border border-white/5 bg-[#0a1220]/30 backdrop-blur-sm h-full">
    <h3 className="text-white font-bold text-center text-lg mb-8 tracking-tight max-w-[200px] leading-tight">
      {category.title}
    </h3>
    
    {/* Lead Avatar */}
    <div className="relative mb-10">
      <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#020617] shadow-[0_0_20px_rgba(59,130,246,0.5)]">
        <Image src={category.lead.image} alt="Lead" fill className="object-cover" />
      </div>
    </div>

    {/* Members Grid */}
    <div className="grid grid-cols-5 gap-3">
      {category.members.map((img, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.2, zIndex: 10 }}
          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#020617] bg-[#0a1220] shadow-lg"
        >
          <Image src={img} alt="Member" fill className="object-cover grayscale hover:grayscale-0 transition-all" />
        </motion.div>
      ))}
    </div>
  </div>
);

export const Team: React.FC = () => {
  return (
    <section id="team" className="py-32 bg-[#020617] relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header (Co-Chairs) */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 mb-32">
          {TEAM_DATA.executives.map((exec, i) => (
            <div key={i} className="flex flex-col items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{exec.name}</h3>
              <div className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-8">Event Co-Chair</div>
              
              <div className="relative w-48 h-56 rounded-3xl border border-white/5 bg-[#0a1220]/50 overflow-hidden group">
                  <Image src={exec.image} alt={exec.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60" />
                  
                  {/* Decorative element */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                     <div className="w-8 h-[1px] bg-blue-500/50" />
                     <div className="w-2 h-2 rotate-45 border border-blue-500" />
                     <div className="w-8 h-[1px] bg-blue-500/50" />
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_DATA.categories.map((cat, i) => (
            <CategoryGroup key={i} category={cat} />
          ))}
        </div>

      </div>
    </section>
  );
};
