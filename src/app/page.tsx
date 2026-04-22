'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LinuxEnvironment } from '@/components/ui/LinuxEnvironment';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinnedRef.current,
        start: 'top top',
        end: isTouchDevice ? '+=320%' : '+=250%',
        scrub: isTouchDevice ? 0.6 : 1.2,
        pin: pinnedRef.current,
        pinType: 'fixed',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
      },
    });

    tl.to(windowRef.current, {
      yPercent: 0,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
    })
      .to(
        heroContentRef.current,
        {
          opacity: 0,
          y: -80,
          duration: 0.6,
        },
        0.4,
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
        1,
      );

    // Enable pointer events when the window is fully expanded
    tl.call(() => {
      gsap.set(windowRef.current, { pointerEvents: 'auto' });
    }, [], 2.15);

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
    <main className="flex-1">
      <div ref={pinnedRef} className="relative h-[100svh] w-full overflow-hidden bg-black touch-pan-y">
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
          <LinuxEnvironment />
        </div>
      </div>
    </main>
  );
}
