"use client";

import * as React from "react";
import { Car, Check, Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FUEL_LABEL, POPULAR_VEHICLES, TRANSMISSION_LABEL } from "@/features/driver/lib/vehicles";
import type { DriverVehicle, FuelType, TransmissionType } from "@/features/driver/types";
import { cn } from "@/lib/utils";

const EMPTY_MANUAL: DriverVehicle = { name: "", seats: 4, fuel: "petrol", transmission: "manual", ac: true };

/**
 * Replaces the old 4-item vehicle dropdown: a search box over the
 * popular-vehicles catalogue, with a manual "Add my vehicle" fallback
 * for anything not in that list. Used once, in the Driver Profile —
 * publishing a journey never touches this component.
 */
export function VehicleSelector({
  value,
  onChange,
}: {
  value: DriverVehicle | null;
  onChange: (vehicle: DriverVehicle) => void;
}) {
  const [mode, setMode] = React.useState<"search" | "manual">("search");
  const [query, setQuery] = React.useState("");
  const [manual, setManual] = React.useState<DriverVehicle>(value ?? EMPTY_MANUAL);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_VEHICLES;
    return POPULAR_VEHICLES.filter((vehicle) => vehicle.name.toLowerCase().includes(q));
  }, [query]);

  function selectPopular(vehicle: DriverVehicle) {
    onChange(vehicle);
  }

  function submitManual() {
    if (!manual.name.trim()) return;
    onChange(manual);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("search")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            mode === "search" ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          Search vehicles
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            mode === "manual" ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <Plus className="size-3.5" /> Add my vehicle
        </button>
      </div>

      {value && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-secondary/40 bg-secondary/5 px-3.5 py-2.5">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Check className="size-4 text-secondary" /> {value.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {value.seats} seats · {FUEL_LABEL[value.fuel]} · {TRANSMISSION_LABEL[value.transmission]}
            {value.ac ? " · AC" : ""}
          </p>
        </div>
      )}

      {mode === "search" ? (
        <div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search popular vehicles (e.g. Innova, Ertiga, Dzire)"
              className="pl-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <ul className="mt-2 max-h-64 overflow-y-auto rounded-md border border-border">
            {results.length === 0 ? (
              <li className="p-4 text-center text-sm text-muted-foreground">
                No match — try &quot;Add my vehicle&quot; instead.
              </li>
            ) : (
              results.map((vehicle) => (
                <li key={vehicle.name}>
                  <button
                    type="button"
                    onClick={() => selectPopular(vehicle)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-b border-border px-3.5 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-muted",
                      value?.name === vehicle.name && "bg-secondary/8",
                    )}
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Car className="size-4 text-muted-foreground" /> {vehicle.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3.5" /> {vehicle.seats}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-md border border-dashed border-border p-4">
          <div>
            <Label htmlFor="manual-vehicle-name" className="mb-2 block">
              Vehicle name
            </Label>
            <Input
              id="manual-vehicle-name"
              placeholder="e.g. Chevrolet Tavera"
              value={manual.name}
              onChange={(event) => setManual((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="manual-vehicle-seats" className="mb-2 block">
                Seats
              </Label>
              <Input
                id="manual-vehicle-seats"
                type="number"
                min={1}
                max={20}
                value={manual.seats}
                onChange={(event) => setManual((prev) => ({ ...prev, seats: Number(event.target.value) || 1 }))}
              />
            </div>

            <div>
              <Label className="mb-2 block">Fuel</Label>
              <Select value={manual.fuel} onValueChange={(v) => setManual((prev) => ({ ...prev, fuel: v as FuelType }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FUEL_LABEL) as FuelType[]).map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {FUEL_LABEL[fuel]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Transmission</Label>
              <Select
                value={manual.transmission}
                onValueChange={(v) => setManual((prev) => ({ ...prev, transmission: v as TransmissionType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TRANSMISSION_LABEL) as TransmissionType[]).map((transmission) => (
                    <SelectItem key={transmission} value={transmission}>
                      {TRANSMISSION_LABEL[transmission]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={manual.ac}
              onChange={(event) => setManual((prev) => ({ ...prev, ac: event.target.checked }))}
            />
            <span className="text-sm text-muted-foreground">Air conditioned</span>
          </label>

          <Button type="button" size="sm" className="self-start" disabled={!manual.name.trim()} onClick={submitManual}>
            Use this vehicle
          </Button>
        </div>
      )}
    </div>
  );
}
