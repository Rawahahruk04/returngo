/** The Driver Workspace's vocabulary — deliberately small, no fleet/revenue/analytics concepts. */
export type FuelType = "petrol" | "diesel" | "cng" | "electric";
export type TransmissionType = "manual" | "automatic";

export type DriverVehicle = {
  name: string;
  seats: number;
  fuel: FuelType;
  transmission: TransmissionType;
  ac: boolean;
};

/** Set once in the Driver Profile — never re-asked when publishing a journey. */
export type DriverProfile = {
  name: string;
  phone: string;
  vehicleRegistration: string;
  vehicle: DriverVehicle | null;
  verified: boolean;
  photoDataUrl?: string;
};

export type DriverJourneyPurpose = "airport" | "hospital" | "intercity";

export type JourneyStatus = "upcoming" | "completed" | "cancelled";

/** A published journey is "shared" while upcoming; a return leg accepted from Screen 4 is also published this way, tagged "return". */
export type PublishedJourneyCategory = "shared" | "return";

export type PublishedJourney = {
  id: string;
  driverName: string;
  vehicleName: string;
  vehiclePlate: string;
  originId: string;
  destinationId: string;
  date: string;
  time: string;
  seatsTotal: number;
  seatsReserved: number;
  purpose: DriverJourneyPurpose;
  category: PublishedJourneyCategory;
  status: JourneyStatus;
  createdAt: number;
  /** Price the driver is asking for the whole journey — shown on the card, not fed into the Match Engine's own fare math. */
  price?: number;
  notes?: string;
};

export type ReservationStatus = "pending" | "accepted" | "declined";

export type Reservation = {
  id: string;
  journeyId: string;
  passengerLabel: string;
  passengers: number;
  pickupId: string;
  destinationId: string;
  requestedTime: string;
  matchScore: number;
  savingsRupees: number;
  status: ReservationStatus;
};

export type PublishJourneyInput = {
  driverName: string;
  vehicleName: string;
  vehiclePlate: string;
  originId: string;
  destinationId: string;
  date: string;
  time: string;
  seatsTotal: number;
  purpose: DriverJourneyPurpose;
  price?: number;
  notes?: string;
};
