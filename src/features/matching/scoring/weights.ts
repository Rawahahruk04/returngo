import type { MatchCategory } from "@/features/matching/types";

/**
 * SCORING FORMULA
 * ================
 * Every candidate gets five 0-100 sub-scores, each weighted, summed,
 * and rounded to a single 0-100 Match Score:
 *
 *   total = 0.40 * categoryScore
 *         + 0.25 * timeFitScore
 *         + 0.20 * costEfficiencyScore
 *         + 0.10 * occupancyScore
 *         + 0.05 * reliabilityScore
 *
 * categoryScore   — fixed per match category, reflecting the product
 *                    priority order (return > shared > nearby-flexible
 *                    > direct > rental). This is the dominant term so
 *                    the score itself already favours the priority
 *                    order; the engine's ranking step (see
 *                    `engine/match-engine.ts`) additionally sorts by
 *                    category tier first, score second, so priority
 *                    order is guaranteed even for an unusually strong
 *                    lower-tier candidate.
 * timeFitScore    — 100 minus the percentage of the candidate's
 *                    flexibility window consumed by the gap between
 *                    the requested time and the candidate's departure.
 * costEfficiencyScore — the candidate's savings as a percentage of
 *                    the direct-taxi reference fare (0 for direct/rental).
 * occupancyScore  — how full the vehicle becomes once this passenger
 *                    boards, as a percentage of total seats — a proxy
 *                    for how efficiently the trip uses road capacity.
 * reliabilityScore — the assigned driver's rating, scaled to 0-100.
 *
 * Every input above is deterministic (see `models/pool.ts` and
 * `utils/seed.ts`), so identical requests always produce identical
 * scores.
 */
export const SCORE_WEIGHTS = {
  category: 0.4,
  timeFit: 0.25,
  costEfficiency: 0.2,
  occupancy: 0.1,
  reliability: 0.05,
} as const;

export const CATEGORY_BASE_SCORE: Record<MatchCategory, number> = {
  return: 100,
  shared: 78,
  "nearby-flexible": 58,
  direct: 38,
  rental: 22,
};

export const CATEGORY_LABEL: Record<MatchCategory, string> = {
  return: "Return Journey",
  shared: "Shared Journey",
  "nearby-flexible": "Nearby Flexible Journey",
  direct: "Direct Taxi",
  rental: "Rental Vehicle",
};
