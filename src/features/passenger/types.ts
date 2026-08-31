export type SavedLocation = {
  id: string;
  label: string;
  locationId: string;
};

export type PassengerTrip = {
  id: string;
  matchId: string;
  originId: string;
  destinationId: string;
  driverName: string;
  vehicle: string;
  date: string;
  fare: number;
  confirmationCode: string;
  createdAt: number;
};

export type SavedLocationInput = Omit<SavedLocation, "id">;
export type PassengerTripInput = Omit<PassengerTrip, "id" | "createdAt">;
