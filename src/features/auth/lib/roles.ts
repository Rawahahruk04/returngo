import type { UserRole } from "@/features/auth/types";

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  passenger: "/passenger",
  driver: "/driver",
  "rental-owner": "/rental-owner",
  "fleet-owner": "/fleet",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  passenger: "Passenger",
  driver: "Driver",
  "rental-owner": "Rental Owner",
  "fleet-owner": "Fleet Owner",
};

export const ROLE_DESCRIPTION: Record<UserRole, string> = {
  passenger: "Book taxis and vehicle rentals across the corridor.",
  driver: "Publish journeys and earn from empty return legs.",
  "rental-owner": "List vehicles and manage rental bookings.",
  "fleet-owner": "Manage a roster of drivers and vehicles.",
};
