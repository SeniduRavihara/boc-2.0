import type { VenueMapInfo } from '@/types/venue-directions';

export type VenueMapType = 'roadmap' | 'hybrid';

export const VENUE_MAP_TYPE_OPTIONS: { id: VenueMapType; label: string }[] = [
  { id: 'roadmap', label: 'Map' },
  { id: 'hybrid', label: 'Satellite' },
];

export const DEFAULT_VENUE_MAP_TYPE: VenueMapType = 'roadmap';

export function toGoogleMapTypeId(type: VenueMapType): google.maps.MapTypeId {
  return type as google.maps.MapTypeId;
}

/** Legacy iframe fallback when the JavaScript API key is not configured. */
export function buildVenueMapIframeFallbackUrl(map: VenueMapInfo): string {
  if (map.embedUrl) return map.embedUrl;
  const { latitude, longitude, zoom } = map;
  return `https://maps.google.com/maps?ll=${latitude},${longitude}&hl=en&z=${zoom}&t=h&output=embed`;
}
