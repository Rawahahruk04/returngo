import { generatePool } from "@/features/matching/models/pool";
import { matchDirectTaxi, matchNearbyFlexible, matchRental, matchReturnJourney, matchSharedJourney } from "@/features/matching/rules";
import { MATCH_CATEGORY_PRIORITY } from "@/features/matching/types";
import type { MatchEngineOutput, MatchRequest, MatchResult, RegionalImpactSummary } from "@/features/matching/types";

const RULE_BY_CATEGORY = {
  return: matchReturnJourney,
  shared: matchSharedJourney,
  "nearby-flexible": matchNearbyFlexible,
  direct: matchDirectTaxi,
  rental: matchRental,
} as const;

/**
 * RANKING
 * ================
 * Results are sorted tier-first: category priority (return > shared >
 * nearby-flexible > direct > rental, `MATCH_CATEGORY_PRIORITY`) always
 * wins, and the weighted Match Score (see `scoring/weights.ts`) only
 * breaks ties *within* a tier. This guarantees the product's stated
 * priority order holds even though the score formula also folds
 * category into its weighting — the tier sort is the hard guarantee,
 * the score is the transparent "why this one, of this tier" signal.
 */
export function runMatchEngine(request: MatchRequest): MatchEngineOutput {
  const preferredTime = request.time || "08:00";
  const pool = generatePool(request.originId, request.destinationId, preferredTime);

  const candidates: MatchResult[] = pool.map((journey) => RULE_BY_CATEGORY[journey.category](request, journey));

  const ranked = candidates
    .sort((a, b) => {
      const tierDiff = MATCH_CATEGORY_PRIORITY.indexOf(a.category) - MATCH_CATEGORY_PRIORITY.indexOf(b.category);
      if (tierDiff !== 0) return tierDiff;
      return b.score.total - a.score.total;
    })
    .map((result, index) => ({ ...result, rank: index + 1 }));

  return {
    request,
    results: ranked,
    regionalImpact: aggregateImpact(ranked),
  };
}

function aggregateImpact(results: MatchResult[]): RegionalImpactSummary {
  const totals = results.reduce(
    (sum, result) => ({
      passengersCoordinated: sum.passengersCoordinated + result.impact.passengersCoordinated,
      driverRevenueIncreasedRupees: sum.driverRevenueIncreasedRupees + result.impact.driverRevenueIncreasedRupees,
      fuelSavedLitres: sum.fuelSavedLitres + result.impact.fuelSavedLitres,
      emptyKmPrevented: sum.emptyKmPrevented + result.impact.emptyKmPrevented,
      carbonSavedKg: sum.carbonSavedKg + result.impact.carbonSavedKg,
    }),
    { passengersCoordinated: 0, driverRevenueIncreasedRupees: 0, fuelSavedLitres: 0, emptyKmPrevented: 0, carbonSavedKg: 0 },
  );

  const returnMatch = results.find((r) => r.category === "return");
  const communityImpactNote = returnMatch
    ? returnMatch.impact.communityImpactNote
    : "No return leg available for this route yet — coordinated options still reduce the number of vehicles needed.";

  return { ...totals, communityImpactNote };
}

export function requestFromSearchParams(params: {
  originId: string;
  destinationId: string;
  date: string;
  time: string;
  passengers: number;
  journeyType: MatchRequest["journeyType"];
  flexibleDeparture: boolean;
}): MatchRequest {
  return { ...params };
}
