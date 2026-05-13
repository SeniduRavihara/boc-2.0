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
    <ShinyText
      text={text}
      speed={speed}
      delay={delay}
      color="#0077FF"
      shineColor={shineColor}
      baseGradient="linear-gradient(180deg,#0077FF 0%,#00336E 100%)"
      spread={140}
      direction="left"
      className={`inline-block ${className}`}
    />
  );
}
