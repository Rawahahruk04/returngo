import { locations } from "@/features/journey/data/locations";
import { addMinutes24, nearestNeighbour } from "@/features/matching/utils/geo";
import { hashSeed, seededPick, seededRange } from "@/features/matching/utils/seed";
import type { MatchRequest } from "@/features/matching/types";

/**
 * Regional passenger "demand" — waiting requests the driver-side of the
 * app matches its supply against. Generated deterministically, same
 * seeding discipline as `models/pool.ts`, so the Driver Workspace and
 * the passenger Match Engine can never disagree about what's real.
 */
export type DemandCluster = {
  id: string;
  label: string;
  pickupId: string;
  destinationId: string;
  count: number;
  requestedTime: string;
  journeyType: MatchRequest["journeyType"];
  flexible: boolean;
};

const PASSENGER_NAME_POOL = [
  "Fathima Nooriya",
  "Suhas Kamath",
  "Deepika Rai",
  "Ibrahim Sait",
  "Ramesh Shenoy",
  "Ananya Pai",
  "Yusuf Kaladgi",
  "Meera Bhat",
];

function labelFor(count: number, seed: number, offset: number): string {
  const lead = seededPick(PASSENGER_NAME_POOL, seed, offset);
  const firstName = lead.split(" ")[0];
  return count === 1 ? firstName : `${firstName} + ${count - 1} more`;
}

/**
 * Demand for a journey's own route — passengers wanting the exact leg
 * a driver published, plus one nearby-pickup variant. Powers Screen 3
 * (Passenger Requests).
 */
export function generateJourneyDemand(
  originId: string,
  destinationId: string,
  journeyType: MatchRequest["journeyType"],
  preferredTime: string,
): DemandCluster[] {
  const seed = hashSeed(`demand::${originId}::${destinationId}::${preferredTime}`);
  const clusters: DemandCluster[] = [];

  const exactCount = seededRange(seed, 0, 1, 3);
  clusters.push({
    id: `demand::exact::${originId}::${destinationId}`,
    label: labelFor(exactCount, seed, 0),
    pickupId: originId,
    destinationId,
    count: exactCount,
    requestedTime: addMinutes24(preferredTime, seededRange(seed, 1, -20, 20)),
    journeyType,
    flexible: false,
  });

  const neighbour = nearestNeighbour(originId);
  if (neighbour) {
    const nearbyCount = seededRange(seed, 2, 1, 2);
    clusters.push({
      id: `demand::nearby::${neighbour.id}::${destinationId}`,
      label: labelFor(nearbyCount, seed, 3),
      pickupId: neighbour.id,
      destinationId,
      count: nearbyCount,
      requestedTime: addMinutes24(preferredTime, seededRange(seed, 4, 10, 45)),
      journeyType,
      flexible: true,
    });
  }

  return clusters;
}

/**
 * Demand for the reverse leg after a journey completes — passengers
 * waiting near the driver's current location, heading back toward
 * (or beyond) where the driver originally came from. Powers Screen 4
 * (Return Opportunity).
 */
export function generateReturnDemand(
  currentLocationId: string,
  headingTowardId: string,
  journeyType: MatchRequest["journeyType"],
  preferredTime: string,
): DemandCluster[] {
  const seed = hashSeed(`return-demand::${currentLocationId}::${headingTowardId}::${preferredTime}`);

  const headingLocation = locations.find((loc) => loc.id === headingTowardId);
  const nearbyDestinations = headingLocation
    ? locations
        .filter((loc) => loc.id !== currentLocationId && loc.id !== headingTowardId)
        .map((loc) => ({ loc, distanceKm: Math.abs(loc.corridorKm - headingLocation.corridorKm) }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 2)
        .map((entry) => entry.loc.id)
    : [];

  const destinationIds = [headingTowardId, ...nearbyDestinations];

  return destinationIds.map((destinationId, index) => {
    const count = seededRange(seed, index, 1, 3);
    return {
      id: `return-demand::${currentLocationId}::${destinationId}`,
      label: labelFor(count, seed, index + 10),
      pickupId: currentLocationId,
      destinationId,
      count,
      requestedTime: addMinutes24(preferredTime, seededRange(seed, index + 5, 10, 50)),
      journeyType,
      flexible: true,
    };
  });
}
