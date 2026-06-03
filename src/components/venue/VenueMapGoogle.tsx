'use client';

import { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import {
  DEFAULT_VENUE_MAP_TYPE,
  toGoogleMapTypeId,
  VENUE_MAP_TYPE_OPTIONS,
  type VenueMapType,
} from '@/lib/venue-map-embed';
import type { VenueMapInfo } from '@/types/venue-directions';

function MapTypeControl({
  mapType,
  onChange,
}: {
  mapType: VenueMapType;
  onChange: (type: VenueMapType) => void;
}) {
  return (
    <div
      className="absolute top-3 right-3 z-20 flex flex-col gap-0.5 p-1 rounded-xl bg-[#0f172a]/95 border border-white/10 shadow-lg backdrop-blur-sm"
      role="group"
      aria-label="Map type"
    >
      {VENUE_MAP_TYPE_OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={mapType === id}
          className={`px-3 py-2 text-left text-[11px] font-mono uppercase tracking-wider rounded-lg transition-colors ${
            mapType === id
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function VenueMapGoogle({
  map,
  apiKey,
}: {
  map: VenueMapInfo;
  apiKey: string;
}) {
  const [mapType, setMapType] = useState<VenueMapType>(DEFAULT_VENUE_MAP_TYPE);

  const center = { lat: map.latitude, lng: map.longitude };

  return (
    <APIProvider apiKey={apiKey} language="en" region="LK">
      <div className="relative w-full h-full">
        <Map
          mapTypeId={toGoogleMapTypeId(mapType)}
          center={center}
          zoom={map.zoom}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          fullscreenControl
          clickableIcons={false}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <Marker position={center} title={map.buildingName} />
        </Map>
        <MapTypeControl mapType={mapType} onChange={setMapType} />
      </div>
    </APIProvider>
  );
}
