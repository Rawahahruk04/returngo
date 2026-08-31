"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ListChecks, Send, UserCog, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WorkspaceNav } from "@/features/driver/components/workspace-nav";
import { useDriverAuth } from "@/features/driver/data/auth-store";
import { useDriverStore } from "@/features/driver/data/store";
import { matchDemandForJourney } from "@/features/driver/lib/adapters";
import type { Reservation } from "@/features/driver/types";

function countPendingRequests(
  journeys: ReturnType<typeof useDriverStore>["journeys"],
  reservations: Reservation[],
): number {
  const upcoming = journeys.filter((j) => j.status === "upcoming");
  return upcoming.reduce((total, journey) => {
    const demandMatches = matchDemandForJourney(journey);
    const actioned = new Set(
      reservations
        .filter((r) => r.journeyId === journey.id)
        .map((r) => `${r.pickupId}::${r.destinationId}`),
    );
    const pending = demandMatches.filter(
      (match) => !actioned.has(`${match.cluster.pickupId}::${match.cluster.destinationId}`),
    );
    return total + pending.length;
  }, 0);
}

export default function DriverWorkspacePage() {
  const { profile } = useDriverAuth();
  const { journeys, reservations } = useDriverStore();
  const pendingCount = countPendingRequests(journeys, reservations);
  const upcomingCount = journeys.filter((j) => j.status === "upcoming").length;

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Turn empty return legs into paid trips.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        A lightweight workspace — publish a journey, see who ReturnGo matched you with, and accept the return leg
        once you&apos;re done.
      </p>

      <div className="mt-8">
        <WorkspaceNav active="/driver" />
      </div>

      {profile && (
        <Link
          href="/driver/profile"
          className="mt-6 flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-secondary/40"
        >
          <Avatar className="size-12">
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoDataUrl} alt="" className="size-full object-cover" />
            ) : (
              <AvatarFallback>{(profile.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground">
              {profile.vehicle ? `${profile.vehicle.name} · ${profile.vehicleRegistration}` : "No vehicle set yet"}
            </p>
          </div>
          <Badge variant={profile.verified ? "success" : "warning"}>
            <BadgeCheck className="size-3" /> {profile.verified ? "Verified" : "Pending verification"}
          </Badge>
        </Link>
      )}

      <div className="mt-6 flex flex-col gap-4">
        <Link
          href="/driver/requests"
          className="flex items-center justify-between gap-4 rounded-lg border border-secondary/40 bg-secondary/5 p-5 shadow-sm transition-colors hover:bg-secondary/10"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Users className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Passenger requests</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Every passenger the Match Engine found for your published journeys — accept or decline.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {pendingCount > 0 && <Badge variant="success">{pendingCount} new</Badge>}
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/driver/publish"
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-secondary/40"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Send className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Publish a journey</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell ReturnGo where you&apos;re driving so passengers heading the same way can find you.
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>

        <Link
          href="/driver/journeys"
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-secondary/40"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <ListChecks className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">My journeys</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {upcomingCount} upcoming — mark a journey complete, or cancel one that didn&apos;t work out.
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>

        <Link
          href="/driver/profile"
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-secondary/40"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <UserCog className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">Profile</p>
              <p className="mt-1 text-sm text-muted-foreground">Vehicle, registration, verification and photo.</p>
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </div>
    </section>
  );
}
