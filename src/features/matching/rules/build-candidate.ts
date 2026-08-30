import { getLocation } from "@/features/journey/data/locations";
import { formatTime12h } from "@/features/journey/lib/geo";
import { buildRoutePoints, distanceKmBetween, durationMinutesFor, referenceFareFor } from "@/features/matching/utils/geo";
import { estimateMatchFare, estimateMatchSavings } from "@/features/matching/utils/fare";
import { buildReasons } from "@/features/matching/utils/explain";
import { computeImpact } from "@/features/matching/utils/impact";
import { computeScore } from "@/features/matching/scoring/score";
import { CATEGORY_LABEL } from "@/features/matching/scoring/weights";
import type { MatchCategory, MatchDetails, MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";

export type CandidateCopy = {
  headline: string;
  pickupNote: string;
  dropNote: string;
  driverBenefit: string;
  passengerBenefit: string;
  howGenerated: string;
  returnJourneyBenefit: string;
};

/**
 * Shared candidate assembly used by every category rule (`rules/*.ts`).
 * A rule only supplies category-specific copy — every numeric field
 * (score, fare, savings, impact, route) is computed once here so the
 * five categories can never drift into inconsistent math.
 */
export function buildCandidate(
  category: MatchCategory,
  request: MatchRequest,
  journey: PoolJourney,
  copy: CandidateCopy,
): MatchResult {
  const distanceKm = distanceKmBetween(journey.originId, journey.destinationId);
  const durationMinutes = durationMinutesFor(distanceKm);
  const fare = estimateMatchFare(distanceKm, category);
  const referenceFare = referenceFareFor(distanceKm);
  const estimatedSavings = estimateMatchSavings(distanceKm, category);

  const score = computeScore({
    category,
    requestedTime: request.time,
    flexibleDeparture: request.flexibleDeparture,
    passengers: request.passengers,
    journey,
    estimatedSavings,
    referenceFare,
  });
  const timeFitScore = score.factors.find((f) => f.key === "timeFit")?.rawScore ?? 0;

  const reasons = buildReasons({ category, journey, estimatedSavings, timeFitScore });
  const impact = computeImpact({ category, journey, passengers: request.passengers, distanceKm, fare });

  const requestedOrigin = getLocation(request.originId);
  const actualOrigin = getLocation(journey.originId);
  const pickupAdjustmentKm =
    requestedOrigin && actualOrigin ? Math.abs(requestedOrigin.corridorKm - actualOrigin.corridorKm) : 0;

  const estimatedWaitMinutes = Math.max(
    0,
    (() => {
      const [rh, rm] = request.time.split(":").map(Number);
      const [jh, jm] = journey.departureTime.split(":").map(Number);
      return jh * 60 + jm - (rh * 60 + rm);
    })(),
  );

  const occupancySeatsConfirmed = journey.seatsConfirmed + request.passengers;
  const details: MatchDetails = {
    howGenerated: copy.howGenerated,
    distanceDifferenceKm: pickupAdjustmentKm,
    pickupAdjustmentKm,
    travelTimeMinutes: durationMinutes,
    sharedSavingsRupees: estimatedSavings,
    returnJourneyBenefit: copy.returnJourneyBenefit,
    regionalImpact: impact.communityImpactNote,
  };

  return {
    id: `${category}::${request.originId}::${request.destinationId}::${request.time || "flex"}`,
    category,
    rank: 0,
    badge: CATEGORY_LABEL[category],
    headline: copy.headline,
    score,
    reasons,
    estimatedSavingsRupees: estimatedSavings,
    estimatedWaitMinutes,
    occupancy: {
      seatsConfirmed: Math.min(occupancySeatsConfirmed, journey.seatsTotal),
      seatsTotal: journey.seatsTotal,
      occupancyRate: Math.round((Math.min(occupancySeatsConfirmed, journey.seatsTotal) / journey.seatsTotal) * 100),
    },
    impact,
    driverBenefit: copy.driverBenefit,
    passengerBenefit: copy.passengerBenefit,
    distanceKm,
    durationMinutes,
    fare,
    referenceFare,
    departureDisplay:
      category === "direct" ? "Any time you choose" : category === "rental" ? "Pick up any time" : formatTime12h(journey.departureTime),
    pickupNote: copy.pickupNote,
    dropNote: copy.dropNote,
    driver: journey.driver,
    route: buildRoutePoints(request.originId, request.destinationId, journey.originId),
    details,
  };
}
