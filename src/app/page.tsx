'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LinuxEnvironment } from '@/components/ui/LinuxEnvironment';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Gallery } from '@/components/sections/Gallery';
import { Team } from '@/components/sections/Team';
import { Partners } from '@/components/sections/Partners';
import { Footer } from '@/components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

/*
  Portal orb anchor — must match the ghost placeholder position in the dock.
  The dock is bottom-4 (16px), and the orb icon is 48px tall with 4px padding
  above the dock bottom edge → centre is at ~42px from the OS window bottom.
  Horizontal centre is 50% (dock is centred).
*/
const ORB_CX = '50%';
const ORB_CY = 'calc(100% - 42px)';

export default function Home() {
  const pinnedRef         = useRef<HTMLDivElement>(null);
  const heroContentRef    = useRef<HTMLDivElement>(null);
  const windowRef         = useRef<HTMLDivElement>(null);
  const linuxEnvRef       = useRef<HTMLDivElement>(null);   // for OS-chrome fade
  const portalOverlayRef  = useRef<HTMLDivElement>(null);   // clip-path circle
  const portalInnerRef    = useRef<HTMLDivElement>(null);   // counter-scaled inner world
  const innerWorldRef     = useRef<HTMLDivElement>(null);   // post-portal normal flow

  /* ── Reset scroll on mount ───────────────────────────── */
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => { window.history.scrollRestoration = prev; };
  }, []);

  /* ── GSAP timeline ───────────────────────────────────── */
  useGSAP(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll(true);

    const touch = ScrollTrigger.isTouch === 1;

    /* ── Initial states ── */

    // OS window: starts partially below the viewport, slightly scaled down
    gsap.set(windowRef.current, {
      left: '50%',
      xPercent: -50,
      yPercent: touch ? 125 : 60,
      scale: touch ? 0.96 : 0.85,
      pointerEvents: 'none',
      transformOrigin: 'bottom center',
    });

    // Portal overlay: clipped to a 24px circle centred on the orb slot
    gsap.set(portalOverlayRef.current, {
      clipPath: `circle(24px at ${ORB_CX} ${ORB_CY})`,
    });

    // Inner world: counter-scaled so it "fits" in the 48px orb
    // 0.038 ≈ 48 / 1280 — works for typical viewport widths
    gsap.set(portalInnerRef.current, {
      scale: 0.038,
      transformOrigin: `${ORB_CX} ${ORB_CY}`,
    });

    // Post-portal sections: hidden until the timeline hands off
    gsap.set(innerWorldRef.current, { opacity: 0 });

    /* ── ScrollTrigger timeline ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinnedRef.current,
        start: 'top top',
        end: '+=500%',
        scrub: touch ? 0.8 : 1,
        pin: pinnedRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    /* ── Phase 1 → 2: hero fades, OS window rises  [t: 0 → 1] ── */
    tl.to(heroContentRef.current, {
      opacity: 0,
      y: -80,
      duration: 0.8,
      ease: 'power2.out',
    }, 0)
    .to(windowRef.current, {
      yPercent: 0,
      scale: 1,
      pointerEvents: 'auto',
      duration: 1,
      ease: 'power2.out',
    }, 0);

    /* ── Phase 2: OS window expands to fullscreen  [t: 0.8 → 2] ── */
    tl.to(windowRef.current, {
      width: '100%',
      height: '100%',
      borderRadius: 0,
      duration: 1.2,
      ease: 'power3.inOut',
    }, 0.8);

    /* ── Phase 3: Portal breach                   [t: 2 → 3.8] ──
       Three things happen in sync:
         a) OS chrome (LinuxEnvironment) fades out
         b) clip-path circle expands from 24px → 3000px
         c) inner world scale goes from 0.038 → 1
       All anchored to the same ORB_CX / ORB_CY point.
    ── */

    // a) Fade OS chrome
    tl.to(linuxEnvRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 2.0);

    // b) Expand clip-path circle
    tl.to(portalOverlayRef.current, {
      clipPath: `circle(3000px at ${ORB_CX} ${ORB_CY})`,
      duration: 2,
      ease: 'power3.inOut',
    }, 2.0);

    // c) Counter-scale inner world back to 1:1
    tl.to(portalInnerRef.current, {
      scale: 1,
      duration: 2,
      ease: 'power3.inOut',
    }, 2.0);

    /* ── Hand-off: fade in post-portal normal flow  [t: 3.8 → 4] ── */
    tl.to(innerWorldRef.current, {
      opacity: 1,
      duration: 0.3,
    }, 3.8);

    /* ── Cleanup ── */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, { scope: pinnedRef });

  return (
    <main className="flex flex-col relative bg-[#050812]">

      {/* ════════ PINNED STAGE ════════ */}
      <div
        ref={pinnedRef}
        className="relative z-20 h-[100svh] w-full overflow-hidden bg-black touch-pan-y"
      >
        {/* Background video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-50">
            <source src="/Earth.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        {/* Hero Content */}
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

        {/* OS Environment Window */}
        <div
          ref={windowRef}
          className="absolute bottom-0 z-20 h-[56svh] w-[92vw] overflow-hidden rounded-t-2xl border border-white/10 border-b-0 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] md:h-[60vh] md:w-[85vw]"
        >
          {/* Linux environment — wrapped so we can fade the whole chrome layer */}
          <div ref={linuxEnvRef} className="absolute inset-0 z-10">
            <LinuxEnvironment>
              {/*
                Ghost orb slot inside the dock.
                The real "orb" is the PortalOverlay below — this transparent
                placeholder just keeps the dock layout correct.
                Must be exactly 48×48px with border-radius 50%.
              */}
              <div className="relative mx-1 z-[200] flex-shrink-0 pointer-events-none" aria-hidden="true">
                <div className="w-12 h-12 rounded-full bg-transparent" />
              </div>
            </LinuxEnvironment>
          </div>

          {/*
            ══ PORTAL OVERLAY ══
            Sits on top of the Linux environment.
            Starts clipped to a 24px circle at the dock orb position.
            As GSAP animates clipPath → circle(3000px), the inner world
            expands from microscopic → full size.
          */}
          <div
            ref={portalOverlayRef}
            style={{ willChange: 'clip-path' }}
            className="absolute inset-0 z-30 overflow-hidden bg-[#020a18]"
          >
            {/* Glow ring — purely decorative, CSS only */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: `radial-gradient(
                  circle 30px at ${ORB_CX} ${ORB_CY},
                  transparent 20px,
                  #3b82f655 26px,
                  #60a5fa88 30px,
                  #3b82f633 34px,
                  transparent 42px
                )`,
                animation: 'orbPulse 2s ease-in-out infinite',
              }}
            />

            {/*
              Inner world div.
              Contains ALL sections at their natural full size.
              Starts scaled to 0.038 (fits in the 48px orb).
              transform-origin matches the clip-path anchor point exactly.
            */}
            <div
              ref={portalInnerRef}
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: `${ORB_CX} ${ORB_CY}`,
                willChange: 'transform',
              }}
            >
              {/* Ambient portal glow behind sections */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% 15%, #0d204a 0%, #020a18 60%)',
                }}
              />
              <div className="relative z-10 bg-[#050812]">
                <About />
                <Experience />
                <Gallery />
                <Team />
                <Partners />
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ POST-PORTAL NORMAL FLOW ════════
          Rendered below the pinned stage. GSAP fades this in
          once the portal is fully open, giving the user a
          normal scrollable page after the cinematic intro.
      ════════ */}
      <div
        ref={innerWorldRef}
        id="inner-world-content"
        className="relative z-10 w-full bg-[#050812]"
      >
        <About />
        <Experience />
        <Gallery />
        <Team />
        <Partners />
        <Footer />
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 0.15; }
        }
      `}</style>
    </main>
  );
}
