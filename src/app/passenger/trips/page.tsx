"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { usePassengerStore } from "@/features/passenger/data/store";
import { PassengerNav } from "@/features/passenger/components/passenger-nav";

export default function PassengerTripsPage() {
  const { trips } = usePassengerStore();
  const sorted = [...trips].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Passenger</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">My trips</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Every taxi journey you&apos;ve reserved through ReturnGo.</p>

      <div className="mt-8">
        <PassengerNav active="/passenger/trips" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven&apos;t booked a taxi journey yet.</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/plan">
                <Send /> Book a taxi
              </Link>
            </Button>
          </div>
        ) : (
          sorted.map((trip) => {
            const origin = getLocation(trip.originId);
            const destination = getLocation(trip.destinationId);
            return (
              <article key={trip.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold text-foreground">
                    {origin?.name} <ArrowRight className="size-4 text-muted-foreground" /> {destination?.name}
                  </h3>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wide text-secondary">
                    {trip.confirmationCode}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
                  <Stat mono={false} label="Driver" value={trip.driverName} />
                  <Stat mono={false} label="Vehicle" value={trip.vehicle} />
                  <Stat mono={false} label="Date" value={trip.date} />
                  <Stat label="Fare" value={formatFare(trip.fare)} />
                </dl>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
