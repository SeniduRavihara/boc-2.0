'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LinuxEnvironment } from '@/components/ui/LinuxEnvironment';
import { LinuxShell } from '@/components/ui/LinuxShell';
import { Footer } from '@/components/sections/Footer';
import { Gallery } from './ui/Gallery';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ZONE_DVH = 500;

export function HomeClient() {
  const mainRef        = useRef<HTMLDivElement>(null);
  const pinnedRef      = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const windowRef      = useRef<HTMLDivElement>(null);
  const galleryZoneRef = useRef<HTMLDivElement>(null);

  /* ── Reset scroll on mount ───────────────────────────────── */
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => { window.history.scrollRestoration = prev; };
  }, []);

  /* ── Hero → Linux GSAP animation (unchanged) ─────────────── */
  useGSAP(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll(true);
    if (!pinnedRef.current) return;

    const touch = ScrollTrigger.isTouch === 1;

    gsap.set(windowRef.current, {
      left:            '50%',
      xPercent:        -50,
      yPercent:        touch ? 125 : 60,
      scale:           touch ? 0.96 : 0.85,
      pointerEvents:   'none',
      transformOrigin: 'bottom center',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:             pinnedRef.current, // Now triggers on the zone
        start:               'top top',
        end:                 'bottom bottom',
        scrub:               touch ? 0.8 : 1,
        invalidateOnRefresh: true,
        refreshPriority:     1, 
      },
    });

    tl.to(heroContentRef.current, { opacity: 0, y: -80, duration: 0.8, ease: 'power2.out' }, 0)
      .to(windowRef.current, { yPercent: 0, scale: 1, pointerEvents: 'auto', duration: 1, ease: 'power2.out' }, 0)
      .to(windowRef.current, { width: '100%', height: '100%', borderRadius: 0, duration: 1.2, ease: 'power3.inOut' }, 0.8);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize',            refresh);
    window.addEventListener('orientationchange', refresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize',            refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="flex flex-col relative bg-[#050812]">

      {/* ── 1. Hero + Linux (CSS Sticky Calibration) ────────── */}
      <div
        ref={pinnedRef}
        style={{ height: '500vh' }}
        className="relative z-20 w-full bg-black"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden touch-pan-y">
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-50">
              <source src="/Earth.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          </div>

          <div
            ref={heroContentRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">
                System Online // Phase 2.0
              </span>
            </div>
            <h1 className="mb-6 text-6xl font-bold uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-[9rem]">
              <span className="block text-white">Beauty Of</span>
              <span className="block text-blue-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]">Cloud.</span>
            </h1>
            <p className="max-w-xl font-mono text-base uppercase tracking-widest text-white/50 md:text-lg">
              Sri Lanka&apos;s premier inter-university cloud ideathon.
            </p>
          </div>

          <div
            ref={windowRef}
            className="absolute bottom-0 z-20 h-[56svh] w-[92vw] overflow-hidden rounded-t-2xl border border-white/10 border-b-0 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] md:h-[60vh] md:w-[85vw]"
          >
            <LinuxEnvironment />
          </div>
        </div>
      </div>

      {/* ── 2. Gallery (Sticky Calibration) ────────────────── */}
      <div
        ref={galleryZoneRef}
        style={{ height: `${GALLERY_ZONE_DVH}dvh` }}
        className="relative z-30 w-full bg-black"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Gallery triggerRef={galleryZoneRef} />
        </div>
      </div>

      <Footer />
    </main>
  );
}