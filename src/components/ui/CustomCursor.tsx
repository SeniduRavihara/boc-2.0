'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const CustomCursor: React.FC = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Use motion values outside of conditional render to keep them stable
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 20);
      mouseY.set(e.clientY - 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // If not mounted, render a placeholder to keep the DOM structure stable for hydration
  if (!isMounted) {
    return <div className="custom-cursor-placeholder" />;
  }

  const shouldShow = !pathname?.startsWith('/admin') && !pathname?.startsWith('/test');

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        <motion.div
          key="custom-cursor-v2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        />
      )}
    </AnimatePresence>
  );
};
