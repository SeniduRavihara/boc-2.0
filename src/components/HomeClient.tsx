"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

import MainFooter from "@/components/layout/MainFooter";
import { AboutNew } from "./sections/AboutNew";
import { ContactSection } from "./sections/ContactSection";
import { CTASection } from "./sections/CTASection";
import { FallingScene } from "./sections/FallingScene";
import { GalleryNew } from "./sections/GalleryNew";
import { Partners } from "./sections/Partners";
import { PrizePool } from "./sections/PrizePool";
import { Timeline } from "./sections/Timeline";

gsap.registerPlugin(ScrollTrigger);

type WindowWithEarthFrame = Window & {
  renderEarthFrame?: (progress: number) => void;
};

export function HomeClient() {
  const mainRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  /* ── Reset scroll on mount ─────────────────────────── */
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  /* ── Earth Image Sequence Preloading ──────────────── */
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const totalFrames = 120;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/Earth-splits/ezgif-frame-${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          // Initial render
          renderFrame(0);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    function renderFrame(progress: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || imagesRef.current.length === 0) return;

      const totalFrames = 120;
      const frameIndex = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1,
      );
      const img = imagesRef.current[frameIndex];
      if (!img) return;

      // Cover scaling logic
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const canvasRatio = canvasWidth / canvasHeight;
      const imgRatio = imgWidth / imgHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Store render function for ScrollTrigger
    (window as WindowWithEarthFrame).renderEarthFrame = renderFrame;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll(true);
      if (!pinnedRef.current) return;

      const touch = ScrollTrigger.isTouch === 1;

      gsap.set(windowRef.current, {
        left: "50%",
        xPercent: -50,
        yPercent: touch ? 125 : 60,
        scale: touch ? 0.96 : 0.85,
        pointerEvents: "none",
        transformOrigin: "bottom center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: touch ? 0.8 : 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            const windowWithEarthFrame = window as WindowWithEarthFrame;
            if (windowWithEarthFrame.renderEarthFrame) {
              windowWithEarthFrame.renderEarthFrame(self.progress);
            }
          },
        },
      });

      tl.to(
        heroContentRef.current,
        { opacity: 0, y: -80, duration: 0.8, ease: "power2.out" },
        0,
      )
        .to(
          windowRef.current,
          {
            yPercent: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: 1,
            ease: "power2.out",
          },
          0,
        )
        .to(
          windowRef.current,
          {
            width: "100%",
            height: "100%",
            borderRadius: 0,
            duration: 1.2,
            ease: "power3.inOut",
          },
          0.8,
        );

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
      };
    },
    { scope: mainRef },
  );

  return (
    <main ref={mainRef} className="flex flex-col relative bg-[#050812]">
      {/* ── 1. Hero + Linux — condensed pinned reveal ─────────────── */}
      <div
        ref={pinnedRef}
        style={{ height: "300vh" }}
        className="relative z-20 w-full bg-black"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden touch-pan-y">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          </div>

          <div
            ref={heroContentRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          >
            <h1 className="font-reglo mb-6 font-black leading-[0.85]">
              <span className="block text-[4rem] leading-[0.85] tracking-tighter min-[380px]:text-[4.5rem] sm:text-[5.5rem] md:hidden">
                <span className="text-white block sm:inline">Beauty of Cloud</span>
                <span className="hidden sm:inline"> </span>
                <span className="text-blue-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                  2.0
                </span>
              </span>
              <span className="hidden md:inline text-8xl tracking-tighter lg:text-[9rem]">
                <span className="text-white">Beauty of Cloud</span>
                <span className="hidden sm:inline"> </span>
                <span className="text-blue-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                  2.0
                </span>
              </span>
            </h1>
            <p className="max-w-xl font-mono text-xs min-[380px]:text-sm uppercase tracking-widest text-white/50 md:text-lg px-4 mb-8">
              Sri Lanka&apos;s premier inter-university cloud ideathon.
            </p>
            <Link href="/register/session/2">
              <button className="px-8 py-3.5 rounded-full bg-white text-black font-bold tracking-widest uppercase text-xs sm:text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Register for Session 2
              </button>
            </Link>
          </div>

          <div
            ref={windowRef}
            className="absolute bottom-0 z-20 h-[56svh] w-[92vw] overflow-hidden rounded-t-2xl border border-white/10 border-b-0 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] md:h-[60vh] md:w-[85vw]"
          >
            {/* <LinuxEnvironment /> */}
            <AboutNew />
          </div>
        </div>
      </div>

      <FallingScene />
      {/* <MissionPillars /> */}
      <Timeline />
      {/* <PrizePool /> */}

      {/*
        ── 2. Gallery zoom + PortalSection1 ─────────────────────────────────
        Height is GALLERY_ZONE_DVH imported directly from Gallery.tsx.
        When you change ZOOM_SCROLL or add sections in Gallery, this
        automatically updates — no manual sync needed.

        Current: TOTAL_SCROLL_MULTIPLIER = 1.5 + 1×1.0 = 2.5 → 250dvh
      */}
      {/* <div
        ref={galleryZoneRef}
        style={{ height: `${GALLERY_ZONE_DVH}dvh` }}
        className="relative z-30 w-full bg-black"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Gallery triggerRef={galleryZoneRef} />
        </div>
      </div> */}

      {/* ── 3. Normal page sections (no scroll tricks) ───────── */}
      {/* <AboutNew /> */}
      {/* <PortalSection2 /> */}
      {/* <PortalSection3 /> */}
      <GalleryNew />
      {/* <Partners /> */}
      <ContactSection />
      <CTASection />

      {/* <Footer /> */}
      <MainFooter hideTopStyling={true} />
    </main>
  );
}
