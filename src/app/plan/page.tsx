import type { Metadata } from "next";

import { JourneyPlannerForm } from "@/features/journey/components/journey-planner-form";

export const metadata: Metadata = {
  title: "Plan Your Journey",
  description: "Tell ReturnGo where you're travelling — we'll match you to a driver already heading that way.",
};

export default function PlanJourneyPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">
        Book Taxi
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Plan your journey.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Tell us where you&apos;re travelling and when. We&apos;ll check who&apos;s
        already heading that way before we look at anything else.
      </p>

      <div className="mt-10 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <JourneyPlannerForm />
      </div>
    </section>
  );
}
