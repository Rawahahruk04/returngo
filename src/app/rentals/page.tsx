"use client";

import * as React from "react";
import Link from "next/link";
import { Car, Fuel, Gauge, Users } from "lucide-react";

import { locationGroups, locations, getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRentalCatalog } from "@/features/rental/data/catalog-store";
import { FUEL_LABEL, TRANSMISSION_LABEL } from "@/features/driver/lib/vehicles";
import { VEHICLE_CATEGORIES, VEHICLE_CATEGORY_LABEL, type VehicleCategory } from "@/lib/vehicle-categories";
import type { RentalFuel, RentalTransmission } from "@/features/rental/types";
import { cn } from "@/lib/utils";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RentalsBrowsePage() {
  const catalog = useRentalCatalog();

  const [category, setCategory] = React.useState<VehicleCategory | "all">("all");
  const [transmission, setTransmission] = React.useState<RentalTransmission | "all">("all");
  const [fuel, setFuel] = React.useState<RentalFuel | "all">("all");
  const [locationId, setLocationId] = React.useState("all");
  const [pickupDate, setPickupDate] = React.useState(todayISODate());
  const [returnDate, setReturnDate] = React.useState(todayISODate());
  const [driverRequired, setDriverRequired] = React.useState(false);

  const results = catalog.filter((vehicle) => {
    if (!vehicle.available) return false;
    if (category !== "all" && vehicle.category !== category) return false;
    if (transmission !== "all" && vehicle.transmission !== transmission) return false;
    if (fuel !== "all" && vehicle.fuel !== fuel) return false;
    if (locationId !== "all" && vehicle.locationId !== locationId) return false;
    if (driverRequired && !vehicle.driverAvailable) return false;
    return true;
  });

  const detailQuery = new URLSearchParams({ pickup: pickupDate, return: returnDate }).toString();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Hire a vehicle, not a taxi.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        A separate marketplace from Book Taxi — browse, filter, and hire self-drive or with a driver. No return-leg
        matching here.
      </p>

      <div className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="mb-2 block">Vehicle type</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as VehicleCategory | "all")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {VEHICLE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {VEHICLE_CATEGORY_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Transmission</Label>
          <Select value={transmission} onValueChange={(v) => setTransmission(v as RentalTransmission | "all")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {(Object.keys(TRANSMISSION_LABEL) as RentalTransmission[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {TRANSMISSION_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Fuel</Label>
          <Select value={fuel} onValueChange={(v) => setFuel(v as RentalFuel | "all")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {(Object.keys(FUEL_LABEL) as RentalFuel[]).map((f) => (
                <SelectItem key={f} value={f}>
                  {FUEL_LABEL[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Pickup location</Label>
          <Select value={locationId} onValueChange={setLocationId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Anywhere</SelectItem>
              {locationGroups.map((group) => {
                const options = locations.filter((l) => l.category === group.category);
                if (options.length === 0) return null;
                return (
                  <SelectGroup key={group.category}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {options.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rentals-pickup-date" className="mb-2 block">
            Pickup date
          </Label>
          <input
            id="rentals-pickup-date"
            type="date"
            min={todayISODate()}
            value={pickupDate}
            onChange={(event) => setPickupDate(event.target.value)}
            className="flex h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div>
          <Label htmlFor="rentals-return-date" className="mb-2 block">
            Return date
          </Label>
          <input
            id="rentals-return-date"
            type="date"
            min={pickupDate}
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
            className="flex h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex items-end pb-2.5 sm:col-span-2 lg:col-span-2">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={driverRequired} onChange={(event) => setDriverRequired(event.target.checked)} />
            <span className="text-sm text-muted-foreground">Driver required</span>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "vehicle" : "vehicles"} available
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((vehicle) => {
          const location = getLocation(vehicle.locationId);
          return (
            <Link
              key={vehicle.id}
              href={`/rentals/${encodeURIComponent(vehicle.id)}?${detailQuery}`}
              className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-secondary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Car className="size-5" />
                </span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {VEHICLE_CATEGORY_LABEL[vehicle.category]}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{location?.name}</p>

              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="size-3.5" /> {vehicle.seats}
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="size-3.5" /> {FUEL_LABEL[vehicle.fuel]}
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="size-3.5" /> {TRANSMISSION_LABEL[vehicle.transmission]}
                </div>
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="font-mono text-base font-semibold tabular-nums text-foreground">
                  {formatFare(vehicle.pricePerDay)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">/day</span>
                </p>
                {vehicle.driverAvailable && (
                  <span className={cn("text-xs font-medium text-secondary")}>Driver available</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No vehicles match these filters — try widening your search.
        </div>
      )}
    </section>
  );
}
