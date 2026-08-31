"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { HeartPulse, Plane, Route as RouteIcon, Send, UserCog } from "lucide-react";

import { locationGroups, locations } from "@/features/journey/data/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useDriverAuth } from "@/features/driver/data/auth-store";
import { publishJourney } from "@/features/driver/data/store";
import { publishJourneySchema, type PublishJourneyFormValues } from "@/features/driver/lib/schema";

const purposeOptions: SegmentedOption[] = [
  { value: "airport", label: "Airport", icon: Plane },
  { value: "hospital", label: "Hospital", icon: HeartPulse },
  { value: "intercity", label: "Intercity", icon: RouteIcon },
];

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PublishJourneyForm() {
  const router = useRouter();
  const { profile } = useDriverAuth();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublishJourneyFormValues>({
    resolver: zodResolver(publishJourneySchema),
    defaultValues: {
      originId: "bhatkal",
      destinationId: "mangalore-airport",
      date: todayISODate(),
      time: "07:00",
      seatsTotal: profile?.vehicle?.seats ?? 4,
      purpose: "airport",
      price: 900,
    },
  });

  if (!profile?.vehicle || !profile.vehicleRegistration) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-border p-6 text-center sm:items-center">
        <UserCog className="size-8 text-secondary" />
        <div>
          <p className="font-display text-lg font-semibold text-foreground">Complete your driver profile first</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add your vehicle and registration once — every journey you publish after that only asks for the trip
            itself.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/driver/profile">Set up driver profile</Link>
        </Button>
      </div>
    );
  }

  function onSubmit(values: PublishJourneyFormValues) {
    if (!profile?.vehicle) return;
    const journey = publishJourney({
      ...values,
      driverName: profile.name,
      vehicleName: profile.vehicle.name,
      vehiclePlate: profile.vehicleRegistration,
    });
    router.push(`/driver/journeys#${journey.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-muted px-3.5 py-2.5 text-sm">
        <span className="text-muted-foreground">
          Driving as <span className="font-medium text-foreground">{profile.name}</span> ·{" "}
          {profile.vehicle.name} · {profile.vehicleRegistration}
        </span>
        <Link href="/driver/profile" className="shrink-0 font-medium text-secondary hover:underline">
          Change
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="originId" className="mb-2 block">
            Origin
          </Label>
          <Controller
            control={control}
            name="originId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="originId" aria-invalid={Boolean(errors.originId)}>
                  <SelectValue placeholder="Where does the journey start?" />
                </SelectTrigger>
                <LocationSelectContent />
              </Select>
            )}
          />
          {errors.originId && <p className="mt-1.5 text-xs text-destructive">{errors.originId.message}</p>}
        </div>

        <div>
          <Label htmlFor="destinationId" className="mb-2 block">
            Destination
          </Label>
          <Controller
            control={control}
            name="destinationId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="destinationId" aria-invalid={Boolean(errors.destinationId)}>
                  <SelectValue placeholder="Where does the journey end?" />
                </SelectTrigger>
                <LocationSelectContent />
              </Select>
            )}
          />
          {errors.destinationId && <p className="mt-1.5 text-xs text-destructive">{errors.destinationId.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="date" className="mb-2 block">
            Departure date
          </Label>
          <Input id="date" type="date" min={todayISODate()} aria-invalid={Boolean(errors.date)} {...register("date")} />
          {errors.date && <p className="mt-1.5 text-xs text-destructive">{errors.date.message}</p>}
        </div>

        <div>
          <Label htmlFor="time" className="mb-2 block">
            Departure time
          </Label>
          <Input id="time" type="time" aria-invalid={Boolean(errors.time)} {...register("time")} />
          {errors.time && <p className="mt-1.5 text-xs text-destructive">{errors.time.message}</p>}
        </div>

        <div>
          <Label htmlFor="seatsTotal" className="mb-2 block">
            Available seats
          </Label>
          <Controller
            control={control}
            name="seatsTotal"
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger id="seatsTotal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((count) => (
                    <SelectItem key={count} value={String(count)}>
                      {count} {count === 1 ? "seat" : "seats"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price" className="mb-2 block">
            Price (₹, whole journey)
          </Label>
          <Input
            id="price"
            type="number"
            min={1}
            aria-invalid={Boolean(errors.price)}
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="mt-1.5 text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div>
          <Label className="mb-3 block">Journey purpose</Label>
          <Controller
            control={control}
            name="purpose"
            render={({ field }) => (
              <SegmentedControl name={field.name} options={purposeOptions} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="mb-2 block">
          Notes for passengers (optional)
        </Label>
        <Input id="notes" placeholder="e.g. Boarding at the NH66 junction, not the bus stand" {...register("notes")} />
        {errors.notes && <p className="mt-1.5 text-xs text-destructive">{errors.notes.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        <Send /> Publish journey
      </Button>
    </form>
  );
}

function LocationSelectContent() {
  return (
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
  );
}
