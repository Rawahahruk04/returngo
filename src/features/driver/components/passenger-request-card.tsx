import { Check, ShieldCheck, X } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare, formatTime12h } from "@/features/journey/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { ExplainabilityList } from "@/features/matching/components/explainability-list";
import { MatchScoreBadge } from "@/features/matching/components/match-score-badge";
import type { DemandMatch } from "@/features/driver/lib/adapters";
import type { Reservation } from "@/features/driver/types";

const JOURNEY_TYPE_LABEL: Record<DemandMatch["cluster"]["journeyType"], string> = {
  airport: "Airport",
  hospital: "Hospital",
  intercity: "Intercity",
  rental: "Rental",
};

export function PassengerRequestCard({
  demandMatch,
  reservation,
  onAccept,
  onDecline,
}: {
  demandMatch: DemandMatch;
  reservation?: Reservation;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const { cluster, result } = demandMatch;
  const pickup = getLocation(cluster.pickupId);
  const destination = getLocation(cluster.destinationId);

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <MatchScoreBadge score={result.score.total} />
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">{cluster.label}</h3>
            <p className="text-sm text-muted-foreground">
              {pickup?.name} <span className="mx-1">&rarr;</span> {destination?.name}
            </p>
          </div>
        </div>
        <Badge variant="outline">{JOURNEY_TYPE_LABEL[cluster.journeyType]}</Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
        <Stat label="Requested time" value={formatTime12h(cluster.requestedTime)} />
        <Stat label="Passengers" value={String(cluster.count)} />
        <Stat label="Savings vs. taxi" value={result.estimatedSavingsRupees > 0 ? formatFare(result.estimatedSavingsRupees) : "—"} emphasis />
      </dl>

      <div className="mt-4">
        <ExplainabilityList reasons={result.reasons} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        {reservation ? (
          <Badge variant={reservation.status === "accepted" ? "success" : "neutral"}>
            {reservation.status === "accepted" ? (
              <>
                <ShieldCheck className="size-3" /> Accepted
              </>
            ) : (
              "Declined"
            )}
          </Badge>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={onAccept}>
              <Check /> Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onDecline}>
              <X /> Decline
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
