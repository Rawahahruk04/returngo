"use client";

import { formatFare } from "@/features/journey/lib/geo";
import { Stat } from "@/components/ui/stat";
import { useAccount } from "@/features/auth/data/account-store";
import { useRentalBookings } from "@/features/rental/data/booking-store";
import { useRentalCatalog } from "@/features/rental/data/catalog-store";
import { OwnerNav } from "@/features/rental-owner/components/owner-nav";

export default function RentalOwnerRevenuePage() {
  const { account } = useAccount();
  const catalog = useRentalCatalog();
  const bookings = useRentalBookings();
  if (!account) return null;

  const myVehicles = catalog.filter((v) => v.ownerName === account.name);
  const myVehicleIds = new Set(myVehicles.map((v) => v.id));
  const myBookings = bookings.filter((b) => myVehicleIds.has(b.vehicleId));
  const totalRevenue = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const byVehicle = myVehicles
    .map((vehicle) => ({
      vehicle,
      revenue: myBookings.filter((b) => b.vehicleId === vehicle.id).reduce((sum, b) => sum + b.totalPrice, 0),
      bookingCount: myBookings.filter((b) => b.vehicleId === vehicle.id).length,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Revenue</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Total earnings across every listed vehicle.</p>

      <div className="mt-8">
        <OwnerNav active="/rental-owner/revenue" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <Stat label="Total revenue" value={formatFare(totalRevenue)} emphasis />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <Stat label="Bookings" value={String(myBookings.length)} />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <Stat label="Listed vehicles" value={String(myVehicles.length)} />
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-foreground">By vehicle</h2>
      <div className="mt-4 flex flex-col gap-3">
        {byVehicle.length === 0 ? (
          <p className="text-sm text-muted-foreground">No vehicles listed yet.</p>
        ) : (
          byVehicle.map(({ vehicle, revenue, bookingCount }) => (
            <div key={vehicle.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bookingCount} {bookingCount === 1 ? "booking" : "bookings"}
                </p>
              </div>
              <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{formatFare(revenue)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
