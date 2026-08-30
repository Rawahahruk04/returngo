import { getLocation, locations } from "@/features/journey/data/locations";
import {
  addMinutes24,
  estimateDirectFare,
  estimateDurationMinutes,
  formatTime12h,
} from "@/features/journey/lib/geo";
import type { RoutePoint } from "@/features/matching/types";

/**
 * The only geography ReturnGo's matching engine trusts: the shared
 * corridor position dataset owned by `features/journey`. Duplicating
 * it here would let the two features disagree about where a town is,
 * so it is read, never copied.
 */
export function distanceKmBetween(originId: string, destinationId: string): number {
  const origin = getLocation(originId);
  const destination = getLocation(destinationId);
  if (!origin || !destination) return 0;
  return Math.max(8, Math.abs(destination.corridorKm - origin.corridorKm));
}

export function durationMinutesFor(distanceKm: number): number {
  return estimateDurationMinutes(distanceKm);
}

export function referenceFareFor(distanceKm: number): number {
  return estimateDirectFare(distanceKm);
}

/** Absolute minutes between two `HH:MM` 24h times, ignoring day wraparound direction. */
export function minutesBetween(timeA: string, timeB: string): number {
  const [ah, am] = timeA.split(":").map(Number);
  const [bh, bm] = timeB.split(":").map(Number);
  return Math.abs(ah * 60 + am - (bh * 60 + bm));
}

export { addMinutes24, formatTime12h };

/**
 * Builds the ordered stop list a stylized route visualization draws:
 * origin, any intermediate corridor towns strictly between the two
 * endpoints, then the destination — sorted by corridor position so
 * the line always reads geographically left-to-right.
 */
export function buildRoutePoints(originId: string, destinationId: string, pickupId?: string): RoutePoint[] {
  const origin = getLocation(originId);
  const destination = getLocation(destinationId);
  if (!origin || !destination) return [];

  const lowKm = Math.min(origin.corridorKm, destination.corridorKm);
  const highKm = Math.max(origin.corridorKm, destination.corridorKm);

  const stops = locations
    .filter((loc) => loc.id !== originId && loc.id !== destinationId)
    .filter((loc) => loc.corridorKm > lowKm && loc.corridorKm < highKm)
    .sort((a, b) => a.corridorKm - b.corridorKm)
    .slice(0, 2)
    .map((loc) => ({ id: loc.id, name: loc.name, role: "stop" as const, corridorKm: loc.corridorKm }));

  const points: RoutePoint[] = [
    { id: origin.id, name: origin.name, role: "origin", corridorKm: origin.corridorKm },
    ...stops,
    { id: destination.id, name: destination.name, role: "destination", corridorKm: destination.corridorKm },
  ];

  if (pickupId && pickupId !== originId) {
    const pickup = getLocation(pickupId);
    if (pickup) points.unshift({ id: pickup.id, name: pickup.name, role: "pickup", corridorKm: pickup.corridorKm });
  }

  return points.sort((a, b) => a.corridorKm - b.corridorKm);
}

/** The nearest corridor neighbour of `locationId`, used as an alternative pickup point suggestion. */
export function nearestNeighbour(locationId: string): { id: string; name: string; distanceKm: number } | undefined {
  const origin = getLocation(locationId);
  if (!origin) return undefined;
  const candidate = locations
    .filter((loc) => loc.id !== locationId)
    .map((loc) => ({ loc, distanceKm: Math.abs(loc.corridorKm - origin.corridorKm) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
  if (!candidate) return undefined;
  return { id: candidate.loc.id, name: candidate.loc.name, distanceKm: candidate.distanceKm };
}
