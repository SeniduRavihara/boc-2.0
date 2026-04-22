"use client";

import { useRef } from "react";
import type { HTMLProps } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface LogoAnimateProps {
  className?: HTMLProps<HTMLElement>["className"];
}

const LogoAnimate = ({ className }: LogoAnimateProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) {
        return;
      }

      const outerPath = svg.querySelector<SVGPathElement>(".js-logo-outer");
      const innerPath = svg.querySelector<SVGPathElement>(".js-logo-inner");
      const coreCircle = svg.querySelector<SVGCircleElement>(".js-logo-core");
      const coreMark = svg.querySelector<SVGPathElement>(".js-logo-mark");

      if (!outerPath || !innerPath || !coreCircle || !coreMark) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const outerLength = outerPath.getTotalLength();
      const innerLength = innerPath.getTotalLength();

      const resetLogoState = () => {
        gsap.set(outerPath, {
          strokeDasharray: outerLength,
          strokeDashoffset: outerLength,
          fill: "rgba(0, 153, 255, 0)",
        });

        gsap.set(innerPath, {
          strokeDasharray: innerLength,
          strokeDashoffset: innerLength,
          fill: "rgba(10, 11, 43, 0)",
        });

        gsap.set([coreCircle, coreMark], {
          scale: 1,
          transformOrigin: "50% 50%",
        });
      };

      if (reduceMotion) {
        gsap.set(outerPath, {
          strokeDasharray: outerLength,
          strokeDashoffset: 0,
          fill: "#0099FF",
        });

        gsap.set(innerPath, {
          strokeDasharray: innerLength,
          strokeDashoffset: 0,
          fill: "#0A0B2B",
        });

        gsap.set([coreCircle, coreMark], {
          scale: 1,
          transformOrigin: "50% 50%",
        });

        return;
      }

      resetLogoState();

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.8,
        onRepeat: resetLogoState,
        defaults: {
          ease: "power2.inOut",
        },
      });

      tl.to(innerPath, {
        strokeDashoffset: 0,
        duration: 1.2,
      })
        .to(
          innerPath,
          {
            fill: "#0A0B2B",
            duration: 0.55,
            ease: "power1.inOut",
          },
          "<0.25"
        )
        .to(
          outerPath,
          {
            strokeDashoffset: 0,
            duration: 1.8,
          },
          "<0.05"
        )
        .to(
          outerPath,
          {
            fill: "#0099FF",
            duration: 0.7,
            ease: "power1.inOut",
          },
          "<0.5"
        )
        .to(
          [coreCircle, coreMark],
          {
            scale: 1.1,
            duration: 0.75,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          "<0.1"
        );

      return () => {
        tl.kill();
      };
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 643 464"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        className="js-logo-outer"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M416.625 425.625H151.5C151.5 425.625 37.1743 413.903 37.875 312C38.2727 254.506 88.779 201.841 151.5 198.375C151.5 119.936 201.684 46.875 284.062 46.875C349.075 46.875 392.442 86.5676 407.876 141.827C501.712 137.737 565.171 211.972 568.125 274.125C572.102 357.696 484.819 425.625 416.625 425.625ZM436.832 104.218C409.031 47.879 351.158 9 284.062 9C194.128 9 120.632 78.7273 114.25 167.033C48.1395 185.876 0 243.636 0 312C0 392.674 67.0387 458.406 151.5 463.064C151.5 463.064 413.425 463.5 416.625 463.5C515.99 463.5 606 382.959 606 283.594C606 187.846 531.178 109.805 436.832 104.218Z"
        stroke="#0099FF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="rgba(0, 153, 255, 0)"
      />

      <path
        className="js-logo-inner"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M453.625 416.625H188.5C188.5 416.625 74.1743 404.903 74.875 303C75.2727 245.506 125.779 192.841 188.5 189.375C188.5 110.936 238.684 37.875 321.062 37.875C386.075 37.875 429.442 77.5676 444.876 132.827C538.712 128.737 602.171 202.972 605.125 265.125C609.102 348.696 521.819 416.625 453.625 416.625ZM473.832 95.218C446.031 38.879 388.158 0 321.062 0C231.128 0 157.632 69.7273 151.25 158.033C85.1395 176.876 37 234.636 37 303C37 383.674 104.039 449.406 188.5 454.064C188.5 454.064 450.425 454.5 453.625 454.5C552.99 454.5 643 373.959 643 274.594C643 178.846 568.178 100.805 473.832 95.218Z"
        stroke="#0A0B2B"
        strokeWidth="0.00064"
        fill="rgba(10, 11, 43, 0)"
      />

      <circle
        className="js-logo-core"
        cx="302.49"
        cy="256.76"
        r="117.255"
        fill="white"
      />

      <path
        className="js-logo-mark"
        d="M303 152.25C275.417 152.25 248.965 163.207 229.461 182.711C209.957 202.215 199 228.667 199 256.25C199 283.832 209.957 310.285 229.461 329.789C248.965 349.293 275.417 360.25 303 360.25C330.582 360.25 357.035 349.293 376.539 329.789C396.043 310.285 407 283.832 407 256.25C407 228.667 396.043 202.215 376.539 182.711C357.035 163.207 330.582 152.25 303 152.25ZM318.607 204.25L331.421 210.242L327.324 218.74L379.747 251.104V263.072L338.767 288.496L331.319 277.155L365.342 257.096L321.332 231.35L284.245 308.25L271.329 302.359L275.527 293.642L226.253 263.072V251.206L267.335 225.68L274.681 237.122L240.539 257.096L281.52 281.15L318.607 204.25Z"
        fill="#0077FF"
      />
    </svg>
  );
};

export default LogoAnimate;
