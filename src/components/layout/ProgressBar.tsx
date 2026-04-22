'use client';

import React from 'react';
import { motion, useScroll, useSpring } from "framer-motion";

export const ProgressBar: React.FC<{ targetRef: React.RefObject<HTMLElement | null> }> = ({ targetRef }) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const scrollX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-aws via-accent to-gcp z-[1000] origin-left"
      style={{ scaleX: scrollX }}
    />
  );
};
