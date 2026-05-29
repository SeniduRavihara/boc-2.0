'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   Minimal Bowyer-Watson Delaunay triangulation (no external dependencies)
────────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   Fragment data (mirrors SAMPLE Fragment object model)
────────────────────────────────────────────────────────────────────────────── */
interface Frag {
  el: HTMLCanvasElement;
  rx: number;      // target rotation X
  ry: number;      // target rotation Y
  delay: number;   // normalized delay based on distance
}

function makeFragments(
  src: HTMLImageElement,
  W: number,
  H: number,
  centerX: number,
  centerY: number,
): Frag[] {
  // Rings exactly as specified in the SAMPLE
  const rings = [
    { r: 50, c: 12 },
    { r: 150, c: 12 },
    { r: 300, c: 12 },
    { r: 1200, c: 12 } // huge outer ring to cover corners
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

  // Clamp vertices to image boundaries
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

    // Create fragment canvas
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

    // Calculate distance and angles from origin (clickPosition)
    const dx = cx - centerX;
    const dy = cy - centerY;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;

    // rotation target formula from SAMPLE
    const rx = 30 * (dy < 0 ? -1 : 1);
    const ry = 90 * -(dx < 0 ? -1 : 1);
    const delay = d * 0.003 * (0.9 + Math.random() * 0.2); // SAMPLE randomRange(0.9, 1.1)

    frags.push({
      el: fc,
      rx,
      ry,
      delay,
    });
  }

  return frags;
}

export default function Testing3Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<'HTML' | 'CAPTURINIG' | 'SCREENSHOT'>('HTML');
  const [scrollProgress, setScrollProgress] = useState(0);

  const fragsRef = useRef<Frag[]>([]);
  const builtRef = useRef(false);

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

  // Calculate local shatter progress once past 10%
  const localShatterProgress = Math.max(0, (scrollProgress - 0.1) / 0.9);

  // Apply fragment translations & rotations
  const applyPhysics = useCallback((p: number) => {
    const maxDelay = 0.5; // limit delay to 50% of the timeline
    
    fragsRef.current.forEach((f) => {
      const start = Math.min(f.delay, maxDelay);
      const local = Math.max(0, Math.min(1, (p - start) / (1 - start)));

      // Cubic easeIn: t^3
      const t = local * local * local;

      // Z-depth: moves from 0 to -500px (SAMPLE)
      const tz = -500 * t;
      const rx = f.rx * t;
      const ry = f.ry * t;

      // Opacity: starts fading out at 60% of local duration (SAMPLE tl1.to(..., 0.4, {alpha:0}, 0.6))
      const alpha = local > 0.6 ? Math.max(0, 1 - (local - 0.6) / 0.4) : 1;

      f.el.style.transform = `translate3d(0px, 0px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      f.el.style.opacity = String(alpha.toFixed(3));
    });
  }, []);

  const captureAndSwap = async () => {
    const target = targetRef.current;
    const preview = previewRef.current;
    if (!target || !preview) return;

    try {
      const { domToPng } = await import('modern-screenshot');
      
      const W = target.offsetWidth;
      const H = target.offsetHeight;

      const dataUrl = await domToPng(target, {
        width: W,
        height: H,
        backgroundColor: '#090b11',
        style: {
          transform: 'none',
        }
      });

      // Load data URL in an Image
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        // Build Delaunay fragments from the image
        const frags = makeFragments(img, W, H, W * 0.5, H * 0.5);
        fragsRef.current = frags;

        // Clear preview container and mount all fragment canvases
        preview.innerHTML = '';
        preview.style.cssText = `
          position: absolute;
          inset: 0;
          perspective: 500px;
          pointer-events: none;
          z-index: 50;
        `;
        
        frags.forEach((f) => {
          preview.appendChild(f.el);
        });

        // Hide original HTML content
        target.style.visibility = 'hidden';
        setStatus('SCREENSHOT');
        builtRef.current = true;

        // Apply initial physics state
        applyPhysics(0);
      };

    } catch (error) {
      console.error('Screenshot capture failed:', error);
      setStatus('HTML');
    }
  };

  useEffect(() => {
    if (scrollProgress > 0.1) {
      if (!builtRef.current && status === 'HTML') {
        setStatus('CAPTURINIG');
        captureAndSwap();
      } else if (builtRef.current) {
        applyPhysics(localShatterProgress);
      }
    } else {
      // Reset
      if (builtRef.current || status !== 'HTML') {
        setStatus('HTML');
        builtRef.current = false;
        fragsRef.current = [];
        if (previewRef.current) {
          previewRef.current.innerHTML = '';
          previewRef.current.style.cssText = '';
        }
        if (targetRef.current) {
          targetRef.current.style.visibility = 'visible';
        }
      }
    }
  }, [scrollProgress, localShatterProgress, applyPhysics]);

  return (
    <main ref={containerRef} className="bg-[#02040a] text-white min-h-[250vh] relative">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-[100] flex gap-4">
        <a 
          href="/" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium transition-all"
        >
          ← Main Site
        </a>
        <a 
          href="/testing2" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium transition-all"
        >
          ← Testing 2
        </a>
      </div>

      {/* State HUD */}
      <div className="fixed top-6 right-6 z-[100] bg-black/85 border border-white/10 backdrop-blur-md p-4 rounded-xl font-mono text-xs flex flex-col gap-2 min-w-[250px] shadow-2xl">
        <div className="text-slate-400">STATE CONTROL</div>
        
        <div className="flex items-center justify-between">
          <span>Scroll Progress:</span>
          <span className="font-bold text-blue-400">{(scrollProgress * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Shatter Progress:</span>
          <span className="font-bold text-purple-400">{(localShatterProgress * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Active Layer:</span>
          <span className={`font-black px-2 py-0.5 rounded ${
            status === 'HTML' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            status === 'CAPTURINIG' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {status}
          </span>
        </div>

        <div className="text-[10px] text-slate-500 mt-2 leading-relaxed">
          {status === 'HTML' && "Original active React component/HTML is rendered. Scroll down past 10% to capture."}
          {status === 'CAPTURINIG' && "Running html2canvas/dom-to-image screenshot conversion..."}
          {status === 'SCREENSHOT' && "Original HTML is hidden. The screenshot fragments are active and shattering in 3D."}
        </div>
      </div>

      {/* Pinned Scroll Container */}
      <div ref={triggerRef} className="w-full h-[200vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
          
          <div className="mb-8 text-center max-w-md">
            <h1 className="text-2xl font-black uppercase mb-2">Screenshot Shatter Test</h1>
            <p className="text-sm text-slate-400">
              Scroll down past 10% to capture the card below, hide the HTML, and watch it shatter away in 3D.
            </p>
          </div>

          {/* Test Box Area */}
          <div className="relative w-full max-w-lg aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#090b11]">
            
            {/* 1. Original HTML Content */}
            <div 
              ref={targetRef} 
              className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black z-10"
            >
              <div>
                <div className="inline-flex rounded-full px-3 py-1 text-xs font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
                  Interactive HTML
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Linux Shell UI Preview</h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                  This card has text, borders, gradients, and custom components. Try to hover and interact.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-xl">🐳</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-xl">🚀</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-xl">🛡️</span>
                </div>
              </div>
            </div>

            {/* 2. Captured Screenshot Canvas Placeholder */}
            <div 
              ref={previewRef} 
              className="absolute inset-0 z-20 pointer-events-none" 
            />

          </div>

        </div>
      </div>
    </main>
  );
}
