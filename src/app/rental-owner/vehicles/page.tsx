"use client";

import * as React from "react";
import { Car, Pencil, Plus, Trash2, Users } from "lucide-react";

import { getLocation, locationGroups, locations } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount } from "@/features/auth/data/account-store";
import { FUEL_LABEL, TRANSMISSION_LABEL } from "@/features/driver/lib/vehicles";
import { addVehicle, removeVehicle, updateVehicle, useRentalCatalog } from "@/features/rental/data/catalog-store";
import { OwnerNav } from "@/features/rental-owner/components/owner-nav";
import type { RentalFuel, RentalTransmission, RentalVehicle, RentalVehicleInput } from "@/features/rental/types";
import { VEHICLE_CATEGORIES, VEHICLE_CATEGORY_LABEL, type VehicleCategory } from "@/lib/vehicle-categories";

function emptyForm(ownerName: string): RentalVehicleInput {
  return {
    ownerName,
    brand: "",
    model: "",
    category: "hatchback",
    transmission: "manual",
    fuel: "petrol",
    seats: 4,
    pricePerDay: 1500,
    locationId: "mangalore",
    driverAvailable: false,
    available: true,
  };
}

export default function RentalOwnerVehiclesPage() {
  const { account } = useAccount();
  const catalog = useRentalCatalog();
  const [editingId, setEditingId] = React.useState<string | "new" | null>(null);
  const [form, setForm] = React.useState<RentalVehicleInput>(emptyForm(account?.name ?? ""));

  if (!account) return null;
  const myVehicles = catalog.filter((v) => v.ownerName === account.name);

  function startAdd() {
    setForm(emptyForm(account!.name));
    setEditingId("new");
  }

  function startEdit(vehicle: RentalVehicle) {
    setForm(vehicle);
    setEditingId(vehicle.id);
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) return;
    if (editingId === "new") {
      addVehicle(form);
    } else if (editingId) {
      updateVehicle(editingId, form);
    }
    setEditingId(null);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">My vehicles</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Vehicles you list here appear immediately in the public Rent Vehicle marketplace.
      </p>

      <div className="mt-8">
        <OwnerNav active="/rental-owner/vehicles" />
      </div>

      {editingId ? (
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {editingId === "new" ? "Add a vehicle" : "Edit vehicle"}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="owner-vehicle-brand" className="mb-2 block">
                Brand
              </Label>
              <Input id="owner-vehicle-brand" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="owner-vehicle-model" className="mb-2 block">
                Model
              </Label>
              <Input id="owner-vehicle-model" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} required />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label className="mb-2 block">Vehicle type</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as VehicleCategory }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
              <Select value={form.transmission} onValueChange={(v) => setForm((p) => ({ ...p, transmission: v as RentalTransmission }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
              <Select value={form.fuel} onValueChange={(v) => setForm((p) => ({ ...p, fuel: v as RentalFuel }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FUEL_LABEL) as RentalFuel[]).map((f) => (
                    <SelectItem key={f} value={f}>
                      {FUEL_LABEL[f]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="owner-vehicle-seats" className="mb-2 block">
                Seats
              </Label>
              <Input
                id="owner-vehicle-seats"
                type="number"
                min={1}
                max={20}
                value={form.seats}
                onChange={(e) => setForm((p) => ({ ...p, seats: Number(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="owner-vehicle-price" className="mb-2 block">
                Price per day (₹)
              </Label>
              <Input
                id="owner-vehicle-price"
                type="number"
                min={1}
                value={form.pricePerDay}
                onChange={(e) => setForm((p) => ({ ...p, pricePerDay: Number(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label className="mb-2 block">Pickup location</Label>
              <Select value={form.locationId} onValueChange={(v) => setForm((p) => ({ ...p, locationId: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={form.driverAvailable}
                onChange={(e) => setForm((p) => ({ ...p, driverAvailable: e.target.checked }))}
              />
              <span className="text-sm text-muted-foreground">Available with driver</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox checked={form.available} onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))} />
              <span className="text-sm text-muted-foreground">Listed (visible to renters)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" size="lg">
              {editingId === "new" ? "Add vehicle" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button size="sm" className="mt-6" onClick={startAdd}>
          <Plus /> Add a vehicle
        </Button>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {myVehicles.length === 0 && !editingId && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            You haven&apos;t listed a vehicle yet.
          </div>
        )}
        {myVehicles.map((vehicle) => (
          <article key={vehicle.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Car className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {VEHICLE_CATEGORY_LABEL[vehicle.category]} · {getLocation(vehicle.locationId)?.name}
                  </p>
                </div>
              </div>
              <Badge variant={vehicle.available ? "success" : "neutral"}>{vehicle.available ? "Listed" : "Unlisted"}</Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {vehicle.seats} seats
              </span>
              <span>{FUEL_LABEL[vehicle.fuel]}</span>
              <span>{TRANSMISSION_LABEL[vehicle.transmission]}</span>
              <span className="font-mono font-semibold text-foreground">{formatFare(vehicle.pricePerDay)}/day</span>
            </div>

            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <Button size="sm" variant="outline" onClick={() => startEdit(vehicle)}>
                <Pencil /> Edit
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removeVehicle(vehicle.id)}>
                <Trash2 /> Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
