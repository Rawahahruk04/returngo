import type { MatchCategory, MatchImpact, PoolJourney } from "@/features/matching/types";

/** Average fuel burn for the sedan/SUV mix on this corridor, used to turn km into litres. */
const KM_PER_LITRE = 12;
/** Tailpipe CO2 per litre of petrol burned (kg) — a standard emissions-factor constant, not measured. */
const CO2_KG_PER_LITRE = 2.31;

/**
 * IMPACT FORMULA
 * ================
 * - emptyKmPrevented: for a return match, the full leg would have run
 *   with zero passengers — every km of it is "prevented empty running".
 *   Other categories don't remove an empty leg, so this is 0 for them.
 * - fuelSavedLitres / carbonSavedKg: derived directly from
 *   emptyKmPrevented at a fixed corridor fuel-efficiency assumption.
 * - driverRevenueIncreasedRupees: for a return leg the driver would
 *   otherwise have earned ₹0 on this leg, so the full fare is
 *   incremental revenue. For a shared journey, only the marginal fare
 *   contributed by the *new* passenger (this request) counts — the
 *   trip was already happening. Direct/rental trips aren't coordinated,
 *   so they add no network revenue beyond the standard fare.
 */
export function computeImpact(params: {
  category: MatchCategory;
  journey: PoolJourney;
  passengers: number;
  distanceKm: number;
  fare: number;
}): MatchImpact {
  const { category, journey, passengers, distanceKm, fare } = params;

  const emptyKmPrevented = category === "return" ? distanceKm : 0;
  const fuelSavedLitres = Math.round((emptyKmPrevented / KM_PER_LITRE) * 10) / 10;
  const carbonSavedKg = Math.round(fuelSavedLitres * CO2_KG_PER_LITRE * 10) / 10;

  const passengersCoordinated = journey.seatsConfirmed + passengers;

  let driverRevenueIncreasedRupees = 0;
  if (category === "return") {
    driverRevenueIncreasedRupees = fare;
  } else if (category === "shared" || category === "nearby-flexible") {
    driverRevenueIncreasedRupees = Math.round(fare / (journey.seatsConfirmed + 1));
  }

  const communityImpactNote =
    category === "return"
      ? `${passengersCoordinated} passenger${passengersCoordinated === 1 ? "" : "s"} coordinated onto a leg that would otherwise have run empty across the corridor.`
      : category === "shared" || category === "nearby-flexible"
        ? `${passengersCoordinated} passengers now share one vehicle instead of ${passengersCoordinated} separate trips.`
        : "A standard trip — no additional coordination impact on the corridor.";

  return {
    passengersCoordinated,
    driverRevenueIncreasedRupees,
    fuelSavedLitres,
    emptyKmPrevented,
    carbonSavedKg,
    communityImpactNote,
  };
}
