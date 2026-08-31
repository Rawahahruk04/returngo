import type { VehicleCategory } from "@/lib/vehicle-categories";

export type FleetDriverStatus = "active" | "inactive";
export type FleetVehicleStatus = "active" | "maintenance";
export type FleetBookingStatus = "upcoming" | "completed";

export type FleetDriver = {
  id: string;
  name: string;
  phone: string;
  vehicleName: string;
  status: FleetDriverStatus;
};

export type FleetVehicle = {
  id: string;
  name: string;
  plate: string;
  category: VehicleCategory;
  status: FleetVehicleStatus;
};

/**
 * Manually logged by the Fleet Owner — there's no real passenger-facing
 * "book through a fleet" flow in this MVP, so this is an internal
 * operations log rather than a live booking pipeline.
 */
export type FleetBooking = {
  id: string;
  driverId: string;
  vehicleId: string;
  passengerLabel: string;
  route: string;
  date: string;
  fare: number;
  status: FleetBookingStatus;
};

export type FleetDriverInput = Omit<FleetDriver, "id">;
export type FleetVehicleInput = Omit<FleetVehicle, "id">;
export type FleetBookingInput = Omit<FleetBooking, "id">;
