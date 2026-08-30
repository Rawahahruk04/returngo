"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { HeartPulse, Plane, Car, Route as RouteIcon, Search } from "lucide-react";

import { locationGroups, locations } from "@/features/journey/data/locations";
import { journeyPlanSchema, type JourneyPlanFormValues } from "@/features/journey/lib/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const journeyTypeOptions: SegmentedOption[] = [
  { value: "airport", label: "Airport", icon: Plane },
  { value: "hospital", label: "Hospital", icon: HeartPulse },
  { value: "intercity", label: "Intercity", icon: RouteIcon },
  { value: "rental", label: "Rental", icon: Car },
];

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function JourneyPlannerForm() {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JourneyPlanFormValues>({
    resolver: zodResolver(journeyPlanSchema),
    defaultValues: {
      originId: "bhatkal",
      destinationId: "mangalore-airport",
      date: todayISODate(),
      time: "06:45",
      passengers: 1,
      journeyType: "airport",
      flexible: false,
    },
  });

  const journeyType = useWatch({ control, name: "journeyType" });

  function onSubmit(values: JourneyPlanFormValues) {
    const params = new URLSearchParams({
      from: values.originId,
      to: values.destinationId,
      date: values.date,
      time: values.time,
      passengers: String(values.passengers),
      type: values.journeyType,
      flexible: String(values.flexible),
    });
    router.push(`/matches?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div>
        <Label className="mb-3 block">Journey type</Label>
        <Controller
          control={control}
          name="journeyType"
          render={({ field }) => (
            <SegmentedControl
              name={field.name}
              options={journeyTypeOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
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
                  <SelectValue placeholder="Where are you travelling from?" />
                </SelectTrigger>
                <LocationSelectContent />
              </Select>
            )}
          />
          {errors.originId && (
            <p className="mt-1.5 text-xs text-destructive">{errors.originId.message}</p>
          )}
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
                  <SelectValue placeholder="Where are you headed?" />
                </SelectTrigger>
                <LocationSelectContent />
              </Select>
            )}
          />
          {errors.destinationId && (
            <p className="mt-1.5 text-xs text-destructive">{errors.destinationId.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="date" className="mb-2 block">
            Travel date
          </Label>
          <Input id="date" type="date" min={todayISODate()} {...register("date")} />
          {errors.date && <p className="mt-1.5 text-xs text-destructive">{errors.date.message}</p>}
        </div>

        <div>
          <Label htmlFor="time" className="mb-2 block">
            Preferred time
          </Label>
          <Input id="time" type="time" {...register("time")} />
          {errors.time && <p className="mt-1.5 text-xs text-destructive">{errors.time.message}</p>}
        </div>

        <div>
          <Label htmlFor="passengers" className="mb-2 block">
            Passengers
          </Label>
          <Controller
            control={control}
            name="passengers"
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger id="passengers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((count) => (
                    <SelectItem key={count} value={String(count)}>
                      {count} {count === 1 ? "passenger" : "passengers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox {...register("flexible")} className="mt-0.5" />
        <span className="text-sm text-muted-foreground">
          I can shift my departure by an hour or two — show me more return-journey matches.
        </span>
      </label>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        <Search /> Find smart matches
      </Button>

      {journeyType === "hospital" && (
        <p className="text-xs text-muted-foreground">
          We&apos;ll prioritise arriving with buffer before your appointment time.
        </p>
      )}
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
