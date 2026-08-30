"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDriverStore } from "@/features/driver/data/store";
import { JourneyCard } from "@/features/driver/components/journey-card";
import { WorkspaceNav } from "@/features/driver/components/workspace-nav";
import type { JourneyStatus } from "@/features/driver/types";
import { cn } from "@/lib/utils";

const TABS: { value: JourneyStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyJourneysPage() {
  const { journeys } = useDriverStore();
  const [tab, setTab] = useState<JourneyStatus>("upcoming");

  const filtered = journeys
    .filter((journey) => journey.status === tab)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Driver Workspace</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">My journeys</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Every journey you&apos;ve published, in one simple list.</p>

      <div className="mt-8">
        <WorkspaceNav active="/driver/journeys" />
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.value
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span className="ml-1.5 font-mono text-xs tabular-nums">
              {journeys.filter((j) => j.status === t.value).length}
            </span>
          </button>
        ))}
      </div>

      <h2 className="sr-only">{TABS.find((t) => t.value === tab)?.label} journeys</h2>
      <div className="mt-6 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No {tab} journeys yet.</p>
            {tab === "upcoming" && (
              <Button asChild size="sm" className="mt-4">
                <Link href="/driver/publish">
                  <Send /> Publish a journey
                </Link>
              </Button>
            )}
          </div>
        ) : (
          filtered.map((journey) => (
            <div key={journey.id} id={journey.id}>
              <JourneyCard journey={journey} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
