import { Clock, ShieldCheck, Users, Wallet } from "lucide-react";

import { formatDuration, formatFare } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { Stat } from "@/components/ui/stat";
import { cn } from "@/lib/utils";
import { ExplainabilityList } from "@/features/matching/components/explainability-list";
import { ImpactCard } from "@/features/matching/components/impact-card";
import { MatchDetailsPanel } from "@/features/matching/components/match-details-panel";
import { MatchScoreBadge } from "@/features/matching/components/match-score-badge";
import { RouteVisualization } from "@/features/matching/components/route-visualization";
import type { MatchResult } from "@/features/matching/types";

const BADGE_VARIANT: Record<MatchResult["category"], "success" | "info" | "neutral" | "outline" | "warning"> = {
  return: "success",
  shared: "info",
  "nearby-flexible": "warning",
  direct: "neutral",
  rental: "outline",
};

export function MatchResultCard({ result }: { result: MatchResult }) {
  const isTopMatch = result.rank === 1;

  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-5 shadow-sm sm:p-6",
        isTopMatch ? "border-success/40 bg-success/4" : "border-border",
      )}
    >
      <h3 className="sr-only">
        #{result.rank} match: {result.badge} with {result.driver.name}, score {result.score.total} of 100
      </h3>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <MatchScoreBadge score={result.score.total} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={BADGE_VARIANT[result.category]}>{result.badge}</Badge>
              <span className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                #{result.rank} match
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {result.driver.name}
              <ShieldCheck className="size-3.5 text-secondary" aria-label="Verified driver" />
              <RatingStars rating={result.driver.rating} />
            </p>
          </div>
        </div>
        <p className="text-right font-mono text-lg font-semibold tabular-nums text-foreground">
          {formatFare(result.fare)}
          {result.estimatedSavingsRupees > 0 && (
            <span className="ml-2 font-sans text-xs font-normal text-muted-foreground line-through">
              {formatFare(result.referenceFare)}
            </span>
          )}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
        <Stat icon={Clock} label="Leaving" value={result.departureDisplay} />
        <Stat icon={Users} label="Occupancy" value={`${result.occupancy.seatsConfirmed} of ${result.occupancy.seatsTotal} (${result.occupancy.occupancyRate}%)`} />
        <Stat label="Duration" value={formatDuration(result.durationMinutes)} />
        <Stat
          icon={result.estimatedSavingsRupees > 0 ? Wallet : undefined}
          label={result.estimatedSavingsRupees > 0 ? "Estimated savings" : "Fare"}
          value={result.estimatedSavingsRupees > 0 ? formatFare(result.estimatedSavingsRupees) : formatFare(result.fare)}
          emphasis={result.estimatedSavingsRupees > 0}
        />
      </dl>

      <div className="mt-5">
        <ExplainabilityList reasons={result.reasons} />
      </div>

      {result.category === "return" && (
        <div className="mt-4">
          <ImpactCard impact={result.impact} title="Impact of this match" />
        </div>
      )}

      <div className="mt-4">
        <RouteVisualization route={result.route} category={result.category} />
      </div>

      <MatchDetailsPanel details={result.details} score={result.score} />
    </article>
  );
}
