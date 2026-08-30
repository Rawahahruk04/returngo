"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Car, Users } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatTime12h } from "@/features/journey/lib/geo";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { cancelJourney, completeJourney } from "@/features/driver/data/store";
import { VEHICLE_LABEL } from "@/features/driver/lib/vehicles";
import type { PublishedJourney } from "@/features/driver/types";
import { JourneyStatusBadge } from "@/features/driver/components/journey-status-badge";

export function JourneyCard({ journey }: { journey: PublishedJourney }) {
  const router = useRouter();
  const origin = getLocation(journey.originId);
  const destination = getLocation(journey.destinationId);

  function handleComplete() {
    completeJourney(journey.id);
    router.push(`/driver/journeys/${encodeURIComponent(journey.id)}/return`);
  }

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold text-foreground">
            {origin?.name} <ArrowRight className="size-4 text-muted-foreground" /> {destination?.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="size-3.5" />
            {journey.date} &middot; {formatTime12h(journey.time)}
          </p>
        </div>
        <JourneyStatusBadge status={journey.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
        <Stat
          icon={Car}
          label="Verified vehicle"
          mono={false}
          value={`${VEHICLE_LABEL[journey.vehicleType]} · ${journey.vehiclePlate}`}
        />
        <Stat icon={Users} label="Seats" value={String(journey.seatsTotal)} />
        <Stat
          label="Passengers"
          value={`${journey.seatsReserved} of ${journey.seatsTotal}`}
          emphasis={journey.seatsReserved > 0}
        />
      </dl>

      {journey.status === "upcoming" && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button asChild size="sm" variant="outline">
            <Link href={`/driver/requests#${journey.id}`}>View requests</Link>
          </Button>
          <Button size="sm" onClick={handleComplete}>
            Complete journey
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => cancelJourney(journey.id)}>
            Cancel
          </Button>
        </div>
      )}

      {journey.status === "completed" && journey.category !== "return" && (
        <div className="mt-4 border-t border-border pt-4">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/driver/journeys/${encodeURIComponent(journey.id)}/return`}>See return opportunity</Link>
          </Button>
        </div>
      )}
    </article>
  );
}
