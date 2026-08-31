import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Milestone, ShieldCheck, Timer, Wallet } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { getMatchById } from "@/features/journey/data/matches";
import { formatDuration, formatFare } from "@/features/journey/lib/geo";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { Stat } from "@/components/ui/stat";
import { JourneyTimeline } from "@/features/journey/components/journey-timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = getMatchById(decodeURIComponent(id));
  if (!match) return { title: "Journey not found" };
  const origin = getLocation(match.originId);
  const destination = getLocation(match.destinationId);
  return { title: `${origin?.name} to ${destination?.name}` };
}

export default async function JourneyDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const match = getMatchById(decodeURIComponent(id));
  if (!match) notFound();

  const query = await searchParams;
  const backQuery = new URLSearchParams(
    Object.entries(query).flatMap(([key, value]) =>
      value === undefined ? [] : [[key, Array.isArray(value) ? value[0] : value]],
    ),
  ).toString();

  const origin = getLocation(match.originId);
  const destination = getLocation(match.destinationId);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href={`/matches?${backQuery}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to matches
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge variant={match.kind === "return" ? "success" : "neutral"}>{match.badge}</Badge>
        <span className="text-xs text-muted-foreground">Step 3 of 3</span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        {origin?.name} <ArrowRight className="inline size-7 -translate-y-1 text-muted-foreground" /> {destination?.name}
      </h1>

      <div className="mt-8 flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
        <Avatar className="size-14">
          <AvatarFallback className="text-base">{getInitials(match.driver.name)}</AvatarFallback>
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
        <div className="text-right">
          <RatingStars rating={match.driver.rating} />
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {match.driver.completedJourneys} journeys
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: MapPin, label: "Pickup", value: match.pickupNote },
          { icon: MapPin, label: "Drop", value: match.dropNote },
          { icon: Milestone, label: "Distance", value: `${match.distanceKm} km` },
          { icon: Timer, label: "Estimated time", value: formatDuration(match.durationMinutes) },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <Stat icon={item.icon} label={item.label} value={item.value} mono={false} />
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Fare</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
            {formatFare(match.fare)}
          </p>
        </div>
        {match.estimatedSavings > 0 && (
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Wallet className="size-3" /> Shared savings
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-success">
              {formatFare(match.estimatedSavings)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-foreground">Journey timeline</h2>
        <div className="mt-4">
          <JourneyTimeline steps={match.timeline} />
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-surface-muted p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">ReturnGo benefits</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {match.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2.5 text-sm text-foreground/90">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <Button asChild size="lg" className="mt-10 w-full sm:w-auto">
        <Link href={`/booking/${encodeURIComponent(match.id)}?${backQuery}`}>
          Review booking summary <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}
