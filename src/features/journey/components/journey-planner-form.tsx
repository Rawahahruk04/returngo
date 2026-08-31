"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowLeft, Car, Check, HeartPulse, MapPin, Plane, Route as RouteIcon, Search, Users } from "lucide-react";

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
import { cn } from "@/lib/utils";

const journeyTypeOptions: SegmentedOption[] = [
  { value: "airport", label: "Airport", icon: Plane },
  { value: "hospital", label: "Hospital", icon: HeartPulse },
  { value: "intercity", label: "Intercity", icon: RouteIcon },
  { value: "local", label: "Local", icon: MapPin },
];

const TRIP_TYPE_OPTIONS: { value: "entire" | "share"; icon: typeof Car; title: string; description: string }[] = [
  { value: "share", icon: Users, title: "Share Seat", description: "Save money by joining a return leg or a shared departure heading your way." },
  { value: "entire", icon: Car, title: "Entire Taxi", description: "Book the whole vehicle — family trips, hospital emergencies, or when you'd rather not share." },
];

const STEPS = ["Purpose", "Trip Type", "Journey Details"] as const;

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function JourneyPlannerForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
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
      tripType: "share",
      flexible: false,
    },
  });

  const journeyType = useWatch({ control, name: "journeyType" });
  const tripType = useWatch({ control, name: "tripType" });

  function onSubmit(values: JourneyPlanFormValues) {
    const params = new URLSearchParams({
      from: values.originId,
      to: values.destinationId,
      date: values.date,
      time: values.time,
      passengers: String(values.passengers),
      type: values.journeyType,
      tripType: values.tripType,
      flexible: String(values.flexible),
    });
    router.push(`/matches?${params.toString()}`);
  }

  function goNext() {
    if (step === 2) return;
    setStep((s) => s + 1);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <ol className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
                index < step
                  ? "bg-secondary text-secondary-foreground"
                  : index === step
                    ? "border border-secondary text-secondary"
                    : "border border-border text-muted-foreground",
              )}
            >
              {index < step ? <Check className="size-3" /> : index + 1}
            </span>
            <span className={cn("text-xs font-medium", index === step ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {index < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div>
          <Label className="mb-3 block">What&apos;s this journey for?</Label>
          <Controller
            control={control}
            name="journeyType"
            render={({ field }) => (
              <SegmentedControl name={field.name} options={journeyTypeOptions} value={field.value} onChange={field.onChange} />
            )}
          />
          <Button type="button" size="lg" className="mt-6" onClick={goNext}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div>
          <Label className="mb-3 block">How would you like to travel?</Label>
          <Controller
            control={control}
            name="tripType"
            render={({ field }) => (
              <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
                {TRIP_TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const checked = field.value === option.value;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors",
                        checked ? "border-secondary bg-secondary/8" : "border-border hover:border-secondary/40",
                      )}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={checked}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-2">
                        <Icon className={cn("size-5", checked ? "text-secondary" : "text-muted-foreground")} />
                        <span className="font-display text-base font-semibold text-foreground">{option.title}</span>
                        {option.value === "share" && (
                          <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                            Save money
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{option.description}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          <div className="mt-6 flex gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(0)}>
              <ArrowLeft /> Back
            </Button>
            <Button type="button" size="lg" onClick={goNext}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
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

          <div className="flex gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
              <ArrowLeft /> Back
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              <Search /> Find smart matches
            </Button>
          </div>

          {journeyType === "hospital" && (
            <p className="text-xs text-muted-foreground">
              We&apos;ll prioritise arriving with buffer before your appointment time.
            </p>
          )}
          {tripType === "entire" && (
            <p className="text-xs text-muted-foreground">
              You&apos;ll see dedicated-vehicle options only — no seat sharing.
            </p>
          )}
        </div>
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
