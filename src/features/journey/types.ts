/**
 * The vocabulary of the passenger journey flow. `MatchKind` mirrors
 * the four card types called for in Smart Matches — a return-leg
 * match is the hero mechanic; the other three exist so the network
 * never shows an empty results screen when no return leg fits.
 */
export type JourneyType = "airport" | "hospital" | "intercity" | "rental";

export type LocationCategory = "town" | "airport" | "hospital";

export type Location = {
  id: string;
  name: string;
  category: LocationCategory;
  /** Position in km along the Goa-to-Mangalore corridor; used to estimate distance between any two locations. */
  corridorKm: number;
};

export type MatchKind = "return" | "shared" | "direct" | "rental";

export type Driver = {
  name: string;
  rating: number;
  completedJourneys: number;
  vehicle: string;
  vehiclePlate: string;
};

export type TimelineStep = {
  label: string;
  detail: string;
  time: string;
};

export type MatchOption = {
  id: string;
  kind: MatchKind;
  badge: string;
  headline: string;
  rating: number;
  originId: string;
  destinationId: string;
  pickupNote: string;
  dropNote: string;
  departure: string;
  distanceKm: number;
  durationMinutes: number;
  fare: number;
  oneWayReferenceFare: number;
  estimatedSavings: number;
  seatsAvailable: number;
  seatsTotal: number;
  driver: Driver;
  timeline: TimelineStep[];
  benefits: string[];
};

export type JourneyPlanQuery = {
  originId: string;
  destinationId: string;
  date: string;
  time: string;
  passengers: number;
  journeyType: JourneyType;
  flexible: boolean;
};
