/** The Driver Workspace's vocabulary — deliberately small, no fleet/revenue/analytics concepts. */
export type VehicleType = "innova" | "ertiga" | "swift-dzire" | "traveller";

export type DriverJourneyPurpose = "airport" | "hospital" | "intercity";

export type JourneyStatus = "upcoming" | "completed" | "cancelled";

/** A published journey is "shared" while upcoming; a return leg accepted from Screen 4 is also published this way, tagged "return". */
export type PublishedJourneyCategory = "shared" | "return";

export type PublishedJourney = {
  id: string;
  driverName: string;
  vehicleType: VehicleType;
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
  vehicleType: VehicleType;
  vehiclePlate: string;
  originId: string;
  destinationId: string;
  date: string;
  time: string;
  seatsTotal: number;
  purpose: DriverJourneyPurpose;
};
