'use client';

import React from 'react';
import { Search, FileText, Globe, Award, Cpu, Sparkles, Check } from 'lucide-react';

import { AboutNew } from '../../sections/AboutNew';

export const DocumentViewerContent: React.FC = () => {
  return (
    <div className="h-full bg-[#050812] flex flex-col select-none text-slate-100 font-sans">
      {/* PDF Viewer Header Toolbar */}
      <div className="h-10 bg-[#1e1e2f] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
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

      {/* Document Body Area (Rendering the real AboutNew Section) */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#050812]">
        <AboutNew />
      </div>
    </div>
  );
};
