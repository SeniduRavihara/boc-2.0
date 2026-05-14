"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";
import Link from "next/link";
import Magnet from "@/components/ui/Magnet";
import Grainient from "@/components/ui/Grainient";
import Image from "next/image";

export function CTASection() {
  const constraintsRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const vx = useRef(0);
  const vy = useRef(0);
  const isDragging = useRef(false);

  useAnimationFrame((t, delta) => {
    if (isDragging.current) return;
    if (!constraintsRef.current || !ballRef.current) return;

    // Normalize delta to 60fps (16.66ms per frame)
    const dt = delta / 16.66;
    if (dt > 3) return; // Prevent huge jumps when tab is inactive

    // Apply gravity
    vy.current += 0.8 * dt;

    // Apply air friction
    vx.current *= Math.pow(0.99, dt);
    vy.current *= Math.pow(0.99, dt);

    let nextX = x.get() + vx.current * dt;
    let nextY = y.get() + vy.current * dt;

    if (isNaN(nextX) || isNaN(nextY)) {
      nextX = 0;
      nextY = 0;
      vx.current = 0;
      vy.current = 0;
    }

    // Calculate bounds based on offset (ignores transform translates)
    const minX = -ballRef.current.offsetLeft; 
    const maxX = constraintsRef.current.clientWidth - ballRef.current.offsetLeft - ballRef.current.clientWidth;
    const minY = -ballRef.current.offsetTop;
    const maxY = constraintsRef.current.clientHeight - ballRef.current.offsetTop - ballRef.current.clientHeight;

    // X axis collision
    if (nextX <= minX) {
      nextX = minX;
      vx.current *= -0.7; // Bounce left wall
    } else if (nextX >= maxX) {
      nextX = maxX;
      vx.current *= -0.7; // Bounce right wall
    }

    // Y axis collision
    if (nextY <= minY) {
      nextY = minY;
      vy.current *= -0.7; // Bounce ceiling
    } else if (nextY >= maxY) {
      nextY = maxY;
      vy.current *= -0.6; // Bounce floor
      vx.current *= Math.pow(0.95, dt); // Floor friction
      
      // Settle if velocity is very small
      if (Math.abs(vy.current) < 1.5) {
        vy.current = 0;
        nextY = maxY;
      }
    }

    x.set(nextX);
    y.set(nextY);
  });

  return (
    <section ref={constraintsRef} className="relative w-full overflow-hidden bg-[#050812] border-y border-white/5">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#0077FF"
          color2="#000000"
          color3="#00336E"
          timeSpeed={0.7}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Subtle overlay to ensure text contrast */}
      </div>

      {/* Interactive Physics Ball */}
      <motion.div
        ref={ballRef}
        style={{ x, y }}
        drag
        dragMomentum={false} // Disable framer's internal momentum so our physics loop takes over
        onDragStart={() => {
          isDragging.current = true;
          vx.current = 0;
          vy.current = 0;
        }}
        onDragEnd={(e, info) => {
          isDragging.current = false;
          // Convert info.velocity (px/s) to px/frame (at 60fps)
          vx.current = info.velocity.x / 60;
          vy.current = info.velocity.y / 60;
        }}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        className="absolute z-50 cursor-grab w-24 h-24 md:w-32 md:h-32 left-8 md:left-24 top-12"
      >
        <Image 
          src="/Group.webp" 
          alt="Interactive Object" 
          fill
          className="object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] pointer-events-none"
          priority
        />
      </motion.div>

      <div className="relative w-full min-h-[500px] flex items-center justify-center py-24 px-6 overflow-hidden group">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} 
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-reglo text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-white">
              Ready to Shape<br />
              <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">the Future?</span>
            </h2>

            <p className="max-w-xl mx-auto text-white/40 text-sm md:text-base font-medium mb-10 tracking-[0.1em] uppercase">
              Join Sri Lanka&apos;s most prestigious cloud ideathon.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Magnet padding={150} magnetStrength={12}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 rounded-full bg-white text-black text-xl font-bold transition-all hover:bg-blue-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                  >
                    Register Now
                  </motion.button>
                </Magnet>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
