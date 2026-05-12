'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { GradientShinyTitle } from '@/components/ui/GradientShinyTitle';

const ROW_1 = [
  '/gallery/535402715_122240866520212355_8124034634747307157_n 1.png',
  '/gallery/535554370_122240866814212355_5298821791634180236_n 1.png',
  '/gallery/536284330_122240866082212355_6148099243555502993_n 1.png',
  '/gallery/536502129_122240864120212355_2064198593439261121_n 1.png',
];

const ROW_2 = [
  '/gallery/537424474_122240865374212355_3166245579080254582_n 3.png',
  '/gallery/537483229_122240864276212355_3196250950373039991_n 2.png',
  '/gallery/538341720_122240863028212355_4189567101984455264_n 1.png',
  '/gallery/fffff 2.png',
];

function GalleryRow({
  images,
  x,
}: {
  images: string[];
  x: MotionValue<string>;
}) {
  return (
    <motion.div
      style={{ x }}
      className="flex gap-4 md:gap-6 will-change-transform"
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className="relative flex-shrink-0 w-[calc(50vw-24px)] md:w-[calc(25vw-24px)] aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 group"
        >
          <Image
            src={src}
            alt={`Gallery Image ${idx + 1}`}
            fill
            className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </motion.div>
  );
}

export function GalleryNew() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Row 1 slides from 0 → -80px (moves left as you scroll down)
  const row1X = useTransform(scrollYProgress, [0, 1], ['0px', '-80px']);
  // Row 2 slides from 0 → +80px (moves right as you scroll down)
  const row2X = useTransform(scrollYProgress, [0, 1], ['0px', '80px']);

  return (
    <section
      ref={sectionRef}
      id="gallery-new"
      className="w-full py-24 bg-[#050812] relative overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-reglo text-5xl md:text-7xl font-black tracking-tighter mb-6"
          >
            <GradientShinyTitle text="Gallery" className="pr-3" speed={2} delay={0.5} />
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-blue-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          />
        </div>
      </div>

      {/* Parallax rows — full-bleed so images can travel beyond container */}
      <div className="flex flex-col gap-4 md:gap-6 overflow-hidden px-4 md:px-6">
        <GalleryRow images={ROW_1} x={row1X} />
        <GalleryRow images={ROW_2} x={row2X} />
      </div>
    </section>
  );
}
