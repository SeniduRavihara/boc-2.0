'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CLOUD_ICONS = [
  { 
    name: 'Docker', 
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    initialAngle: 0,
    radius: 120,
    size: 50
  },
  { 
    name: 'GCP', 
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
    initialAngle: 72,
    radius: 160,
    size: 40
  },
  { 
    name: 'AWS', 
    img: '/aws_logo.png', // Using existing local AWS logo
    initialAngle: 144,
    radius: 200,
    size: 70
  },
  { 
    name: 'Terraform', 
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
    initialAngle: 216,
    radius: 140,
    size: 45
  },
  { 
    name: 'Kubernetes', 
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    initialAngle: 288,
    radius: 180,
    size: 55
  }
];

export function AboutNew() {
  return (
    <section id="about-new" className="w-full py-24 bg-[#050812] relative overflow-hidden border-r-4 border-blue-500/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Decorative Orbit Area */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] flex items-center justify-center">
            {/* Orbiting Paths (Circles) */}
            <div className="absolute w-[240px] h-[240px] border border-white/5 rounded-full" />
            <div className="absolute w-[320px] h-[320px] border border-white/5 rounded-full" />
            <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full" />
            
            {/* Central Glow */}
            <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

            {/* Orbiting Icons */}
            {CLOUD_ICONS.map((icon, idx) => (
              <OrbitIcon key={idx} icon={icon} />
            ))}
          </div>

          {/* Right: Content Area */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-blue-500 mb-10 tracking-tight uppercase leading-none">
                About Beauty <br />
                <span className="text-white">of cloud</span>
              </h2>
              
              <div className="space-y-8">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-blue-500/30 pl-6"
                >
                  “Beauty of Cloud” is an exciting hackathon that deepens participants’ understanding of cloud technologies.
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 text-lg md:text-xl leading-relaxed font-light"
                >
                  It empowers tech enthusiasts to explore cloud platforms, tackle real-world challenges, and innovate with cutting-edge tools. Developers, students, and professionals will come together to learn, collaborate, and build impactful cloud-based solutions.
                </motion.p>
              </div>

              {/* Decorative line below */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-px bg-gradient-to-r from-blue-500/50 to-transparent mt-12" 
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function OrbitIcon({ icon }: { icon: typeof CLOUD_ICONS[0] }) {
  return (
    <motion.div
      animate={{
        rotate: [icon.initialAngle, icon.initialAngle + 360],
      }}
      transition={{
        duration: 20 + icon.radius / 10,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute flex items-center justify-center"
      style={{
        width: icon.radius * 2,
        height: icon.radius * 2,
      }}
    >
      <motion.div
        animate={{
          rotate: [-(icon.initialAngle), -(icon.initialAngle + 360)],
        }}
        transition={{
          duration: 20 + icon.radius / 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="relative group">
          <div className="absolute -inset-2 bg-white/5 rounded-full blur-sm group-hover:bg-blue-500/20 transition-colors duration-300" />
          <div className="relative bg-[#0d152a] p-2 rounded-2xl border border-white/10 shadow-xl group-hover:border-blue-500/40 group-hover:shadow-blue-500/10 transition-all duration-300">
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
        </div>
      </motion.div>
    </motion.div>
  );
}
