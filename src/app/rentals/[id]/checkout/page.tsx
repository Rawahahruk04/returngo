"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Key, ShipWheel } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stat } from "@/components/ui/stat";
import { useAccount } from "@/features/auth/data/account-store";
import { getVehicleById } from "@/features/rental/data/catalog-store";
import { createBooking } from "@/features/rental/data/booking-store";
import { computeRentalTotal, daysBetween, DRIVER_FEE_PER_DAY } from "@/features/rental/lib/pricing";
import { VEHICLE_CATEGORY_LABEL } from "@/lib/vehicle-categories";
import type { RentalMode } from "@/features/rental/types";

export default function RentalCheckoutPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { account } = useAccount();

  const vehicleId = decodeURIComponent(params.id);
  const vehicle = getVehicleById(vehicleId);
  const pickupDate = searchParams.get("pickup") ?? "";
  const returnDate = searchParams.get("return") ?? "";
  const mode: RentalMode = searchParams.get("mode") === "with-driver" ? "with-driver" : "self-drive";

  const [renterName, setRenterName] = React.useState(account?.name ?? "");
  const [confirmed, setConfirmed] = React.useState(false);

  if (!vehicle) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">This vehicle listing couldn&apos;t be found.</p>
        <Button asChild size="sm" className="mt-4">
          <Link href="/rentals">Back to Rent Vehicle</Link>
        </Button>
      </section>
    );
  }

  const location = getLocation(vehicle.locationId);
  const days = daysBetween(pickupDate, returnDate);
  const baseTotal = vehicle.pricePerDay * days;
  const driverFee = mode === "with-driver" ? DRIVER_FEE_PER_DAY * days : 0;
  const total = computeRentalTotal(vehicle.pricePerDay, days, mode);

  function handleConfirm(event: React.FormEvent) {
    event.preventDefault();
    if (!vehicle || !renterName.trim()) return;
    createBooking({
      vehicleId: vehicle.id,
      renterName: renterName.trim(),
      mode,
      pickupDate,
      returnDate,
      locationId: vehicle.locationId,
      totalPrice: total,
    });
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-foreground sm:text-3xl">Booking confirmed</h1>
        <p className="mt-3 text-muted-foreground">
          {vehicle.brand} {vehicle.model} is reserved for {renterName}, {pickupDate} to {returnDate}.
        </p>
        <p className="mt-4 font-mono text-lg font-semibold tabular-nums text-foreground">{formatFare(total)}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/rentals">Browse more vehicles</Link>
          </Button>
          <Button asChild>
            <Link href="/">Back to ReturnGo</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href={`/rentals/${encodeURIComponent(vehicle.id)}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to vehicle
      </Link>

      <h1 className="mt-5 font-display text-3xl font-semibold text-foreground sm:text-4xl">Checkout</h1>
      <p className="mt-3 text-muted-foreground">Review your rental before confirming — no payment collected here.</p>

      <div className="mt-8 flex flex-col gap-6">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {vehicle.brand} {vehicle.model}
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat mono={false} label="Type" value={VEHICLE_CATEGORY_LABEL[vehicle.category]} />
            <Stat mono={false} label="Pickup location" value={location?.name ?? "—"} />
            <Stat
              icon={mode === "with-driver" ? ShipWheel : Key}
              mono={false}
              label="Mode"
              value={mode === "with-driver" ? "With Driver" : "Self Drive"}
            />
            <Stat mono={false} label="Pickup" value={pickupDate} />
            <Stat mono={false} label="Return" value={returnDate} />
            <Stat mono={false} label="Duration" value={`${days} ${days === 1 ? "day" : "days"}`} />
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Price breakdown</h2>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">
                {formatFare(vehicle.pricePerDay)} × {days} {days === 1 ? "day" : "days"}
              </dt>
              <dd className="font-mono tabular-nums text-foreground">{formatFare(baseTotal)}</dd>
            </div>
            {mode === "with-driver" && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">
                  Driver fee — {formatFare(DRIVER_FEE_PER_DAY)} × {days}
                </dt>
                <dd className="font-mono tabular-nums text-foreground">{formatFare(driverFee)}</dd>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-mono text-lg font-semibold tabular-nums text-foreground">{formatFare(total)}</dd>
            </div>
          </dl>
        </section>

        <form onSubmit={handleConfirm} className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
          <Label htmlFor="checkout-name" className="mb-2 block">
            Full name
          </Label>
          <Input
            id="checkout-name"
            placeholder="As per ID"
            value={renterName}
            onChange={(event) => setRenterName(event.target.value)}
            required
          />
          <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
            Confirm booking
          </Button>
        </form>
      </div>
    </section>
  );
}
