'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useAnimationFrame, 
  useMotionValue, 
  useVelocity, 
  useSpring,
  type MotionValue
} from 'framer-motion';
import { GradientShinyTitle } from '@/components/ui/GradientShinyTitle';

// Custom wrap function to replace @motionone/utils
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

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

interface MarqueeProps {
  images: string[];
  baseVelocity: number;
}

function GalleryMarquee({ images, baseVelocity = 5 }: MarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -75, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap flex-nowrap mb-6">
      <motion.div className="flex whitespace-nowrap flex-nowrap gap-6" style={{ x }}>
        {[1, 2, 3, 4].map((set) => (
          <React.Fragment key={set}>
            {images.map((src, idx) => (
              <div
                key={`${set}-${idx}`}
                className="relative flex-shrink-0 w-[80vw] md:w-[35vw] aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-white/5 group shadow-2xl"
              >
                <Image
                  src={src}
                  alt={`Gallery Image ${idx + 1}`}
                  fill
                  className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 35vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function GalleryNew() {
  return (
    <section
      id="gallery-new"
      className="w-full py-32 bg-[#050812] relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 mb-20">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-2 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">
              Visual Archive
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-reglo text-6xl md:text-8xl lg:text-8xl font-black uppercase tracking-tighter mb-8 text-center"
          >
            <GradientShinyTitle text="Moments In Cloud." className="px-4 pb-1" speed={2} delay={0.5} />
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          />
        </div>
      </div>

      <div className="relative z-10 space-y-8">
        <GalleryMarquee images={ROW_1} baseVelocity={-0.8} />
        <GalleryMarquee images={ROW_2} baseVelocity={0.8} />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
    </section>
  );
}
