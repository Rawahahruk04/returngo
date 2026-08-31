"use client";

import Link from "next/link";
import { ArrowRight, Car, ClipboardList, IndianRupee, Users } from "lucide-react";

import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/features/auth/data/account-store";
import { useFleetStore } from "@/features/fleet/data/store";
import { FleetNav } from "@/features/fleet/components/fleet-nav";

export default function FleetDashboardPage() {
  const { account } = useAccount();
  const { drivers, vehicles, bookings } = useFleetStore();
  if (!account) return null;

  const totalRevenue = bookings.reduce((sum, b) => sum + b.fare, 0);
  const recentBookings = [...bookings].slice(0, 3);
  const cards = [
    { icon: Users, value: String(drivers.length), label: "Drivers" },
    { icon: Car, value: String(vehicles.length), label: "Vehicles" },
    { icon: ClipboardList, value: String(bookings.length), label: "Bookings logged" },
    { icon: IndianRupee, value: formatFare(totalRevenue), label: "Total revenue" },
  ];

  const shortcuts = [
    { href: "/fleet/drivers", label: "Manage drivers" },
    { href: "/fleet/vehicles", label: "Manage vehicles" },
    { href: "/fleet/bookings", label: "Log a booking" },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Welcome back, {account.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">An operations console for your fleet of drivers and vehicles.</p>

      <div className="mt-8">
        <FleetNav active="/fleet" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        {recentBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Logged bookings will show up here.</p>
        ) : (
          recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <ClipboardList className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{booking.route}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.passengerLabel} · {booking.date}
                  </p>
                </div>
              </div>
              <Badge variant={booking.status === "completed" ? "success" : "info"}>{booking.status}</Badge>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
