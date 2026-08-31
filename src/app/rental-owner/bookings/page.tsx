"use client";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/ui/stat";
import { useAccount } from "@/features/auth/data/account-store";
import { useRentalBookings } from "@/features/rental/data/booking-store";
import { useRentalCatalog } from "@/features/rental/data/catalog-store";
import { OwnerNav } from "@/features/rental-owner/components/owner-nav";

export default function RentalOwnerBookingsPage() {
  const { account } = useAccount();
  const catalog = useRentalCatalog();
  const bookings = useRentalBookings();
  if (!account) return null;

  const myVehicleIds = new Set(catalog.filter((v) => v.ownerName === account.name).map((v) => v.id));
  const myBookings = bookings
    .filter((b) => myVehicleIds.has(b.vehicleId))
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Bookings</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Every booking made against one of your listed vehicles.</p>

      <div className="mt-8">
        <OwnerNav active="/rental-owner/bookings" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {myBookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No bookings yet.
          </div>
        ) : (
          myBookings.map((booking) => {
            const vehicle = catalog.find((v) => v.id === booking.vehicleId);
            return (
              <article key={booking.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicle removed"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{booking.renterName}</p>
                  </div>
                  <Badge variant={booking.mode === "with-driver" ? "info" : "neutral"}>
                    {booking.mode === "with-driver" ? "With Driver" : "Self Drive"}
                  </Badge>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
                  <Stat mono={false} label="Pickup" value={booking.pickupDate} />
                  <Stat mono={false} label="Return" value={booking.returnDate} />
                  <Stat mono={false} label="Location" value={getLocation(booking.locationId)?.name ?? "—"} />
                  <Stat label="Total" value={formatFare(booking.totalPrice)} emphasis />
                </dl>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
