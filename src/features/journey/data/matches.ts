import {
  addMinutes24,
  estimateDistanceKm,
  estimateDurationMinutes,
  estimateFare,
  estimateSavings,
  formatTime12h,
} from "@/features/journey/lib/geo";
import { getLocation } from "@/features/journey/data/locations";
import type { JourneyPlanQuery, MatchKind, MatchOption } from "@/features/journey/types";

/**
 * The literal scenario from the product brief: Mohammed dropped a
 * passenger near Bhatkal earlier this morning and, instead of
 * driving the 190km back to Mangalore empty, ReturnGo already has
 * two verified passengers waiting for exactly that leg. This is
 * the canonical demonstration of the hero mechanic, so it's
 * hand-authored rather than generated.
 */
const heroMatch: MatchOption = {
  id: "curated::return::bhatkal::mangalore-airport",
  kind: "return",
  badge: "Return Journey",
  headline: "Best Match",
  rating: 5,
  originId: "bhatkal",
  destinationId: "mangalore-airport",
  pickupNote: "Bhatkal Bus Stand, 200m from NH66 junction",
  dropNote: "Mangalore Airport, Departures kerb",
  departure: "6:45 AM",
  distanceKm: 190,
  durationMinutes: 230,
  fare: 950,
  oneWayReferenceFare: 1400,
  estimatedSavings: 450,
  seatsAvailable: 3,
  seatsTotal: 4,
  driver: {
    name: "Mohammed Ashfaq",
    rating: 4.9,
    completedJourneys: 612,
    vehicle: "Toyota Innova Crysta",
    vehiclePlate: "KA-19-B-4021",
  },
  timeline: [
    { time: "5:50 AM", label: "Arrived in Bhatkal", detail: "Dropped an earlier passenger near the bus stand — this return leg was about to run empty." },
    { time: "6:45 AM", label: "Pickup at Bhatkal", detail: "Boarding begins for passengers travelling toward Mangalore Airport." },
    { time: "10:35 AM", label: "Arrival at Mangalore Airport", detail: "Estimated arrival with a comfortable buffer before domestic departures." },
  ],
  benefits: [
    "Fare is fixed before you board — no negotiation at pickup.",
    "Mohammed is verified: RC, licence and photo ID reviewed by ReturnGo.",
    "You're filling a leg that was going to run empty either way — that's the ₹450 saving.",
  ],
};

const sharedMatch: MatchOption = {
  id: "curated::shared::bhatkal::mangalore-airport",
  kind: "shared",
  badge: "Shared Ride",
  headline: "Travelling Together",
  rating: 4.7,
  originId: "bhatkal",
  destinationId: "mangalore-airport",
  pickupNote: "Bhatkal NH66 junction",
  dropNote: "Mangalore Airport, Departures kerb",
  departure: "7:30 AM",
  distanceKm: 190,
  durationMinutes: 225,
  fare: 1180,
  oneWayReferenceFare: 1400,
  estimatedSavings: 220,
  seatsAvailable: 2,
  seatsTotal: 4,
  driver: {
    name: "Vishwas Shetty",
    rating: 4.8,
    completedJourneys: 349,
    vehicle: "Maruti Suzuki Ertiga",
    vehiclePlate: "KA-19-C-7714",
  },
  timeline: [
    { time: "7:30 AM", label: "Pickup at Bhatkal", detail: "A dedicated departure — not a return leg, but already carrying two other passengers to the airport." },
    { time: "11:15 AM", label: "Arrival at Mangalore Airport", detail: "Estimated arrival with buffer for domestic departures." },
  ],
  benefits: [
    "Lower fare than a direct taxi by splitting the trip three ways.",
    "Fixed departure time — useful if you can't wait for a return-leg match.",
  ],
};

