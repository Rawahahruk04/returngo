import type { DriverVehicle } from "@/features/driver/types";

/**
 * Searchable "popular vehicles" catalogue for the Vehicle Selector.
 * A driver can also skip this list entirely and add their own vehicle
 * manually — see `VehicleSelector`.
 */
export const POPULAR_VEHICLES: DriverVehicle[] = [
  { name: "Maruti Suzuki Swift Dzire", seats: 4, fuel: "petrol", transmission: "manual", ac: true },
  { name: "Maruti Suzuki Ertiga", seats: 6, fuel: "petrol", transmission: "manual", ac: true },
  { name: "Toyota Innova Crysta", seats: 6, fuel: "diesel", transmission: "manual", ac: true },
  { name: "Toyota Innova Hycross", seats: 6, fuel: "petrol", transmission: "automatic", ac: true },
  { name: "Toyota Etios", seats: 4, fuel: "petrol", transmission: "manual", ac: true },
  { name: "Mahindra Marazzo", seats: 7, fuel: "diesel", transmission: "manual", ac: true },
  { name: "Mahindra Xylo", seats: 7, fuel: "diesel", transmission: "manual", ac: true },
  { name: "Hyundai Aura", seats: 4, fuel: "petrol", transmission: "manual", ac: true },
  { name: "Hyundai Exter", seats: 4, fuel: "petrol", transmission: "manual", ac: true },
  { name: "Force Traveller", seats: 12, fuel: "diesel", transmission: "manual", ac: true },
  { name: "Tata Winger", seats: 12, fuel: "diesel", transmission: "manual", ac: true },
  { name: "Toyota Fortuner", seats: 6, fuel: "diesel", transmission: "automatic", ac: true },
  { name: "Maruti Suzuki Eeco", seats: 5, fuel: "petrol", transmission: "manual", ac: false },
  { name: "Tata Nexon EV", seats: 4, fuel: "electric", transmission: "automatic", ac: true },
];

export const FUEL_LABEL: Record<DriverVehicle["fuel"], string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  cng: "CNG",
  electric: "Electric",
};

export const TRANSMISSION_LABEL: Record<DriverVehicle["transmission"], string> = {
  manual: "Manual",
  automatic: "Automatic",
};
