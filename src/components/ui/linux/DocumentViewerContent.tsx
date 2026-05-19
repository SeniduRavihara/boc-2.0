'use client';

import React from 'react';
import { Search, FileText, Globe, Award, Cpu, Sparkles, Check } from 'lucide-react';

export const DocumentViewerContent: React.FC = () => {
  return (
    <div className="h-full bg-[#181824] flex flex-col select-none text-slate-100 font-sans">
      {/* PDF Viewer Header Toolbar */}
      <div className="h-10 bg-[#1e1e2f] border-b border-white/5 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-white/80 text-xs font-mono">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>about-boc-2.0.pdf</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono border border-emerald-500/20">
            SECURE
          </span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          <Search className="w-4 h-4 cursor-pointer hover:text-white/70 transition-colors" />
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-xs font-mono font-medium">
            <span className="text-white/80">1</span>
            <span>/</span>
            <span>1</span>
          </div>
        </div>
      </div>

      {/* Document Body Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-[#0d0d15] relative">
        {/* Subtle decorative grid/glow behind document */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

        {/* The Document Page */}
        <div className="w-full max-w-2xl bg-[#0f111a]/85 backdrop-blur-md border border-white/10 shadow-2xl p-6 md:p-10 rounded-xl min-h-[750px] relative overflow-hidden flex flex-col justify-between">
          {/* Top subtle decorative strip */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div>
            {/* Header section */}
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-mono tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 uppercase">
                    IDEATHON OFFICIAL
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">
                  Beauty of Cloud <span className="text-blue-400">2.0</span>
                </h1>
                <p className="text-slate-400 uppercase tracking-widest text-[9px] md:text-[10px] font-mono mt-1">
                  Inter-University Cloud Ideathon
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <Globe className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-6">
              {/* Introduction Card */}
              <section className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Introduction
                  </h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  Beauty of Cloud 2.0 is Sri Lanka&apos;s first student-led inter-university cloud ideathon, returning for its second edition. This initiative brings together the brightest minds from universities across the island to solve critical real-world problems using cloud technologies.
                </p>
              </section>

              {/* Vision & Mission Card */}
              <section className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Vision & Mission
                  </h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Our vision is to foster a culture of innovation and excellence in cloud computing among the Sri Lankan student community.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Empower students with industry-level cloud expertise.",
                    "Bridge the gap between academic learning and industrial application.",
                    "Create a platform for sustainable, scalable technological solutions."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-indigo-400" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Event Theme Card */}
              <section className="relative overflow-hidden rounded-lg p-0.5 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30">
                <div className="bg-[#0b0c13] rounded-[6px] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Event Theme
                    </h2>
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed border-l-2 border-indigo-500/50 pl-3">
                    &quot;Cloud Innovation for a Sustainable Future: Scaling impact through distributed computing and intelligent architecture.&quot;
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer of PDF Document */}
          <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="text-[9px] text-slate-500 font-mono leading-relaxed">
              <span className="text-slate-400 font-bold block mb-0.5">REF: BOC-2026-X01</span>
              <span>CLASSIFICATION: INTELLECTUAL PROPERTY</span>
            </div>
            <div className="text-left sm:text-right font-sans">
              <p className="text-xs font-bold text-slate-300">The BOC Organizing Committee</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Sri Lanka Business Platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
