"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type UseLandingOptions = {
  onReady?: () => void;
};

export default function useLandingAnimations(
  pageRef: RefObject<HTMLDivElement | null>,
  options?: UseLandingOptions
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let readySignaled = false;

      const signalReady = () => {
        if (!readySignaled && options?.onReady) {
          readySignaled = true;
          options.onReady();
        }
      };

      mm.add(
        {
          all: "(min-width: 0px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          const duration = reduceMotion ? 0 : 0.46;

          gsap.set(".js-reveal-white", { xPercent: -100 });
          gsap.set(".js-reveal-blue", { xPercent: -100 });
          gsap.set(".js-reveal-text", { autoAlpha: 0 });

          gsap.utils.toArray<HTMLElement>(".js-triple-reveal").forEach((container) => {
            const text = container.querySelector<HTMLElement>(".js-reveal-text");
            const whiteMask = container.querySelector<HTMLElement>(".js-reveal-white");
            const blueMask = container.querySelector<HTMLElement>(".js-reveal-blue");

            if (!text || !whiteMask || !blueMask) {
              return;
            }

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: container,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
            });

            // 1) White mask does a full pass with text still hidden.
            tl.to(whiteMask, {
              xPercent: 0,
              duration,
              ease: "power3.inOut",
            })
              .to(whiteMask, {
                xPercent: 100,
                duration,
                ease: "power3.inOut",
              })
              // 2) Blue mask covers the line.
              .to(blueMask, {
                xPercent: 0,
                duration,
                ease: "power3.inOut",
              })
              // 3) Text turns visible only at the blue handoff.
              .set(text, { autoAlpha: 1 })
              // 4) Blue mask exits and reveals the text.
              .to(blueMask, {
                xPercent: 100,
                duration,
                ease: "power3.inOut",
              });
          });

          const panels = gsap.utils.toArray<HTMLElement>(".js-panel");

          if (panels.length > 0) {
            const setActivePanel = (activePanel: HTMLElement) => {
              if (reduceMotion) {
                gsap.set(panels, {
                  autoAlpha: 1,
                  scale: 1,
                  y: 0,
                  borderColor: "#1f1f1f",
                  boxShadow: "0 0 0 rgba(0,0,0,0)",
                });
                return;
              }

              gsap.to(panels, {
                autoAlpha: 0.42,
                scale: 0.986,
                y: 0,
                borderColor: "#1f1f1f",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                duration: 0.24,
                ease: "power2.out",
                overwrite: "auto",
              });

              gsap.to(activePanel, {
                autoAlpha: 1,
                scale: 1.02,
                borderColor: "#2b89f3",
                boxShadow: "0 20px 38px rgba(18, 62, 130, 0.28)",
                duration: 0.34,
                ease: "power2.out",
                overwrite: "auto",
              });
            };

            gsap.set(panels, {
              y: reduceMotion ? 0 : 36,
              autoAlpha: reduceMotion ? 1 : 0,
              scale: reduceMotion ? 1 : 0.986,
            });

            panels.forEach((panel) => {
              gsap.to(panel, {
                y: 0,
                autoAlpha: 1,
                duration: reduceMotion ? 0 : 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 84%",
                  once: true,
                },
              });

              ScrollTrigger.create({
                trigger: panel,
                start: "top 55%",
                end: "bottom 55%",
                onToggle: (self) => {
                  if (self.isActive) {
                    setActivePanel(panel);
                  }
                },
              });
            });

            ScrollTrigger.create({
              trigger: ".js-story-wrap",
              start: "top 78%",
              end: "bottom 22%",
              onEnter: () => setActivePanel(panels[0]),
              onEnterBack: () => setActivePanel(panels[0]),
              onLeave: () => setActivePanel(panels[panels.length - 1]),
            });
          }

          gsap.fromTo(
            ".js-progress-line",
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".js-page",
                start: "top top",
                end: "bottom bottom",
                scrub: reduceMotion ? false : true,
              },
            }
          );

          gsap.fromTo(
            ".js-cloud-image",
            { yPercent: -4 },
            {
              yPercent: 18,
              ease: "none",
              scrollTrigger: {
                trigger: ".js-cloud-stage",
                start: "top bottom",
                end: "bottom top",
                scrub: reduceMotion ? false : 1.2,
              },
            }
          );

          gsap.fromTo(
            ".js-footer-title",
            { yPercent: 24 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".js-footer-stage",
                start: "top bottom",
                end: "top 40%",
                scrub: reduceMotion ? false : 1,
              },
            }
          );

          // Signal ready after GSAP initial states and triggers are configured.
          requestAnimationFrame(signalReady);
        }
      );

      // Failsafe: unblock loader even if no media handler executes.
      requestAnimationFrame(signalReady);

      return () => mm.revert();
    },
    { scope: pageRef }
  );
}
