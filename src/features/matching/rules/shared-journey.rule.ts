import { getLocation } from "@/features/journey/data/locations";
import { buildCandidate } from "@/features/matching/rules/build-candidate";
import type { MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";

/**
 * Second priority: a dedicated departure already scheduled on this
 * route with other confirmed passengers. Not a return leg, so it
 * carries no "empty km prevented" credit, but it still splits cost
 * and road capacity across more than one passenger.
 */
export function matchSharedJourney(request: MatchRequest, journey: PoolJourney): MatchResult {
  const originName = getLocation(journey.originId)?.name ?? "the pickup point";
  const destinationName = getLocation(journey.destinationId)?.name ?? "your destination";

  return buildCandidate("shared", request, journey, {
    headline: "Travelling Together",
    pickupNote: `${originName} — town centre pickup point`,
    dropNote: `${destinationName} — drop near your destination`,
    driverBenefit: `Fills an additional seat on a trip that's already running, raising revenue per km.`,
    passengerBenefit: "A fixed departure time, at a lower fare than a dedicated vehicle.",
    howGenerated: `This departure already has ${journey.seatsConfirmed} confirmed passenger${journey.seatsConfirmed === 1 ? "" : "s"} heading the same way — the engine added your request to the same vehicle instead of opening a new one.`,
    returnJourneyBenefit: "Not a return leg — this is a dedicated departure shared across passengers.",
  });
}
