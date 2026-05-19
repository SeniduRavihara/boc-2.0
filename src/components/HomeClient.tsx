"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ScreenLoader from "@/components/ui/screen-loader";

import Image from "next/image";
import { Download, Users } from "lucide-react";
import MainFooter from "@/components/layout/MainFooter";
import { AboutNew } from "./sections/AboutNew";
import { ContactSection } from "./sections/ContactSection";
import { CTASection } from "./sections/CTASection";
import { FallingScene } from "./sections/FallingScene";
import { GalleryNew } from "./sections/GalleryNew";
import { Partners } from "./sections/Partners";
import { PrizePool } from "./sections/PrizePool";
import { Timeline } from "./sections/Timeline";
import { ShatterLinux } from "./ui/ShatterLinux";

gsap.registerPlugin(ScrollTrigger);

type WindowWithEarthFrame = Window & {
  renderEarthFrame?: (progress: number) => void;
};

export function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [shatterProgress, setShatterProgress] = useState(0);
  const [preCapture, setPreCapture] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Refs for Falling elements inside the sticky area
  const earthContainerRef = useRef<HTMLDivElement>(null);
  const fallingContainerRef = useRef<HTMLDivElement>(null);
  const fallingBgRef = useRef<HTMLDivElement>(null);
  const darknessRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);
  const personContainerRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);
  const missionTextRef = useRef<HTMLDivElement>(null);

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
    const totalFrames = 120;
    // Pre-allocate array of size 120 with null
    const loadedImages: HTMLImageElement[] = new Array(totalFrames).fill(null);
    imagesRef.current = loadedImages;

    let firstFrameLoaded = false;
    let timerDone = false;

    const checkHideLoader = () => {
      if (firstFrameLoaded && timerDone) {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      timerDone = true;
      checkHideLoader();
    }, 3000);

    // Load the first frame immediately for fast FCP/LCP
    const firstImg = new window.Image();
    firstImg.src = `/Earth-splits/ezgif-frame-001.webp`;
    firstImg.onload = () => {
      loadedImages[0] = firstImg;
      firstFrameLoaded = true;
      renderFrame(0);
      checkHideLoader();
    };

    // Helper to load the rest of the frames
    const loadRemainingFrames = () => {
      for (let i = 2; i <= totalFrames; i++) {
        const img = new window.Image();
        const frameNum = String(i).padStart(3, "0");
        img.src = `/Earth-splits/ezgif-frame-${frameNum}.webp`;
        img.onload = () => {
          loadedImages[i - 1] = img;
        };
      }
    };

    // Defer loading remaining frames until after hydration is done and network is idle
    let idleId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        idleId = (window as any).requestIdleCallback(() => {
          timeoutId = setTimeout(loadRemainingFrames, 1000);
        });
      } else {
        timeoutId = setTimeout(loadRemainingFrames, 1500);
      }
    }

    function renderFrame(progress: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || imagesRef.current.length === 0) return;

      const totalFrames = 120;
      const frameIndex = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1,
      );

      // Find the closest loaded frame to prevent flickering while loading
      let img = imagesRef.current[frameIndex];
      if (!img) {
        for (let j = frameIndex - 1; j >= 0; j--) {
          if (imagesRef.current[j]) {
            img = imagesRef.current[j];
            break;
          }
        }
      }
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
      clearTimeout(timer);
      if (idleId && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll(true);
      if (!pinnedRef.current) return;

      const touch = ScrollTrigger.isTouch === 1;

      // Initial positions/styles
      gsap.set(windowRef.current, {
        left: "50%",
        xPercent: -50,
        yPercent: touch ? 125 : 60,
        scale: touch ? 0.96 : 0.85,
        pointerEvents: "none",
        transformOrigin: "bottom center",
      });

      gsap.set(personRef.current, {
        y: "-15vh",
        rotate: -10,
        scale: 0.6,
      });

      gsap.set(missionTextRef.current, {
        opacity: 0,
        y: 40,
        pointerEvents: "none",
      });

      // Unified Timeline: total duration = 7.5
      // 0.0 -> 2.0: scale/expand Linux environment + Earth frames (Phase 1)
      // 2.0 -> 3.5: shatter Linux environment (Phase 2)
      // 2.0 -> 7.5: falling scene animation (Phase 3)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: touch ? 0.8 : 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      // ── PHASE 1 (0.0 -> 2.0) ──

      // 1. Earth sequence frame index mapping
      const earthObj = { progress: 0 };
      tl.to(
        earthObj,
        {
          progress: 1,
          duration: 2.0,
          ease: "none",
          onUpdate: () => {
            const windowWithEarthFrame = window as WindowWithEarthFrame;
            if (windowWithEarthFrame.renderEarthFrame) {
              windowWithEarthFrame.renderEarthFrame(earthObj.progress);
            }
          },
        },
        0
      );

      // 2. Hero content fade out
      tl.to(
        heroContentRef.current,
        { opacity: 0, y: -80, duration: 0.8, ease: "power2.out" },
        0
      );

      // 3. Linux UI scale up
      tl.to(
        windowRef.current,
        {
          yPercent: 0,
          scale: 1,
          pointerEvents: "auto",
          duration: 1.0,
          ease: "power2.out",
        },
        0
      );

      // 4. Linux UI expand to full screen
      tl.to(
        windowRef.current,
        {
          width: "100%",
          height: "100%",
          borderRadius: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        0.8
      );

      // 5. Predictive trigger for early screenshot capture (preCapture)
      tl.to(
        {},
        {
          duration: 0.1,
          onStart: () => setPreCapture(true),
          onReverseComplete: () => setPreCapture(false),
        },
        1.8
      );

      // ── PHASE 2 (2.0 -> 3.5) ──

      // 6. Linux UI Shatter progress (goes from 0 to 1)
      const shatterObj = { progress: 0 };
      tl.to(
        shatterObj,
        {
          progress: 1,
          duration: 1.5,
          ease: "none",
          onUpdate: () => {
            setShatterProgress(shatterObj.progress);
          },
        },
        2.0
      );

      // 7. Earth sequence fades out as falling scene becomes visible
      tl.to(
        earthContainerRef.current,
        { opacity: 0, duration: 0.5 },
        2.0
      );

      // 8. Falling container fades in (clouds, streaks, person)
      tl.to(
        [fallingContainerRef.current, personContainerRef.current],
        { opacity: 1, duration: 0.5 },
        2.0
      );

      // 8.5. Hide Linux window container when shatter is done
      tl.to(
        windowRef.current,
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.1,
        },
        3.5
      );

      // ── PHASE 3 (2.0 -> 7.5 - continuing through shatter) ──

      // 9. Clouds panning down (equivalent to translate 0% to -50%)
      tl.to(
        fallingBgRef.current,
        {
          yPercent: -50,
          duration: 5.5,
          ease: "none",
        },
        2.0
      );

      // 10. Motion streaks fade/pulsate
      tl.to(
        streaksRef.current,
        {
          opacity: 0.4,
          duration: 2.75,
          ease: "none",
        },
        2.0
      ).to(
        streaksRef.current,
        {
          opacity: 0.2,
          duration: 2.75,
          ease: "none",
        },
        4.75
      );

      // 11. Darkness overlay opacity increase
      tl.to(
        darknessRef.current,
        {
          opacity: 0.4,
          duration: 5.5,
          ease: "none",
        },
        2.0
      );

      // 12. Falling person animation (y, scale, rotate)
      tl.to(
        personRef.current,
        {
          y: "0vh",
          scale: 1.3,
          duration: 5.5,
          ease: "none",
        },
        2.0
      );

      tl.to(
        personRef.current,
        {
          keyframes: [
            { rotate: 5, duration: 2.75 },
            { rotate: -2, duration: 2.75 },
          ],
          ease: "none",
        },
        2.0
      );

      // 13. Mission Text reveal
      tl.to(
        missionTextRef.current,
        {
          opacity: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 1.5,
          ease: "power2.out",
        },
        6.0
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
    { scope: mainRef }
  );

  return (
    <main ref={mainRef} className="flex flex-col relative bg-[#050812]">
      <ScreenLoader isVisible={isLoading} />
      {/* ── 1. Hero + Linux — condensed pinned reveal ─────────────── */}
      <div
        ref={pinnedRef}
        style={{ height: "850vh" }}
        className="relative z-20 w-full bg-black"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden touch-pan-y">
          {/* A. Background 1: Earth Canvas */}
          <div ref={earthContainerRef} className="absolute inset-0 z-0 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          </div>

          {/* B. Background 2: Falling Clouds (starts hidden, fades in at shatter) */}
          <div ref={fallingContainerRef} className="absolute inset-0 z-5 pointer-events-none opacity-0">
            {/* Cloud background */}
            <div ref={fallingBgRef} className="absolute inset-x-0 top-0 w-full">
              <Image
                src="/falling_background.webp"
                alt="Cloud sky background"
                width={1080}
                height={1920}
                className="hidden md:block w-full h-auto object-cover"
                style={{ minHeight: '220vh' }}
              />
              <Image
                src="/falling_background_mobile.webp"
                alt="Cloud sky background mobile"
                width={720}
                height={1280}
                className="block md:hidden w-full h-auto object-cover"
                style={{ minHeight: '220vh' }}
              />
            </div>
            
            {/* Darkness overlay */}
            <div ref={darknessRef} className="absolute inset-0 bg-black/40 opacity-0" />

            {/* Streaks */}
            <div ref={streaksRef} className="absolute inset-0 opacity-0">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent blur-sm" />
              <div className="absolute left-[calc(50%-60px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="absolute left-[calc(50%+60px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="absolute left-[calc(50%-120px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
              <div className="absolute left-[calc(50%+120px)] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[300px] h-full bg-gradient-to-b from-transparent via-blue-400/5 to-transparent blur-[60px]" />
            </div>
          </div>

          {/* C. Falling Person (starts hidden, fades in at shatter) */}
          <div ref={personContainerRef} className="absolute inset-0 z-10 flex items-center justify-center overflow-visible pointer-events-none opacity-0">
            <div ref={personRef} className="relative w-[85vw] md:w-[50vw] max-w-[650px] aspect-square">
              <Image
                src="/falling_person1.webp"
                alt="Falling person"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 85vw, 650px"
              />
            </div>
          </div>

          {/* D. Hero Content */}
          <div
            ref={heroContentRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
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

          {/* E. Linux window (Phase 1 scales up to full screen, Phase 2 shatters) */}
          <div
            ref={windowRef}
            className="absolute bottom-0 z-30 h-[56svh] w-[92vw] overflow-hidden rounded-t-2xl border border-white/10 border-b-0 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] md:h-[60vh] md:w-[85vw]"
          >
            <ShatterLinux
              shatterProgress={shatterProgress}
              preCapture={preCapture}
            />
          </div>

          {/* F. Mission Text / CTA */}
          <div
            ref={missionTextRef}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex justify-center pointer-events-none opacity-0"
          >
            <div className="max-w-[1000px] mx-auto px-6 text-center pointer-events-auto">
              <h2 className="font-reglo text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] drop-shadow-2xl text-white">
                To build Sri Lanka&apos;s next generation of cloud-native engineers by bridging academic learning and industry infrastructure.
              </h2>
              <p className="mt-6 text-slate-300 font-mono text-xs uppercase tracking-[0.4em] drop-shadow-lg mb-10">
                Founded under IEEE Student Branch - University of Sri Jayewardenepura
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register/compitition">
                  <button className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-widest uppercase text-xs rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2">
                    <Users size={14} /> Team Registration
                  </button>
                </Link>
                
                <a 
                  href="/Delegate_Booklet.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold tracking-widest uppercase text-xs rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                >
                  <Download size={14} /> Download Delegate Booklet
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <MissionPillars /> */}
      <Timeline />
      <PrizePool />

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
      <Partners />
      <ContactSection />
      <CTASection />

      {/* <Footer /> */}
      <MainFooter hideTopStyling={true} />
    </main>
  );
}
