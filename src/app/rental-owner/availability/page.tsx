"use client";

import { Car } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { useAccount } from "@/features/auth/data/account-store";
import { setVehicleAvailability, useRentalCatalog } from "@/features/rental/data/catalog-store";
import { OwnerNav } from "@/features/rental-owner/components/owner-nav";
import { cn } from "@/lib/utils";

export default function RentalOwnerAvailabilityPage() {
  const { account } = useAccount();
  const catalog = useRentalCatalog();
  if (!account) return null;

  const myVehicles = catalog.filter((v) => v.ownerName === account.name);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Availability</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Toggle a vehicle off when it&apos;s in for service, or on to make it bookable again.
      </p>

      <div className="mt-8">
        <OwnerNav active="/rental-owner/availability" />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {myVehicles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            List a vehicle first to manage its availability.
          </div>
        ) : (
          myVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Car className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-xs text-muted-foreground">{getLocation(vehicle.locationId)?.name}</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={vehicle.available}
                onClick={() => setVehicleAvailability(vehicle.id, !vehicle.available)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  vehicle.available ? "bg-success" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                    vehicle.available ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
