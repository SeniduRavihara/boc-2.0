'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { About } from '@/components/sections/About';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  { id: 1, src: '/gallery/gallery_image_1_1778001541656.png', alt: 'Server Room' },
  { id: 2, src: '/gallery/gallery_image_2_1778001958438.png', alt: 'Future Office' },
  { id: 3, src: '/gallery/gallery_image_3_1778002054333.png', alt: 'Cloud Computing' },
  { id: 4, src: '/gallery/gallery_image_4_1778002160468.png', alt: 'Collaboration' },
];

export function Gallery({ triggerRef }: { triggerRef?: React.RefObject<HTMLDivElement | null> }) {
  const containerRef         = useRef<HTMLDivElement>(null);
  const placeholderMobileRef = useRef<HTMLDivElement>(null); // used on < lg
  const placeholderDesktopRef= useRef<HTMLDivElement>(null); // used on ≥ lg
  const zoomItemRef          = useRef<HTMLDivElement>(null);
  const contentRef           = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const trigger   = triggerRef?.current ?? containerRef.current;
    const zoomEl    = zoomItemRef.current;
    const contentEl = contentRef.current;
    if (!trigger || !zoomEl || !contentEl) return;

    // Pick whichever placeholder is currently visible
    const getPlaceholder = () =>
      window.innerWidth < 1024
        ? placeholderMobileRef.current
        : placeholderDesktopRef.current;

    const snapToPlaceholder = () => {
      const ph = getPlaceholder();
      if (!ph) return;
      const r = ph.getBoundingClientRect();
      gsap.set(zoomEl, {
        top       : r.top,
        left      : r.left,
        width     : r.width,
        height    : r.height,
        visibility: 'visible',
      });
    };

    snapToPlaceholder();
    gsap.set(contentEl, { opacity: 0, scale: 0.8, visibility: 'hidden' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start            : 'top top',
        end              : '+=400%',
        scrub            : 1,
        pin              : true,
        anticipatePin    : 1,
        invalidateOnRefresh: true,
        onRefresh        : snapToPlaceholder,
      },
    });

    tl.to(zoomEl, {
      top         : 0,
      left        : 0,
      width       : () => window.innerWidth,
      height      : () => window.innerHeight,
      borderRadius: 0,
      duration    : 1.5,
      ease        : 'power3.inOut',
    });

    tl.to(
      contentEl,
      { opacity: 1, scale: 1, visibility: 'visible', duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden"
    >

      {/* ═══════════════════════════════════════════════════════
          MOBILE MASONRY  (hidden on lg+)
          Left col          Right col
          ┌───────────┐    ┌───────────┐
          │  img1     │    │  img2     │  landscape 4/3
          │  portrait │    ├───────────┤
          │  3/4 tall │    │  img4     │  landscape 4/3
          └───────────┘    └───────────┘
          ┌──────────────────────────────┐
          │  Enter Core  (placeholder)   │  16/7
          └──────────────────────────────┘
          ┌──────────────────────────────┐
          │  img3  (wide panoramic)      │  16/6
          └──────────────────────────────┘
          ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden w-full px-3 flex flex-col gap-2">

        {/* Row 1 — masonry two columns */}
        <div className="flex gap-2 w-full">

          {/* Left col: one tall portrait image */}
          <div className="flex-1">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '3/4' }}>
              <Image
                src={GALLERY_IMAGES[0].src}
                alt={GALLERY_IMAGES[0].alt}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
            </div>
          </div>

          {/* Right col: two shorter landscape images stacked */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
              <Image
                src={GALLERY_IMAGES[1].src}
                alt={GALLERY_IMAGES[1].alt}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '4/3' }}>
              <Image
                src={GALLERY_IMAGES[3].src}
                alt={GALLERY_IMAGES[3].alt}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>

        {/* Row 2 — Enter Core placeholder, full width */}
        <div
          ref={placeholderMobileRef}
          className="relative w-full rounded-xl"
          style={{ aspectRatio: '16/7' }}
          aria-hidden="true"
        />

        {/* Row 3 — wide panoramic image */}
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/6' }}>
          <Image
            src={GALLERY_IMAGES[2].src}
            alt={GALLERY_IMAGES[2].alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP GRID  (hidden below lg) — UNTOUCHED from your code
          ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 px-3 lg:px-6 w-full lg:max-w-5xl">

        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image
            src={GALLERY_IMAGES[0].src}
            alt={GALLERY_IMAGES[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image
            src={GALLERY_IMAGES[1].src}
            alt={GALLERY_IMAGES[1].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Desktop placeholder — 3rd col row 1 */}
        <div
          ref={placeholderDesktopRef}
          className="relative aspect-video rounded-xl col-span-2 lg:col-span-1"
          aria-hidden="true"
        />

        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 lg:col-span-2">
          <Image
            src={GALLERY_IMAGES[2].src}
            alt={GALLERY_IMAGES[2].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 66vw"
          />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image
            src={GALLERY_IMAGES[3].src}
            alt={GALLERY_IMAGES[3].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

      </div>

      {/* ZOOM CARD — fixed, snapped over the correct placeholder by GSAP */}
      <div
        ref={zoomItemRef}
        className="rounded-xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.2)] bg-[#050812]"
        style={{ position: 'fixed', visibility: 'hidden', zIndex: 50 }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-blue-900/40 to-transparent flex flex-col justify-end p-3 pointer-events-none">
          <p className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-0.5">System Entry</p>
          <h3 className="text-sm lg:text-base font-bold uppercase tracking-tighter leading-none text-white">Enter Core</h3>
        </div>
        <div className="absolute inset-0 scale-[0.15] origin-top-left w-[666%] h-[666%] pointer-events-none opacity-40">
          <About />
        </div>
      </div>

      {/* Fullscreen content */}
      <div
        ref={contentRef}
        className="fixed inset-0 z-[60] bg-[#050812] overflow-y-auto invisible"
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 text-white text-xl lg:text-3xl">
          {/* <About /> <Experience /> <Team /> <Partners /> */}
          lorem ipsum dolor sit amet consectetur adipiscing elit
        </div>
      </div>
    </div>
  );
}