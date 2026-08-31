import type { DriverVehicle } from "@/features/driver/types";

/**
 * Searchable "popular vehicles" catalogue for the Vehicle Selector.
 * A driver can also skip this list entirely and add their own vehicle
 * manually — see `VehicleSelector`. `year` defaults to a recent model
 * year here; the driver adjusts it to their actual vehicle's year.
 */
export const POPULAR_VEHICLES: DriverVehicle[] = [
  { brand: "Maruti Suzuki", model: "Swift Dzire", category: "sedan", seats: 4, fuel: "petrol", transmission: "manual", year: 2022 },
  { brand: "Maruti Suzuki", model: "Ertiga", category: "suv", seats: 6, fuel: "petrol", transmission: "manual", year: 2022 },
  { brand: "Toyota", model: "Innova Crysta", category: "suv", seats: 6, fuel: "diesel", transmission: "manual", year: 2021 },
  { brand: "Toyota", model: "Innova Hycross", category: "suv", seats: 6, fuel: "petrol", transmission: "automatic", year: 2023 },
  { brand: "Toyota", model: "Etios", category: "sedan", seats: 4, fuel: "petrol", transmission: "manual", year: 2019 },
  { brand: "Mahindra", model: "Marazzo", category: "suv", seats: 7, fuel: "diesel", transmission: "manual", year: 2021 },
  { brand: "Mahindra", model: "Xylo", category: "suv", seats: 7, fuel: "diesel", transmission: "manual", year: 2018 },
  { brand: "Hyundai", model: "Aura", category: "sedan", seats: 4, fuel: "petrol", transmission: "manual", year: 2022 },
  { brand: "Hyundai", model: "Exter", category: "hatchback", seats: 4, fuel: "petrol", transmission: "manual", year: 2023 },
  { brand: "Force", model: "Traveller", category: "traveller", seats: 12, fuel: "diesel", transmission: "manual", year: 2020 },
  { brand: "Tata", model: "Winger", category: "traveller", seats: 12, fuel: "diesel", transmission: "manual", year: 2021 },
  { brand: "Toyota", model: "Fortuner", category: "luxury", seats: 6, fuel: "diesel", transmission: "automatic", year: 2023 },
  { brand: "Maruti Suzuki", model: "Eeco", category: "hatchback", seats: 5, fuel: "petrol", transmission: "manual", year: 2020 },
  { brand: "Tata", model: "Nexon EV", category: "hatchback", seats: 4, fuel: "electric", transmission: "automatic", year: 2023 },
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
