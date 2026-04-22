'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

/**
 * BentoGallery — Asymmetric bento grid gallery with lightbox
 * Uses local /gallery images, grayscale → color hover, and fullscreen modal.
 * Replaces the scroll-animation Grid Motion Gallery.
 */

const GALLERY_ITEMS = [
  {
    src: '/gallery/535402715_122240866520212355_8124034634747307157_n 1.png',
    label: '001 // IDEATHON',
    title: 'BOC 1.0',
    sub: '2025 — Cloud Era',
    span: 'lg:col-span-2 lg:row-span-2', // Hero — large
  },
  {
    src: '/gallery/535554370_122240866814212355_5298821791634180236_n 1.png',
    label: '002 // KEYNOTE',
    title: 'Opening Day',
    sub: '2025 — Main Stage',
    span: 'lg:col-span-1',
  },
  {
    src: '/gallery/536284330_122240866082212355_6148099243555502993_n 1.png',
    label: '003 // TEAM',
    title: 'Core Team',
    sub: '2025 — Sri Jayewardenepura',
    span: 'lg:col-span-1',
  },
  {
    src: '/gallery/536502129_122240864120212355_2064198593439261121_n 1.png',
    label: '004 // AWARDS',
    title: 'Ceremony',
    sub: '2025 — Finalists',
    span: 'lg:col-span-1',
  },
  {
    src: '/gallery/537424474_122240865374212355_3166245579080254582_n 3.png',
    label: '005 // WORKSHOP',
    title: 'Cloud Workshop',
    sub: '2025 — AWS Track',
    span: 'lg:col-span-2', // Wide
  },
  {
    src: '/gallery/537483229_122240864276212355_3196250950373039991_n 2.png',
    label: '006 // HACKERS',
    title: 'Hack Night',
    sub: '2025 — Late Session',
    span: 'lg:col-span-1',
  },
  {
    src: '/gallery/538341720_122240863028212355_4189567101984455264_n 1.png',
    label: '007 // COLLAB',
    title: 'University Meet',
    sub: '2025 — Collaboration',
    span: 'lg:col-span-1',
  },
  {
    src: '/gallery/fffff 2.png',
    label: '008 // MOMENT',
    title: 'Memorable',
    sub: '2025 — Highlights',
    span: 'lg:col-span-1',
  },
];

export const GridMotionGallery: React.FC = () => {
  const [selected, setSelected] = useState<null | typeof GALLERY_ITEMS[0]>(null);

  return (
    <section id="gallery" className="py-32 px-6 bg-[#020617] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-500 font-mono text-xs tracking-[0.5em] uppercase">Gallery</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              BOC 1.0<br />
              <span className="text-white/20">Moments</span>
            </h2>
          </motion.div>
          <p className="text-white/30 font-mono text-xs max-w-xs leading-relaxed">
            Relive Sri Lanka&apos;s first inter-university cloud ideathon — captured in frames.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => setSelected(item)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group border border-white/5 bg-[#0a1628] ${item.span}`}
            >
              {/* Image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay always */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Hover zoom icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Label + Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                <p className="text-[10px] text-blue-400 font-mono tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </p>
                <h3 className="text-white font-bold text-lg uppercase tracking-tight leading-tight">
                  {item.title}
                </h3>
                <p className="text-white/40 text-xs font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.sub}
                </p>
              </div>

              {/* Blue accent border on hover */}
              <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/30 rounded-2xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/10 font-mono text-xs tracking-[0.4em] uppercase mt-12"
        >
          Beauty of Cloud 1.0 · 2025 · Sri Lanka
        </motion.p>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-16 cursor-zoom-out"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-8 right-8 z-[510] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image
                src={selected.src}
                alt={selected.title}
                width={1400}
                height={900}
                className="w-full h-full object-contain bg-[#060f1e]"
              />
              <div className="absolute bottom-0 left-0 right-0 px-8 py-5 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                <div>
                  <p className="text-blue-400 font-mono text-[10px] tracking-widest mb-1">{selected.label}</p>
                  <h3 className="text-white font-bold text-xl uppercase">{selected.title}</h3>
                  <p className="text-white/40 font-mono text-xs mt-1">{selected.sub}</p>
                </div>
                <span className="text-white/20 font-mono text-[10px] tracking-widest">Press ESC or click to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