const directMatch: MatchOption = {
  id: "curated::direct::bhatkal::mangalore-airport",
  kind: "direct",
  badge: "Direct Taxi",
  headline: "Dedicated Vehicle",
  rating: 4.6,
  originId: "bhatkal",
  destinationId: "mangalore-airport",
  pickupNote: "Your doorstep in Bhatkal",
  dropNote: "Mangalore Airport, Departures kerb",
  departure: "Any time you choose",
  distanceKm: 190,
  durationMinutes: 220,
  fare: 1400,
  oneWayReferenceFare: 1400,
  estimatedSavings: 0,
  seatsAvailable: 4,
  seatsTotal: 4,
  driver: {
    name: "Prakash Achar",
    rating: 4.6,
    completedJourneys: 208,
    vehicle: "Toyota Etios",
    vehiclePlate: "KA-30-A-2290",
  },
  timeline: [
    { time: "Your choice", label: "Doorstep pickup in Bhatkal", detail: "No other passengers, no shared schedule — the vehicle is dedicated to your trip." },
    { time: "~3 hr 40 min later", label: "Arrival at Mangalore Airport", detail: "Duration depends on your chosen departure time and traffic." },
  ],
  benefits: [
    "No coordination with other passengers — leaves exactly when you do.",
    "Best fit for red-eye flights or odd hours outside normal corridor traffic.",
  ],
};

const rentalMatch: MatchOption = {
  id: "curated::rental::bhatkal::mangalore-airport",
  kind: "rental",
  badge: "Rental Option",
  headline: "Self-Drive",
  rating: 4.5,
  originId: "bhatkal",
  destinationId: "mangalore-airport",
  pickupNote: "ReturnGo partner garage, Bhatkal",
  dropNote: "Drop anywhere in the Mangalore–Udupi corridor",
  departure: "Pick up any time",
  distanceKm: 190,
  durationMinutes: 210,
  fare: 2600,
  oneWayReferenceFare: 1400,
  estimatedSavings: 0,
  seatsAvailable: 4,
  seatsTotal: 4,
  driver: {
    name: "Coastal Self-Drive Rentals",
    rating: 4.5,
    completedJourneys: 1140,
    vehicle: "Maruti Suzuki Dzire",
    vehiclePlate: "KA-30-D-5510",
  },
  timeline: [
    { time: "Pickup", label: "Vehicle handover in Bhatkal", detail: "ID and licence verification at the partner garage." },
    { time: "Drop-off", label: "Return anywhere on the corridor", detail: "One-way drop fee already included in the quoted price." },
  ],
  benefits: [
    "Useful if your onward plans in Mangalore are unpredictable.",
    "₹2,600 flat for up to 2 days, fuel excluded.",
  ],
};

const curatedRoutes: Record<string, MatchOption[]> = {
  "bhatkal::mangalore-airport": [heroMatch, sharedMatch, directMatch, rentalMatch],
};

const DRIVER_POOL = [
  { name: "Ganesh Poojary", vehicle: "Toyota Innova Crysta", plate: "KA-19-B-3312" },
  { name: "Abdul Rasheed", vehicle: "Mahindra Marazzo", plate: "KA-30-C-1187" },
  { name: "Naveen Kotian", vehicle: "Maruti Suzuki Ertiga", plate: "KA-20-A-6642" },
  { name: "Suresh Kulal", vehicle: "Toyota Etios", plate: "KA-19-D-9081" },
  { name: "Ravindra Nayak", vehicle: "Toyota Innova Crysta", plate: "KA-30-B-4456" },
];

function pickDriver(originId: string, destinationId: string, offset: number) {
  const seed = `${originId}${destinationId}`
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return DRIVER_POOL[(seed + offset) % DRIVER_POOL.length];
}

const KIND_COPY: Record<MatchKind, { badge: string; headline: string; pickup: string; drop: string }> = {
  return: { badge: "Return Journey", headline: "Best Match", pickup: "town centre pickup point", drop: "drop near your destination" },
  shared: { badge: "Shared Ride", headline: "Travelling Together", pickup: "town centre pickup point", drop: "drop near your destination" },
  direct: { badge: "Direct Taxi", headline: "Dedicated Vehicle", pickup: "your doorstep", drop: "your exact destination" },
  rental: { badge: "Rental Option", headline: "Self-Drive", pickup: "nearest ReturnGo partner garage", drop: "flexible drop-off" },
};

