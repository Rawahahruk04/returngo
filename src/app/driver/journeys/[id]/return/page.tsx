"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useDriverStore } from "@/features/driver/data/store";
import { matchReturnDemandForJourney } from "@/features/driver/lib/adapters";
import { ReturnOpportunityPanel } from "@/features/driver/components/return-opportunity-panel";
import { WorkspaceNav } from "@/features/driver/components/workspace-nav";

export default function ReturnOpportunityPage() {
  const params = useParams<{ id: string }>();
  const { journeys } = useDriverStore();
  const journeyId = decodeURIComponent(params.id);
  const journey = journeys.find((j) => j.id === journeyId);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/driver/journeys"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to my journeys
      </Link>

      <div className="mt-5">
        <WorkspaceNav active="/driver/journeys" />
      </div>

      <div className="mt-8">
        {!journey ? (
          <p className="text-sm text-muted-foreground">This journey couldn&apos;t be found. It may have been cancelled.</p>
        ) : journey.status !== "completed" ? (
          <p className="text-sm text-muted-foreground">
            Return opportunities appear once a journey is marked complete.
          </p>
        ) : (
          <ReturnOpportunityPanel journey={journey} demandMatches={matchReturnDemandForJourney(journey)} />
        )}
      </div>
    </section>
  );
}
