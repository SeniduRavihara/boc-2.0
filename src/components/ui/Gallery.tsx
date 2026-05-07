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
  { id: 5, src: '/gallery/gallery_image_5_1778002212394.png', alt: 'Tech Chip' },
];

const SECTIONS = [
  { id: 'section1', Component: PortalSection1 },
];

const ZOOM_SCROLL             = 1.5;
const SECTION_SCROLL          = 1.0;
const TOTAL_SCROLL_MULTIPLIER = ZOOM_SCROLL + SECTIONS.length * SECTION_SCROLL;

export const GALLERY_ZONE_DVH = TOTAL_SCROLL_MULTIPLIER * 100;

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
        onRefresh          : snapToPlaceholder,
        onEnter            : snapToPlaceholder,
        onUpdate() {
          const left = parseFloat(zoomEl.style.left) || 0;
          const top  = parseFloat(zoomEl.style.top)  || 0;
          zoomEl.style.setProperty('--x-offset', `${-left}px`);
          zoomEl.style.setProperty('--y-offset', `${-top}px`);
        },
      },
    });

    tl.to(zoomEl, {
      top: 0, left: 0,
      width       : () => window.innerWidth,
      height      : () => window.innerHeight,
      borderRadius: 0,
      duration    : ZOOM_SCROLL,
      ease        : 'power3.inOut',
    });

    tl.to(portalInner, {
      y       : () => -(sectionH() * (SECTIONS.length - 1)),
      duration: SECTIONS.length * SECTION_SCROLL,
      ease    : 'none',
    }, '>');

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden lg:items-center"
    >

      {/* ── MOBILE masonry ── */}
      <div className="lg:hidden w-full h-full px-3 py-3 flex flex-col gap-2 items-stretch">
        {/* Title */}
        <div className="mb-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-blue-500 mb-0.5">Gallery // Moments</p>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">
            Our <span className="text-blue-500">Memories</span>
          </h2>
        </div>

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

        {/* flex-1 fills whatever space remains — no fixed aspect ratio so no dead space */}
        <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" sizes="100vw" />
        </div>
      </div>

      {/* ── DESKTOP grid ── */}
      <div className="hidden lg:flex lg:flex-col gap-3 px-6 w-full max-w-5xl h-full py-4">

        {/* Title row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-blue-500 mb-1">Gallery // Moments</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
              Our <span className="text-blue-500">Memories</span>
            </h2>
          </div>
          {/* subtle decorative line */}
          <div className="h-px flex-1 ml-8 bg-gradient-to-r from-blue-500/30 to-transparent" />
        </div>

        {/*
          Desktop grid layout:
          Row 1: img1 (1col) | img2 (1col) | [placeholder / Enter Core] (1col)
          Row 2: img3 (2col) | img4 (1col)
          Row 3: img5 (1col) | (empty 2col — reserved, keeps grid balanced)
        */}
        <div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-3 flex-1 min-h-0">
          {/* Row 1 */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
            <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" sizes="33vw" priority />
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
            <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover" sizes="33vw" />
          </div>
          {/* Placeholder — Enter Core card snaps here */}
          <div ref={placeholderDesktopRef} className="relative aspect-video rounded-xl" aria-hidden="true" />

          {/* Row 2 — img3 left (2col), img4+img5 stacked right (1col) */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 col-span-2">
            <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" sizes="66vw" />
          </div>

          {/* Col 3: img4 and img5 stacked — fills the full height of row 2 */}
          <div className="flex flex-col gap-3">
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10">
              <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="33vw" />
            </div>
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10">
              <Image src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} fill className="object-cover" sizes="33vw" />
            </div>
          </div>
        </div>
      </div>

      {/* ── ZOOM CARD ── */}
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