"use client";

import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
/* ─── data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "500+", label: "Registered Participants" },
  { value: "3rd", label: "Annual Edition" },
  { value: "20+", label: "Industry Partners" },
  { value: "48H", label: "Competition Duration" },
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

/* ─── main section ──────────────────────────────────────────────────────────── */
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import Image from "next/image";

export function AboutNew({ isWindowMode = false }: { isWindowMode?: boolean } = {}) {
  const headingRef = useRef(null);
  const headingView = useInView(headingRef, { once: true });

  return (
    <section
      id="about-us"
      className={`w-full bg-[#050812] relative overflow-x-hidden flex items-center ${
        isWindowMode 
          ? "py-8 md:py-12 min-h-0" 
          : "py-24 md:py-32 lg:min-h-screen lg:py-0 lg:items-center"
      }`}
    >
      {/* Background Pattern with Fade */}
      <div
        className="absolute inset-0 bg-pattern-cube pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

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

      <div className={`w-full mx-auto px-4 sm:px-6 relative z-10 ${isWindowMode ? "max-w-[900px]" : "max-w-[1280px]"}`}>
        <div
          ref={headingRef}
          className={`grid grid-cols-1 gap-8 items-center relative ${
            isWindowMode ? "md:grid-cols-2 md:gap-10" : "lg:grid-cols-2 lg:gap-16"
          }`}
        >
          {/* ── Left Column: Text ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs uppercase tracking-[0.35em] text-blue-500 mb-5"
            >
              Who We Are
            </motion.p>
 
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`font-reglo font-black tracking-tighter leading-[1.1] mb-4 min-w-0 ${
                isWindowMode ? "text-3xl md:text-5xl" : "text-5xl sm:text-6xl md:text-7xl"
              }`}
            >
              <GradientShinyTitle
                text="About "
                className="block"
                speed={2.2}
                delay={0.6}
              />
              <GradientShinyTitle
                text="Beauty of Cloud"
                className="block"
                speed={2.2}
                delay={0.9}
              />
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`h-1 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] ${
                isWindowMode ? "mb-4" : "mb-8"
              }`}
            />
 
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headingView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className={`font-uncut text-slate-400 leading-relaxed min-w-0 max-w-2xl lg:max-w-none ${
                isWindowMode ? "text-sm md:text-base" : "text-lg sm:text-xl"
              }`}
            >
              Beauty of Cloud 2.0 is Sri Lanka&apos;s first and premier
              undergraduate cloud computing competition — a platform where the
              next generation of engineers design, deploy, and defend real cloud
              infrastructure under pressure.
            </motion.p>
          </div>

          {/* ── Right Column: Orbiting Visuals ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={headingView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className={`relative flex w-full flex-col items-center justify-center overflow-hidden ${
              isWindowMode ? "h-[320px]" : "h-[500px]"
            }`}
          >
            {/* Center Core */}
            <div className="relative z-10 flex items-center justify-center pointer-events-none drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
              <Image
                src="/email-and-header/boc.webp"
                alt="BOC Logo"
                width={isWindowMode ? 80 : 120}
                height={isWindowMode ? 80 : 120}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            {/* Inner Orbit (Cloud Providers) */}
            <OrbitingCircles
              duration={20}
              delay={0}
              radius={isWindowMode ? 65 : 100}
              iconSize={isWindowMode ? 32 : 50}
            >
              <Image
                src="/service-icons/aws 1.webp"
                alt="AWS"
                width={20}
                height={20}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/service-icons/icons8-azure-96 3.webp"
                alt="Azure"
                width={20}
                height={20}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/service-icons/icons8-google-cloud-144 2.webp"
                alt="GCP"
                width={22}
                height={22}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </OrbitingCircles>

            {/* Outer Orbit (DevOps Tools) */}
            <OrbitingCircles
              radius={isWindowMode ? 115 : 180}
              duration={30}
              delay={10}
              reverse
              iconSize={isWindowMode ? 38 : 60}
            >
              <Image
                src="/service-icons/icons8-docker-144 2.webp"
                alt="Docker"
                width={24}
                height={24}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/service-icons/kubanaties.webp"
                alt="Kubernetes"
                width={24}
                height={24}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/service-icons/icons8-terraform-144 2.webp"
                alt="Terraform"
                width={24}
                height={24}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="/service-icons/github_logo.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </OrbitingCircles>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
