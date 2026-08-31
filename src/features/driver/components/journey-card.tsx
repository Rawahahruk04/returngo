"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Car, Users } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare, formatTime12h } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { cancelJourney, completeJourney } from "@/features/driver/data/store";
import type { PublishedJourney } from "@/features/driver/types";
import { JourneyStatusBadge } from "@/features/driver/components/journey-status-badge";

const PURPOSE_LABEL: Record<PublishedJourney["purpose"], string> = {
  airport: "Airport",
  hospital: "Hospital",
  intercity: "Intercity",
};

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
        <div className="flex items-center gap-2">
          <Badge variant="outline">{PURPOSE_LABEL[journey.purpose]}</Badge>
          <JourneyStatusBadge status={journey.status} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
        <Stat
          icon={Car}
          label="Verified vehicle"
          mono={false}
          value={`${journey.vehicleName} · ${journey.vehiclePlate}`}
          className="col-span-2 sm:col-span-1"
        />
        <Stat icon={Users} label="Seats" value={String(journey.seatsTotal)} />
        <Stat
          label="Passengers"
          value={`${journey.seatsReserved} of ${journey.seatsTotal}`}
          emphasis={journey.seatsReserved > 0}
        />
        {typeof journey.price === "number" && <Stat label="Price" value={formatFare(journey.price)} />}
      </dl>

      {journey.notes && (
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{journey.notes}</p>
      )}

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
