'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShatterLinux } from '@/components/ui/ShatterLinux';

gsap.registerPlugin(ScrollTrigger);

export default function Testing2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    if (!triggerRef.current) return;

    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="bg-[#02040a] text-white min-h-[350vh] relative">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-[100] flex gap-4">
        <a 
          href="/" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium transition-all"
        >
          ← Main Site
        </a>
        <a 
          href="/testing" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium transition-all"
        >
          Testing 1
        </a>
      </div>

      {/* Progress HUD */}
      <div className="fixed top-6 right-6 z-[100] bg-black/60 border border-white/10 backdrop-blur-md p-4 rounded-xl font-mono text-xs flex flex-col gap-1 min-w-[200px]">
        <div className="text-slate-400">SHATTER PROGRESS</div>
        <div className="text-xl font-black text-blue-400">{(progress * 100).toFixed(1)}%</div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
          <div 
            className="bg-blue-500 h-full transition-all duration-75" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="text-[10px] text-slate-500 mt-2">
          {progress === 0 && "Status: Assembled (Real UI active)"}
          {progress > 0 && progress < 0.5 && "Status: Initiating Shatter (Snapshot active)"}
          {progress >= 0.5 && progress < 1 && "Status: Fragments Dispersing"}
          {progress === 1 && "Status: Fully Shattered"}
        </div>
      </div>

      {/* Pinned Viewport */}
      <div 
        ref={triggerRef}
        className="w-full h-[300vh] relative"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
          <div className="absolute top-20 text-center z-10 pointer-events-none">
            <h1 className="text-3xl font-black tracking-tight uppercase mb-2">Shatter Effect Playground</h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Scroll down slowly to trigger the Delaunay triangulation shatter animation on the Linux Desktop below.
            </p>
          </div>

          {/* Linux Wrapper matching HomeClient bounds */}
          <div className="w-[92vw] md:w-[85vw] h-[56svh] md:h-[60vh] rounded-t-2xl border border-white/10 border-b-0 overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.9)] bg-[#1a1a2e] relative mt-16">
            <ShatterLinux shatterProgress={progress} />
          </div>
        </div>
      </div>

      {/* Post-shatter space */}
      <div className="h-screen flex flex-col items-center justify-center bg-black relative border-t border-white/5">
        <div className="text-center px-4">
          <h2 className="text-2xl font-black mb-4 uppercase text-slate-400">Environment Destroyed</h2>
          <p className="text-slate-600 max-w-sm mx-auto text-sm">
            You have scrolled past the active environment. Scroll back up to re-assemble the window fragments.
          </p>
        </div>
      </div>
    </main>
  );
}
