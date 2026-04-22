"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LogoAnimate from "@/components/ui/logo-animate";

gsap.registerPlugin(useGSAP);

type ScreenLoaderProps = {
  isVisible: boolean;
};

export default function ScreenLoader({ isVisible }: ScreenLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!loaderRef.current) {
        return;
      }

      const logoElement = loaderRef.current.querySelector<SVGElement>(
        ".js-loader-logo"
      );

      gsap.killTweensOf(loaderRef.current);
      if (logoElement) {
        gsap.killTweensOf(logoElement);
      }

      if (isVisible) {
        gsap.set(loaderRef.current, {
          display: "flex",
          autoAlpha: 1,
          pointerEvents: "auto",
        });

        gsap.fromTo(
          loaderRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.18, ease: "power2.out" }
        );

        if (logoElement) {
          gsap.fromTo(
            logoElement,
            { scale: 0.92, autoAlpha: 0.85 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.38,
              ease: "power2.out",
            }
          );
        }

        return;
      }

      // Hide quickly when no longer needed
      gsap.to(loaderRef.current, {
        autoAlpha: 0,
        duration: 0.22,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(loaderRef.current, {
            display: "none",
            pointerEvents: "none",
          });
        },
      });
    },
    { scope: loaderRef, dependencies: [isVisible] }
  );

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[#020817]"
    >
      <LogoAnimate className="js-loader-logo h-[200px] w-[200px]" />
    </div>
  );
}
