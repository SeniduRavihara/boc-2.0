'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Minimal Delaunay triangulation (Bowyer-Watson)
function delaunay(pts: number[][]): number[] {
  const n = pts.length;
  if (n < 3) return [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x; if (y < minY) minY = y;
    if (x > maxX) maxX = x; if (y > maxY) maxY = y;
  }
  const dm = Math.max(maxX - minX, maxY - minY);
  const mx = (minX + maxX) / 2, my = (minY + maxY) / 2;

  const v = [...pts, [mx - 20 * dm, my - dm], [mx, my + 20 * dm], [mx + 20 * dm, my - dm]];

  type T = [number, number, number];
  let tris: T[] = [[n, n + 1, n + 2]];

  for (let i = 0; i < n; i++) {
    const [px, py] = v[i];
    const edges: [number, number][] = [];
    const good: T[] = [];

    for (const [a, b, c] of tris) {
      const [ax, ay] = v[a], [bx, by] = v[b], [cx, cy] = v[c];
      const A = bx - ax, B = by - ay, C = cx - ax, D = cy - ay;
      const E = A * (ax + bx) + B * (ay + by);
      const F = C * (ax + cx) + D * (ay + cy);
      const G = 2 * (A * (cy - by) - B * (cx - bx));
      if (Math.abs(G) < 1e-10) { good.push([a, b, c]); continue; }
      const rx = (D * E - B * F) / G, ry = (A * F - C * E) / G;
      const r2 = (ax - rx) ** 2 + (ay - ry) ** 2;
      if ((px - rx) ** 2 + (py - ry) ** 2 - r2 > 1e-10) {
        good.push([a, b, c]); continue;
      }
      edges.push([a, b], [b, c], [c, a]);
    }

    const uniq: [number, number][] = [];
    for (let j = 0; j < edges.length; j++) {
      let s = false;
      for (let k = 0; k < edges.length; k++) {
        if (j === k) continue;
        if ((edges[j][0] === edges[k][0] && edges[j][1] === edges[k][1]) ||
            (edges[j][0] === edges[k][1] && edges[j][1] === edges[k][0])) {
          s = true; break;
        }
      }
      if (!s) uniq.push(edges[j]);
    }
    tris = [...good, ...uniq.map(([e0, e1]) => [e0, e1, i] as T)];
  }

  const out: number[] = [];
  for (const [a, b, c] of tris) {
    if (a < n && b < n && c < n) out.push(a, b, c);
  }
  return out;
}

interface Frag {
  el: HTMLCanvasElement;
  rx: number;
  ry: number;
  delay: number;
  speedX?: number;
  speedY?: number;
}

function makeFragments(
  src: HTMLImageElement,
  W: number,
  H: number,
  centerX: number,
  centerY: number,
): Frag[] {
  const rings = [
    { r: 55, c: 12 },
    { r: 160, c: 12 },
    { r: 320, c: 12 },
    { r: 1200, c: 12 }
  ];

  const verts: number[][] = [[centerX, centerY]];

  rings.forEach((ring) => {
    const radius = ring.r;
    const count = ring.c;
    const variance = radius * 0.25;

    for (let i = 0; i < count; i++) {
      const x = Math.cos((i / count) * Math.PI * 2) * radius + centerX + (Math.random() - 0.5) * variance * 2;
      const y = Math.sin((i / count) * Math.PI * 2) * radius + centerY + (Math.random() - 0.5) * variance * 2;
      verts.push([x, y]);
    }
  });

  verts.forEach((v) => {
    v[0] = Math.min(Math.max(v[0], 0), W);
    v[1] = Math.min(Math.max(v[1], 0), H);
  });

  const idx = delaunay(verts);
  const frags: Frag[] = [];

  for (let i = 0; i < idx.length; i += 3) {
    const v0 = verts[idx[i]];
    const v1 = verts[idx[i + 1]];
    const v2 = verts[idx[i + 2]];

    const xMin = Math.floor(Math.min(v0[0], v1[0], v2[0]));
    const xMax = Math.ceil(Math.max(v0[0], v1[0], v2[0]));
    const yMin = Math.floor(Math.min(v0[1], v1[1], v2[1]));
    const yMax = Math.ceil(Math.max(v0[1], v1[1], v2[1]));
    const bw = xMax - xMin, bh = yMax - yMin;
    if (bw < 1 || bh < 1) continue;

    const cx = (v0[0] + v1[0] + v2[0]) / 3;
    const cy = (v0[1] + v1[1] + v2[1]) / 3;

    const fc = document.createElement('canvas');
    fc.width = bw;
    fc.height = bh;
    fc.style.width = bw + 'px';
    fc.style.height = bh + 'px';
    fc.style.left = xMin + 'px';
    fc.style.top = yMin + 'px';
    fc.style.position = 'absolute';
    fc.style.backfaceVisibility = 'hidden';

    const ctx = fc.getContext('2d')!;
    ctx.translate(-xMin, -yMin);
    ctx.beginPath();
    ctx.moveTo(v0[0], v0[1]);
    ctx.lineTo(v1[0], v1[1]);
    ctx.lineTo(v2[0], v2[1]);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(src, 0, 0, W, H);

    const dx = cx - centerX;
    const dy = cy - centerY;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;

    const rx = 30 * (dy < 0 ? -1 : 1);
    const ry = 90 * -(dx < 0 ? -1 : 1);
    const delay = d * 0.003 * (0.9 + Math.random() * 0.2);

    frags.push({
      el: fc,
      rx,
      ry,
      delay,
    });
  }

  return frags;
}

