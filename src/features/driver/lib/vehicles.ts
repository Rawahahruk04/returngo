import type { VehicleType } from "@/features/driver/types";

export const VEHICLE_LABEL: Record<VehicleType, string> = {
  innova: "Toyota Innova Crysta",
  ertiga: "Maruti Suzuki Ertiga",
  "swift-dzire": "Maruti Suzuki Swift Dzire",
  traveller: "Force Traveller",
};

/** Default seat suggestion when a driver picks a vehicle type — still editable in the form. */
export const VEHICLE_DEFAULT_SEATS: Record<VehicleType, number> = {
  innova: 6,
  ertiga: 6,
  "swift-dzire": 4,
  traveller: 12,
};

export const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "innova", label: VEHICLE_LABEL.innova },
  { value: "ertiga", label: VEHICLE_LABEL.ertiga },
  { value: "swift-dzire", label: VEHICLE_LABEL["swift-dzire"] },
  { value: "traveller", label: VEHICLE_LABEL.traveller },
];
