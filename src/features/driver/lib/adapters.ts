import { generateJourneyDemand, generateReturnDemand, type DemandCluster } from "@/features/matching/models/demand";
import { matchReturnJourney, matchSharedJourney } from "@/features/matching/rules";
import type { MatchCategory, MatchRequest, MatchResult, PoolJourney } from "@/features/matching/types";
import type { PublishedJourney } from "@/features/driver/types";

/**
 * Bridges the Driver Workspace to the passenger-side Match Engine
 * (`@/features/matching`). No scoring, explainability, or impact math
 * is reimplemented here — a published journey is simply reshaped into
 * the engine's own `PoolJourney` supply type and run through the same
 * `matchReturnJourney` / `matchSharedJourney` rules the passenger
 * flow uses, so a driver and a passenger can never see contradictory
 * numbers for the same route.
 */
function toPoolJourney(
  journey: PublishedJourney,
  originId: string,
  destinationId: string,
  category: MatchCategory,
): PoolJourney {
  return {
    id: `driver::${journey.id}::${destinationId}`,
    category,
    driver: {
      name: journey.driverName,
      rating: 4.8,
      completedJourneys: 240,
      vehicle: journey.vehicleName,
      vehiclePlate: journey.vehiclePlate,
    },
    originId,
    destinationId,
    departureTime: journey.time,
    flexibilityMinutes: 30,
    seatsTotal: journey.seatsTotal,
    seatsConfirmed: journey.seatsReserved,
    context:
      category === "return"
        ? `${journey.driverName} just completed a journey here and has an empty vehicle for the way back.`
        : `${journey.driverName} published this journey and has seats open for passengers heading the same way.`,
  };
}

function toMatchRequest(journey: PublishedJourney, cluster: DemandCluster): MatchRequest {
  return {
    originId: cluster.pickupId,
    destinationId: cluster.destinationId,
    date: journey.date,
    time: cluster.requestedTime,
    passengers: cluster.count,
    journeyType: cluster.journeyType,
    flexibleDeparture: cluster.flexible,
  };
}

export type DemandMatch = { cluster: DemandCluster; result: MatchResult };

/** Screen 3: who wants a seat on this journey, exactly as published. */
export function matchDemandForJourney(journey: PublishedJourney): DemandMatch[] {
  const clusters = generateJourneyDemand(journey.originId, journey.destinationId, journey.purpose, journey.time);
  const ruleFn = journey.category === "return" ? matchReturnJourney : matchSharedJourney;

  return clusters
    .map((cluster) => ({
      cluster,
      result: ruleFn(toMatchRequest(journey, cluster), toPoolJourney(journey, journey.originId, cluster.destinationId, journey.category)),
    }))
    .sort((a, b) => b.result.score.total - a.result.score.total);
}

/** Screen 4: who's waiting nearby for the reverse leg once this journey completes. */
export function matchReturnDemandForJourney(journey: PublishedJourney): DemandMatch[] {
  const clusters = generateReturnDemand(journey.destinationId, journey.originId, journey.purpose, journey.time);

  return clusters
    .map((cluster) => ({
      cluster,
      result: matchReturnJourney(
        toMatchRequest(journey, cluster),
        toPoolJourney(journey, journey.destinationId, cluster.destinationId, "return"),
      ),
    }))
    .sort((a, b) => b.result.score.total - a.result.score.total);
}