// The Component we want to capture and shatter
const MockShatterTarget: React.FC<{ title?: string }> = ({ title = "Off-Screen Triangulated Canvas" }) => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white relative border border-white/10 rounded-2xl shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-xs font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-6">
          Pre-Captured Off-Screen
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-400">
          {title}
        </h2>
        <p className="text-slate-300 text-base leading-relaxed max-w-md">
          This card is rendered at 100vw/100vh off-screen immediately on page load, captured, and converted into triangles before you even scroll!
        </p>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur shadow-inner">
          <span className="text-3xl">🐳</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur shadow-inner">
          <span className="text-3xl">🚀</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur shadow-inner">
          <span className="text-3xl">🛡️</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur shadow-inner">
          <span className="text-3xl">✨</span>
        </div>
      </div>
    </div>
  );
};

export default function TestingOffscreenPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Ref for offscreen cloning
  const offscreenRef = useRef<HTMLDivElement>(null);
  // Ref for live on-screen layout (which starts as HTML and then gets swapped with screenshot overlay)
  const onscreenRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<'HTML' | 'PRE-CAPTURING' | 'READY-SHATTER'>('HTML');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [buildTime, setBuildTime] = useState<number | null>(null);

  const fragsRef = useRef<Frag[]>([]);
  const builtRef = useRef(false);
  const rafRef = useRef(0);

  // Apply fragment translations & rotations
  const applyPhysics = useCallback((p: number) => {
    const maxDelay = 0.45;
    fragsRef.current.forEach((f) => {
      const start = Math.min(f.delay, maxDelay);
      const local = Math.max(0, Math.min(1, (p - start) / (1 - start)));

      const tExplode = Math.sin(local * Math.PI * 0.5);
      const tGravity = local * local;

      const tx = f.speedX ? f.speedX * 60 * tExplode : (Math.random() - 0.5) * 200 * tExplode;
      const ty = f.speedY ? f.speedY * 60 * tExplode + 900 * tGravity : (Math.random() - 0.5) * 200 * tExplode + 900 * tGravity;
      const tz = -600 * tExplode;

      const rx = f.rx * local;
      const ry = f.ry * local;
      const alpha = local > 0.75 ? Math.max(0, 1 - (local - 0.75) / 0.25) : 1;

      f.el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
      f.el.style.opacity = String(alpha.toFixed(3));
    });
  }, []);

  // Capture offscreen element immediately on mount
  useEffect(() => {
    const runOffscreenCapture = async () => {
      const offscreen = offscreenRef.current;
      const overlay = overlayRef.current;
      if (!offscreen || !overlay) return;

      setStatus('PRE-CAPTURING');
      const startTime = performance.now();

      try {
        const { domToPng } = await import('modern-screenshot');
        
        // Target is styled to fill screen off-screen
        const W = offscreen.offsetWidth;
        const H = offscreen.offsetHeight;

        const dataUrl = await domToPng(offscreen, {
          width: W,
          height: H,
          backgroundColor: '#090b11',
        });

        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const frags = makeFragments(img, W, H, W * 0.5, H * 0.5);
          
          // Seed random scatter speeds
          frags.forEach((f) => {
            (f as any).speedX = (Math.random() - 0.5) * 12;
            (f as any).speedY = (Math.random() - 0.5) * 12 - 4;
          });
          
          fragsRef.current = frags;

          overlay.innerHTML = '';
          overlay.style.cssText = `
            position: absolute;
            inset: 0;
            perspective: 1200px;
            transform-style: preserve-3d;
            overflow: visible;
            pointer-events: none;
            z-index: 50;
            display: none;
          `;
          
          frags.forEach((f) => {
            overlay.appendChild(f.el);
          });

          setBuildTime(Math.round(performance.now() - startTime));
          builtRef.current = true;
          setStatus('READY-SHATTER');
          
          // Apply initial positioning
          applyPhysics(0);
        };
      } catch (err) {
        console.error('Offscreen capture failed:', err);
        setStatus('HTML');
      }
    };

    // Delay briefly to allow initial render layout to settle
    const t = setTimeout(runOffscreenCapture, 500);
    return () => clearTimeout(t);
  }, [applyPhysics]);

  useGSAP(() => {
    if (!triggerRef.current) return;

    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });
  }, { scope: containerRef });

  // Shatter animation occurs in the range [0.3, 1.0] of scroll progress
  const shatterRangeProgress = Math.max(0, (scrollProgress - 0.3) / 0.7);

  useEffect(() => {
    const onscreen = onscreenRef.current;
    const overlay = overlayRef.current;
    if (!onscreen || !overlay || !builtRef.current) return;

    if (shatterRangeProgress > 0) {
      // Swapped immediately with NO SCROLL LOCK!
      onscreen.style.visibility = 'hidden';
      overlay.style.display = 'block';
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyPhysics(shatterRangeProgress));
    } else {
      onscreen.style.visibility = 'visible';
      overlay.style.display = 'none';
      applyPhysics(0);
    }
  }, [shatterRangeProgress, applyPhysics]);

  return (
    <main ref={containerRef} className="bg-[#02040a] text-white min-h-[300vh] relative">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-[100] flex gap-4">
        <a 
          href="/" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 rounded-lg text-xs font-medium transition-all"
        >
          ← Main Site
        </a>
      </div>

      {/* State HUD */}
      <div className="fixed top-6 right-6 z-[100] bg-black/85 border border-white/10 backdrop-blur-md p-4 rounded-xl font-mono text-xs flex flex-col gap-2 min-w-[280px] shadow-2xl">
        <div className="text-indigo-400 font-bold">OFF-SCREEN DEMO CONTROL</div>
        
        <div className="flex items-center justify-between">
          <span>Scroll Progress:</span>
          <span className="font-bold text-blue-400">{(scrollProgress * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Shatter Progress:</span>
          <span className="font-bold text-purple-400">{(shatterRangeProgress * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Capture Status:</span>
          <span className={`font-black px-2 py-0.5 rounded text-[10px] ${
            status === 'HTML' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            status === 'PRE-CAPTURING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {status}
          </span>
        </div>

        {buildTime !== null && (
          <div className="flex items-center justify-between">
            <span>Background Build Time:</span>
            <span className="font-bold text-emerald-400">{buildTime}ms</span>
          </div>
        )}

        <div className="text-[10px] text-slate-500 mt-2 leading-relaxed border-t border-white/10 pt-2">
          {status === 'PRE-CAPTURING' && "Taking invisible screenshot of offscreen cloned element..."}
          {status === 'READY-SHATTER' && "READY. Scroll down below 30% to watch it shatter. Note that scroll is never locked/held!"}
        </div>
      </div>

      {/* 1. Off-screen Clone Container for capturing */}
      <div 
        ref={offscreenRef} 
        className="w-screen h-screen fixed"
        style={{
          left: '-9999px',
          top: '-9999px',
          zIndex: -100,
          pointerEvents: 'none',
        }}
      >
        <MockShatterTarget title="Off-Screen Pre-Rendered Canvas" />
      </div>

      {/* Header Explainer */}
      <div className="h-screen w-full flex flex-col items-center justify-center px-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500 mb-4">
          Off-Screen Background Capture Demo
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-6">
          Scroll down. An invisible, full-sized clone of the section below was already screenshotted, triangulated, and loaded into memory within the first 500ms of loading this page.
        </p>
        <div className="flex justify-center gap-2 text-xs font-mono text-slate-500">
          <span>[Scroll down to begin]</span>
          <span className="animate-bounce">↓</span>
        </div>
      </div>

      {/* Pinned Scroll Container */}
      <div ref={triggerRef} className="w-full h-[200vh] relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-12 py-12">
          
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] aspect-video">
            {/* Live On-Screen layout matching offscreen dimensions */}
            <div ref={onscreenRef} className="absolute inset-0 w-full h-full">
              <MockShatterTarget title="Live On-Screen Layout" />
            </div>

            {/* Delaunay fragments layer overlay */}
            <div ref={overlayRef} />
          </div>

        </div>
      </div>
    </main>
  );
}
