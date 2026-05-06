'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Activity, Lock } from 'lucide-react';

export const BrowserContent = ({ currentUrl }: { currentUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadIssue, setHasLoadIssue] = useState(false);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasLoadIssue(false);

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasLoadIssue(true);
    }, 7000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [currentUrl]);

  const handleFrameLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setHasLoadIssue(false);
    setIsLoading(false);
  };

  const handleFrameError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setHasLoadIssue(true);
    setIsLoading(false);
  };

  return (
    <div className="h-full bg-[#202124] flex flex-col select-none">
      <div className="h-12 md:h-11 bg-[#2d2d2d] border-b border-black/30 flex items-center gap-2 px-2 md:px-3">
        <button className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors">
          <Activity className="w-4 h-4" />
        </button>
        <div className="flex-1 h-9 md:h-8 rounded-full bg-[#1a1a1a] border border-white/10 px-2.5 md:px-3 flex items-center gap-2 min-w-0">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] md:text-[12px] text-white/80 font-mono truncate">{currentUrl}</span>
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-cyan-300/80 ml-auto shrink-0">Pinned</span>
        </div>
      </div>
      <div className="flex-1 bg-black relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-cyan-200/80 text-xs font-mono">Loading pinned website...</p>
            </div>
          </div>
        )}
        <iframe
          src={currentUrl}
          title="BOC Browser"
          className="w-full h-full border-0 bg-white"
          onLoad={handleFrameLoad}
          onError={handleFrameError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
        {hasLoadIssue && (
          <div className="absolute inset-0 z-20 bg-[#0b1119]/95 backdrop-blur-sm flex items-center justify-center px-5">
            <div className="max-w-md text-center">
              <p className="text-cyan-100 text-sm font-medium mb-2">Pinned page is taking too long to load.</p>
              <p className="text-cyan-200/70 text-xs mb-4">This can happen when the page blocks embedded view.</p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-300/40 px-4 py-2 text-cyan-100 text-xs font-semibold"
              >
                Open website in new tab
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
