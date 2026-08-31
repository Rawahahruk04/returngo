"use client";

import { useDriverStore } from "@/features/driver/data/store";
import { useRentalCatalog } from "@/features/rental/data/catalog-store";
import { useRentalBookings } from "@/features/rental/data/booking-store";
import { usePassengerStore } from "@/features/passenger/data/store";
import { useFleetStore } from "@/features/fleet/data/store";
import { Car, CheckCircle2, Route as RouteIcon, Users } from "lucide-react";

export function LivePlatformMetrics() {
  const { journeys, reservations } = useDriverStore();
  const rentalVehicles = useRentalCatalog();
  const rentalBookings = useRentalBookings();
  const passengerTrips = usePassengerStore().trips;
  const fleetDrivers = useFleetStore().drivers;

  // Extract unique registered driver names across journeys and fleet store
  const driverNames = new Set<string>();
  journeys.forEach((j) => {
    if (j.driverName) driverNames.add(j.driverName);
  });
  fleetDrivers.forEach((d) => {
    if (d.name) driverNames.add(d.name);
  });
  const totalRegisteredDrivers = Math.max(driverNames.size, 1);

  const totalPublishedJourneys = journeys.length;
  const totalRentalVehicles = rentalVehicles.length;

  const confirmedRentalBookings = rentalBookings.length;
  const confirmedJourneyReservations = reservations.filter((r) => r.status === "accepted").length;
  const confirmedPassengerTrips = passengerTrips.length;
  const totalConfirmedBookings =
    confirmedRentalBookings + confirmedJourneyReservations + confirmedPassengerTrips;

  const metrics = [
    {
      label: "Registered Drivers",
      value: totalRegisteredDrivers,
      icon: Users,
      description: "Active regional drivers",
    },
    {
      label: "Published Journeys",
      value: totalPublishedJourneys,
      icon: RouteIcon,
      description: "Return & shared legs scheduled",
    },
    {
      label: "Rental Vehicles",
      value: totalRentalVehicles,
      icon: Car,
      description: "Cars, bikes & SUVs listed",
    },
    {
      label: "Confirmed Bookings",
      value: totalConfirmedBookings,
      icon: CheckCircle2,
      description: "Completed & active trips",
    },
  ];

  return (
    <section className="border-y border-border bg-surface-muted/50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-secondary"></span>
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Live Platform Activity
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Computed in real-time from application stores
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="rounded-xl border border-border/80 bg-card p-4.5 shadow-sm transition-all duration-200 hover:border-secondary/30 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-muted-foreground">
                    {m.label}
                  </span>
                  <Icon className="size-4 text-secondary/70" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {m.value}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
