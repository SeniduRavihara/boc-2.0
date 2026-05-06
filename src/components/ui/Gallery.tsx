'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Team } from '@/components/sections/Team';
import { Partners } from '@/components/sections/Partners';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  { id: 1, src: '/gallery/gallery_image_1_1778001541656.png', alt: 'Server Room' },
  { id: 2, src: '/gallery/gallery_image_2_1778001958438.png', alt: 'Future Office' },
  { id: 3, src: '/gallery/gallery_image_3_1778002054333.png', alt: 'Cloud Computing' },
  { id: 4, src: '/gallery/gallery_image_4_1778002160468.png', alt: 'Collaboration' },
];

const SECTIONS = [
  { label: 'SECTION 1', bg: 'bg-blue-600' },
  { label: 'SECTION 2', bg: 'bg-red-600' },
  { label: 'SECTION 3', bg: 'bg-emerald-600' },
  { label: 'SECTION 4', bg: 'bg-purple-600' },
];

// Total scroll: 1 unit for zoom-in + 1 unit per section after zoom completes
const ZOOM_SCROLL   = 1.5; // portion of 400% dedicated to zoom animation
const SECTION_SCROLL = 1.0; // portion per section (SECTIONS.length × this = rest of scroll)
const TOTAL_SCROLL_MULTIPLIER = ZOOM_SCROLL + SECTIONS.length * SECTION_SCROLL; // 5.5×

