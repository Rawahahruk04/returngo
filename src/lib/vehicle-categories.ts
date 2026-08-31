/** Shared vehicle-type vocabulary — used by both the Driver vehicle profile and the Rent Vehicle catalogue. */
export type VehicleCategory = "bike" | "scooter" | "hatchback" | "sedan" | "suv" | "traveller" | "luxury";

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  "bike",
  "scooter",
  "hatchback",
  "sedan",
  "suv",
  "traveller",
  "luxury",
];

export const VEHICLE_CATEGORY_LABEL: Record<VehicleCategory, string> = {
  bike: "Bike",
  scooter: "Scooter",
  hatchback: "Hatchback",
  sedan: "Sedan",
  suv: "SUV",
  traveller: "Traveller",
  luxury: "Luxury",
};
