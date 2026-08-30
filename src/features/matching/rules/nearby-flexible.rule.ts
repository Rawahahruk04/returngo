import { getLocation } from "@/features/journey/data/locations";
import { buildCandidate } from "@/features/matching/rules/build-candidate";
import type { MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";

/**
 * Third priority: a journey that doesn't start exactly at the
 * requested origin or exactly at the requested time, but is close
 * enough on both axes to be worth surfacing — trades a short pickup
 * walk for a materially better fare than a direct taxi.
 */
export function matchNearbyFlexible(request: MatchRequest, journey: PoolJourney): MatchResult {
  const originName = getLocation(journey.originId)?.name ?? "a nearby pickup point";
  const destinationName = getLocation(journey.destinationId)?.name ?? "your destination";
  const requestedOriginName = getLocation(request.originId)?.name ?? "your requested pickup";

  return buildCandidate("nearby-flexible", request, journey, {
    headline: "Nearby & Flexible",
    pickupNote: `${originName} — alternative pickup point near ${requestedOriginName}`,
    dropNote: `${destinationName} — drop near your destination`,
    driverBenefit: "Picks up an additional passenger with a small pickup detour instead of running the leg alone.",
    passengerBenefit: "A meaningfully lower fare than a direct taxi, in exchange for a short walk to pickup.",
    howGenerated: `No journey matched your exact origin and time, so the engine widened the search to nearby pickup points and a flexible departure window, and found this one at ${originName}.`,
    returnJourneyBenefit: "Not a return leg — a nearby journey adjusted to fit your route.",
  });
}
