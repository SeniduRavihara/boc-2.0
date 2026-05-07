'use client';

import React from 'react';
import { Lightbulb, Users, Rocket, BrainCircuit } from 'lucide-react';

export function Ideathon() {
  return (
    <div className="w-full h-full bg-[#050812] flex items-center justify-center relative overflow-hidden px-8 md:px-20">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-cyan-400">Phase_02 // Innovation Hub</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-8">
            The<br /><span className="text-cyan-400">Ideathon</span>
          </h2>
          
          <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-md">
            Unleash your creativity and architect the future of cloud computing. Join forces with the brightest minds to solve real-world challenges.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm">#CLOUD_NATIVE</div>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm">#AI_DRIVEN</div>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm">#SUSTAINABILITY</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group">
            <BrainCircuit className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold mb-2">Brainstorm</h4>
            <p className="text-white/40 text-xs leading-relaxed">Collaborative sessions to refine your core concepts.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group mt-8">
            <Users className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold mb-2">Team Up</h4>
            <p className="text-white/40 text-xs leading-relaxed">Connect with mentors and peers across the region.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group">
            <Lightbulb className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold mb-2">Pitch</h4>
            <p className="text-white/40 text-xs leading-relaxed">Present your vision to a panel of industry experts.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors group mt-8">
            <Rocket className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold mb-2">Launch</h4>
            <p className="text-white/40 text-xs leading-relaxed">Win funding and support to bring your idea to life.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
