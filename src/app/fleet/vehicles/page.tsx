"use client";

import * as React from "react";
import { Car, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addVehicle, removeVehicle, updateVehicle, useFleetStore } from "@/features/fleet/data/store";
import { FleetNav } from "@/features/fleet/components/fleet-nav";
import type { FleetVehicle, FleetVehicleInput, FleetVehicleStatus } from "@/features/fleet/types";
import { VEHICLE_CATEGORIES, VEHICLE_CATEGORY_LABEL, type VehicleCategory } from "@/lib/vehicle-categories";

const EMPTY: FleetVehicleInput = { name: "", plate: "", category: "sedan", status: "active" };

export default function FleetVehiclesPage() {
  const { vehicles } = useFleetStore();
  const [editingId, setEditingId] = React.useState<string | "new" | null>(null);
  const [form, setForm] = React.useState<FleetVehicleInput>(EMPTY);

  function startAdd() {
    setForm(EMPTY);
    setEditingId("new");
  }
  function startEdit(vehicle: FleetVehicle) {
    setForm(vehicle);
    setEditingId(vehicle.id);
  }
  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.plate.trim()) return;
    if (editingId === "new") addVehicle(form);
    else if (editingId) updateVehicle(editingId, form);
    setEditingId(null);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Manage vehicles</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Your fleet&apos;s vehicle roster.</p>

      <div className="mt-8">
        <FleetNav active="/fleet/vehicles" />
      </div>

      {editingId ? (
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="fleet-vehicle-name" className="mb-2 block">
                Vehicle name
              </Label>
              <Input id="fleet-vehicle-name" placeholder="e.g. Toyota Innova Crysta" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="fleet-vehicle-plate" className="mb-2 block">
                Registration
              </Label>
              <Input id="fleet-vehicle-plate" placeholder="e.g. KA-19-B-4021" value={form.plate} onChange={(e) => setForm((p) => ({ ...p, plate: e.target.value }))} required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
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
              <Label className="mb-2 block">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as FleetVehicleStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <Plus /> Add vehicle
        </Button>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {vehicles.length === 0 && !editingId && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No vehicles on your roster yet.
          </div>
        )}
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Car className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{vehicle.name}</p>
                <p className="text-xs text-muted-foreground">
                  {vehicle.plate} · {VEHICLE_CATEGORY_LABEL[vehicle.category]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={vehicle.status === "active" ? "success" : "warning"}>{vehicle.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => startEdit(vehicle)}>
                <Pencil />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removeVehicle(vehicle.id)}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
