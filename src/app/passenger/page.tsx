"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Car, Route as RouteIcon } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { useAccount } from "@/features/auth/data/account-store";
import { useRentalBookings } from "@/features/rental/data/booking-store";
import { usePassengerStore } from "@/features/passenger/data/store";
import { PassengerNav } from "@/features/passenger/components/passenger-nav";

export default function PassengerDashboardPage() {
  const { account } = useAccount();
  const { trips, savedLocations } = usePassengerStore();
  const rentalBookings = useRentalBookings();
  if (!account) return null;

  const myRentalBookings = rentalBookings.filter((b) => b.renterName === account.name);
  const recentTrips = [...trips].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  const cards = [
    { icon: RouteIcon, value: String(trips.length), label: "Taxi trips" },
    { icon: Car, value: String(myRentalBookings.length), label: "Rental bookings" },
    { icon: Bookmark, value: String(savedLocations.length), label: "Saved locations" },
  ];

  const shortcuts = [
    { href: "/plan", label: "Book a taxi" },
    { href: "/rentals", label: "Rent a vehicle" },
    { href: "/passenger/saved", label: "Manage saved locations" },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Passenger</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Welcome back, {account.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Everything you&apos;ve booked with ReturnGo, in one place.</p>

      <div className="mt-8">
        <PassengerNav active="/passenger" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <card.icon className="size-5 text-secondary" />
            <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.href}
            href={shortcut.href}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-secondary/40 hover:shadow-md"
          >
            <p className="font-display text-base font-semibold text-foreground">{shortcut.label}</p>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-foreground">Recent activity</h2>
      <div className="mt-4 flex flex-col gap-3">
        {recentTrips.length === 0 ? (
          <p className="text-sm text-muted-foreground">Your booked trips will show up here.</p>
        ) : (
          recentTrips.map((trip) => {
            const origin = getLocation(trip.originId);
            const destination = getLocation(trip.destinationId);
            return (
              <div key={trip.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <RouteIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {origin?.name} → {destination?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{trip.date}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-secondary">
                  {trip.confirmationCode}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
