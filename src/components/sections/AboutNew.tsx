"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { OrbitingCircles } from "@/components/ui/OrbitingCircles";
import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";
/* ─── data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "500+", label: "Registered Participants" },
  { value: "3rd", label: "Annual Edition" },
  { value: "20+", label: "Industry Partners" },
  { value: "48H", label: "Competition Duration" },
];

const ORBIT_LOGOS = [
  { src: "/orbiting-logos/aws.png", alt: "AWS" },
  { src: "/orbiting-logos/azure.png", alt: "Azure" },
  { src: "/orbiting-logos/gcp.png", alt: "Google Cloud" },
  { src: "/orbiting-logos/docker.png", alt: "Docker" },
  { src: "/orbiting-logos/k8s.png", alt: "Kubernetes" },
  { src: "/orbiting-logos/terraform.png", alt: "Terraform" },
];

/* ─── stat card ─────────────────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group flex flex-col items-center justify-center py-10 px-4 border border-blue-500/20 bg-[#080c16] overflow-hidden min-w-0"
    >
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />
      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-500" />
      <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
        {value}
      </span>
      <span className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 text-center">
        {label}
      </span>
    </motion.div>
  );
}

function OrbitLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full rounded-full border border-blue-400/20 bg-[#07101f]/90 p-2 shadow-[0_0_28px_rgba(0,119,255,0.24)] backdrop-blur-md">
      <Image src={src} alt={alt} fill className="object-contain p-2" sizes="72px" />
    </div>
  );
}

/* ─── main section ──────────────────────────────────────────────────────────── */
export function AboutNew() {
  const headingRef = useRef(null);
  const headingView = useInView(headingRef, { once: true });

  return (
    <section
      id="about-us"
      className="w-full min-h-screen bg-[#050812] relative overflow-hidden py-24 md:py-32"
    >
      {/* Background Pattern with Fade */}
      <div 
        className="absolute inset-0 bg-pattern-cube pointer-events-none" 
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
        }}
      />
      {/* Ambient glows */}
      {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/4 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" /> */}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-64 overflow-hidden md:h-80">
        <div className="absolute inset-x-0 bottom-[-224px] h-[448px] md:bottom-[-310px] md:h-[620px]">
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#050812] via-[#050812]/70 to-transparent" />
            <OrbitingCircles iconSize={58} radius={154} speed={0.9} className="md:hidden">
              {ORBIT_LOGOS.slice(0, 5).map((logo) => (
                <OrbitLogo key={logo.src} {...logo} />
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={72} radius={224} speed={0.85} className="hidden md:flex">
              {ORBIT_LOGOS.map((logo) => (
                <OrbitLogo key={logo.src} {...logo} />
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={44} radius={92} reverse speed={1.5} className="md:hidden">
              {ORBIT_LOGOS.slice(1, 5).map((logo) => (
                <OrbitLogo key={logo.src} {...logo} />
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={52} radius={140} reverse speed={1.6} className="hidden md:flex">
              {ORBIT_LOGOS.slice(1, 5).map((logo) => (
                <OrbitLogo key={logo.src} {...logo} />
              ))}
            </OrbitingCircles>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Section label + headline ── */}
        <div ref={headingRef} className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headingView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.35em] text-blue-500 mb-5"
          >
            Who We Are
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-reglo text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-none min-w-0"
            >
              <GradientShinyTitle text="About" className="block" speed={2.2} delay={0.6} />
              <GradientShinyTitle
                text="Beauty of Cloud 2.0"
                className="block"
                speed={2.2}
                delay={0.9}
              />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="font-uncut text-slate-400 text-base sm:text-lg leading-relaxed min-w-0"
            >
              Beauty of Cloud 2.0 is Sri Lanka&apos;s first and premier
              undergraduate cloud computing competition — a platform where the
              next generation of engineers design, deploy, and defend real cloud
              infrastructure under pressure.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headingView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="h-px bg-gradient-to-r from-blue-500/60 via-blue-500/20 to-transparent mt-12 origin-left"
          />
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-blue-500/10 mb-20 md:mb-24">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
