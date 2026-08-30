import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users, Wallet } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatDuration, formatFare } from "@/features/journey/lib/geo";
import type { MatchOption } from "@/features/journey/types";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { cn } from "@/lib/utils";

const BADGE_VARIANT: Record<MatchOption["kind"], "success" | "info" | "neutral" | "outline"> = {
  return: "success",
  shared: "info",
  direct: "neutral",
  rental: "outline",
};

export function MatchCard({ match, query }: { match: MatchOption; query: string }) {
  const origin = getLocation(match.originId);
  const destination = getLocation(match.destinationId);
  const isHero = match.kind === "return";

  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-5 shadow-sm sm:p-6",
        isHero ? "border-success/40 bg-success/4" : "border-border",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={BADGE_VARIANT[match.kind]}>{match.badge}</Badge>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RatingStars rating={match.rating} />
          <span className="font-medium text-foreground">{match.headline}</span>
        </div>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
        {origin?.name} <ArrowRight className="inline size-5 -translate-y-0.5 text-muted-foreground" /> {destination?.name}
      </h3>

      <p className="mt-1.5 text-sm text-muted-foreground">
        {match.driver.name} &middot; {match.driver.vehicle}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
        <Stat icon={Clock} label="Leaving" value={match.departure} />
        <Stat icon={Users} label="Seats available" value={`${match.seatsAvailable} of ${match.seatsTotal}`} />
        <Stat label="Duration" value={formatDuration(match.durationMinutes)} />
        <Stat
          icon={match.estimatedSavings > 0 ? Wallet : undefined}
          label={match.estimatedSavings > 0 ? "Shared savings" : "Fare"}
          value={match.estimatedSavings > 0 ? formatFare(match.estimatedSavings) : formatFare(match.fare)}
          emphasis={match.estimatedSavings > 0}
        />
      </dl>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5">
        <p className="font-mono text-lg font-semibold tabular-nums text-foreground">
          {formatFare(match.fare)}
          {match.estimatedSavings > 0 && (
            <span className="ml-2 font-sans text-xs font-normal text-muted-foreground line-through">
              {formatFare(match.oneWayReferenceFare)}
            </span>
          )}
        </p>
        <Link
          href={`/journey/${encodeURIComponent(match.id)}?${query}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
        >
          View journey <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  emphasis,
}: {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="size-3" />}
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 font-mono text-sm font-semibold tabular-nums",
          emphasis ? "text-success" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
