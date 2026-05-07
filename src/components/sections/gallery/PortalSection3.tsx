'use client';

import React from 'react';
import Image from 'next/image';

const PARTNERS = [
  { name: 'CoDeKu DevOps Academy', img: '/codeku-logo.png' },
  { name: 'AWS User Group Colombo', img: '/aws_logo.png' },
  { name: 'Hack SL', img: '/hackhub_logo.png' },
  { name: 'Pepiliyana Timber Dealers', img: '/pepiliyana-timber-dealers.png' },
  { name: 'Global Ceylon', img: '/global-ceylon.png' },
  { name: 'DR Eco friendly bag', img: '/DR-Eco-friendly-bag.png' },
  { name: 'Pearl Bay', img: '/pearl-bay.png' },
  { name: 'VIUKON', img: '/viukon.png' },
];

export function PortalSection3() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#050812] px-4 md:px-6 py-16 md:py-24">
      
      <div className="text-center mb-12 md:mb-20">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Our <span className="text-blue-400">Partners</span>
        </h2>
        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
        <p className="text-slate-400 mt-6 max-w-lg mx-auto font-medium">
          Collaborating with industry leaders and communities to empower the next generation of cloud innovators.
        </p>
      </div>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {PARTNERS.map((partner, idx) => (
            <div 
              key={idx} 
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] transition-all duration-300 hover:bg-white/[0.05] hover:border-blue-500/20"
            >
              <div className="relative w-24 h-24 mb-4 transition-transform duration-500 group-hover:scale-110">
                <Image 
                  src={partner.img} 
                  alt={partner.name} 
                  fill 
                  className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                />
              </div>
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] text-center font-bold group-hover:text-blue-400 transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 pt-12 border-t border-white/5 w-full max-w-4xl text-center">
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">
          End of Portal View // System Nominal
        </p>
      </div>
      
    </div>
  );
}
