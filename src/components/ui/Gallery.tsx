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
  { id: 5, src: '/gallery/gallery_image_5_1778002212394.png', alt: 'Tech Chip' },
];

export function Gallery({ triggerRef }: { triggerRef?: React.RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomItemRef  = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const trigger   = triggerRef?.current ?? containerRef.current;
    const zoomEl    = zoomItemRef.current;
    const contentEl = contentRef.current;
    if (!trigger || !zoomEl || !contentEl) return;

    // ── 1. Capture natural grid position BEFORE ScrollTrigger touches layout ──
    // The element is still in normal flow here, so this is the real grid rect.
    const r = zoomEl.getBoundingClientRect();
    const startState = {
      position    : 'fixed' as const,
      top         : r.top,
      left        : r.left,
      width       : r.width,
      height      : r.height,
      zIndex      : 50,
      borderRadius: '12px',
      margin      : 0,
    };

    // ── 2. Hidden initial state for fullscreen content ──
    gsap.set(contentEl, { opacity: 0, scale: 0.8, visibility: 'hidden' });

    // ── 3. Pinned scrub timeline ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start            : 'top top',
        end              : '+=400%',
        scrub            : 1,
        pin              : true,
        anticipatePin    : 1,
        invalidateOnRefresh: true,
        // On window resize: strip GSAP styles → re-measure → patch startState
        onRefresh() {
          gsap.set(zoomEl, {
            clearProps: 'position,top,left,width,height,zIndex,borderRadius,margin',
          });
          const rr = zoomEl.getBoundingClientRect();
          startState.top    = rr.top;
          startState.left   = rr.left;
          startState.width  = rr.width;
          startState.height = rr.height;
        },
      },
    });

    // Fade out the surrounding cards while the zoom begins
    tl.to('.gallery-item-other', {
      opacity : 0,
      scale   : 0.85,
      duration: 0.4,
      stagger : 0.06,
      ease    : 'power2.inOut',
    });

    // ── 4. Zoom: from exact grid coordinates → fullscreen ──
    // GSAP 3 requires plain objects in fromTo — not a function as fromVars.
    tl.fromTo(
      zoomEl,
      startState,        // ← static object, coordinates captured before ST init
      {
        top         : 0,
        left        : 0,
        width       : '100vw',
        height      : '100vh',
        borderRadius: 0,
        duration    : 1.5,
        ease        : 'power3.inOut',
      }
    );

    // ── 5. Reveal fullscreen content ──
    tl.to(
      contentEl,
      {
        opacity   : 1,
        scale     : 1,
        visibility: 'visible',
        duration  : 0.5,
        ease      : 'power2.out',
      },
      '-=0.3'
    );

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center"
    >
      {/* ── Masonry Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-6 w-full max-w-5xl max-h-[80vh] mx-auto overflow-hidden">

        <div className="gallery-item-other relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" />
        </div>

        <div className="gallery-item-other relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover" />
        </div>

        {/* ── SPECIAL ZOOM ITEM ── */}
        <div
          ref={zoomItemRef}
          className="relative aspect-video rounded-xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.2)] bg-[#050812]"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-blue-900/40 to-transparent flex flex-col justify-end p-3 pointer-events-none">
            <p className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-0.5">System Entry</p>
            <h3 className="text-base font-bold uppercase tracking-tighter leading-none text-white">Enter Core</h3>
          </div>
          <div className="absolute inset-0 scale-[0.15] origin-top-left w-[666%] h-[666%] pointer-events-none opacity-40">
            <About />
          </div>
        </div>

        <div className="gallery-item-other relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg lg:col-span-2">
          <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover" />
        </div>

        <div className="gallery-item-other relative aspect-square md:aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" />
        </div>

        <div className="gallery-item-other relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <Image src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} fill className="object-cover" />
        </div>
      </div>

      {/* ── Fullscreen content ── */}
      <div
        ref={contentRef}
        className="fixed inset-0 z-[60] bg-[#050812] overflow-y-auto invisible"
      >
        <div className="max-w-7xl mx-auto py-20 px-6 text-white text-3xl">
          {/* <About /> <Experience /> <Team /> <Partners /> */}
          lorem ipsum dolor sit amet consectetur adipiscing elit
        </div>
      </div>
    </div>
  );
}