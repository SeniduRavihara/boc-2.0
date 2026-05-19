'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { LinuxEnvironment } from './LinuxEnvironment';

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
   Fragment model mirroring the SAMPLE perfectly
────────────────────────────────────────────────────────────────────────────── */
interface Frag {
  el: HTMLCanvasElement;
  rx: number;
  ry: number;
  delay: number;
}

function makeFragments(
  src: HTMLImageElement,
  W: number,
  H: number,
  centerX: number,
  centerY: number,
): Frag[] {
  const rings = [
    { r: 50, c: 12 },
    { r: 150, c: 12 },
    { r: 300, c: 12 },
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

export interface ShatterLinuxProps {
  shatterProgress: number; // 0 = intact, 1 = fully shattered
  preCapture?: boolean;
}

export const ShatterLinux: React.FC<ShatterLinuxProps> = ({ shatterProgress, preCapture = false }) => {
  const linuxRef = useRef<HTMLDivElement>(null);
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
    const maxDelay = 0.5;
    fragsRef.current.forEach((f) => {
      const start = Math.min(f.delay, maxDelay);
      const local = Math.max(0, Math.min(1, (p - start) / (1 - start)));
      const t = local * local * local; // Cubic.easeIn

      const tz = -500 * t;
      const rx = f.rx * t;
      const ry = f.ry * t;
      const alpha = local > 0.6 ? Math.max(0, 1 - (local - 0.6) / 0.4) : 1;

      f.el.style.transform = `translate3d(0px, 0px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      f.el.style.opacity = String(alpha.toFixed(3));
    });
  }, []);

  const captureAndSwap = useCallback(async () => {
    if (isCapturingRef.current || builtRef.current) return;
    isCapturingRef.current = true;

    const target = linuxRef.current;
    const overlay = overlayRef.current;
    if (!target || !overlay) {
      isCapturingRef.current = false;
      return;
    }

    try {
      const { domToPng } = await import('modern-screenshot');
      const W = target.offsetWidth;
      const H = target.offsetHeight;

      // Capture screenshot using modern-screenshot
      const dataUrl = await domToPng(target, {
        width: W,
        height: H,
        backgroundColor: '#1a1a2e',
        style: {
          transform: 'none',
        }
      });

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const frags = makeFragments(img, W, H, W * 0.5, H * 0.5);
        fragsRef.current = frags;

        overlay.innerHTML = '';
        overlay.style.cssText = `
          position: absolute;
          inset: 0;
          perspective: 500px;
          pointer-events: none;
          z-index: 50;
        `;

        frags.forEach((f) => {
          overlay.appendChild(f.el);
        });

        target.style.visibility = 'hidden';
        builtRef.current = true;
        isCapturingRef.current = false;

        // Apply physics at current scroll progress
        applyPhysics(progressRef.current);
      };
    } catch (error) {
      console.error('[ShatterLinux] Capture failed:', error);
      isCapturingRef.current = false;
    }
  }, [applyPhysics]);

  useEffect(() => {
    const target = linuxRef.current;
    const overlay = overlayRef.current;
    if (!target || !overlay) return;

    if (shatterProgress > 0 || preCapture) {
      if (!builtRef.current) {
        captureAndSwap();
      } else if (shatterProgress > 0) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => applyPhysics(shatterProgress));
      }
    } else {
      // Revert/Reset
      if (builtRef.current || isCapturingRef.current) {
        cancelAnimationFrame(rafRef.current);
        builtRef.current = false;
        isCapturingRef.current = false;
        fragsRef.current = [];
        overlay.innerHTML = '';
        overlay.style.cssText = '';
        target.style.visibility = 'visible';
      }
    }
  }, [shatterProgress, preCapture, captureAndSwap, applyPhysics]);

  return (
    <div className="relative w-full h-full bg-transparent">
      {/* 1. Real Linux UI */}
      <div ref={linuxRef} className="absolute inset-0 w-full h-full">
        <LinuxEnvironment />
      </div>

      {/* 2. Fragment Container Overlay */}
      <div ref={overlayRef} />
    </div>
  );
};
