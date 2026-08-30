import { minutesBetween } from "@/features/matching/utils/geo";
import { CATEGORY_BASE_SCORE, SCORE_WEIGHTS } from "@/features/matching/scoring/weights";
import type { MatchCategory, MatchDriverInfo, MatchScoreBreakdown, PoolJourney } from "@/features/matching/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function timeFitScore(requestedTime: string, journey: PoolJourney, flexibleDeparture: boolean): number {
  const window = Math.max(journey.flexibilityMinutes, flexibleDeparture ? 180 : 90);
  const gap = minutesBetween(requestedTime, journey.departureTime);
  return clamp(100 - (gap / window) * 100, 0, 100);
}

function costEfficiencyScore(estimatedSavings: number, referenceFare: number): number {
  if (referenceFare <= 0) return 0;
  return clamp((estimatedSavings / referenceFare) * 100, 0, 100);
}

function occupancyScore(seatsConfirmed: number, passengers: number, seatsTotal: number): number {
  return clamp(((seatsConfirmed + passengers) / seatsTotal) * 100, 0, 100);
}

function reliabilityScore(driver: MatchDriverInfo): number {
  return clamp((driver.rating / 5) * 100, 0, 100);
}

export function computeScore(params: {
  category: MatchCategory;
  requestedTime: string;
  flexibleDeparture: boolean;
  passengers: number;
  journey: PoolJourney;
  estimatedSavings: number;
  referenceFare: number;
}): MatchScoreBreakdown {
  const { category, requestedTime, flexibleDeparture, passengers, journey, estimatedSavings, referenceFare } = params;

  const rawScores = {
    category: CATEGORY_BASE_SCORE[category],
    timeFit: timeFitScore(requestedTime, journey, flexibleDeparture),
    costEfficiency: costEfficiencyScore(estimatedSavings, referenceFare),
    occupancy: occupancyScore(journey.seatsConfirmed, passengers, journey.seatsTotal),
    reliability: reliabilityScore(journey.driver),
  };

  const factors: MatchScoreBreakdown["factors"] = [
    { key: "category", label: "Match priority", weight: SCORE_WEIGHTS.category, rawScore: rawScores.category, contribution: rawScores.category * SCORE_WEIGHTS.category },
    { key: "timeFit", label: "Departure time fit", weight: SCORE_WEIGHTS.timeFit, rawScore: rawScores.timeFit, contribution: rawScores.timeFit * SCORE_WEIGHTS.timeFit },
    { key: "costEfficiency", label: "Cost efficiency", weight: SCORE_WEIGHTS.costEfficiency, rawScore: rawScores.costEfficiency, contribution: rawScores.costEfficiency * SCORE_WEIGHTS.costEfficiency },
    { key: "occupancy", label: "Seat occupancy", weight: SCORE_WEIGHTS.occupancy, rawScore: rawScores.occupancy, contribution: rawScores.occupancy * SCORE_WEIGHTS.occupancy },
    { key: "reliability", label: "Driver reliability", weight: SCORE_WEIGHTS.reliability, rawScore: rawScores.reliability, contribution: rawScores.reliability * SCORE_WEIGHTS.reliability },
  ];

  const total = Math.round(factors.reduce((sum, factor) => sum + factor.contribution, 0));

  return { total: clamp(total, 0, 100), factors };
}
