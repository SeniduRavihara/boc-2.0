'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import type { VenueDirectionStep } from '@/types/venue-directions';

export function VenueDirectionCard({
  step,
  isLast,
}: {
  step: VenueDirectionStep;
  isLast: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <li className="relative flex gap-0 md:gap-0">
      {/* Timeline rail */}
      <div className="hidden sm:flex flex-col items-center mr-6 shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sm font-black text-blue-400 tabular-nums">
          {String(step.order).padStart(2, '0')}
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[2rem] bg-gradient-to-b from-blue-500/50 to-blue-500/10 mt-2" />
        )}
      </div>

      <article className="flex-1 bg-[#0f172a] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-black/20 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-[42%] aspect-[4/3] md:aspect-auto md:min-h-[220px] bg-[#060f21] shrink-0">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={step.image}
                alt={step.landmark}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40 p-6 text-center">
                <MapPin className="w-10 h-10 text-blue-500/60" />
                <span className="text-xs font-mono uppercase tracking-widest">Landmark photo</span>
                <span className="text-[10px] text-white/30">{step.image}</span>
              </div>
            )}
            <span className="sm:hidden absolute top-3 left-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black text-white">
              {step.order}
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 md:p-8 md:w-[58%]">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-blue-400 shrink-0" />
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                {step.landmark}
              </h3>
            </div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">{step.instruction}</p>
            {step.tip && (
              <p className="mt-4 text-xs text-blue-300/90 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-blue-400">Tip: </span>
                {step.tip}
              </p>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
