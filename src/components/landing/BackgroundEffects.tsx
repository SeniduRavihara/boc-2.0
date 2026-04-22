"use client";

import Grainient from "@/components/ui/Grainient";

export default function BackgroundEffects() {
  return (
    <>
      <div className="boc-grain-stage" aria-hidden="true">
        <Grainient
          className="boc-grain"
          timeSpeed={0.2}
          colorBalance={-0.25}
          warpStrength={1.25}
          warpFrequency={4.2}
          warpSpeed={1.3}
          warpAmplitude={58}
          blendAngle={18}
          blendSoftness={0.2}
          rotationAmount={170}
          noiseScale={1.55}
          grainAmount={0.08}
          grainScale={1.2}
          grainAnimated
          contrast={1.18}
          saturation={0.72}
          zoom={0.94}
          color1="#2B89F3"
          color2="#0E0E0E"
          color3="#050505"
        />
      </div>

      <div className="boc-progress-rail" aria-hidden="true">
        <span className="js-progress-line boc-progress-line" />
      </div>
    </>
  );
}
