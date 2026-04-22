'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DitheredLogoProps {
  src: string;
  className?: string;
  pixelSize?: number;
  color?: string;
}

/**
 * DitheredLogo - A component that applies an Atkinson dithering algorithm 
 * to an image, mimicking the high-contrast retro look of Dithering Studio.
 */
export const DitheredLogo: React.FC<DitheredLogoProps> = ({ 
  src, 
  className, 
  pixelSize = 3,
  color = '#3b82f6' // Brand Accent (Tech Blue)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      render(img, ctx, canvas);
    };
  }, [src, pixelSize, isHovered, color]);

  const render = (img: HTMLImageElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Responsive scaling based on pixelSize for the dither effect
    const w = Math.floor(img.width / pixelSize);
    const h = Math.floor(img.height / pixelSize);
    
    canvas.width = img.width;
    canvas.height = img.height;

    // Offscreen canvas for low-res processing
    const offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    const oCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!oCtx) return;

    oCtx.drawImage(img, 0, 0, w, h);
    const imgData = oCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Pre-calculate RGB for theme color
    const rMatch = parseInt(color.slice(1, 3), 16);
    const gMatch = parseInt(color.slice(3, 5), 16);
    const bMatch = parseInt(color.slice(5, 7), 16);

    // Atkinson Dither Algorithm
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] < 128) continue; // Skip transparency

        // Grayscale conversion for thresholding
        const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        const newGray = gray > 128 ? 255 : 0;
        const err = (gray - newGray) / 8;

        data[i] = newGray;
        data[i + 1] = newGray;
        data[i + 2] = newGray;

        // Distribute error to neighbors (Atkinson Pattern)
        const neighbors = [
          [x + 1, y], [x + 2, y],
          [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
          [x, y + 2]
        ];

        neighbors.forEach(([nx, ny]) => {
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const ni = (ny * w + nx) * 4;
            data[ni] += err;
            data[ni + 1] += err;
            data[ni + 2] += err;
          }
        });
      }
    }

    // Apply Palette (Map B/W dither to brand colors)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) {
         data[i + 3] = 0;
         continue;
      }
      
      const gray = data[i];
      if (gray > 128) {
        // "ON" pixels use brand color
        data[i] = rMatch;
        data[i + 1] = gMatch;
        data[i + 2] = bMatch;
        data[i + 3] = 255;
      } else {
        // "OFF" pixels are transparent (let background show through)
        data[i + 3] = 0;
      }
    }

    oCtx.putImageData(imgData, 0, 0);

    // Scale back up crisp (pixelated)
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add a randomized glitch shift on hover
    const shiftX = isHovered ? (Math.random() - 0.5) * 5 : 0;
    const shiftY = isHovered ? (Math.random() - 0.5) * 5 : 0;
    
    ctx.drawImage(offscreen, shiftX, shiftY, canvas.width, canvas.height);
  };

  return (
    <motion.div 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,62,0,0.4)]" 
      />
    </motion.div>
  );
};