export function Gallery({ triggerRef }: { triggerRef?: React.RefObject<HTMLDivElement | null> }) {
  const containerRef          = useRef<HTMLDivElement>(null);
  const placeholderMobileRef  = useRef<HTMLDivElement>(null);
  const placeholderDesktopRef = useRef<HTMLDivElement>(null);
  const zoomItemRef           = useRef<HTMLDivElement>(null);
  const portalInnerRef        = useRef<HTMLDivElement>(null); // the scrollable strip inside the card

  useGSAP(() => {
    const zoomEl      = zoomItemRef.current;
    const portalInner = portalInnerRef.current;
    if (!zoomEl || !portalInner) return;

    const getPlaceholder = () =>
      window.innerWidth < 1024
        ? placeholderMobileRef.current
        : placeholderDesktopRef.current;

    const snapToPlaceholder = () => {
      const ph        = getPlaceholder();
      const container = containerRef.current;
      if (!ph || !container) return;

      const r = ph.getBoundingClientRect();
      const p = container.getBoundingClientRect();

      gsap.set(zoomEl, {
        top       : r.top - p.top,
        left      : r.left - p.left,
        width     : r.width,
        height    : r.height,
        opacity   : 1,
        visibility: 'visible',
      });

      // Keep portal content anchored to viewport origin
      zoomEl.style.setProperty('--x-offset', `${-r.left}px`);
      zoomEl.style.setProperty('--y-offset', `${-r.top}px`);
    };

    snapToPlaceholder();

    // Start portal inner at Y=0 (first section visible), hidden until card is big enough
    gsap.set(portalInner, { y: 0 });

    const trigger    = triggerRef?.current ?? containerRef.current;
    const useGSAPPin = !triggerRef;

    // ─── SECTION HEIGHTS for the strip scroll ─────────────────────────────
    // Each section is 100vh; strip moves upward by 100vh per section transition
    const sectionH = () => window.innerHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start              : 'top top',
        // Scale end to accommodate zoom + all 4 section scrolls
        end                : `+=${TOTAL_SCROLL_MULTIPLIER * 100}%`,
        scrub              : 1,
        pin                : useGSAPPin ? (containerRef.current ?? true) : false,
        anticipatePin      : useGSAPPin ? 1 : 0,
        invalidateOnRefresh: true,
        refreshPriority    : -1,
        onRefresh          : snapToPlaceholder,
        onEnter            : snapToPlaceholder,
        onEnterBack        : snapToPlaceholder,
        onUpdate           : () => {
          // Keep portal content anchored every frame
          const r = zoomEl.getBoundingClientRect();
          zoomEl.style.setProperty('--x-offset', `${-r.left}px`);
          zoomEl.style.setProperty('--y-offset', `${-r.top}px`);
        },
      },
    });

    // ── Phase 1: Zoom card from placeholder → full viewport (1.5 units) ───
    tl.to(zoomEl, {
      top         : 0,
      left        : 0,
      width       : () => window.innerWidth,
      height      : () => window.innerHeight,
      borderRadius: 0,
      duration    : ZOOM_SCROLL,
      ease        : 'power3.inOut',
    });

    // ── Phase 2: Scroll the strip inside the now-fullscreen card (1 unit each) ──
    // We translate the inner strip upward, one full viewport height per section change.
    // Sections 1→2→3→4 means 3 transitions (we start already seeing section 1).
    tl.to(
      portalInner,
      {
        y       : () => -(sectionH() * (SECTIONS.length - 1)),
        duration: SECTIONS.length * SECTION_SCROLL,
        ease    : 'none', // linear so each section gets equal scroll distance
      },
      // Start immediately after zoom completes
      `>`,
    );

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* ── MOBILE masonry (hidden lg+) ──────────────────────── */}
      <div className="lg:hidden w-full px-3 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '3/4' }}>
              <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" sizes="50vw" priority />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
              <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
              <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="50vw" />
            </div>
          </div>
        </div>

        {/* Mobile placeholder */}
        <div
          ref={placeholderMobileRef}
          className="relative w-full rounded-xl"
          style={{ aspectRatio: '16/7' }}
          aria-hidden="true"
        />

        <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/6' }}>
          <Image 
            src={GALLERY_IMAGES[2].src} 
            alt={GALLERY_IMAGES[2].alt} 
            fill 
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, 66vw" 
          />
        </div>
      </div>

      {/* ── DESKTOP grid (hidden below lg) ───────────────────── */}
      <div className="hidden lg:grid grid-cols-3 gap-3 px-6 w-full max-w-5xl">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" sizes="33vw" priority />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover" sizes="33vw" />
        </div>

        {/* Desktop placeholder */}
        <div
          ref={placeholderDesktopRef}
          className="relative aspect-video rounded-xl"
          aria-hidden="true"
        />

        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 col-span-2">
          <Image 
            src={GALLERY_IMAGES[2].src} 
            alt={GALLERY_IMAGES[2].alt} 
            fill 
            className="object-cover" 
            sizes="(max-width: 1024px) 100vw, 66vw" 
          />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="33vw" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ZOOM CARD — expands from placeholder to full viewport,
          then its inner strip scrolls through all 4 sections.
      ───────────────────────────────────────────────────────────────────── */}
      <div
        ref={zoomItemRef}
        className="rounded-xl overflow-hidden border border-white/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-[#050812]"
        style={{ position: 'absolute', visibility: 'hidden', zIndex: 50 }}
      >
        {/* Portal Bezel / UI Overlay — only visible before full zoom */}
        <div className="absolute inset-0 z-20 pointer-events-none border border-white/10 rounded-xl" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300/80">Active Viewport // Portal.01</p>
          </div>
          <h3 className="text-sm lg:text-lg font-bold uppercase tracking-tighter leading-none text-white drop-shadow-md">Enter Core</h3>
        </div>

        {/*
          PORTAL VIEWPORT — clipped to card bounds (overflow:hidden on parent).
          portalInnerRef is the scrolling strip; GSAP translates it upward on scroll.

          Width is forced to window width via the counter-offset trick so the content
          fills the card correctly both before and after zoom.
        */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ width: '100vw', height: '100vh',
                   transform: 'translate(var(--x-offset, 0), var(--y-offset, 0))' }}
        >
          {/* The moving strip — one 100vh section per child */}
          <div ref={portalInnerRef} className="w-full will-change-transform">
            {SECTIONS.map((s) => (
              <div
                key={s.label}
                className={`w-full flex items-center justify-center border-b-4 border-white/20 ${s.bg}/80`}
                style={{ height: '100vh' }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white opacity-50">{s.label}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}