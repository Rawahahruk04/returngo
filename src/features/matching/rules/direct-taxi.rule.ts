import { buildCandidate } from "@/features/matching/rules/build-candidate";
import type { MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";

/**
 * Fourth priority: the always-available fallback. No coordination
 * with other passengers, so it carries none of the shared-savings or
 * empty-km-prevented benefits the coordinated categories do.
 */
export function matchDirectTaxi(request: MatchRequest, journey: PoolJourney): MatchResult {
  return buildCandidate("direct", request, journey, {
    headline: "Dedicated Vehicle",
    pickupNote: "Your doorstep",
    dropNote: "Your exact destination",
    driverBenefit: "A standard, uncoordinated fare for a single dedicated trip.",
    passengerBenefit: "No coordination with anyone else — leaves exactly when you do.",
    howGenerated: "No coordinated match fit your window, or you preferred a dedicated vehicle — the engine falls back to a standard direct fare so results are never empty.",
    returnJourneyBenefit: "Not a return leg — a dedicated vehicle assigned solely to this trip.",
  });
}
