"use client";

import { formatFare } from "@/features/journey/lib/geo";
import { useFleetStore } from "@/features/fleet/data/store";
import { FleetNav } from "@/features/fleet/components/fleet-nav";

export default function FleetReportsPage() {
  const { drivers, vehicles, bookings } = useFleetStore();

  const completed = bookings.filter((b) => b.status === "completed");
  const activeDrivers = drivers.filter((d) => d.status === "active").length;
  const activeVehicles = vehicles.filter((v) => v.status === "active").length;
  const completionRate = bookings.length === 0 ? 0 : Math.round((completed.length / bookings.length) * 100);
  const totalRevenue = completed.reduce((sum, b) => sum + b.fare, 0);
  const avgFare = completed.length === 0 ? 0 : Math.round(totalRevenue / completed.length);

  const cards = [
    { label: "Total bookings", value: String(bookings.length) },
    { label: "Completed", value: String(completed.length) },
    { label: "Completion rate", value: `${completionRate}%` },
    { label: "Active drivers", value: `${activeDrivers} of ${drivers.length}` },
    { label: "Active vehicles", value: `${activeVehicles} of ${vehicles.length}` },
    { label: "Average fare", value: formatFare(avgFare) },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Reports</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Aggregate performance across your fleet&apos;s logged bookings.</p>

      <div className="mt-8">
        <FleetNav active="/fleet/reports" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
