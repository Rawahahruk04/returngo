"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerUpLeft, Sparkles } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { formatFare, formatTime12h } from "@/features/journey/lib/geo";
import { Button } from "@/components/ui/button";
import { ImpactCard } from "@/features/matching/components/impact-card";
import { MatchScoreBadge } from "@/features/matching/components/match-score-badge";
import { addReservation, publishReturnJourney, setReservationStatus } from "@/features/driver/data/store";
import type { DemandMatch } from "@/features/driver/lib/adapters";
import type { PublishedJourney } from "@/features/driver/types";

export function ReturnOpportunityPanel({
  journey,
  demandMatches,
}: {
  journey: PublishedJourney;
  demandMatches: DemandMatch[];
}) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const origin = getLocation(journey.originId);
  const destination = getLocation(journey.destinationId);

  const totalPassengers = demandMatches.reduce((sum, m) => sum + m.cluster.count, 0);
  const estimatedEarnings = demandMatches.reduce((sum, m) => sum + m.result.impact.driverRevenueIncreasedRupees, 0);
  const sharedSavings = demandMatches.reduce((sum, m) => sum + m.result.estimatedSavingsRupees * m.cluster.count, 0);

  const furthest = demandMatches.reduce(
    (best, m) => (m.result.distanceKm > best.result.distanceKm ? m : best),
    demandMatches[0],
  );

  function handleAccept() {
    if (!furthest) return;
    const newJourney = publishReturnJourney(journey, furthest.cluster.destinationId, furthest.cluster.requestedTime);

    for (const match of demandMatches) {
      const reservation = addReservation({
        journeyId: newJourney.id,
        passengerLabel: match.cluster.label,
        passengers: match.cluster.count,
        pickupId: match.cluster.pickupId,
        destinationId: match.cluster.destinationId,
        requestedTime: match.cluster.requestedTime,
        matchScore: match.result.score.total,
        savingsRupees: match.result.estimatedSavingsRupees,
      });
      setReservationStatus(reservation.id, "accepted");
    }

    setAccepted(true);
    setTimeout(() => router.push("/driver/journeys"), 1200);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-5">
        <p className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-secondary">
          <CornerUpLeft className="size-3.5" /> Return opportunity
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
          {destination?.name} <ArrowRight className="mx-1 inline size-5 -translate-y-0.5 text-muted-foreground" /> back toward {origin?.name}
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          {journey.driverName} just completed this journey and has an empty vehicle. Instead of driving back alone,
          here&apos;s who&apos;s waiting nearby.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SummaryStat label="Passengers waiting" value={String(totalPassengers)} />
        <SummaryStat label="Estimated earnings" value={formatFare(estimatedEarnings)} emphasis />
        <SummaryStat label="Shared savings" value={formatFare(sharedSavings)} emphasis />
      </dl>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold text-foreground">Passengers waiting nearby</h3>
        {demandMatches.map(({ cluster, result }) => {
          const destinationLocation = getLocation(cluster.destinationId);
          return (
            <div
              key={cluster.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <MatchScoreBadge score={result.score.total} className="size-11" />
                <div>
                  <p className="font-medium text-foreground">
                    {cluster.count} {cluster.count === 1 ? "passenger" : "passengers"}
                    <ArrowRight className="mx-1.5 inline size-3.5 text-muted-foreground" />
                    {destinationLocation?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.reasons[0]}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{formatTime12h(cluster.requestedTime)}</p>
                {result.estimatedSavingsRupees > 0 && (
                  <p className="font-mono text-xs text-success">saves {formatFare(result.estimatedSavingsRupees)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ImpactCard
        impact={{
          passengersCoordinated: totalPassengers,
          driverRevenueIncreasedRupees: estimatedEarnings,
          fuelSavedLitres: furthest?.result.impact.fuelSavedLitres ?? 0,
          emptyKmPrevented: furthest?.result.impact.emptyKmPrevented ?? 0,
          carbonSavedKg: furthest?.result.impact.carbonSavedKg ?? 0,
          communityImpactNote:
            furthest?.result.impact.communityImpactNote ??
            "Coordinating this return leg keeps vehicles off the corridor that would otherwise run separately.",
        }}
        title="ReturnGo impact of accepting this return leg"
      />

      <Button size="lg" onClick={handleAccept} disabled={accepted || demandMatches.length === 0} className="self-start">
        <Sparkles /> {accepted ? "Return journey published" : "Accept return journey"}
      </Button>
    </div>
  );
}

function SummaryStat({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <dt className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={emphasis ? "mt-1 font-mono text-lg font-semibold tabular-nums text-success" : "mt-1 font-mono text-lg font-semibold tabular-nums text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
