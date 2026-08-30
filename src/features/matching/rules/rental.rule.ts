import { buildCandidate } from "@/features/matching/rules/build-candidate";
import type { MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";

/**
 * Fifth priority: self-drive. Ranked last because it removes ReturnGo's
 * coordination entirely — useful when the passenger's onward plans are
 * unpredictable, but it has no shared-savings or impact story.
 */
export function matchRental(request: MatchRequest, journey: PoolJourney): MatchResult {
  return buildCandidate("rental", request, journey, {
    headline: "Self-Drive",
    pickupNote: "Nearest ReturnGo partner garage",
    dropNote: "Flexible drop-off anywhere on the corridor",
    driverBenefit: "Fixed rental revenue for the partner garage, independent of passenger coordination.",
    passengerBenefit: "Full control of the route and schedule, useful for unpredictable onward plans.",
    howGenerated: "Shown as the always-available self-drive fallback, regardless of what else matched.",
    returnJourneyBenefit: "Not applicable — a self-drive rental, not a coordinated journey.",
  });
}
