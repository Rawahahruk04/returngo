import { getLocation } from "@/features/journey/data/locations";
import { buildCandidate } from "@/features/matching/rules/build-candidate";
import type { MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";

/**
 * Highest-priority rule: a driver already returning through this
 * corridor empty. This is ReturnGo's hero mechanic — it never costs
 * the driver an extra km, so it's the cheapest fare and the largest
 * carbon/impact number of any category.
 */
export function matchReturnJourney(request: MatchRequest, journey: PoolJourney): MatchResult {
  const originName = getLocation(journey.originId)?.name ?? "the pickup point";
  const destinationName = getLocation(journey.destinationId)?.name ?? "your destination";

  return buildCandidate("return", request, journey, {
    headline: "Best Match",
    pickupNote: `${originName} — town centre pickup point`,
    dropNote: `${destinationName} — drop near your destination`,
    driverBenefit: "Turns an empty return leg into paid revenue instead of a wasted trip.",
    passengerBenefit: "Lowest fare available, because the vehicle was making this trip either way.",
    howGenerated: `${journey.driver.name} was already heading back through ${originName} with an empty vehicle — the engine matched your request onto that leg instead of dispatching a new trip.`,
    returnJourneyBenefit: `Prevents ${journey.driver.name.split(" ")[0]}'s vehicle from covering this leg with zero passengers.`,
  });
}
