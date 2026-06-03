export interface VenueDirectionStep {
  id: string;
  order: number;
  landmark: string;
  instruction: string;
  image: string;
  tip?: string;
}

export interface VenueMapInfo {
  buildingName: string;
  address: string;
  /** Google Maps place reference from the shared pin link */
  placeId: string;
  latitude: number;
  longitude: number;
  zoom: number;
  googleMapsUrl: string;
  /** Optional override for the iframe src */
  embedUrl?: string;
}

export interface VenueDirectionsData {
  title: string;
  subtitle: string;
  destination: {
    name: string;
    description: string;
  };
  map: VenueMapInfo;
  steps: VenueDirectionStep[];
}
