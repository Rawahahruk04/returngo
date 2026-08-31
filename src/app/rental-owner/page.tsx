"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Car, IndianRupee, Plus } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/features/auth/data/account-store";
import { useRentalBookings } from "@/features/rental/data/booking-store";
import { useRentalCatalog } from "@/features/rental/data/catalog-store";
import { OwnerNav } from "@/features/rental-owner/components/owner-nav";

export default function RentalOwnerDashboardPage() {
  const { account } = useAccount();
  const catalog = useRentalCatalog();
  const bookings = useRentalBookings();
  if (!account) return null;

  const myVehicles = catalog.filter((v) => v.ownerName === account.name);
  const myVehicleIds = new Set(myVehicles.map((v) => v.id));
  const myBookings = bookings.filter((b) => myVehicleIds.has(b.vehicleId));
  const totalRevenue = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const recentBookings = [...myBookings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  const cards = [
    { icon: Car, value: String(myVehicles.length), label: "Listed vehicles" },
    { icon: Calendar, value: String(myBookings.length), label: "Total bookings" },
    { icon: IndianRupee, value: formatFare(totalRevenue), label: "Total revenue" },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Welcome back, {account.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Manage your listed vehicles and see how they&apos;re performing.</p>

      <div className="mt-8">
        <OwnerNav active="/rental-owner" />
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
        <Link
          href="/rental-owner/vehicles"
          className="flex items-center justify-between gap-4 rounded-lg border border-secondary/40 bg-secondary/5 p-5 shadow-sm transition-colors hover:bg-secondary/10"
        >
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              <Plus className="mr-1.5 inline size-4" /> List a new vehicle
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Add it once and it&apos;s live in the marketplace instantly.</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link href="/rentals">View public marketplace</Link>
        </Button>
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-foreground">Recent activity</h2>
      <div className="mt-4 flex flex-col gap-3">
        {recentBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bookings for your vehicles will show up here.</p>
        ) : (
          recentBookings.map((booking) => {
            const vehicle = myVehicles.find((v) => v.id === booking.vehicleId);
            return (
              <div key={booking.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Calendar className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicle removed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.renterName} · {getLocation(booking.locationId)?.name}
                    </p>
                  </div>
                </div>
                <Badge variant={booking.mode === "with-driver" ? "info" : "neutral"}>
                  {booking.mode === "with-driver" ? "With Driver" : "Self Drive"}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
