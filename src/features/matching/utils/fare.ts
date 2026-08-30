import { referenceFareFor } from "@/features/matching/utils/geo";
import type { MatchCategory } from "@/features/matching/types";

/**
 * Fare multipliers against the direct-taxi reference fare. A return
 * leg discounts most because the driver's cost is already sunk on an
 * otherwise-empty trip; nearby-flexible discounts a little less than
 * shared because the passenger absorbs a pickup-location adjustment
 * in exchange for the flexibility.
 */
const FARE_MULTIPLIER: Partial<Record<MatchCategory, number>> = {
  return: 0.62,
  shared: 0.78,
  "nearby-flexible": 0.7,
};

export function estimateMatchFare(distanceKm: number, category: MatchCategory): number {
  const direct = referenceFareFor(distanceKm);
  if (category === "rental") return Math.round((1800 + distanceKm * 6) / 10) * 10;
  if (category === "direct") return direct;
  const multiplier = FARE_MULTIPLIER[category] ?? 1;
  return Math.round((direct * multiplier) / 10) * 10;
}

export function estimateMatchSavings(distanceKm: number, category: MatchCategory): number {
  if (category === "direct" || category === "rental") return 0;
  return referenceFareFor(distanceKm) - estimateMatchFare(distanceKm, category);
}
