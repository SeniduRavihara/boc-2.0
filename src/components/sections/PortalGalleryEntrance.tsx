'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { GradientShinyTitle } from '../ui/GradientShinyTitle';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// 🎛️ GALLERY SIZING CONFIGURATION
// Adjust these values to easily change the width and height of the miniature card
// =========================================================================
const GALLERY_CONFIG = {
  mobile: {
    width: 130,
    height: 250,
    expandedGridHeight: 500, // Usually 2x the height to allow smooth scrolling inside
  },
  desktop: {
    width: 360,
    height: 240,
    expandedGridHeight: 400, // Usually 1.5x - 2x the height 
  }
};
// =========================================================================

const PORTAL_ITEMS = [
  {
    id: 'boc-neural',
    src: '/gallery/535402715_122240866520212355_8124034634747307157_n 1.webp',
    span: 'col-span-12 md:col-span-6 row-span-1',
    depth: -40, rx: 8, ry: -6,
  },
  {
    id: 'boc-nebula',
    src: '/gallery/535554370_122240866814212355_5298821791634180236_n 1.webp',
    span: 'col-span-12 md:col-span-6 row-span-1',
    depth: -70, rx: -10, ry: 8,
  },
  {
    id: 'boc-shard',
    src: '/gallery/536284330_122240866082212355_6148099243555502993_n 1.webp',
    span: 'col-span-12 md:col-span-4 row-span-1',
    depth: -20, rx: 6, ry: -10,
  },
  {
    id: 'boc-monolith',
    src: '/gallery/536502129_122240864120212355_2064198593439261121_n 1.webp',
    span: 'col-span-12 md:col-span-8 row-span-1',
    depth: -50, rx: -6, ry: 12,
  },
  {
    id: 'boc-pulse',
    src: '/gallery/537424474_122240865374212355_3166245579080254582_n 3.webp',
    span: 'col-span-12 md:col-span-6 row-span-1',
    depth: -90, rx: 12, ry: -8,
  },
  {
    id: 'boc-spectral',
    src: '/gallery/537483229_122240864276212355_3196250950373039991_n 2.webp',
    span: 'col-span-12 md:col-span-6 row-span-1',
    depth: -30, rx: -8, ry: 6,
  },
  {
    id: 'boc-vortex',
    src: '/gallery/538341720_122240863028212355_4189567101984455264_n 1.webp',
    span: 'col-span-12 md:col-span-4 row-span-1',
    depth: -60, rx: 10, ry: -10,
  },
  {
    id: 'boc-prism',
    src: '/gallery/fffff 2.webp',
    span: 'col-span-12 md:col-span-8 row-span-1',
    depth: -40, rx: -12, ry: 12,
  },
];

