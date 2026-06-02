'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ZoomIn, Info, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Gallery Portal Data
const PORTAL_ITEMS = [
  {
    id: 'boc-neural',
    src: '/gallery/535402715_122240866520212355_8124034634747307157_n 1.webp',
    title: 'Neural Convergence',
    category: 'CLOUD ERA',
    year: '2025',
    desc: 'Visualizing Sri Lanka\'s university cloud collaborative networks.',
    span: 'col-span-2 row-span-2',
    depth: -40,
    rx: 8,
    ry: -6,
  },
  {
    id: 'boc-nebula',
    src: '/gallery/535554370_122240866814212355_5298821791634180236_n 1.webp',
    title: 'Data Nebula',
    category: 'INNOVATION',
    year: '2025',
    desc: 'Exploring the latent potential of student cloud ideas.',
    span: 'col-span-1 row-span-2',
    depth: -70,
    rx: -10,
    ry: 8,
  },
  {
    id: 'boc-shard',
    src: '/gallery/536284330_122240866082212355_6148099243555502993_n 1.webp',
    title: 'Infinite Shard',
    category: 'MAPPING',
    year: '2025',
    desc: 'Digital mapping infrastructure for Beauty of Cloud.',
    span: 'col-span-1 row-span-2',
    depth: -20,
    rx: 6,
    ry: -10,
  },
  {
    id: 'boc-monolith',
    src: '/gallery/536502129_122240864120212355_2064198593439261121_n 1.webp',
    title: 'Digital Monolith',
    category: 'DESIGN SYSTEM',
    year: '2025',
    desc: 'Geometric architecture of the event branding.',
    span: 'col-span-2 row-span-2',
    depth: -50,
    rx: -6,
    ry: 12,
  },
  {
    id: 'boc-pulse',
    src: '/gallery/537424474_122240865374212355_3166245579080254582_n 3.webp',
    title: 'Cloud Pulse',
    category: 'TELEMETRY',
    year: '2025',
    desc: 'Real-time university delegate telemetry tracking.',
    span: 'col-span-2 row-span-2',
    depth: -90,
    rx: 12,
    ry: -8,
  },
  {
    id: 'boc-spectral',
    src: '/gallery/537483229_122240864276212355_3196250950373039991_n 2.webp',
    title: 'Spectral Array',
    category: 'LIGHT LOGIC',
    year: '2025',
    desc: 'High-speed data packet illumination modeling.',
    span: 'col-span-1 row-span-2',
    depth: -30,
    rx: -8,
    ry: 6,
  },
  {
    id: 'boc-vortex',
    src: '/gallery/538341720_122240863028212355_4189567101984455264_n 1.webp',
    title: 'Vortex Core',
    category: 'SERVERLESS',
    year: '2025',
    desc: 'Analyzing serverless transaction orchestration pipelines.',
    span: 'col-span-1 row-span-2',
    depth: -60,
    rx: 10,
    ry: -10,
  },
  {
    id: 'boc-prism',
    src: '/gallery/fffff 2.webp',
    title: 'Prism Void',
    category: 'VISUAL CORE',
    year: '2025',
    desc: 'Stunning abstracts showcasing computational prisms.',
    span: 'col-span-2 row-span-2',
    depth: -40,
    rx: -12,
    ry: 12,
  }
];

