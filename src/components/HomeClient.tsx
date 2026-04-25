'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LinuxEnvironment } from '@/components/ui/LinuxEnvironment';
import { LinuxShell } from '@/components/ui/LinuxShell';
import { Footer } from '@/components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

/** Height of each section band in vh */
const SECTION_BAND_VH = 220;
const NUM_SECTIONS = 5;

export function HomeClient() {
  const pinnedRef      = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const windowRef      = useRef<HTMLDivElement>(null);
  const sectionZoneRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(0);

  /* ── Reset scroll to top on mount ─────────────────────── */
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => { window.history.scrollRestoration = prev; };
  }, []);

  /* ── Scroll → active section ──────────────────────────────
     Uses sectionZoneRef.offsetTop so we don't need to
     hardcode any GSAP pin heights — it's always correct.
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      const zone = sectionZoneRef.current;
      if (!zone) return;
      const scrollInZone = window.scrollY - zone.offsetTop;
      if (scrollInZone < 0) return;
      const bandPx = window.innerHeight * (SECTION_BAND_VH / 100);
      const idx    = Math.floor(scrollInZone / bandPx);
      setActiveSection(Math.max(0, Math.min(NUM_SECTIONS - 1, idx)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Click a dock icon → smooth scroll to that band ────── */
  const scrollToSection = useCallback((index: number) => {
    const zone = sectionZoneRef.current;
    if (!zone) return;
    const bandPx  = window.innerHeight * (SECTION_BAND_VH / 100);
    const targetY = zone.offsetTop + index * bandPx;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  /* ── GSAP Phase 1 + 2 — hero → Linux rises ──────────────
     Phase 1: hero content fades, OS window slides up
     Phase 2: OS window expands to fullscreen
     Everything after is handled by LinuxShell + scroll math.
  ─────────────────────────────────────────────────────────── */
  useGSAP(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll(true);

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
        trigger:             pinnedRef.current,
        start:               'top top',
        end:                 '+=400%',
        scrub:               touch ? 0.8 : 1,
        pin:                 pinnedRef.current,
        anticipatePin:       1,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1: hero fades, window rises
    tl.to(heroContentRef.current, {
      opacity:  0,
      y:        -80,
      duration: 0.8,
      ease:     'power2.out',
    }, 0)
    .to(windowRef.current, {
      yPercent:     0,
      scale:        1,
      pointerEvents: 'auto',
      duration:     1,
      ease:         'power2.out',
    }, 0)
    // Phase 2: window expands to fullscreen
    .to(windowRef.current, {
      width:        '100%',
      height:       '100%',
      borderRadius: 0,
      duration:     1.2,
      ease:         'power3.inOut',
    }, 0.8);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize',            refresh);
    window.addEventListener('orientationchange', refresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize',            refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, { scope: pinnedRef });

  return (
    <main className="flex flex-col relative bg-[#050812]">
      <div
        ref={pinnedRef}
        className="relative z-20 h-[100svh] w-full overflow-hidden bg-black touch-pan-y"
      >
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

      <div
        ref={sectionZoneRef}
        className="relative"
        style={{ height: `${NUM_SECTIONS * SECTION_BAND_VH}vh` }}
      >
        <div className="sticky top-0 h-[100svh] w-full">
          <LinuxShell
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