export function PortalGalleryEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  // The single entity that zooms — wraps BOTH text and card
  const entityRef = useRef<HTMLDivElement>(null);
  // Just the card element — used to compute pivot + post-zoom animations
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const entity = entityRef.current;
    const card = cardRef.current;

    if (!container || !sticky || !entity || !card) return;

    const badge = card.querySelector('.preview-badge');
    const gridContainer = card.querySelector('.grid-container');
    const gridItems = card.querySelectorAll('.grid-item');
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gridItems.forEach((item, index) => {
        // Dynamic alternating 3D accordion/float effect on mobile
        const depth = -40 - (index % 3) * 25; // -40, -65, -90...
        const rx = index % 2 === 0 ? 8 : -8;
        const ry = index % 2 === 0 ? -12 : 12;

        item.setAttribute('data-depth', depth.toString());
        item.setAttribute('data-rx', rx.toString());
        item.setAttribute('data-ry', ry.toString());

        gsap.set(item, {
          z: depth,
          rotateX: rx,
          rotateY: ry,
        });
      });
    }

    if (gridContainer) {
      gsap.set(gridContainer, { y: 0 });
    }

    // ── How much to scale so the card EXACTLY fills the viewport ──────────
    const getScaleFactor = () => {
      const cW = card.offsetWidth || GALLERY_CONFIG.desktop.width;
      const cH = card.offsetHeight || GALLERY_CONFIG.desktop.height;
      return Math.max(window.innerWidth / cW, window.innerHeight / cH) * 1.02;
    };

    // ── Local VH calculation for responsive scaled heights ────────────────
    const getLocalVH = () => {
      return window.innerHeight / getScaleFactor();
    };

    // Store card centering offsets
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    const calculateOffsets = () => {
      // Temporarily clear inline transforms to measure clean static rects
      const prevTransform = entity.style.transform;
      entity.style.transform = 'none';

      const sRect = sticky.getBoundingClientRect();
      const cRect = card.getBoundingClientRect();

      const scale = getScaleFactor();
      const scaledHeight = cRect.height * scale;

      // Card center relative to the sticky viewport container
      const cardCX_rel = (cRect.left - sRect.left) + cRect.width / 2;
      const cardCY_rel = (cRect.top - sRect.top) + cRect.height / 2;

      // Viewport center
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      // Delta required to center the card on screen (relative to sticky top-0 state)
      initialTranslateX = screenCenterX - cardCX_rel;

      // If the scaled card height exceeds the viewport, align the top of the card
      // to the top of the screen (y = 0) so the first row of images isn't cropped.
      if (scaledHeight > window.innerHeight) {
        initialTranslateY = (scaledHeight / 2) - cardCY_rel;
      } else {
        initialTranslateY = screenCenterY - cardCY_rel;
      }

      // Restore transform state
      entity.style.transform = prevTransform;
    };

    // ── Pivot = card center in entity-local coordinates ───────────────────
    // This makes the zoom feel like flying INTO the card specifically.
    const setCardPivot = () => {
      const prevTransform = entity.style.transform;
      entity.style.transform = 'none';

      const eRect = entity.getBoundingClientRect();
      const cRect = card.getBoundingClientRect();
      const ox = (cRect.left - eRect.left) + cRect.width / 2;
      const oy = (cRect.top - eRect.top) + cRect.height / 2;

      entity.style.transform = prevTransform;

      gsap.set(entity, { transformOrigin: `${ox}px ${oy}px` });
    };

    // Initialize measurements
    calculateOffsets();
    setCardPivot();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onRefresh: () => {
          calculateOffsets();
          setCardPivot();
        },
        onUpdate: (self) => {
          // Mark as zoomed once scale animation is mostly done
          card.classList.toggle('is-zoomed', self.progress > 0.52);
        },
      },
    });

    // ── Phase 0: Fade badge immediately ───────────────────────────────────
    if (badge) {
      tl.to(badge, { opacity: 0, scale: 0.75, duration: 0.5, ease: 'power2.out' }, 0);
    }

    // ── Phase 1: Entire entity (text + card) zooms as one smooth unit ────────
    // We animate scale AND translate the entity so the card centers perfectly in the screen.
    tl.to(entity, {
      scale: () => getScaleFactor(),
      x: () => initialTranslateX,
      y: () => initialTranslateY,
      duration: 3.6,
      ease: 'power2.inOut',
      invalidateOnRefresh: true,
    }, 0);

    // ── Phase 2: Card border/radius cleanup as it fills screen ────────────
    tl.to(card, {
      borderRadius: '0px',
      borderColor: 'transparent',
      duration: 0.6,
      ease: 'power2.out',
    }, 1.4);

    // ── Phase 3: Grid items flatten their individual 3D offsets ───────────
    gridItems.forEach((item) => {
      const depth = parseFloat(item.getAttribute('data-depth') || '0');
      const rx = parseFloat(item.getAttribute('data-rx') || '0');
      const ry = parseFloat(item.getAttribute('data-ry') || '0');

      tl.fromTo(
        item,
        { z: depth, rotateX: rx, rotateY: ry },
        {
          z: 0, rotateX: 0, rotateY: 0,
          duration: 1.5,
          ease: 'power2.out',
        },
        1.5
      );
    });

    // ── Phase 4: Grid expands height dynamically ──────────
    if (gridContainer) {
      tl.to(gridContainer, {
        height: () => window.innerWidth < 768 ? GALLERY_CONFIG.mobile.expandedGridHeight : GALLERY_CONFIG.desktop.expandedGridHeight,
        duration: 1.5,
        ease: 'power2.inOut',
      }, 1.5);

      // ── Phase 5: Scroll through the full grid ─────────────────────────
      tl.to(gridContainer, {
        y: () => {
          const scale = getScaleFactor();
          const vh = window.innerHeight;
          const expandedHeight = window.innerWidth < 768 ? GALLERY_CONFIG.mobile.expandedGridHeight : GALLERY_CONFIG.desktop.expandedGridHeight;
          return vh / scale - expandedHeight;
        },
        duration: 2.3,
        ease: 'none',
      }, 3.0);
    }

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-[600vh] w-full">

      {/* Sticky viewport — perspective for card's internal 3D grid items */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-[#020617] pointer-events-none z-0"
        />

        {/* ── SINGLE ZOOM ENTITY ─────────────────────────────────────────────
            Desktop: flex-row — text LEFT, card RIGHT, side by side
            Mobile:  flex-col — text top, card bottom
            Both zoom together. Pivot locked to card center via GSAP.        ── */}
        <div
          ref={entityRef}
          className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 md:px-0 will-change-transform"
        >

          {/* ── LEFT / TOP: Text column ───────────────────────────────────── */}
          <div className="flex flex-col items-start select-none max-w-sm md:max-w-md shrink-0">
            {/* <span className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase mb-4 font-bold">
              02 // Archive Portal
            </span> */}
            {/* <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-slate-100 mb-6">
              Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                Memories
              </span>
            </h2> */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-reglo text-5xl md:text-7xl font-black tracking-tighter mb-4"
            >
              <GradientShinyTitle text="Our Memories" speed={2} delay={0.7} />
            </motion.h2>
            <p className="text-slate-400 font-sans text-xs md:text-sm max-w-xs leading-relaxed mb-6">
              RELIVE THE CLOUD REVOLUTION. SCROLL DOWN TO PASS THROUGH THE PORTAL
              MATRIX AND ENTER THE BOC 1.0 HIGHLIGHTS.
            </p>
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-500 font-black animate-pulse">
                SCROLL TO IMMERSE
              </span>
            </div>
          </div>

          {/* ── RIGHT / BOTTOM: Gallery card ─────────────────────────────── */}
          <div className="shrink-0 flex items-center justify-center">
            <div
              ref={cardRef}
              className="dynamic-gallery-card shrink-0 rounded-2xl bg-[#020617] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-start origin-center pointer-events-auto will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Badge overlay */}
              {/* <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 rounded-2xl preview-badge pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                </div>
                <span className="text-[9px] font-mono text-white tracking-[0.4em] font-black uppercase">
                  ENTER PORTAL
                </span>
                <span className="text-[7px] font-mono text-white/40 tracking-[0.2em] mt-1 uppercase">
                  SCROLL TO ZOOM
                </span>
              </div> */}

              {/* Gallery grid — 3D items restored from original */}
              <div
                className="grid-container dynamic-gallery-card grid grid-cols-12 gap-1.5 w-full shrink-0 p-1.5 rounded-2xl relative z-10 origin-top"
                style={{
                  flexShrink: 0,
                  transformStyle: 'preserve-3d',
                }}
              >
                {PORTAL_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    data-depth={item.depth}
                    data-rx={item.rx}
                    data-ry={item.ry}
                    className={`grid-item relative overflow-hidden bg-[#060f21] border border-white/5 cursor-default group/grid rounded-lg ${item.span}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(${item.depth}px) rotateX(${item.rx}deg) rotateY(${item.ry}deg)`,
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.id}
                      fill
                      unoptimized
                      className="object-cover transition-all duration-700 grayscale group-hover/grid:grayscale-0 group-hover/grid:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover/grid:bg-transparent transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .dynamic-gallery-card {
          width: ${GALLERY_CONFIG.mobile.width}px;
          height: ${GALLERY_CONFIG.mobile.height}px;
        }

        .grid-container {
          grid-template-rows: repeat(8, minmax(0, 1fr));
          height: ${GALLERY_CONFIG.mobile.expandedGridHeight}px;
        }

        @media (min-width: 768px) {
          .dynamic-gallery-card {
            width: ${GALLERY_CONFIG.desktop.width}px;
            height: ${GALLERY_CONFIG.desktop.height}px;
          }
          .grid-container {
            grid-template-rows: repeat(4, minmax(0, 1fr));
            height: ${GALLERY_CONFIG.desktop.height}px;
          }
        }

        .is-zoomed .grid-item {
          pointer-events: auto !important;
          cursor: default !important;
          transition: filter 0.4s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), z-index 0s !important;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .is-zoomed .grid-item:hover {
          filter: grayscale(0%) !important;
          z-index: 50 !important;
          transform: scale(1.05) translateZ(30px) !important;
        }
        .grid-item {
          pointer-events: none;
          transition: filter 0.4s ease, z-index 0s;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
