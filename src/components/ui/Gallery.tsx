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
  const containerRef          = useRef<HTMLDivElement>(null);
  const placeholderMobileRef  = useRef<HTMLDivElement>(null);
  const placeholderDesktopRef = useRef<HTMLDivElement>(null);
  const zoomItemRef           = useRef<HTMLDivElement>(null);
  const contentRef            = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const zoomEl    = zoomItemRef.current;
    const contentEl = contentRef.current;
    if (!zoomEl || !contentEl) return;

    const getPlaceholder = () =>
      window.innerWidth < 1024
        ? placeholderMobileRef.current
        : placeholderDesktopRef.current;

    const snapToPlaceholder = () => {
      const ph = getPlaceholder();
      const container = containerRef.current;
      if (!ph || !container) return;

      const r = ph.getBoundingClientRect();
      const p = container.getBoundingClientRect();

      // Position relative to the Gallery container, not the screen
      gsap.set(zoomEl, {
        top       : r.top - p.top,
        left      : r.left - p.left,
        width     : r.width,
        height    : r.height,
        opacity   : 1,
        visibility: 'visible',
      });
    };

    snapToPlaceholder();
    gsap.set(contentEl, { opacity: 0, scale: 0.8, visibility: 'hidden' });

    /*
      When triggerRef is provided (from HomeClient), the parent sticky div
      already handles keeping the panel in view — we do NOT use pin:true.
      The ScrollTrigger just drives animation progress as the user scrolls
      through the galleryZoneRef's height.

      When standalone (no triggerRef), we fall back to GSAP pin on containerRef.
    */
    const trigger      = triggerRef?.current ?? containerRef.current;
    const useGSAPPin   = !triggerRef;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start            : 'top top',
        end              : '+=400%',
        scrub            : 1,
        pin              : useGSAPPin ? (containerRef.current ?? true) : false,
        anticipatePin    : useGSAPPin ? 1 : 0,
        invalidateOnRefresh: true,
        refreshPriority  : -1, // always after hero (priority 1)
        onRefresh        : snapToPlaceholder,
        onEnter          : snapToPlaceholder,
        onEnterBack      : snapToPlaceholder,
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
          <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" sizes="100vw" />
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
          <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" sizes="66vw" />
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="33vw" />
        </div>
      </div>

      {/* ZOOM CARD */}
      <div
        ref={zoomItemRef}
        className="rounded-xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.2)] bg-[#050812]"
        style={{ position: 'absolute', visibility: 'hidden', zIndex: 50 }}
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
          lorem ipsum dolor sit amet consectetur adipiscing elit
        </div>
      </div>
    </div>
  );
}