import type { Metadata } from "next";

import { WorkspaceNav } from "@/features/driver/components/workspace-nav";
import { PublishJourneyForm } from "@/features/driver/components/publish-journey-form";

export const metadata: Metadata = {
  title: "Publish a Journey",
  description: "Tell ReturnGo where you're driving so passengers heading the same way can find you.",
};

export default function PublishJourneyPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Driver Workspace</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Publish a journey</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Once published, ReturnGo starts matching passengers heading your way.
      </p>

      <div className="mt-8">
        <WorkspaceNav active="/driver/publish" />
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <PublishJourneyForm />
      </div>
    </section>
  );
}
