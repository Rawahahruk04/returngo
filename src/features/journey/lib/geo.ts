import { getLocation } from "@/features/journey/data/locations";
import type { MatchKind } from "@/features/journey/types";

/** Rough NH66 driving speed once ghat sections and town traffic are averaged in. */
const AVERAGE_SPEED_KMH = 50;

/** Per-km direct-taxi rate for a sedan/SUV on a one-way intercity trip. */
const DIRECT_RATE_PER_KM = 18;

export function estimateDistanceKm(originId: string, destinationId: string): number {
  const origin = getLocation(originId);
  const destination = getLocation(destinationId);
  if (!origin || !destination) return 0;
  return Math.max(8, Math.abs(destination.corridorKm - origin.corridorKm));
}

export function estimateDurationMinutes(distanceKm: number): number {
  const rawMinutes = (distanceKm / AVERAGE_SPEED_KMH) * 60;
  return Math.round(rawMinutes / 5) * 5;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

/**
 * Direct one-way fare is the reference price every other option is
 * discounted against — it's what the passenger would pay today,
 * calling a regular contact, with no return-leg coordination.
 */
export function estimateDirectFare(distanceKm: number): number {
  return Math.round((distanceKm * DIRECT_RATE_PER_KM) / 10) * 10;
}

/**
 * A return-leg match splits the round trip's cost between two
 * one-way passengers instead of one — roughly a third off the
 * direct fare. Shared rides (multiple unrelated passengers on a
 * dedicated departure) discount less because the driver isn't
 * already sunk-cost on an empty leg.
 */
export function estimateFare(distanceKm: number, kind: MatchKind): number {
  const direct = estimateDirectFare(distanceKm);
  switch (kind) {
    case "return":
      return Math.round((direct * 0.62) / 10) * 10;
    case "shared":
      return Math.round((direct * 0.78) / 10) * 10;
    case "rental":
      return Math.round((1800 + distanceKm * 6) / 10) * 10;
    case "direct":
    default:
      return direct;
  }
}

export function estimateSavings(distanceKm: number, kind: MatchKind): number {
  if (kind === "direct" || kind === "rental") return 0;
  return estimateDirectFare(distanceKm) - estimateFare(distanceKm, kind);
}

export function formatFare(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Adds minutes to a 24-hour `HH:MM` time (the native format of
 * `<input type="time">`) and returns another 24-hour `HH:MM`
 * string, so results can be chained through further arithmetic —
 * only `formatTime12h` converts to a display string, and only at
 * the point something is actually rendered.
 */
export function addMinutes24(time: string, minutesToAdd: number): string {
  const [hoursRaw, minutesRaw] = time.split(":").map(Number);
  const totalMinutes = ((hoursRaw * 60 + minutesRaw + minutesToAdd) % 1440 + 1440) % 1440;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/** Formats a 24-hour `HH:MM` string as a 12-hour clock, e.g. `"6:45 AM"`. */
export function formatTime12h(time: string): string {
  const [hours24, minutes] = time.split(":").map(Number);
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}
