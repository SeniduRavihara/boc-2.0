'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { AboutNew } from '../sections/AboutNew';

/* ─────────────────────────────────────────────────────────────────────────────
   Minimal Delaunay triangulation (ironwallaby/delaunay port — no external deps)
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
   Fragment model mirroring the premium Delaunay physics
────────────────────────────────────────────────────────────────────────────── */
interface Frag {
  el: HTMLCanvasElement;
  rx: number;
  ry: number;
  rz: number;
  speedX: number;
  speedY: number;
  delay: number;
}

function makeFragments(
  src: HTMLCanvasElement,
  W: number,
  H: number,
  centerX: number,
  centerY: number,
): Frag[] {
  // Balanced rings for optimal shard count (around 120 shards) and performance
  const rings = [
    { r: 60, c: 14 },
    { r: 180, c: 16 },
    { r: 360, c: 18 },
    { r: 800, c: 18 },
    { r: 1500, c: 14 }
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
    fc.style.willChange = 'transform, opacity';

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

    // Premium 3D rotations
    const rx = (100 + Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
    const ry = (100 + Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
    const rz = (50 + Math.random() * 100) * (Math.random() > 0.5 ? 1 : -1);
    
    // Blast vector outwards based on distance
    const forceFactor = (1 - Math.min(d / W, 0.8));
    const speedX = (dx / d) * (4 + Math.random() * 8) * forceFactor;
    const speedY = (dy / d) * (4 + Math.random() * 8) * forceFactor;

    // Delay based on proximity to center (shatter propagates outwards)
    const delay = d * 0.0015 * (0.8 + Math.random() * 0.4);

    frags.push({
      el: fc,
      rx,
      ry,
      rz,
      speedX,
      speedY,
      delay,
    });
  }

  return frags;
}

export interface AboutNewShatterProps {
  shatterProgress: number; // 0 = intact, 1 = fully shattered
  preCapture?: boolean;
}

export const AboutNewShatter: React.FC<AboutNewShatterProps> = ({ shatterProgress, preCapture = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const fragsRef = useRef<Frag[]>([]);
  const isCapturingRef = useRef(false);
  const builtRef = useRef(false);
  const progressRef = useRef(0);
  const rafRef = useRef(0);

  // Store progress in ref for async callback
  useEffect(() => {
    progressRef.current = shatterProgress;
  }, [shatterProgress]);

  const applyPhysics = useCallback((p: number) => {
    const maxDelay = 0.4;
    fragsRef.current.forEach((f) => {
      const start = Math.min(f.delay, maxDelay);
      const local = Math.max(0, Math.min(1, (p - start) / (1 - start)));
      
      // Snappy ease-out curve for explosion, then gravity falls
      const tExplode = Math.sin(local * Math.PI * 0.5); // circular ease out
      const tGravity = local * local; // quadratic ease in for gravity acceleration

      // Horizontal explosion push + vertical drop
      const tx = f.speedX * 60 * tExplode;
      const ty = f.speedY * 60 * tExplode + 900 * tGravity; // gravity pulls pieces down
      const tz = -600 * tExplode;

      const rx = f.rx * local;
      const ry = f.ry * local;
      const rz = f.rz * local;
      const alpha = local > 0.75 ? Math.max(0, 1 - (local - 0.75) / 0.25) : 1;

      f.el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotateZ(${rz.toFixed(1)}deg)`;
      f.el.style.opacity = String(alpha.toFixed(3));
    });
  }, []);

  const captureAndSwap = useCallback(async () => {
    if (isCapturingRef.current || builtRef.current) return;
    isCapturingRef.current = true;

    const target = contentRef.current;
    const overlay = overlayRef.current;
    if (!target || !overlay) {
      isCapturingRef.current = false;
      return;
    }

    try {
      const { domToCanvas } = await import('modern-screenshot');
      const W = target.offsetWidth;
      const H = target.offsetHeight;

      // Capture screenshot directly as a Canvas element
      const srcCanvas = await domToCanvas(target, {
        width: W,
        height: H,
        backgroundColor: '#050812',
        style: {
          transform: 'none',
        }
      });

      // Create geometry shards
      const frags = makeFragments(srcCanvas, W, H, W * 0.5, H * 0.5);
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
      `;

      frags.forEach((f) => {
        overlay.appendChild(f.el);
      });

      builtRef.current = true;
      isCapturingRef.current = false;

      // Show/hide based on current progress
      if (progressRef.current > 0) {
        target.style.visibility = 'hidden';
        overlay.style.display = 'block';
        applyPhysics(progressRef.current);
      } else {
        target.style.visibility = 'visible';
        overlay.style.display = 'none';
        applyPhysics(0);
      }
    } catch (error) {
      console.error('[AboutNewShatter] Capture failed:', error);
      isCapturingRef.current = false;
    }
  }, [applyPhysics]);

  useEffect(() => {
    const target = contentRef.current;
    const overlay = overlayRef.current;
    if (!target || !overlay) return;

    if (shatterProgress > 0 || preCapture) {
      if (!builtRef.current) {
        captureAndSwap();
      } else if (shatterProgress > 0) {
        overlay.style.display = 'block';
        target.style.visibility = 'hidden';
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => applyPhysics(shatterProgress));
      }
    } else {
      if (builtRef.current) {
        cancelAnimationFrame(rafRef.current);
        overlay.style.display = 'none';
        target.style.visibility = 'visible';
        applyPhysics(0);
      }
    }
  }, [shatterProgress, preCapture, captureAndSwap, applyPhysics]);

  return (
    <div className="relative w-full h-full bg-transparent">
      {/* 1. Real AboutNew Component */}
      <div ref={contentRef} className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
        <AboutNew />
      </div>

      {/* 2. Fragment Container Overlay */}
      <div ref={overlayRef} />
    </div>
  );
};
