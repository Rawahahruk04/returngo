"use client";

import { formatFare } from "@/features/journey/lib/geo";
import { Stat } from "@/components/ui/stat";
import { useFleetStore } from "@/features/fleet/data/store";
import { FleetNav } from "@/features/fleet/components/fleet-nav";

export default function FleetRevenuePage() {
  const { drivers, bookings } = useFleetStore();

  const totalRevenue = bookings.reduce((sum, b) => sum + b.fare, 0);
  const byDriver = drivers
    .map((driver) => {
      const driverBookings = bookings.filter((b) => b.driverId === driver.id);
      return { driver, revenue: driverBookings.reduce((sum, b) => sum + b.fare, 0), count: driverBookings.length };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Revenue</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Total fare across every logged booking, broken down by driver.</p>

      <div className="mt-8">
        <FleetNav active="/fleet/revenue" />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 shadow-sm">
        <Stat label="Total revenue" value={formatFare(totalRevenue)} emphasis />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-foreground">By driver</h2>
      <div className="mt-4 flex flex-col gap-3">
        {byDriver.length === 0 ? (
          <p className="text-sm text-muted-foreground">No drivers on the roster yet.</p>
        ) : (
          byDriver.map(({ driver, revenue, count }) => (
            <div key={driver.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
              <div>
                <p className="text-sm font-medium text-foreground">{driver.name}</p>
                <p className="text-xs text-muted-foreground">
                  {count} {count === 1 ? "booking" : "bookings"}
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
