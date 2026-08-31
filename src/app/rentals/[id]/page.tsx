"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Car, Fuel, Gauge, Key, ShipWheel, Users } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import { getVehicleById, useRentalCatalog } from "@/features/rental/data/catalog-store";
import { FUEL_LABEL, TRANSMISSION_LABEL } from "@/features/driver/lib/vehicles";
import { daysBetween } from "@/features/rental/lib/pricing";
import { VEHICLE_CATEGORY_LABEL } from "@/lib/vehicle-categories";
import type { RentalMode } from "@/features/rental/types";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RentalVehicleDetailsPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  useRentalCatalog(); // subscribe so edits from the owner dashboard are reflected live

  const vehicleId = decodeURIComponent(params.id);
  const vehicle = getVehicleById(vehicleId);

  const [mode, setMode] = React.useState<RentalMode>("self-drive");
  const [pickupDate, setPickupDate] = React.useState(searchParams.get("pickup") ?? todayISODate());
  const [returnDate, setReturnDate] = React.useState(searchParams.get("return") ?? todayISODate());

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

  const modeOptions: SegmentedOption[] = [
    { value: "self-drive", label: "Self Drive", icon: Key },
    ...(vehicle.driverAvailable ? [{ value: "with-driver", label: "With Driver", icon: ShipWheel }] : []),
  ];

  function goToCheckout() {
    const query = new URLSearchParams({ pickup: pickupDate, return: returnDate, mode }).toString();
    router.push(`/rentals/${encodeURIComponent(vehicle!.id)}/checkout?${query}`);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <Link href="/rentals" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to Rent Vehicle
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <Car className="size-7" />
        </span>
        <div>
          <Badge variant="neutral">{VEHICLE_CATEGORY_LABEL[vehicle.category]}</Badge>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{location?.name}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
            <Users className="size-3" /> Seats
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">{vehicle.seats}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
            <Fuel className="size-3" /> Fuel
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">{FUEL_LABEL[vehicle.fuel]}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
            <Gauge className="size-3" /> Transmission
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">{TRANSMISSION_LABEL[vehicle.transmission]}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <Label className="mb-3 block">How would you like to drive?</Label>
        <SegmentedControl name="mode" options={modeOptions} value={mode} onChange={(v) => setMode(v as RentalMode)} />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="rental-pickup-date" className="mb-2 block">
              Pickup date
            </Label>
            <input
              id="rental-pickup-date"
              type="date"
              min={todayISODate()}
              value={pickupDate}
              onChange={(event) => setPickupDate(event.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <Label htmlFor="rental-return-date" className="mb-2 block">
              Return date
            </Label>
            <input
              id="rental-return-date"
              type="date"
              min={pickupDate}
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <div>
            <p className="text-xs text-muted-foreground">
              {days} {days === 1 ? "day" : "days"} · {formatFare(vehicle.pricePerDay)}/day
            </p>
            <p className="font-mono text-xl font-semibold tabular-nums text-foreground">
              {formatFare(vehicle.pricePerDay * days)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">before driver fee</span>
            </p>
          </div>
          <Button size="lg" onClick={goToCheckout}>
            Continue to checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
