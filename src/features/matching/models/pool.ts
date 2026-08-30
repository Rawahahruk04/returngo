import { getLocation } from "@/features/journey/data/locations";
import { addMinutes24, nearestNeighbour } from "@/features/matching/utils/geo";
import { hashSeed, seededPick, seededRange } from "@/features/matching/utils/seed";
import type { MatchCategory, MatchDriverInfo, PoolJourney } from "@/features/matching/types";

/**
 * The regional "supply" ReturnGo already knows about — drivers mid-route,
 * shared departures with confirmed seats, and flexible-window journeys.
 * Generated deterministically per route (see `utils/seed.ts`); nothing
 * here is fetched or random, so a request always sees the same pool.
 */
const DRIVER_POOL: MatchDriverInfo[] = [
  { name: "Mohammed Ashfaq", rating: 4.9, completedJourneys: 612, vehicle: "Toyota Innova Crysta", vehiclePlate: "KA-19-B-4021" },
  { name: "Vishwas Shetty", rating: 4.8, completedJourneys: 349, vehicle: "Maruti Suzuki Ertiga", vehiclePlate: "KA-19-C-7714" },
  { name: "Ganesh Poojary", rating: 4.7, completedJourneys: 288, vehicle: "Toyota Innova Crysta", vehiclePlate: "KA-19-B-3312" },
  { name: "Abdul Rasheed", rating: 4.6, completedJourneys: 204, vehicle: "Mahindra Marazzo", vehiclePlate: "KA-30-C-1187" },
  { name: "Naveen Kotian", rating: 4.8, completedJourneys: 417, vehicle: "Maruti Suzuki Ertiga", vehiclePlate: "KA-20-A-6642" },
  { name: "Prakash Achar", rating: 4.6, completedJourneys: 208, vehicle: "Toyota Etios", vehiclePlate: "KA-30-A-2290" },
];

const RENTAL_PARTNER: MatchDriverInfo = {
  name: "Coastal Self-Drive Rentals",
  rating: 4.5,
  completedJourneys: 1140,
  vehicle: "Maruti Suzuki Dzire",
  vehiclePlate: "KA-30-D-5510",
};

function driverFor(seed: number, offset: number): MatchDriverInfo {
  return seededPick(DRIVER_POOL, seed, offset);
}

/**
 * Builds one candidate `PoolJourney` per match category for a given
 * route + preferred time. Every field is derived from `routeSeed`, so
 * re-running the same request regenerates byte-identical supply.
 */
export function generatePool(originId: string, destinationId: string, preferredTime: string): PoolJourney[] {
  const routeSeed = hashSeed(`${originId}::${destinationId}`);
  const originName = getLocation(originId)?.name ?? "the pickup town";

  const journeys: PoolJourney[] = [];

  // Return leg: a driver already en route back through this corridor,
  // having dropped an earlier passenger nearby. Departs slightly ahead
  // of the request so the passenger boards, not waits for a cold start.
  const returnDeparture = addMinutes24(preferredTime, -seededRange(routeSeed, 1, 5, 25));
  journeys.push({
    id: `pool::return::${originId}::${destinationId}`,
    category: "return",
    driver: driverFor(routeSeed, 0),
    originId,
    destinationId,
    departureTime: returnDeparture,
    flexibilityMinutes: 20,
    seatsTotal: 4,
    seatsConfirmed: seededRange(routeSeed, 2, 0, 1),
    arrivedAt: addMinutes24(returnDeparture, -seededRange(routeSeed, 3, 35, 70)),
    context: `Dropped an earlier passenger near ${originName} and was about to head back with an empty vehicle.`,
  });

  // Shared journey: a dedicated departure that already has confirmed
  // passengers travelling the same leg.
  journeys.push({
    id: `pool::shared::${originId}::${destinationId}`,
    category: "shared",
    driver: driverFor(routeSeed, 1),
    originId,
    destinationId,
    departureTime: addMinutes24(preferredTime, seededRange(routeSeed, 4, 15, 60)),
    flexibilityMinutes: 15,
    seatsTotal: 4,
    seatsConfirmed: seededRange(routeSeed, 5, 1, 2),
    context: "A scheduled departure on this route, already carrying other confirmed passengers.",
  });

  // Nearby flexible: same destination, a pickup point one corridor
  // town away from the requested origin, with a wider departure window.
  const neighbour = nearestNeighbour(originId);
  journeys.push({
    id: `pool::nearby-flexible::${originId}::${destinationId}`,
    category: "nearby-flexible",
    driver: driverFor(routeSeed, 2),
    originId: neighbour?.id ?? originId,
    destinationId,
    departureTime: addMinutes24(preferredTime, seededRange(routeSeed, 6, -45, 45)),
    flexibilityMinutes: 60,
    seatsTotal: 4,
    seatsConfirmed: seededRange(routeSeed, 7, 0, 2),
    context: neighbour
      ? `A journey departing from ${neighbour.name}, ${neighbour.distanceKm}km from your pickup point, on a flexible schedule.`
      : "A nearby journey on a flexible departure window.",
  });

  // Direct taxi: always available, no coordination, departs on demand.
  journeys.push({
    id: `pool::direct::${originId}::${destinationId}`,
    category: "direct",
    driver: driverFor(routeSeed, 3),
    originId,
    destinationId,
    departureTime: preferredTime,
    flexibilityMinutes: 0,
    seatsTotal: 4,
    seatsConfirmed: 0,
    context: "A dedicated vehicle with no other passengers, leaving whenever you're ready.",
  });

  // Rental: self-drive, always available.
  journeys.push({
    id: `pool::rental::${originId}::${destinationId}`,
    category: "rental",
    driver: RENTAL_PARTNER,
    originId,
    destinationId,
    departureTime: preferredTime,
    flexibilityMinutes: 720,
    seatsTotal: 4,
    seatsConfirmed: 0,
    context: "A self-drive vehicle available from the nearest ReturnGo partner garage.",
  });

  const categoryOrder: MatchCategory[] = ["return", "shared", "nearby-flexible", "direct", "rental"];
  return journeys.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
}
