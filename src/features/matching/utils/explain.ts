import { formatFare } from "@/features/journey/lib/geo";
import type { MatchCategory, PoolJourney } from "@/features/matching/types";

/**
 * Builds the "Why am I seeing this?" reasons for a candidate. Every
 * sentence is generated from the candidate's own computed values —
 * never a generic placeholder — so a recommendation is never shown
 * without a concrete, checkable explanation.
 */
export function buildReasons(params: {
  category: MatchCategory;
  journey: PoolJourney;
  estimatedSavings: number;
  timeFitScore: number;
}): string[] {
  const { category, journey, estimatedSavings, timeFitScore } = params;
  const reasons: string[] = [];

  switch (category) {
    case "return":
      reasons.push(journey.context);
      reasons.push("This route avoids an empty return trip.");
      break;
    case "shared":
      reasons.push(
        journey.seatsConfirmed > 0
          ? `${journey.seatsConfirmed} passenger${journey.seatsConfirmed === 1 ? " is" : "s are"} already confirmed on this departure.`
          : "A dedicated departure is already scheduled for this route.",
      );
      break;
    case "nearby-flexible":
      reasons.push(journey.context);
      if (timeFitScore >= 60) reasons.push("Departure is within your preferred window.");
      break;
    case "direct":
      reasons.push("No other passengers to coordinate with — the vehicle leaves exactly when you do.");
      break;
    case "rental":
      reasons.push("Self-drive keeps the schedule entirely in your hands.");
      break;
  }

  if (timeFitScore >= 85 && category !== "nearby-flexible") {
    reasons.push("Departure lines up closely with the time you asked for.");
  }

  if (estimatedSavings > 0) {
    reasons.push(`You save ${formatFare(estimatedSavings)} compared to a private taxi.`);
  }

  return reasons;
}