export function PortalGalleryEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const isZoomedRef = useRef(false);

  const [lightboxItem, setLightboxItem] = useState<typeof PORTAL_ITEMS[0] | null>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    const bgOverlay = bgOverlayRef.current;

    if (!container || !sticky || !card || !text || !bgOverlay) return;

    const gridItems = card.querySelectorAll('.grid-item');
    const badge = card.querySelector('.preview-badge');

    // Dynamic scale factor calculation to completely cover the screen while maintaining proportions (aspect ratio 3:2)
    const getScaleFactor = () => {
      const cardW = 360;
      const cardH = 240;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / cardW;
      const scaleY = vh / cardH;
      return Math.max(scaleX, scaleY) * 1.05; // 5% overlap to avoid rounding gaps
    };

    // Calculate X and Y coordinates to center the card from its starting position
    // We measure the static cardWrapperRef which doesn't undergo scaling or translations
    const getCenterX = () => {
      const wrapperEl = cardWrapperRef.current;
      if (!wrapperEl) return 0;
      const rect = wrapperEl.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const screenCenter = window.innerWidth / 2;
      return screenCenter - center;
    };

    const getCenterY = () => {
      const wrapperEl = cardWrapperRef.current;
      if (!wrapperEl) return 0;
      const rect = wrapperEl.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const screenCenter = window.innerHeight / 2;
      return screenCenter - center;
    };

    // Create GSAP ScrollTrigger timeline
    // Note: We use browser CSS sticky for pinning stickyRef, avoiding double-pinning bugs
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Reaches zoom completion around progress 0.53 (timeline pos 3.2 out of 6.0)
          const isZoomed = self.progress > 0.53;
          isZoomedRef.current = isZoomed;
          
          if (isZoomed) {
            card.classList.add('is-zoomed');
          } else {
            card.classList.remove('is-zoomed');
          }
        }
      }
    });

    // Phase 1: Smooth parallax layout offset
    tl.to(text, {
      y: -30,
      duration: 0.8,
      ease: 'none'
    }, 0);

    tl.to(card, {
      y: 40,
      duration: 0.8,
      ease: 'none'
    }, 0);

    // Phase 2: Heading text fades & scales down, card centers itself, background turns dark
    tl.to(text, {
      opacity: 0,
      scale: 0.85,
      y: -100,
      duration: 1.6,
      ease: 'power2.inOut',
    }, 0.6);

    tl.to(bgOverlay, {
      backgroundColor: '#020617',
      duration: 1.6,
      ease: 'power2.inOut',
    }, 0.6);

    tl.to(card, {
      x: () => getCenterX(),
      y: () => getCenterY(),
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      duration: 1.6,
      ease: 'power2.inOut',
    }, 0.6);

    // Fade out preview card indicator badge early
    if (badge) {
      tl.to(badge, {
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.4);
    }

    // Phase 3 & 4: Seamless zoom portal scale-up to cover the entire screen
    tl.to(card, {
      scale: () => getScaleFactor(),
      borderRadius: '0px',
      borderWidth: '0px',
      padding: '0px',
      duration: 2.0,
      ease: 'power3.in',
    }, 1.2);

    // Phase 5: Align & flatten individual grid items inside the scaled container
    gridItems.forEach((item) => {
      const depth = parseFloat(item.getAttribute('data-depth') || '0');
      const rx = parseFloat(item.getAttribute('data-rx') || '0');
      const ry = parseFloat(item.getAttribute('data-ry') || '0');

      // Stagger items to move forward/flatten out during the camera fly-through
      tl.fromTo(item,
        {
          z: depth,
          rotateX: rx,
          rotateY: ry,
        },
        {
          z: 0,
          rotateX: 0,
          rotateY: 0,
          borderRadius: '12px',
          duration: 2.0,
          ease: 'power2.out',
        },
        1.2
      );
    });

    const gridContainer = card.querySelector('.grid-container');
    if (gridContainer) {
      // Phase 5.5: Expand grid height from 240px (compact thumbnail) to 960px (large scrollable feed)
      // This separates the items vertically and expands their dimensions to cover full screens
      tl.to(gridContainer, {
        height: 960,
        duration: 2.0,
        ease: 'power2.inOut',
      }, 1.2); // runs in parallel with the card zoom

      // Phase 6: Scroll through the grid vertically (reveal bottom blocks 2, 3 and 4)
      // Translates the grid container vertically by three blocks (720px local pixels)
      tl.to(gridContainer, {
        y: -720,
        duration: 2.3,
        ease: 'none',
      }, 3.2); // starts as the zoom finishes (at 3.2)
    }

  }, { scope: containerRef });

  const handleItemClick = (item: typeof PORTAL_ITEMS[0]) => {
    if (!isZoomedRef.current) return;
    setLightboxItem(item);
  };

  return (
    <div ref={containerRef} className="relative min-h-[600vh] w-full">
      
      {/* Dynamic Background Overlay */}
      <div 
        ref={bgOverlayRef} 
        className="absolute inset-0 bg-[#f8fafc] pointer-events-none" 
      />

      {/* Sticky Viewport Container */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Layout Grid */}
        <div className="container mx-auto px-6 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          
          {/* Left Column: Heading Typography */}
          <div ref={textRef} className="flex flex-col items-start select-none max-w-lg md:pr-8">
            <span className="text-blue-600 font-mono text-xs tracking-[0.4em] uppercase mb-4 font-bold">
              02 // Archive Portal
            </span>
            <h2 className="text-7xl md:text-[9.5rem] font-black uppercase tracking-tighter leading-[0.75] text-slate-900 mb-8">
              Our<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Memories</span>
            </h2>
            <p className="text-slate-500 font-sans text-sm max-w-sm leading-relaxed mb-8">
              RELIVE THE CLOUD REVOLUTION. SCROLL DOWN TO PASS THROUGH THE PORTAL MATRIX AND ENTER THE BOC 1.0 HIGHLIGHTS.
            </p>
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-600"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-600 font-black animate-pulse">
                SCROLL TO IMMERSE
              </span>
            </div>
          </div>

          {/* Right Column: Miniature Gallery Preview Card */}
          <div ref={cardWrapperRef} className="relative flex items-center justify-center">
            
            {/* 3D Perspective Card Wrapper */}
            <div 
              style={{ perspective: '1200px' }}
              className="relative"
            >
              {/* The Zooming Card (Landscape 360x240 for wide aspect ratios) */}
              <div 
                ref={cardRef}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(8deg) rotateY(-12deg) rotateZ(2deg)'
                }}
                className="w-[360px] h-[240px] shrink-0 rounded-3xl bg-[#020617] p-2 border border-slate-300/40 shadow-2xl relative overflow-hidden flex flex-col justify-start origin-center"
              >
                
                {/* Miniature Badge Overlap */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 rounded-3xl preview-badge pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
                  </div>
                  <span className="text-[10px] font-mono text-white tracking-[0.4em] font-black uppercase">
                    ENTER PORTAL
                  </span>
                  <span className="text-[7px] font-mono text-white/40 tracking-[0.2em] mt-1 uppercase">
                    SCROLL DOWN TO ZOOM
                  </span>
                </div>

                {/* Grid Container (Starts at h-[240px] matching card height, then expands to h-[960px] on zoom) */}
                <div 
                  className="grid-container grid grid-cols-3 gap-1.5 w-full h-[240px] shrink-0 p-1.5 rounded-2xl relative z-10 [transform-style:preserve-3d] origin-top"
                  style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr))', flexShrink: 0 }}
                >
                  {PORTAL_ITEMS.map((item, idx) => (
                    <div
                      key={item.id}
                      data-depth={item.depth}
                      data-rx={item.rx}
                      data-ry={item.ry}
                      onClick={() => handleItemClick(item)}
                      className={`
                        grid-item relative overflow-hidden bg-[#060f21] border border-white/5 cursor-default group/grid
                        ${item.span}
                      `}
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: `translateZ(${item.depth}px) rotateX(${item.rx}deg) rotateY(${item.ry}deg)`
                      }}
                    >
                      {/* Image */}
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-all duration-700 grayscale group-hover/grid:grayscale-0 group-hover/grid:scale-105"
                        sizes="(max-width: 768px) 100vw, 80vw"
                        quality={85}
                      />

                      {/* Black overlay inside card grid */}
                      <div className="absolute inset-0 bg-black/20 group-hover/grid:bg-transparent transition-colors duration-300" />

                      {/* Detailed Metadata Overlay — Only interactive when zoomed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover/grid:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 details-overlay pointer-events-none">
                        <span className="text-blue-400 font-mono text-[9px] font-bold tracking-widest uppercase mb-1.5">
                          {item.category} // {item.year}
                        </span>
                        <h4 className="text-white font-black text-base md:text-lg uppercase tracking-tight leading-none mb-1">
                          {item.title}
                        </h4>
                        <p className="text-white/50 text-[10px] leading-snug font-sans hidden md:block max-w-[200px]">
                          {item.desc}
                        </p>
                        
                        {/* Hover hint */}
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 p-1.5 rounded-full hidden md:block">
                          <ZoomIn className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-16 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-8 right-8 z-[1010] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/10 bg-[#020617] shadow-2xl flex flex-col md:flex-row cursor-default"
            >
              {/* Visual Side */}
              <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:h-[60vh] bg-black overflow-hidden">
                <Image
                  src={lightboxItem.src}
                  alt={lightboxItem.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={90}
                />
              </div>

              {/* Data Content Side */}
              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center items-start">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] font-mono uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded">
                    {lightboxItem.category}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    // {lightboxItem.year}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black uppercase text-white mb-6 tracking-tighter leading-none">
                  {lightboxItem.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-sans">
                  {lightboxItem.desc}
                </p>

                <div className="h-[1px] w-full bg-white/5 mb-8" />

                <button
                  onClick={() => setLightboxItem(null)}
                  className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all duration-500"
                >
                  Return to Portal
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS tweaks to enable dynamic behavior */}
      <style jsx global>{`
        /* When zoomed in, enable cursor and zoom-in effects for items */
        .is-zoomed .grid-item {
          pointer-events: auto !important;
          cursor: pointer !important;
          /* Enable transform transition only when zoomed to keep GSAP animations smooth */
          transition: border-color 0.4s ease, filter 0.4s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), z-index 0s !important;
        }

        .is-zoomed .grid-item:hover {
          filter: grayscale(0%) !important;
          z-index: 50 !important;
          transform: scale(1.05) translateZ(30px) !important;
        }

        .is-zoomed .grid-item:hover .details-overlay {
          opacity: 1 !important;
          transform: translateY(0) !important;
          pointer-events: auto !important;
        }

        /* Default styling for item transition — transition: transform removed to avoid GSAP conflict */
        .grid-item {
          pointer-events: none;
          transition: border-color 0.4s ease, filter 0.4s ease, z-index 0s;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}
