"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stat } from "@/components/ui/stat";
import { addBooking, removeBooking, useFleetStore } from "@/features/fleet/data/store";
import { FleetNav } from "@/features/fleet/components/fleet-nav";
import type { FleetBookingInput, FleetBookingStatus } from "@/features/fleet/types";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(driverId: string, vehicleId: string): FleetBookingInput {
  return { driverId, vehicleId, passengerLabel: "", route: "", date: todayISODate(), fare: 0, status: "upcoming" };
}

export default function FleetBookingsPage() {
  const { drivers, vehicles, bookings } = useFleetStore();
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState<FleetBookingInput>(emptyForm(drivers[0]?.id ?? "", vehicles[0]?.id ?? ""));

  function startAdd() {
    setForm(emptyForm(drivers[0]?.id ?? "", vehicles[0]?.id ?? ""));
    setAdding(true);
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form.driverId || !form.vehicleId || !form.passengerLabel.trim() || !form.route.trim()) return;
    addBooking(form);
    setAdding(false);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Bookings</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Log trips completed or scheduled across your fleet.</p>

      <div className="mt-8">
        <FleetNav active="/fleet/bookings" />
      </div>

      {adding ? (
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block">Driver</Label>
              <Select value={form.driverId} onValueChange={(v) => setForm((p) => ({ ...p, driverId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Vehicle</Label>
              <Select value={form.vehicleId} onValueChange={(v) => setForm((p) => ({ ...p, vehicleId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="fleet-booking-passenger" className="mb-2 block">
                Passenger
              </Label>
              <Input
                id="fleet-booking-passenger"
                value={form.passengerLabel}
                onChange={(e) => setForm((p) => ({ ...p, passengerLabel: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="fleet-booking-route" className="mb-2 block">
                Route
              </Label>
              <Input
                id="fleet-booking-route"
                placeholder="e.g. Mangalore → Udupi"
                value={form.route}
                onChange={(e) => setForm((p) => ({ ...p, route: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="fleet-booking-date" className="mb-2 block">
                Date
              </Label>
              <Input id="fleet-booking-date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="fleet-booking-fare" className="mb-2 block">
                Fare (₹)
              </Label>
              <Input
                id="fleet-booking-fare"
                type="number"
                min={0}
                value={form.fare}
                onChange={(e) => setForm((p) => ({ ...p, fare: Number(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label className="mb-2 block">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as FleetBookingStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" size="lg" disabled={drivers.length === 0 || vehicles.length === 0}>
              Log booking
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
          {(drivers.length === 0 || vehicles.length === 0) && (
            <p className="text-xs text-muted-foreground">Add at least one driver and vehicle before logging a booking.</p>
          )}
        </form>
      ) : (
        <Button size="sm" className="mt-6" onClick={startAdd}>
          <Plus /> Log a booking
        </Button>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {bookings.length === 0 && !adding && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No bookings logged yet.
          </div>
        )}
        {bookings.map((booking) => {
          const driver = drivers.find((d) => d.id === booking.driverId);
          const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
          return (
            <article key={booking.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{booking.route}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.passengerLabel} · {driver?.name ?? "Unknown driver"} · {vehicle?.name ?? "Unknown vehicle"}
                  </p>
                </div>
                <Badge variant={booking.status === "completed" ? "success" : "info"}>{booking.status}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
                <Stat mono={false} label="Date" value={booking.date} />
                <Stat label="Fare" value={formatFare(booking.fare)} emphasis />
              </dl>
              <div className="mt-4 border-t border-border pt-4">
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removeBooking(booking.id)}>
                  <Trash2 /> Remove
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
