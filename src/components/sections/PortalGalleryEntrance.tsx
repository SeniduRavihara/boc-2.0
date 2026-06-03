'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Info, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PORTAL_ITEMS = [
  {
    id: 'boc-neural',
    src: '/gallery/535402715_122240866520212355_8124034634747307157_n 1.webp',
    title: 'Neural Convergence',
    category: 'CLOUD ERA',
    year: '2025',
    desc: 'Visualizing Sri Lanka\'s university cloud collaborative networks.',
    span: 'col-span-6 row-span-1',
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
    span: 'col-span-6 row-span-1',
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
    span: 'col-span-4 row-span-1',
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
    span: 'col-span-8 row-span-1',
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
    span: 'col-span-6 row-span-1',
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
    span: 'col-span-6 row-span-1',
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
    span: 'col-span-4 row-span-1',
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
    span: 'col-span-8 row-span-1',
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



  useGSAP(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    const bgOverlay = bgOverlayRef.current;

    if (!container || !sticky || !card || !text || !bgOverlay) return;

    const gridItems = card.querySelectorAll('.grid-item');
    const badge = card.querySelector('.preview-badge');
    const gridContainer = card.querySelector('.grid-container');

    const isMobile = window.innerWidth < 768;

    // Set initial card dimensions and transform state dynamically (avoids SSR mismatch)
    gsap.set(card, {
      width: isMobile ? 280 : 360,
      height: isMobile ? 400 : 240,
      x: 0,
      y: 0,
      rotateX: 8,
      rotateY: -12,
      rotateZ: 2,
    });

    if (gridContainer) {
      gsap.set(gridContainer, {
        height: isMobile ? 400 : 240,
        y: 0,
      });
    }

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
          // Reaches expanded state around progress 0.58 (timeline pos 3.5 out of 5.8)
          const isZoomed = self.progress > 0.58;
          isZoomedRef.current = isZoomed;
          
          if (isZoomed) {
            card.classList.add('is-zoomed');
          } else {
            card.classList.remove('is-zoomed');
          }
        }
      }
    });

    // Fade out preview card indicator badge early
    if (badge) {
      tl.to(badge, {
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.2);
    }

    // Phase 1 & 2: Heading text scales up dramatically and flies outward/past the viewer in 3D Z space
    tl.to(text, {
      scale: 6,
      z: 900,
      opacity: 0,
      duration: 1.8,
      ease: 'power2.in',
    }, 0);

    // Background darkens as the camera "enters" the portal
    tl.to(bgOverlay, {
      backgroundColor: '#020617',
      duration: 1.8,
      ease: 'power2.inOut',
    }, 0);

    // Phase 3 & 4: Card expands to fill viewport and flattens
    tl.to(card, {
      width: '100vw',
      height: '100vh',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      borderRadius: '0px',
      borderWidth: '0px',
      padding: '0px',
      duration: 2.0,
      ease: 'power3.inOut',
    }, 1.5);

    // Phase 5: Align & flatten individual grid items inside the container
    gridItems.forEach((item) => {
      const depth = parseFloat(item.getAttribute('data-depth') || '0');
      const rx = parseFloat(item.getAttribute('data-rx') || '0');
      const ry = parseFloat(item.getAttribute('data-ry') || '0');

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
        1.5
      );
    });

    if (gridContainer) {
      // Expand grid height to 200vh to fit exactly 4 images per viewport height (2 rows of 2 images per 100vh)
      tl.to(gridContainer, {
        height: '200vh',
        duration: 2.0,
        ease: 'power2.inOut',
      }, 1.5);

      // Phase 6: Scroll through the grid vertically
      tl.to(gridContainer, {
        y: '-100vh',
        duration: 2.3,
        ease: 'none',
      }, 3.5);
    }

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-[600vh] w-full">
      
      {/* Sticky Viewport Container with 3D Perspective */}
      <div 
        ref={stickyRef} 
        style={{ perspective: '1200px' }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        
        {/* Dynamic Background Overlay */}
        <div 
          ref={bgOverlayRef} 
          className="absolute inset-0 bg-[#f8fafc] pointer-events-none" 
        />

        {/* Center-aligned Heading Typography */}
        <div 
          ref={textRef} 
          className="absolute inset-0 flex flex-col items-center justify-center text-center select-none max-w-2xl mx-auto px-6 z-20 pointer-events-none origin-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
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

        {/* Miniature Gallery Preview Card Wrapper (centered behind text overlay) */}
        <div 
          ref={cardWrapperRef} 
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          {/* 3D Perspective Card Wrapper */}
          <div 
            style={{ perspective: '1200px' }}
            className="relative flex items-center justify-center"
          >
            {/* The Zooming Card */}
            <div 
              ref={cardRef}
              style={{ transformStyle: 'preserve-3d' }}
              className="shrink-0 rounded-3xl bg-[#020617] p-2 border border-slate-300/40 shadow-2xl relative overflow-hidden flex flex-col justify-start origin-center pointer-events-auto"
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

              {/* Grid Container (Dimensions set by GSAP dynamically) */}
              <div 
                className="grid-container grid grid-cols-12 gap-1.5 w-full shrink-0 p-1.5 rounded-2xl relative z-10 [transform-style:preserve-3d] origin-top"
                style={{ gridTemplateRows: 'repeat(4, minmax(0, 1fr))', flexShrink: 0 }}
              >
                {PORTAL_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    data-depth={item.depth}
                    data-rx={item.rx}
                    data-ry={item.ry}
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
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Global CSS tweaks to enable dynamic behavior */}
      <style jsx global>{`
        /* When zoomed in, enable cursor and zoom-in effects for items */
        .is-zoomed .grid-item {
          pointer-events: auto !important;
          cursor: default !important;
          /* Enable transform transition only when zoomed to keep GSAP animations smooth */
          transition: border-color 0.4s ease, filter 0.4s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), z-index 0s !important;
        }

        .is-zoomed .grid-item:hover {
          filter: grayscale(0%) !important;
          z-index: 50 !important;
          transform: scale(1.05) translateZ(30px) !important;
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
