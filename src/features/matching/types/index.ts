/**
 * The ReturnGo Match Engine's vocabulary. This module is intentionally
 * decoupled from `features/journey` — it only reads the shared location
 * corridor dataset (`journey/data/locations`) and generic time/fare math
 * (`journey/lib/geo`) as reference geography, never journey business logic.
 *
 * `MatchCategory` order below is significant: it is the fixed priority
 * tier used by the engine's ranking step (see `engine/match-engine.ts`).
 */
export type MatchCategory = "return" | "shared" | "nearby-flexible" | "direct" | "rental";

export const MATCH_CATEGORY_PRIORITY: MatchCategory[] = [
  "return",
  "shared",
  "nearby-flexible",
  "direct",
  "rental",
];

export type MatchDriverInfo = {
  name: string;
  rating: number;
  completedJourneys: number;
  vehicle: string;
  vehiclePlate: string;
};

/**
 * A request coming from the passenger. Deliberately shaped like
 * `JourneyPlanQuery` but kept as its own type so the matching module
 * never depends on `features/journey`'s type surface directly.
 */
export type MatchRequest = {
  originId: string;
  destinationId: string;
  date: string;
  /** 24h `HH:MM`, defaults handled by the caller. */
  time: string;
  passengers: number;
  journeyType: "airport" | "hospital" | "intercity" | "rental";
  flexibleDeparture: boolean;
};

/**
 * Supply-side record: a journey already in motion or scheduled in the
 * region, which candidate-generation rules match against a request.
 * Generated deterministically per route — see `models/pool.ts`.
 */
export type PoolJourney = {
  id: string;
  category: MatchCategory;
  driver: MatchDriverInfo;
  originId: string;
  destinationId: string;
  /** 24h `HH:MM`. */
  departureTime: string;
  /** How far this journey's departure can shift and still be viable. */
  flexibilityMinutes: number;
  seatsTotal: number;
  seatsConfirmed: number;
  /**
   * For `return` journeys: when the driver arrived, framed as the
   * moment the empty leg would otherwise have started.
   */
  arrivedAt?: string;
  /** Grounds the "why am I seeing this" copy in a concrete fact. */
  context: string;
};

export type ScoreFactor = {
  key: "category" | "timeFit" | "costEfficiency" | "occupancy" | "reliability";
  label: string;
  weight: number;
  rawScore: number;
  contribution: number;
};

export type MatchScoreBreakdown = {
  total: number;
  factors: ScoreFactor[];
};

export type MatchImpact = {
  passengersCoordinated: number;
  driverRevenueIncreasedRupees: number;
  fuelSavedLitres: number;
  emptyKmPrevented: number;
  carbonSavedKg: number;
  communityImpactNote: string;
};

export type RoutePoint = {
  id: string;
  name: string;
  role: "origin" | "destination" | "stop" | "pickup";
  corridorKm: number;
};

export type MatchDetails = {
  howGenerated: string;
  distanceDifferenceKm: number;
  pickupAdjustmentKm: number;
  travelTimeMinutes: number;
  sharedSavingsRupees: number;
  returnJourneyBenefit: string;
  regionalImpact: string;
};

export type MatchResult = {
  id: string;
  category: MatchCategory;
  rank: number;
  badge: string;
  headline: string;
  score: MatchScoreBreakdown;
  reasons: string[];
  estimatedSavingsRupees: number;
  estimatedWaitMinutes: number;
  occupancy: { seatsConfirmed: number; seatsTotal: number; occupancyRate: number };
  impact: MatchImpact;
  driverBenefit: string;
  passengerBenefit: string;
  distanceKm: number;
  durationMinutes: number;
  fare: number;
  referenceFare: number;
  departureDisplay: string;
  pickupNote: string;
  dropNote: string;
  driver: MatchDriverInfo;
  route: RoutePoint[];
  details: MatchDetails;
};

export type RegionalImpactSummary = {
  passengersCoordinated: number;
  driverRevenueIncreasedRupees: number;
  fuelSavedLitres: number;
  emptyKmPrevented: number;
  carbonSavedKg: number;
  communityImpactNote: string;
};

export type MatchEngineOutput = {
  request: MatchRequest;
  results: MatchResult[];
  regionalImpact: RegionalImpactSummary;
};
