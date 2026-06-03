'use client';

import dynamic from 'next/dynamic';
import { buildVenueMapIframeFallbackUrl } from '@/lib/venue-map-embed';
import type { VenueMapInfo } from '@/types/venue-directions';

const VenueMapGoogle = dynamic(
  () => import('./VenueMapGoogle').then((m) => m.VenueMapGoogle),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]">
        <p className="text-slate-500 text-sm font-mono uppercase tracking-widest animate-pulse">
          Loading map…
        </p>
      </div>
    ),
  }
);

function VenueMapApiKeyNotice() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0f172a] p-6 text-center z-10">
      <p className="text-slate-300 text-sm max-w-md">
        Add a Google Maps JavaScript API key to enable Hybrid map view with roads and labels.
      </p>
      <p className="text-slate-500 text-xs font-mono">
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
      </p>
    </div>
  );
}

function VenueMapIframeFallback({ map }: { map: VenueMapInfo }) {
  return (
    <>
      <VenueMapApiKeyNotice />
      <iframe
        title={`Map of ${map.buildingName}`}
        src={buildVenueMapIframeFallbackUrl(map)}
        className="absolute inset-0 w-full h-full border-0 opacity-40"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </>
  );
}

export function VenueMapEmbed({ map }: { map: VenueMapInfo }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="relative w-full h-full">
        <VenueMapIframeFallback map={map} />
      </div>
    );
  }

  return <VenueMapGoogle map={map} apiKey={apiKey} />;
}
