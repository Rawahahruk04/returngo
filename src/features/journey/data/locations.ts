import type { Location } from "@/features/journey/types";

/**
 * `corridorKm` is each location's approximate position along the
 * Goa–Mangalore coastal highway (NH66), north to south. Distance
 * between any two locations is estimated as the difference between
 * their positions — see `lib/geo.ts`. It's a demo approximation,
 * not survey-grade, but it keeps every generated fare and duration
 * internally consistent instead of random.
 */
export const locations: Location[] = [
  { id: "goa-airport", name: "Goa Airport (Dabolim)", category: "airport", corridorKm: 0 },
  { id: "kumta", name: "Kumta", category: "town", corridorKm: 128 },
  { id: "honnavar", name: "Honnavar", category: "town", corridorKm: 152 },
  { id: "murudeshwar", name: "Murudeshwar", category: "town", corridorKm: 170 },
  { id: "bhatkal", name: "Bhatkal", category: "town", corridorKm: 196 },
  { id: "byndoor", name: "Byndoor", category: "town", corridorKm: 228 },
  { id: "kundapura", name: "Kundapura", category: "town", corridorKm: 250 },
  { id: "udupi", name: "Udupi", category: "town", corridorKm: 283 },
  { id: "manipal", name: "Manipal", category: "town", corridorKm: 289 },
  { id: "kmc-hospital", name: "KMC Hospital, Manipal", category: "hospital", corridorKm: 289 },
  { id: "mangalore", name: "Mangalore", category: "town", corridorKm: 366 },
  { id: "aj-hospital", name: "AJ Hospital, Mangalore", category: "hospital", corridorKm: 366 },
  { id: "father-muller-hospital", name: "Father Muller Hospital, Mangalore", category: "hospital", corridorKm: 368 },
  { id: "mangalore-airport", name: "Mangalore Airport (Bajpe)", category: "airport", corridorKm: 386 },
];

export function getLocation(id: string): Location | undefined {
  return locations.find((location) => location.id === id);
}

export const locationGroups: { label: string; category: Location["category"] }[] = [
  { label: "Towns", category: "town" },
  { label: "Airports", category: "airport" },
  { label: "Hospitals", category: "hospital" },
];