function buildGenericMatch(
  kind: MatchKind,
  originId: string,
  destinationId: string,
  preferredTime: string,
  offset: number,
): MatchOption {
  const distanceKm = estimateDistanceKm(originId, destinationId);
  const durationMinutes = estimateDurationMinutes(distanceKm);
  const fare = estimateFare(distanceKm, kind);
  const savings = estimateSavings(distanceKm, kind);
  const copy = KIND_COPY[kind];
  const driver = pickDriver(originId, destinationId, offset);
  const originName = getLocation(originId)?.name ?? "your origin";
  const destinationName = getLocation(destinationId)?.name ?? "your destination";
  // Kept in 24h form for arithmetic; only formatted to a 12h clock at display time.
  const departure24 = addMinutes24(preferredTime, offset * 20);
  const departureDisplay = formatTime12h(departure24);

  return {
    id: `generic::${kind}::${originId}::${destinationId}::${preferredTime}`,
    kind,
    badge: copy.badge,
    headline: copy.headline,
    rating: 4.5 + (offset % 3) * 0.15,
    originId,
    destinationId,
    pickupNote: `${originName} — ${copy.pickup}`,
    dropNote: `${destinationName} — ${copy.drop}`,
    departure: kind === "direct" ? "Any time you choose" : kind === "rental" ? "Pick up any time" : departureDisplay,
    distanceKm,
    durationMinutes,
    fare,
    oneWayReferenceFare: estimateFare(distanceKm, "direct"),
    estimatedSavings: savings,
    seatsAvailable: kind === "direct" || kind === "rental" ? 4 : 4 - ((offset % 2) + 1),
    seatsTotal: 4,
    driver: {
      name: driver.name,
      rating: 4.6 + (offset % 4) * 0.1,
      completedJourneys: 180 + offset * 47,
      vehicle: driver.vehicle,
      vehiclePlate: driver.plate,
    },
    timeline:
      kind === "return"
        ? [
            { time: formatTime12h(addMinutes24(departure24, -55)), label: `Arrived in ${originName}`, detail: "Dropped an earlier passenger — this return leg was about to run empty." },
            { time: departureDisplay, label: `Pickup at ${originName}`, detail: "Boarding opens for passengers heading your way." },
            { time: formatTime12h(addMinutes24(departure24, durationMinutes)), label: `Arrival at ${destinationName}`, detail: "Estimated arrival based on current corridor conditions." },
          ]
        : [
            { time: kind === "direct" || kind === "rental" ? "Your choice" : departureDisplay, label: `Pickup at ${originName}`, detail: copy.pickup },
            { time: `~${Math.round(durationMinutes / 5) * 5} min later`, label: `Arrival at ${destinationName}`, detail: copy.drop },
          ],
    benefits:
      kind === "return"
        ? [
            "Fare is fixed before you board — no negotiation at pickup.",
            "You're filling a leg that was going to run empty either way.",
          ]
        : kind === "shared"
          ? ["Lower fare than a direct taxi by sharing the trip.", "Fixed departure time."]
          : kind === "direct"
            ? ["No coordination with other passengers.", "Leaves exactly when you do."]
            : ["Flexible drop-off anywhere on the corridor.", "Best for unpredictable onward plans."],
  };
}

/**
 * Deterministic fallback for any origin/destination pair that
 * isn't hand-curated — always returns the same four-card shape
 * (return, shared, direct, rental) so the results screen never
 * looks empty or inconsistent between reloads.
 */
function buildGenericRoute(originId: string, destinationId: string, preferredTime: string): MatchOption[] {
  return [
    buildGenericMatch("return", originId, destinationId, preferredTime, 0),
    buildGenericMatch("shared", originId, destinationId, preferredTime, 1),
    buildGenericMatch("direct", originId, destinationId, preferredTime, 2),
    buildGenericMatch("rental", originId, destinationId, preferredTime, 3),
  ];
}

export function getMatchesForQuery(query: JourneyPlanQuery): MatchOption[] {
  const forward = `${query.originId}::${query.destinationId}`;
  const reverse = `${query.destinationId}::${query.originId}`;

  if (curatedRoutes[forward]) return curatedRoutes[forward];
  if (curatedRoutes[reverse]) {
    return curatedRoutes[reverse].map((match) => ({
      ...match,
      id: match.id.replace(reverse, forward),
      originId: query.originId,
      destinationId: query.destinationId,
    }));
  }

  return buildGenericRoute(query.originId, query.destinationId, query.time || "08:00");
}

export function getMatchById(id: string): MatchOption | undefined {
  for (const route of Object.values(curatedRoutes)) {
    const found = route.find((match) => match.id === id);
    if (found) return found;
  }

  const parts = id.split("::");
  if (parts[0] !== "generic" || parts.length !== 5) return undefined;
  const [, kind, originId, destinationId, preferredTime] = parts;
  if (!getLocation(originId) || !getLocation(destinationId)) return undefined;

  const route = buildGenericRoute(originId, destinationId, preferredTime);
  return route.find((match) => match.kind === kind);
}
