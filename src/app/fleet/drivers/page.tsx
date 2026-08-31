"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDriver, removeDriver, updateDriver, useFleetStore } from "@/features/fleet/data/store";
import { FleetNav } from "@/features/fleet/components/fleet-nav";
import type { FleetDriver, FleetDriverInput, FleetDriverStatus } from "@/features/fleet/types";

const EMPTY: FleetDriverInput = { name: "", phone: "", vehicleName: "", status: "active" };

export default function FleetDriversPage() {
  const { drivers } = useFleetStore();
  const [editingId, setEditingId] = React.useState<string | "new" | null>(null);
  const [form, setForm] = React.useState<FleetDriverInput>(EMPTY);

  function startAdd() {
    setForm(EMPTY);
    setEditingId("new");
  }
  function startEdit(driver: FleetDriver) {
    setForm(driver);
    setEditingId(driver.id);
  }
  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    if (editingId === "new") addDriver(form);
    else if (editingId) updateDriver(editingId, form);
    setEditingId(null);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Manage drivers</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Your fleet&apos;s driver roster.</p>

      <div className="mt-8">
        <FleetNav active="/fleet/drivers" />
      </div>

      {editingId ? (
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="fleet-driver-name" className="mb-2 block">
                Name
              </Label>
              <Input id="fleet-driver-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="fleet-driver-phone" className="mb-2 block">
                Phone
              </Label>
              <Input id="fleet-driver-phone" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="fleet-driver-vehicle" className="mb-2 block">
                Assigned vehicle
              </Label>
              <Input
                id="fleet-driver-vehicle"
                placeholder="e.g. Toyota Innova Crysta"
                value={form.vehicleName}
                onChange={(e) => setForm((p) => ({ ...p, vehicleName: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-2 block">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as FleetDriverStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" size="lg">
              {editingId === "new" ? "Add driver" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button size="sm" className="mt-6" onClick={startAdd}>
          <Plus /> Add driver
        </Button>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {drivers.length === 0 && !editingId && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No drivers on your roster yet.
          </div>
        )}
        {drivers.map((driver) => (
          <div key={driver.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <User className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{driver.name}</p>
                <p className="text-xs text-muted-foreground">{driver.phone} · {driver.vehicleName || "No vehicle assigned"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={driver.status === "active" ? "success" : "neutral"}>{driver.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => startEdit(driver)}>
                <Pencil />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removeDriver(driver.id)}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
