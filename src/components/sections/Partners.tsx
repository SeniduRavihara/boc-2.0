'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GradientShinyTitle } from '@/components/ui/GradientShinyTitle';

const SPONSORS = [
  { name: "SLT Mobitel", image: "/images/sponsers/SLT.png" },
  { name: "TIQRI", image: "/images/sponsers/tiqri.png" },
  { name: "HackSL", image: "/images/sponsers/hacksl-logo.png" },
  { name: "Canon - Metropolitan", image: "/images/sponsers/metropoliton-logo.png" },
  { name: "Ragama Pharmacy", image: "/images/sponsers/ragama-pharmacy.png" },
  { name: "ICTS", image: "/images/sponsers/icts.png" },
  { name: "WSO2", image: "/images/sponsers/wso2-logo.png" },
  { name: "Mogo Games", image: "/images/sponsers/mogo.png" },
  { name: "DALUGAMA Second Hand Stores", image: "/images/sponsers/DalugamaSHS.png" },
  { name: "T SHIRT GEEK BY STB", image: "/images/sponsers/T-SHIRT.png" },
];

export const Partners: React.FC = () => {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);

  return (
    <section id="partners" className="py-24 bg-[#050812] border-y border-white/5 overflow-hidden">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-reglo text-5xl md:text-7xl font-black tracking-tighter mb-4"
        >
          <GradientShinyTitle text="Our Partners" speed={2} delay={0.7} />
        </motion.h2>
        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-12 items-center flex-none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredPartner(idx)}
              onMouseLeave={() => setHoveredPartner(null)}
              className={`relative w-40 h-20 md:w-56 md:h-28 flex-shrink-0 flex items-center justify-center transition-all duration-500 ${
                hoveredPartner === null
                  ? 'grayscale-0 brightness-100 opacity-100'
                  : hoveredPartner === idx
                    ? 'grayscale-0 brightness-100 opacity-100 scale-105'
                    : 'grayscale brightness-[0.45] opacity-45'
              }`}
            >
              <Image
                src={sponsor.image}
                alt={sponsor.name}
                fill
                className="object-contain scale-90 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
