import type { VehicleCategory } from "@/lib/vehicle-categories";

export type RentalTransmission = "manual" | "automatic";
export type RentalFuel = "petrol" | "diesel" | "cng" | "electric";
export type RentalMode = "self-drive" | "with-driver";

/**
 * A listing in the rental marketplace — separate from the Match
 * Engine entirely. `ownerName` ties a listing back to whichever
 * Rental Owner account created it; seeded demo listings use a
 * placeholder owner name so they never collide with a real account.
 */
export type RentalVehicle = {
  id: string;
  ownerName: string;
  brand: string;
  model: string;
  category: VehicleCategory;
  transmission: RentalTransmission;
  fuel: RentalFuel;
  seats: number;
  pricePerDay: number;
  photoDataUrl?: string;
  locationId: string;
  /** Whether this listing can be hired with a driver, in addition to self-drive. */
  driverAvailable: boolean;
  available: boolean;
};

export type RentalVehicleInput = Omit<RentalVehicle, "id">;

export type RentalBooking = {
  id: string;
  vehicleId: string;
  renterName: string;
  mode: RentalMode;
  pickupDate: string;
  returnDate: string;
  locationId: string;
  totalPrice: number;
  createdAt: number;
};

export type RentalBookingInput = Omit<RentalBooking, "id" | "createdAt">;
