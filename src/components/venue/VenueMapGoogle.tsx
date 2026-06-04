'use client';

import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import {
  DEFAULT_VENUE_MAP_TYPE,
  toGoogleMapTypeId,
  VENUE_MAP_TYPE_OPTIONS,
  type VenueMapType,
} from '@/lib/venue-map-embed';
import type { VenueMapInfo, VenueDirectionStep } from '@/types/venue-directions';

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

/**
 * Custom Polyline component that renders a route path connecting the milestones.
 */
function MapPath({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const google = (window as any).google;
    if (!google || !google.maps) return;

    const path = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    path.setMap(map);

    return () => {
      path.setMap(null);
    };
  }, [map, points]);

  return null;
}

export function VenueMapGoogle({
  map,
  apiKey,
  steps = [],
}: {
  map: VenueMapInfo;
  apiKey: string;
  steps?: VenueDirectionStep[];
}) {
  const [mapType, setMapType] = useState<VenueMapType>(DEFAULT_VENUE_MAP_TYPE);
  const [selectedStep, setSelectedStep] = useState<VenueDirectionStep | null>(null);

  const center = { lat: map.latitude, lng: map.longitude };

  // Filter steps to get milestones with valid coordinates
  const milestones = steps.filter(
    (step) => step.latitude !== undefined && step.longitude !== undefined
  ) as (VenueDirectionStep & { latitude: number; longitude: number })[];

  // Coordinates array for drawing the route polyline path
  const pathPoints = milestones.map((m) => ({ lat: m.latitude, lng: m.longitude }));

  const mapRef = useMap();

  // Automatically adjust map boundaries to fit all milestones and the destination
  useEffect(() => {
    if (!mapRef || milestones.length === 0) return;

    const google = (window as any).google;
    if (!google || !google.maps) return;

    const bounds = new google.maps.LatLngBounds();
    // Extend bounds for destination center
    bounds.extend(center);
    // Extend bounds for all steps
    milestones.forEach((m) => {
      bounds.extend({ lat: m.latitude, lng: m.longitude });
    });

    // Fit map bounds with padding
    mapRef.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });
  }, [mapRef, milestones, center]);

  return (
    <APIProvider apiKey={apiKey} language="en" region="LK">
      <div className="relative w-full h-full">
        <Map
          mapTypeId={toGoogleMapTypeId(mapType)}
          defaultCenter={center}
          defaultZoom={map.zoom}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          fullscreenControl
          clickableIcons={false}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Main Destination Marker */}
          <Marker position={center} title={map.buildingName} />

          {/* Numbered Milestone Markers for each Step */}
          {milestones.map((step) => (
            <Marker
              key={step.id}
              position={{ lat: step.latitude, lng: step.longitude }}
              title={step.landmark}
              label={{
                text: String(step.order),
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
              onClick={() => setSelectedStep(step)}
            />
          ))}

          {/* InfoWindow displaying step thumbnail image and instructions */}
          {selectedStep && selectedStep.latitude !== undefined && selectedStep.longitude !== undefined && (
            <InfoWindow
              position={{ lat: selectedStep.latitude, lng: selectedStep.longitude }}
              onCloseClick={() => setSelectedStep(null)}
            >
              <div className="text-slate-900 text-xs p-1.5 max-w-[220px]">
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                    {selectedStep.order}
                  </span>
                  {selectedStep.landmark}
                </h4>
                {selectedStep.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedStep.image}
                    alt={selectedStep.landmark}
                    className="w-full h-24 object-cover my-1.5 rounded-lg border border-slate-200"
                  />
                )}
                <p className="text-[10px] text-slate-600 leading-relaxed">{selectedStep.instruction}</p>
                {selectedStep.tip && (
                  <p className="text-[9px] text-blue-600 font-mono mt-1 leading-normal italic">
                    💡 Tip: {selectedStep.tip}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}

          {/* Route path line connecting the milestones */}
          <MapPath points={pathPoints} />
        </Map>
        <MapTypeControl mapType={mapType} onChange={setMapType} />
      </div>
    </APIProvider>
  );
}
