/**
 * Rental is a separate product from Book Taxi — no Match Engine, no
 * scoring, just a booking intent captured for the team to follow up on.
 */
export type RentalMode = "self-drive" | "with-driver";

export type RentalCategory = "hatchback" | "sedan" | "suv" | "traveller";

export type RentalDuration = "few-hours" | "full-day" | "multi-day";

export type RentalInquiry = {
  id: string;
  mode: RentalMode;
  category: RentalCategory;
  duration: RentalDuration;
  locationId: string;
  date: string;
  createdAt: number;
};

export type RentalInquiryInput = Omit<RentalInquiry, "id" | "createdAt">;
