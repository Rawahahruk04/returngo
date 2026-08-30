"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { HeartPulse, Plane, Route as RouteIcon, Send } from "lucide-react";

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
import { publishJourney } from "@/features/driver/data/store";
import { publishJourneySchema, type PublishJourneyFormValues } from "@/features/driver/lib/schema";
import { VEHICLE_DEFAULT_SEATS, VEHICLE_OPTIONS } from "@/features/driver/lib/vehicles";

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
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PublishJourneyFormValues>({
    resolver: zodResolver(publishJourneySchema),
    defaultValues: {
      driverName: "",
      vehicleType: "innova",
      vehiclePlate: "",
      originId: "bhatkal",
      destinationId: "mangalore-airport",
      date: todayISODate(),
      time: "07:00",
      seatsTotal: VEHICLE_DEFAULT_SEATS.innova,
      purpose: "airport",
    },
  });

  const vehicleType = useWatch({ control, name: "vehicleType" });

  function onSubmit(values: PublishJourneyFormValues) {
    const journey = publishJourney(values);
    router.push(`/driver/journeys#${journey.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="driverName" className="mb-2 block">
            Driver name
          </Label>
          <Input id="driverName" placeholder="e.g. Mohammed Ashfaq" aria-invalid={Boolean(errors.driverName)} {...register("driverName")} />
          {errors.driverName && <p className="mt-1.5 text-xs text-destructive">{errors.driverName.message}</p>}
        </div>

        <div>
          <Label htmlFor="vehiclePlate" className="mb-2 block">
            Vehicle registration
          </Label>
          <Input id="vehiclePlate" placeholder="e.g. KA-19-B-4021" aria-invalid={Boolean(errors.vehiclePlate)} {...register("vehiclePlate")} />
          {errors.vehiclePlate && <p className="mt-1.5 text-xs text-destructive">{errors.vehiclePlate.message}</p>}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Vehicle type</Label>
        <Controller
          control={control}
          name="vehicleType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setValue("seatsTotal", VEHICLE_DEFAULT_SEATS[value as keyof typeof VEHICLE_DEFAULT_SEATS]);
              }}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Suggested seats for {VEHICLE_OPTIONS.find((v) => v.value === vehicleType)?.label}:{" "}
          {VEHICLE_DEFAULT_SEATS[vehicleType]}
        </p>
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
