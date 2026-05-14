"use client";

import { useEffect, useRef, ReactNode, HTMLAttributes } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  wrapperClassName = '',
  innerClassName = '',
  ...props
}: MagnetProps) => {
  const magnetRef = useRef<HTMLDivElement>(null);
  
  // Use Motion Values for performance (avoids React re-renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Smooth springs for a premium feel
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  useEffect(() => {
    if (disabled) {
      x.set(0);
      y.set(0);
      scale.set(1);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        x.set(offsetX);
        y.set(offsetY);
        scale.set(1.05);
      } else {
        x.set(0);
        y.set(0);
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, disabled, magnetStrength, x, y, scale]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <motion.div
        className={innerClassName}
        style={{
          x: springX,
          y: springY,
          scale: springScale,
          display: 'inherit'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Magnet;
