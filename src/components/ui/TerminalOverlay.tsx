'use client';

import React, { useEffect, useRef } from 'react';

const CHARS = '█▓▒░$#@%!&*()_+{}:"<>?|\\/-=[];\',.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DENSITY = 25; // Adjusted for performance and aesthetics

export const TerminalOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize character positions
    const cols = Math.floor(width / DENSITY);
    const rows = Math.floor(height / DENSITY);
    const chars: { x: number; y: number; char: string; opacity: number; color: string }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        chars.push({
          x: c * DENSITY + DENSITY / 2,
          y: r * DENSITY + DENSITY / 2,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          opacity: 0.1,
          color: 'rgba(255, 255, 255, 0.2)'
        });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      
      chars.forEach(p => {
        const dx = mousePos.current.x - p.x;
        const dy = mousePos.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Character interaction logic
        const maxDist = 200;
        let scale = 1;
        let finalOpacity = 0.05;
        let finalColor = 'rgba(255, 255, 255, 0.15)';

        if (dist < maxDist) {
          const intensity = 1 - dist / maxDist;
          scale = 1 + intensity * 0.5;
          finalOpacity = 0.05 + intensity * 0.4;
          
          // Color shift based on proximity
          if (intensity > 0.5) {
            finalColor = Math.random() > 0.5 ? '#FF9900' : '#4285F4'; // AWS Orange or GCP Blue
          } else {
            finalColor = `rgba(255, 255, 255, ${0.15 + intensity * 0.4})`;
          }
        }

        // Randomly change characters occasionally
        if (Math.random() > 0.999) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        ctx.fillStyle = finalColor;
        ctx.globalAlpha = finalOpacity;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(scale, scale);
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', handleMouseMove);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
