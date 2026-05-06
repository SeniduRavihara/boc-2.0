'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TestingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxCRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animation for Box C
    // When Box C reaches the screen, it moves to the left side.
    gsap.to(boxCRef.current, {
      x: -300, // Move 300px to the left
      backgroundColor: '#ef4444', // Change to red to make it obvious
      scrollTrigger: {
        trigger: boxCRef.current,
        start: 'top 80%', // Starts when top of Box C is 80% down the viewport
        end: 'top 20%',   // Ends when it reaches 20%
        scrub: 1,         // Smooth scrubbing
        markers: true,    // Added markers so you can see start/end positions
      }
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="bg-[#050812] text-white min-h-[300vh] flex flex-col items-center">
      
      {/* Box A */}
      <section className="h-screen flex flex-col items-center justify-center border-b border-white/5 w-full">
        <h2 className="mb-10 text-xl font-mono text-blue-400">Section 1: Scroll Down</h2>
        <div className="w-[100px] h-[100px] bg-blue-500 rounded-lg flex items-center justify-center font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          Box A
        </div>
      </section>

      {/* Box B */}
      <section className="h-screen flex flex-col items-center justify-center border-b border-white/5 w-full">
        <h2 className="mb-10 text-xl font-mono text-green-400">Section 2: Keep Scrolling</h2>
        <div className="w-[100px] h-[100px] bg-green-500 rounded-lg flex items-center justify-center font-bold shadow-[0_0_20px_rgba(34,197,94,0.5)]">
          Box B
        </div>
      </section>

      {/* Box C */}
      <section className="h-screen flex flex-col items-center justify-center w-full overflow-hidden">
        <h2 className="mb-10 text-xl font-mono text-red-400">Section 3: ScrollTrigger Active</h2>
        <div 
          ref={boxCRef}
          className="w-[100px] h-[100px] bg-white rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]"
        >
          Box C
        </div>
      </section>

      {/* Back to Home Link */}
      <div className="fixed bottom-10 right-10">
        <a 
          href="/" 
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium transition-all"
        >
          ← Back to Site
        </a>
      </div>
    </main>
  );
}
