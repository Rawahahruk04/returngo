"use client";

import Link from "next/link";
import { Send } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { Button } from "@/components/ui/button";
import { addReservation, setReservationStatus, useDriverStore } from "@/features/driver/data/store";
import { matchDemandForJourney, type DemandMatch } from "@/features/driver/lib/adapters";
import { PassengerRequestCard } from "@/features/driver/components/passenger-request-card";
import { WorkspaceNav } from "@/features/driver/components/workspace-nav";
import type { Reservation } from "@/features/driver/types";

export default function PassengerRequestsPage() {
  const { journeys, reservations } = useDriverStore();
  const upcoming = journeys.filter((j) => j.status === "upcoming").sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Driver Workspace</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Passenger requests</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Every match below is produced by the same ReturnGo Match Engine passengers use to find you — same score,
        same explanations.
      </p>

      <div className="mt-8">
        <WorkspaceNav active="/driver/requests" />
      </div>

      {upcoming.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Publish a journey to start receiving matched passengers.</p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/driver/publish">
              <Send /> Publish a journey
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {upcoming.map((journey) => {
            const origin = getLocation(journey.originId);
            const destination = getLocation(journey.destinationId);
            const demandMatches = matchDemandForJourney(journey);

            return (
              <div key={journey.id} id={journey.id}>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {origin?.name} &rarr; {destination?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {journey.driverName} &middot; {journey.date} &middot; {journey.seatsReserved} of {journey.seatsTotal} seats filled
                </p>

                <div className="mt-4 flex flex-col gap-4">
                  {demandMatches.map((demandMatch) => {
                    const existing = findReservation(reservations, journey.id, demandMatch);
                    return (
                      <PassengerRequestCard
                        key={demandMatch.cluster.id}
                        demandMatch={demandMatch}
                        reservation={existing}
                        onAccept={() => handleDecision(journey.id, demandMatch, "accepted")}
                        onDecline={() => handleDecision(journey.id, demandMatch, "declined")}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function findReservation(
  reservations: Reservation[],
  journeyId: string,
  demandMatch: DemandMatch,
): Reservation | undefined {
  return reservations.find(
    (r) =>
      r.journeyId === journeyId &&
      r.pickupId === demandMatch.cluster.pickupId &&
      r.destinationId === demandMatch.cluster.destinationId,
  );
}

function handleDecision(
  journeyId: string,
  demandMatch: DemandMatch,
  status: "accepted" | "declined",
) {
  const reservation = addReservation({
    journeyId,
    passengerLabel: demandMatch.cluster.label,
    passengers: demandMatch.cluster.count,
    pickupId: demandMatch.cluster.pickupId,
    destinationId: demandMatch.cluster.destinationId,
    requestedTime: demandMatch.cluster.requestedTime,
    matchScore: demandMatch.result.score.total,
    savingsRupees: demandMatch.result.estimatedSavingsRupees,
  });
  setReservationStatus(reservation.id, status);
}
