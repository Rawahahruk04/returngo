import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Users, Wallet } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatDuration, formatFare } from "@/features/journey/lib/geo";
import type { MatchOption } from "@/features/journey/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { Stat } from "@/components/ui/stat";
import { MatchScoreBadge } from "@/features/matching/components/match-score-badge";
import { cn, getInitials } from "@/lib/utils";

const BADGE_VARIANT: Record<MatchOption["kind"], "success" | "info" | "neutral" | "outline"> = {
  return: "success",
  shared: "info",
  direct: "neutral",
  rental: "outline",
};

/**
 * The passenger-facing rank of the same 0-100 scale the Match Engine's
 * own reasoning page shows via `MatchScoreBadge` — derived from the
 * driver rating already on `MatchOption` (no new data, purely a
 * display transform) so both screens read as one consistent score.
 */
function deriveMatchScore(match: MatchOption): number {
  return Math.min(100, Math.round(match.rating * 20));
}

export function MatchCard({ match, query }: { match: MatchOption; query: string }) {
  const origin = getLocation(match.originId);
  const destination = getLocation(match.destinationId);
  const isHero = match.kind === "return";
  const score = deriveMatchScore(match);

  return (
    <article
      className={cn(
        "group rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        isHero ? "border-success/40 bg-success/4" : "border-border hover:border-secondary/30",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={BADGE_VARIANT[match.kind]}>{match.badge}</Badge>
            <span className="text-xs font-medium text-muted-foreground">{match.headline}</span>
          </div>

          <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
            {origin?.name} <ArrowRight className="inline size-5 -translate-y-0.5 text-muted-foreground" /> {destination?.name}
          </h3>
        </div>

        <MatchScoreBadge score={score} className="shrink-0" />
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
        <Avatar className="size-10">
          <AvatarFallback>{getInitials(match.driver.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            {match.driver.name}
            <ShieldCheck className="size-3.5 shrink-0 text-secondary" aria-label="Verified driver" />
          </p>
          <p className="truncate text-xs text-muted-foreground">{match.driver.vehicle}</p>
        </div>
        <RatingStars rating={match.rating} />
      </div>

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
        <p className="font-mono text-xl font-semibold tabular-nums text-foreground">
          {formatFare(match.fare)}
          {match.estimatedSavings > 0 && (
            <span className="ml-2 font-sans text-xs font-normal text-muted-foreground line-through">
              {formatFare(match.oneWayReferenceFare)}
            </span>
          )}
        </p>
        <Button asChild size="sm">
          <Link href={`/journey/${encodeURIComponent(match.id)}?${query}`}>
            View journey <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
