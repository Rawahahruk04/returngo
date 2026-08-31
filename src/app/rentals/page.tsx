"use client";

import * as React from "react";
import { Car, Check, Clock, Key, ShipWheel, Truck } from "lucide-react";

import { locationGroups, locations } from "@/features/journey/data/locations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import { submitRentalInquiry } from "@/features/rental/data/store";
import type { RentalCategory, RentalDuration, RentalMode } from "@/features/rental/types";
import { cn } from "@/lib/utils";

const MODE_OPTIONS: SegmentedOption[] = [
  { value: "self-drive", label: "Self Drive", icon: Key },
  { value: "with-driver", label: "With Driver", icon: ShipWheel },
];

const DURATION_OPTIONS: { value: RentalDuration; label: string }[] = [
  { value: "few-hours", label: "A few hours" },
  { value: "full-day", label: "Full day" },
  { value: "multi-day", label: "Multiple days" },
];

const CATEGORIES: { value: RentalCategory; label: string; description: string; icon: typeof Car }[] = [
  { value: "hatchback", label: "Hatchback", description: "City runabouts — 4 seats, easiest to park.", icon: Car },
  { value: "sedan", label: "Sedan", description: "Comfortable for longer stretches — 4 seats.", icon: Car },
  { value: "suv", label: "SUV / MUV", description: "More room and ground clearance — 6-7 seats.", icon: Car },
  { value: "traveller", label: "Traveller", description: "Group travel — 10-12 seats.", icon: Truck },
];

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RentalsPage() {
  const [mode, setMode] = React.useState<RentalMode>("self-drive");
  const [category, setCategory] = React.useState<RentalCategory>("hatchback");
  const [duration, setDuration] = React.useState<RentalDuration>("full-day");
  const [locationId, setLocationId] = React.useState("mangalore");
  const [date, setDate] = React.useState(todayISODate());
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    submitRentalInquiry({ mode, category, duration, locationId, date });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success mx-auto">
          <Check className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-foreground sm:text-3xl">Request received</h1>
        <p className="mt-3 text-muted-foreground">
          A ReturnGo rental partner will reach out with pricing and availability for your{" "}
          {CATEGORIES.find((c) => c.value === category)?.label.toLowerCase()} request.
        </p>
        <Button size="lg" className="mt-8" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Hire a vehicle, not a taxi.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        A separate product from Book Taxi — rent self-drive or with a driver, for however long you need it. No
        return-leg matching here, just a straightforward vehicle hire.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <div>
          <Label className="mb-3 block">How do you want to drive?</Label>
          <SegmentedControl name="mode" options={MODE_OPTIONS} value={mode} onChange={(v) => setMode(v as RentalMode)} />
        </div>

        <div>
          <Label className="mb-3 block">Vehicle category</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map((option) => {
              const Icon = option.icon;
              const checked = category === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1.5 rounded-lg border p-4 transition-colors",
                    checked ? "border-secondary bg-secondary/8" : "border-border hover:border-secondary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="category"
                    className="sr-only"
                    checked={checked}
                    onChange={() => setCategory(option.value)}
                  />
                  <span className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <Icon className={cn("size-4", checked ? "text-secondary" : "text-muted-foreground")} />
                    {option.label}
                  </span>
                  <span className="text-sm text-muted-foreground">{option.description}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="mb-3 flex items-center gap-1.5">
            <Clock className="size-3.5" /> Duration
          </Label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDuration(option.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  duration === option.value
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="rental-location" className="mb-2 block">
              Pickup location
            </Label>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger id="rental-location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locationGroups.map((group) => {
                  const options = locations.filter((location) => location.category === group.category);
                  if (options.length === 0) return null;
                  return (
                    <SelectGroup key={group.category}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {options.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rental-date" className="mb-2 block">
              Start date
            </Label>
            <input
              id="rental-date"
              type="date"
              min={todayISODate()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-2">
          Request this rental
        </Button>
      </form>
    </section>
  );
}
