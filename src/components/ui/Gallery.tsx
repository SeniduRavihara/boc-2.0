'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortalSection1 } from '@/components/sections/gallery/PortalSection1';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  { id: 1, src: '/gallery/gallery_image_1_1778001541656.png', alt: 'Server Room' },
  { id: 2, src: '/gallery/gallery_image_2_1778001958438.png', alt: 'Future Office' },
  { id: 3, src: '/gallery/gallery_image_3_1778002054333.png', alt: 'Cloud Computing' },
  { id: 4, src: '/gallery/gallery_image_4_1778002160468.png', alt: 'Collaboration' },
];

const SECTIONS = [
  { id: 'section1', Component: PortalSection1 },
];

const ZOOM_SCROLL             = 1.5;
const SECTION_SCROLL          = 1.0;
const TOTAL_SCROLL_MULTIPLIER = ZOOM_SCROLL + SECTIONS.length * SECTION_SCROLL; // 2.5

export const GALLERY_ZONE_DVH = TOTAL_SCROLL_MULTIPLIER * 100; // 250

export function Gallery({ triggerRef }: { triggerRef?: React.RefObject<HTMLDivElement | null> }) {
  const containerRef          = useRef<HTMLDivElement>(null);
  const placeholderMobileRef  = useRef<HTMLDivElement>(null);
  const placeholderDesktopRef = useRef<HTMLDivElement>(null);
  const zoomItemRef           = useRef<HTMLDivElement>(null);
  const portalInnerRef        = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const zoomEl      = zoomItemRef.current;
    const portalInner = portalInnerRef.current;
    if (!zoomEl || !portalInner) return;

    const getPlaceholder = () =>
      window.innerWidth < 1024
        ? placeholderMobileRef.current
        : placeholderDesktopRef.current;

    /*
      snapToPlaceholder — sets the card back to placeholder position.
      
      IMPORTANT: only called on:
        • onRefresh  (layout recalc after resize / initial mount)
        • onEnter    (user scrolls INTO the zone from ABOVE for the first time)
      
      NOT called on onEnterBack — when the user scrolls back UP into the zone
      from below, GSAP's scrub tween already knows how to reverse the animation
      correctly. Calling snapToPlaceholder here would fight the tween and break
      the reverse zoom (snapping the card to placeholder when it should be
      fullscreen at progress=1, then reversing from there).
    */
    const snapToPlaceholder = () => {
      const ph        = getPlaceholder();
      const container = containerRef.current;
      if (!ph || !container) return;

      const r = ph.getBoundingClientRect();
      const p = container.getBoundingClientRect();

      gsap.set(zoomEl, {
        top       : r.top  - p.top,
        left      : r.left - p.left,
        width     : r.width,
        height    : r.height,
        visibility: 'visible',
      });

      zoomEl.style.setProperty('--x-offset', `${-r.left}px`);
      zoomEl.style.setProperty('--y-offset', `${-r.top}px`);
    };

    // Initial snap — runs before tween so card is in position from the start
    snapToPlaceholder();
    gsap.set(portalInner, { y: 0 });

    const trigger    = triggerRef?.current ?? containerRef.current;
    const useGSAPPin = !triggerRef;
    const sectionH   = () => window.innerHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start              : 'top top',
        end                : `+=${TOTAL_SCROLL_MULTIPLIER * 100}%`,
        scrub              : 1,
        pin                : useGSAPPin ? (containerRef.current ?? true) : false,
        anticipatePin      : useGSAPPin ? 1 : 0,
        invalidateOnRefresh: true,
        refreshPriority    : -1,

        // onRefresh: recalculate placeholder position on resize/orientation change.
        // Also fires on first ST init, so this is the primary positioning call.
        onRefresh: snapToPlaceholder,

        // onEnter: user scrolling DOWN into the zone from above.
        // Re-snap in case images/fonts shifted layout after initial mount.
        onEnter: snapToPlaceholder,

        // ── NO onEnterBack ──
        // When user scrolls UP back into the zone from below, the scrub tween
        // handles the reverse automatically. Calling snapToPlaceholder here
        // would reset the card to placeholder size while tween is at progress≈1,
        // which breaks the reverse zoom entirely.

        // onUpdate: sync CSS offset vars from GSAP's inline styles.
        // Reading style.left/top is a simple string read — no layout reflow.
        // Works correctly in both scroll directions.
        onUpdate() {
          const left = parseFloat(zoomEl.style.left) || 0;
          const top  = parseFloat(zoomEl.style.top)  || 0;
          zoomEl.style.setProperty('--x-offset', `${-left}px`);
          zoomEl.style.setProperty('--y-offset', `${-top}px`);
        },
      },
    });

    // Phase 1: zoom card placeholder → fullscreen
    tl.to(zoomEl, {
      top         : 0,
      left        : 0,
      width       : () => window.innerWidth,
      height      : () => window.innerHeight,
      borderRadius: 0,
      duration    : ZOOM_SCROLL,
      ease        : 'power3.inOut',
    });

    // Phase 2: scroll portal strip through sections
    tl.to(
      portalInner,
      {
        y       : () => -(sectionH() * (SECTIONS.length - 1)),
        duration: SECTIONS.length * SECTION_SCROLL,
        ease    : 'none',
      },
      '>',
    );

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* ── MOBILE masonry ── */}
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
        <div ref={placeholderMobileRef} className="relative w-full rounded-xl" style={{ aspectRatio: '16/7' }} aria-hidden="true" />
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/6' }}>
          <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" sizes="100vw" />
        </div>
      </div>

      {/* ── DESKTOP grid ── */}
      <div className="hidden lg:grid grid-cols-3 gap-3 px-6 w-full max-w-5xl">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" sizes="33vw" priority />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover" sizes="33vw" />
        </div>
        <div ref={placeholderDesktopRef} className="relative aspect-video rounded-xl" aria-hidden="true" />
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 col-span-2">
          <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" sizes="66vw" />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="33vw" />
        </div>
      </div>

      {/* ── ZOOM CARD ── */}
      {/*
        visibility starts as visible — snapToPlaceholder (called on onRefresh/onEnter)
        positions it correctly. No need to hide it at start since it sits inside
        overflow:hidden container and is clipped until positioned.
      */}
      <div
        ref={zoomItemRef}
        className="rounded-xl overflow-hidden border border-white/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-[#050812]"
        style={{ position: 'absolute', visibility: 'visible', zIndex: 50 }}
      >
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            width     : '100vw',
            height    : '100vh',
            transform : 'translate(var(--x-offset, 0px), var(--y-offset, 0px))',
            willChange: 'transform',
          }}
        >
          <div ref={portalInnerRef} className="w-full" style={{ willChange: 'transform' }}>
            {SECTIONS.map(({ id, Component }) => (
              <div key={id} className="w-full border-b border-white/5" style={{ height: '100vh' }}>
                <Component />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}