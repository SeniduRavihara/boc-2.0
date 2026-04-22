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

export default function Home() {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const portalIconRef = useRef<HTMLDivElement>(null);
  const innerWorldRef = useRef<HTMLDivElement>(null);
  const jumpToPortalRef = useRef<() => void>(() => {});

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reset scroll position on refresh
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useGSAP(() => {
    // Enable scroll normalization for mobile to prevent address bar jumps
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (ScrollTrigger.isTouch === 1) {
      ScrollTrigger.normalizeScroll(true);
    }

    const isTouchDevice = ScrollTrigger.isTouch === 1;
    const initialLift = isTouchDevice ? 125 : 60;
    const initialScale = isTouchDevice ? 0.96 : 0.85;

    // Initial state
    gsap.set(windowRef.current, {
      left: '50%',
      xPercent: -50,
      yPercent: initialLift,
      scale: initialScale,
      pointerEvents: 'none',
      transformOrigin: 'bottom center',
    });
    gsap.set(innerWorldRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinnedRef.current,
        start: 'top top',
        end: isTouchDevice ? '+=400%' : '+=400%',
        scrub: isTouchDevice ? 0.8 : 1,
        pin: pinnedRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    jumpToPortalRef.current = () => {
      const trigger = tl.scrollTrigger;
      if (!trigger) return;

      const portalTarget = trigger.start + (trigger.end - trigger.start) * 0.9;
      window.scrollTo({
        top: portalTarget,
        left: 0,
        behavior: 'smooth',
      });
    };

    // Phase 2: OS Expansion
    tl.to(windowRef.current, {
      yPercent: 0,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
    }, 0)
      .to(
        heroContentRef.current,
        {
          opacity: 0,
          y: -80,
          duration: 0.6,
        },
        0.2,
      )
      .to(
        windowRef.current,
        {
          width: '100%',
          height: '100%',
          borderRadius: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        },
        0.8,
      );

    // Enable pointer events when the window is fully expanded
    tl.call(() => {
      gsap.set(windowRef.current, { pointerEvents: 'auto' });
    }, [], 2.0);

    // Phase 3: The Portal Breach
    // Fade out dock apps and remove their width so they don't take up flex space
    tl.to(['.dock-app', '.w-\\[1px\\]', '.dock-show-apps'], {
      opacity: 0,
      width: 0,
      margin: 0,
      padding: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 2.3);

    // Fade out orb graphics
    tl.to('.orb-graphics', {
      opacity: 0,
      duration: 0.3,
    }, 2.3);

    // Expand the dock container itself - REMOVED because user strictly wants the dock to remain unchanged
    // Instead, we just fade out the dock's background so it doesn't bleed through
    tl.to('#os-dock', {
      backgroundColor: 'rgba(0,0,0,0)',
      backdropFilter: 'blur(0px)',
      borderColor: 'rgba(0,0,0,0)',
      boxShadow: 'none',
      duration: 0.5,
      ease: 'power3.inOut',
    }, 2.4);

    // The icon ITSELF scales visually to fill the screen without affecting flex layout!
    tl.to(portalIconRef.current, {
      scale: 150, // 150 * 48px = 7200px (covers 4K screens)
      borderRadius: 0,
      duration: 1.5,
      ease: 'power3.inOut',
    }, 2.4);

    // Fade in the actual content seamlessly as the portal opens
    tl.to(innerWorldRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 3.0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      jumpToPortalRef.current = () => {};
    };
  }, { scope: pinnedRef });

  return (
    <main className="flex flex-col relative bg-[#050812]">
      <div ref={pinnedRef} className="relative z-20 h-[100svh] w-full overflow-hidden bg-black touch-pan-y">
        {/* Background Video */}
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
          <LinuxEnvironment>
            {/* 
              The Portal Icon is now a NORMAL flex item inside the GNOME dock.
              As it scales, it forces the dock to expand to full screen to act as a seamless transition gateway!
            */}
            <button
              type="button"
              aria-label="Open cloud portal"
              onClick={() => jumpToPortalRef.current()}
              className="relative group flex flex-col items-center mx-1 z-[200] flex-shrink-0 dock-portal-wrapper"
            >
              <div
                ref={portalIconRef}
                className="w-12 h-12 rounded-full overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-[#050812] cursor-pointer transition-all"
              >
                {/* The Orb Graphics */}
                <div className="orb-graphics absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#050812] to-blue-900 pointer-events-none">
                   <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-50 animate-pulse" />
                   <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#050812] to-blue-900 border border-blue-400/50 flex items-center justify-center overflow-hidden portal-orb-inner">
                       <span className="text-blue-400 font-black text-[12px] tracking-tighter shadow-blue-500/50 drop-shadow-lg">BOC</span>
                   </div>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-blue-400 font-bold border border-blue-400/20 whitespace-nowrap pointer-events-none z-[300]">
                ENTER CLOUD
              </div>
            </button>
          </LinuxEnvironment>
        </div>
      </div>

      {/* 
        The Actual Content:
        Because of Lenis smooth scroll, we CANNOT put the website inside the fixed GSAP pin.
        So we place it exactly here and use -mt-[100svh] to perfectly overlay it exactly when the portal finishes expanding.
        This provides the exact visual effect of being inside the portal while keeping perfect 120hz smooth scrolling.
      */}
      <div ref={innerWorldRef} id="inner-world-content" className="relative z-10 w-full min-h-screen bg-[#050812] -mt-[100svh]">
        <About />
        <Experience />
        <Gallery />
        <Team />
        <Partners />
        <Footer />
      </div>
    </main>
  );
}
