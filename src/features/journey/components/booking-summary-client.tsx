"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Info, ShieldCheck } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { generateConfirmationCode } from "@/features/journey/lib/confirmation";
import { formatDuration, formatFare } from "@/features/journey/lib/geo";
import { addTrip } from "@/features/passenger/data/store";
import {
  passengerDetailsSchema,
  type PassengerDetailsValues,
} from "@/features/journey/lib/booking-schema";
import type { MatchOption } from "@/features/journey/types";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stat } from "@/components/ui/stat";

export function BookingSummaryClient({
  match,
  travelDateLabel,
}: {
  match: MatchOption;
  travelDateLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const [confirmation, setConfirmation] = React.useState<{ code: string; passengerName: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PassengerDetailsValues>({
    resolver: zodResolver(passengerDetailsSchema),
    defaultValues: { name: "", phone: "" },
  });

  const origin = getLocation(match.originId);
  const destination = getLocation(match.destinationId);

  async function onSubmit(values: PassengerDetailsValues) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const code = generateConfirmationCode();
    addTrip({
      matchId: match.id,
      originId: match.originId,
      destinationId: match.destinationId,
      driverName: match.driver.name,
      vehicle: match.driver.vehicle,
      date: travelDateLabel,
      fare: match.fare,
      confirmationCode: code,
    });
    setConfirmation({ code, passengerName: values.name });
  }

  return (
    <AnimatePresence mode="wait">
      {confirmation ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-lg border border-success/30 bg-success/6 p-6 text-center sm:p-10"
        >
          <CheckCircle2 className="mx-auto size-12 text-success" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
            Journey reserved.
          </h2>
          <p className="mt-2 text-muted-foreground">
            {confirmation.passengerName}, your seat with {match.driver.name} from{" "}
            {origin?.name} to {destination?.name} is held.
          </p>
          <p className="mt-4 font-mono text-lg font-semibold tracking-wide text-foreground">
            {confirmation.code}
          </p>
          <p className="mx-auto mt-4 max-w-sm text-xs text-muted-foreground">
            Booking confirmation and payment will be available in a future phase.
            For now, this reservation code is your record of the match.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/plan">Plan another journey</Link>
            </Button>
            <Button asChild>
              <Link href="/">Back to ReturnGo</Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Trip</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat mono={false} label="Route" value={`${origin?.name} → ${destination?.name}`} />
              <Stat mono={false} label="Date" value={travelDateLabel} />
              <Stat mono={false} label="Departure" value={match.departure} />
              <Stat mono={false} label="Pickup" value={match.pickupNote} />
              <Stat mono={false} label="Drop" value={match.dropNote} />
              <Stat mono={false} label="Duration" value={formatDuration(match.durationMinutes)} />
            </dl>
          </section>

          <section className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
            <Avatar className="size-12">
              <AvatarFallback>{getInitials(match.driver.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-medium text-foreground">
                {match.driver.name}
                <ShieldCheck className="size-4 text-secondary" aria-label="Verified driver" />
              </p>
              <p className="text-sm text-muted-foreground">
                {match.driver.vehicle} &middot; {match.driver.vehiclePlate}
              </p>
            </div>
            <Badge variant={match.kind === "return" ? "success" : "neutral"}>{match.badge}</Badge>
          </section>

          <section className="flex items-center justify-between rounded-lg border border-border bg-card p-5 shadow-sm">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Fare</p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">{formatFare(match.fare)}</p>
            </div>
            {match.estimatedSavings > 0 && (
              <div className="text-right">
                <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Savings</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-success">
                  {formatFare(match.estimatedSavings)}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Passenger</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Full name
                </Label>
                <Input id="name" placeholder="As per ID" {...register("name")} aria-invalid={Boolean(errors.name)} />
                {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2 block">
                  Mobile number
                </Label>
                <Input id="phone" type="tel" placeholder="98xxxxxxxx" {...register("phone")} aria-invalid={Boolean(errors.phone)} />
                {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-info/25 bg-info/6 p-3.5 sm:col-span-2">
                <Info className="mt-0.5 size-4 shrink-0 text-info" />
                <p className="text-xs text-foreground/80">
                  Booking confirmation and payment will be available in a future phase.
                  Reserving now holds your place with {match.driver.name.split(" ")[0]}.
                </p>
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting} className="sm:col-span-2">
                {isSubmitting ? "Reserving…" : "Reserve journey"}
              </Button>
            </form>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
