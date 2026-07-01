"use client";

import Grainient from "@/components/ui/Grainient";
import Magnet from "@/components/ui/Magnet";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export function CTASection() {
  const constraintsRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Persistent angle state that holds the tilt even after scrolling stops
  const targetAngle = useMotionValue(0);

  // Angle effect removed as requested
  /*
  useMotionValueEvent(scrollVelocity, "change", (latest) => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    // Use very small tilt angles to make the slant subtle and barely noticeable
    const maxAngle = screenWidth < 768 ? 2 : screenWidth < 1200 ? 1 : 0.5;

    // If scrolling down significantly, lock tilt to right
    if (latest > 150) {
      targetAngle.set(maxAngle);
    } 
    // If scrolling up significantly, lock tilt to left
    else if (latest < -150) {
      targetAngle.set(-maxAngle);
    }
  });
  */

  // Smoothly animate the transitions between locked states
  const tiltAngle = useSpring(targetAngle, { damping: 40, stiffness: 200 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const vx = useRef(0);
  const vy = useRef(0);
  const omega = useRef(0); // angular velocity
  const isDragging = useRef(false);
  const [hasStarted, setHasStarted] = React.useState(false);

  useAnimationFrame((t, delta) => {
    if (!hasStarted || isDragging.current) return;
    if (!constraintsRef.current || !ballRef.current) return;

    // Normalize delta to 60fps (16.66ms per frame)
    const dt = delta / 16.66;
    if (dt > 3) return; // Prevent huge jumps when tab is inactive

    const angleRad = tiltAngle.get() * (Math.PI / 180);

    // Apply gravity (tilted)
    vx.current += 0.8 * Math.sin(angleRad) * dt;
    vy.current += 0.8 * Math.cos(angleRad) * dt;

    // Apply air friction to spin
    omega.current *= Math.pow(0.99, dt);

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
    const maxX =
      constraintsRef.current.clientWidth -
      ballRef.current.offsetLeft -
      ballRef.current.clientWidth;
    const minY = -ballRef.current.offsetTop;

    // Dynamic floor based on tilt angle
    // Visual floor is removed, so we bounce exactly at the bottom border
    const floorVisualOffset = -10;
    const baseMaxY =
      constraintsRef.current.clientHeight -
      ballRef.current.offsetTop -
      ballRef.current.clientHeight -
      floorVisualOffset;

    const containerCenterX = constraintsRef.current.clientWidth / 2;
    const ballAbsX =
      ballRef.current.offsetLeft + nextX + ballRef.current.clientWidth / 2;

    // The tilted block rotates around its center, so the slope applies from the center.
    const dynamicMaxY =
      baseMaxY + (ballAbsX - containerCenterX) * Math.tan(angleRad);

    // X axis collision
    if (nextX <= minX) {
      nextX = minX;
      vx.current *= -0.7; // Bounce left wall
      omega.current -= vy.current * 0.2; // Wall friction induces spin
    } else if (nextX >= maxX) {
      nextX = maxX;
      vx.current *= -0.7; // Bounce right wall
      omega.current += vy.current * 0.2; // Wall friction induces spin
    }

    // Y axis collision
    if (nextY <= minY) {
      nextY = minY;
      vy.current *= -0.7; // Bounce ceiling
      omega.current *= 0.8;
    } else if (nextY >= dynamicMaxY) {
      nextY = dynamicMaxY;
      vy.current *= -0.6; // Bounce floor
      vx.current *= Math.pow(0.95, dt); // Floor friction

      // Rolling on the floor links linear velocity to angular velocity
      omega.current = vx.current * 2;

      // Settle if velocity is very small and tilt is low
      if (
        Math.abs(vy.current) < 1.5 &&
        Math.abs(vx.current) < 1 &&
        Math.abs(angleRad) < 0.01
      ) {
        vy.current = 0;
        vx.current = 0;
        nextY = dynamicMaxY;
      }
    }

    x.set(nextX);
    y.set(nextY);
    rotate.set(rotate.get() + omega.current * dt);
  });

  return (
    <section
      ref={constraintsRef}
      className="relative w-full overflow-hidden bg-[#050812] border-t border-white/5"
    >
      {/* Visual Tilted Footer Extension */}
      {/* <motion.div 
        className="absolute bottom-[-80px] left-[-10%] w-[120%] h-[150px] bg-[#001a3d] border-t border-white/10 origin-center z-10"
        style={{ rotate: tiltAngle }}
      /> */}

      {/* Trigger for the physics drop */}
      <motion.div
        onViewportEnter={() => setHasStarted(true)}
        className="absolute inset-0 pointer-events-none z-20"
      />

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
        <div className="absolute inset-0 bg-black/40" />{" "}
        {/* Subtle overlay to ensure text contrast */}
      </div>

      {/* Interactive Physics Ball */}
      <motion.div
        ref={ballRef}
        style={{ x, y, rotate }}
        drag
        dragMomentum={false} // Disable framer's internal momentum so our physics loop takes over
        onDragStart={() => {
          isDragging.current = true;
          vx.current = 0;
          vy.current = 0;
          omega.current = 0;
          // Bulletproof mobile scroll lock while dragging
          if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
          }
        }}
        onDragEnd={(e, info) => {
          isDragging.current = false;
          // Restore scrolling
          if (typeof document !== "undefined") {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
          }
          // Convert info.velocity (px/s) to px/frame (at 60fps)
          vx.current = info.velocity.x / 60;
          vy.current = info.velocity.y / 60;
          // Give it some initial spin based on horizontal throw
          omega.current = vx.current * 1.5;
        }}
        // onTap={() => {
        //   router.push("/register/session/2");
        // }}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        className="absolute z-50 cursor-grab touch-none select-none w-24 h-24 md:w-32 md:h-32 left-[calc(50%-48px)] md:left-[calc(50%-64px)] top-0"
      >
        <Image
          src="/Group.webp"
          alt="Interactive Object"
          fill
          sizes="(max-width: 768px) 128px, 128px"
          className="object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] pointer-events-none"
          priority
        />
      </motion.div>

      <div className="relative w-full min-h-[500px] flex items-center justify-center py-24 px-6 overflow-hidden group">
        {/* Background Decorative Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-reglo text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-white">
              Ready to Shape
              <br />
              <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                the Future?
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-white/40 text-sm md:text-base font-medium mb-10 tracking-[0.1em] uppercase">
              Join Sri Lanka&apos;s most prestigious cloud ideathon.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnet padding={150} magnetStrength={12}>
                <motion.button
                  disabled
                  aria-disabled="true"
                  className="px-12 py-4 rounded-full bg-white/90 text-black/40 text-xl font-bold cursor-not-allowed opacity-75"
                >
                  Registration Soon
                </motion.button>
              </Magnet>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
