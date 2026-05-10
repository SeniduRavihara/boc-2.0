'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  return (
    <section
      id="partners"
      className="py-24 bg-[#050812] relative overflow-hidden border-y border-white/5"
    >
      <div className="container mx-auto px-6 relative z-10 mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-blue-500 mb-4 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Our Partners
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-blue-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          />
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-40 before:bg-gradient-to-r before:from-[#050812] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-40 after:bg-gradient-to-l after:after:from-[#050812] after:to-transparent">
        <motion.div
          className="flex gap-20 items-center flex-none py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* We duplicate the sponsors array to create a seamless loop */}
          {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
            <div
              key={idx}
              className="relative w-40 h-20 md:w-48 md:h-24 flex-shrink-0 group cursor-pointer"
            >
              <Image
                src={sponsor.image}
                alt={sponsor.name}
                fill
                className="object-contain grayscale brightness-[0.6] contrast-[1.2] opacity-40 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
