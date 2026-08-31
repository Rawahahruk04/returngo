"use client";

import * as React from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

import { getLocation, locationGroups, locations } from "@/features/journey/data/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addSavedLocation, removeSavedLocation, usePassengerStore } from "@/features/passenger/data/store";
import { PassengerNav } from "@/features/passenger/components/passenger-nav";

export default function PassengerSavedLocationsPage() {
  const { savedLocations } = usePassengerStore();
  const [label, setLabel] = React.useState("");
  const [locationId, setLocationId] = React.useState(locations[0]?.id ?? "");

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!label.trim() || !locationId) return;
    addSavedLocation({ label: label.trim(), locationId });
    setLabel("");
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Passenger</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Saved locations</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Shortcuts for the places you travel to most.</p>

      <div className="mt-8">
        <PassengerNav active="/passenger/saved" />
      </div>

      <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="saved-location-label" className="mb-2 block">
            Label
          </Label>
          <Input id="saved-location-label" placeholder="e.g. Home, Mum's place" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label className="mb-2 block">Location</Label>
          <Select value={locationId} onValueChange={setLocationId}>
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
        <Button type="submit" size="md">
          <Plus /> Add
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {savedLocations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved locations yet.</p>
        ) : (
          savedLocations.map((saved) => (
            <div key={saved.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{saved.label}</p>
                  <p className="text-xs text-muted-foreground">{getLocation(saved.locationId)?.name}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removeSavedLocation(saved.id)}>
                <Trash2 />
              </Button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
