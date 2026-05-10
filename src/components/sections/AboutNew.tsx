'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import OrbitingCircles from '@/components/ui/orbiting-circles';

const CLOUD_ICONS = [
  { name: 'Docker', img: '/service-icons/icons8-docker-144 2.webp', size: 50 },
  { name: 'GCP', img: '/service-icons/icons8-google-cloud-144 2.webp', size: 40 },
  { name: 'AWS', img: '/service-icons/aws 1.webp', size: 70 },
  { name: 'Terraform', img: '/service-icons/icons8-terraform-144 2.webp', size: 45 },
  { name: 'Azure', img: '/service-icons/icons8-azure-96 2.webp', size: 55 },
];

export function AboutNew() {
  return (
    <section id="about-new" className="w-full py-24 bg-[#050812] relative overflow-hidden border-r-4 border-blue-500/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visual Orbital Animation */}
          <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden order-2 lg:order-1">
            {/* Center Piece */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-20 w-32 h-32 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-full h-full bg-[#080c16] rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                <Image 
                  src="/logo.png" 
                  alt="BOC Logo" 
                  width={60} 
                  height={60} 
                  className="object-contain animate-float"
                />
              </div>
            </motion.div>

            {/* Inner Circle */}
            <OrbitingCircles radius={130} duration={25} delay={0}>
              <OrbitIcon icon={CLOUD_ICONS[0]} />
            </OrbitingCircles>
            <OrbitingCircles radius={130} duration={25} delay={25 / 3} path={false}>
              <OrbitIcon icon={CLOUD_ICONS[1]} />
            </OrbitingCircles>
            <OrbitingCircles radius={130} duration={25} delay={(2 * 25) / 3} path={false}>
              <OrbitIcon icon={CLOUD_ICONS[2]} />
            </OrbitingCircles>

            {/* Outer Circle */}
            <OrbitingCircles radius={220} duration={35} delay={0} reverse>
              <OrbitIcon icon={CLOUD_ICONS[3]} />
            </OrbitingCircles>
            <OrbitingCircles radius={220} duration={35} delay={35 / 2} reverse path={false}>
              <OrbitIcon icon={CLOUD_ICONS[4]} />
            </OrbitingCircles>
          </div>

          {/* Right Column: Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-blue-500 font-mono text-sm uppercase tracking-[0.3em] mb-4">
                Redefining the Future
              </h4>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-none">
                ABOUT <br />
                <span className="text-blue-500">BOC 2.0</span>
              </h2>
              
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed max-w-xl">
                <p>
                  Beauty of Cloud 2.0 is more than just a competition; it&apos;s a gateway to mastering the infrastructure that powers the modern digital world.
                </p>
                <p>
                  As the first and premier cloud computing competition in Sri Lanka, we provide a platform for undergraduates to showcase their skills, learn from industry experts, and push the boundaries of what&apos;s possible.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent mt-12" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function OrbitIcon({ icon }: { icon: typeof CLOUD_ICONS[0] }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-blue-500/0 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
      <div 
        className="relative"
        style={{ width: icon.size, height: icon.size }}
      >
        <Image
          src={icon.img}
          alt={icon.name}
          fill
          className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </div>
  );
}
