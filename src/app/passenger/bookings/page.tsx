"use client";

import Link from "next/link";
import { Car } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { useAccount } from "@/features/auth/data/account-store";
import { useRentalBookings } from "@/features/rental/data/booking-store";
import { useRentalCatalog } from "@/features/rental/data/catalog-store";
import { PassengerNav } from "@/features/passenger/components/passenger-nav";

export default function PassengerBookingsPage() {
  const { account } = useAccount();
  const bookings = useRentalBookings();
  const catalog = useRentalCatalog();
  if (!account) return null;

  const myBookings = bookings.filter((b) => b.renterName === account.name).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Passenger</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Bookings</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Your Rent Vehicle bookings.</p>

      <div className="mt-8">
        <PassengerNav active="/passenger/bookings" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {myBookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No rental bookings yet.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/rentals">
                <Car /> Browse vehicles
              </Link>
            </Button>
          </div>
        ) : (
          myBookings.map((booking) => {
            const vehicle = catalog.find((v) => v.id === booking.vehicleId);
            return (
              <article key={booking.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicle removed"}
                  </h3>
                  <Badge variant={booking.mode === "with-driver" ? "info" : "neutral"}>
                    {booking.mode === "with-driver" ? "With Driver" : "Self Drive"}
                  </Badge>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
                  <Stat mono={false} label="Pickup" value={booking.pickupDate} />
                  <Stat mono={false} label="Return" value={booking.returnDate} />
                  <Stat mono={false} label="Location" value={getLocation(booking.locationId)?.name ?? "—"} />
                  <Stat label="Total" value={formatFare(booking.totalPrice)} />
                </dl>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
