"use client";

import ShinyText from "@/components/ui/ShinyText";

export function GradientShinyTitle({
  text,
  className = "",
  speed = 2,
  delay = 0.6,
  shineColor = "#6BB8FF",
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  shineColor?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="bg-[linear-gradient(180deg,#0077FF_0%,#00336E_100%)] bg-clip-text text-transparent">
        {text}
      </span>
      <ShinyText
        text={text}
        speed={speed}
        delay={delay}
        color="rgba(0,119,255,0)"
        shineColor={shineColor}
        spread={140}
        direction="left"
        className="pointer-events-none absolute inset-0"
      />
    </span>
  );
}
