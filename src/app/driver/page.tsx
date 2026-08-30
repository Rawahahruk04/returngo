import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListChecks, Send, Users } from "lucide-react";

import { WorkspaceNav } from "@/features/driver/components/workspace-nav";

export const metadata: Metadata = {
  title: "Driver Workspace",
  description: "Publish journeys, manage requests, and turn empty return legs into paid trips.",
};

const CARDS = [
  {
    href: "/driver/publish",
    icon: Send,
    title: "Publish a journey",
    description: "Tell ReturnGo where you're driving so passengers heading the same way can find you.",
  },
  {
    href: "/driver/journeys",
    icon: ListChecks,
    title: "My journeys",
    description: "See what's upcoming, mark a journey complete, or cancel one that didn't work out.",
  },
  {
    href: "/driver/requests",
    icon: Users,
    title: "Passenger requests",
    description: "Every passenger the Match Engine found for your published journeys — accept or decline.",
  },
];

export default function DriverWorkspacePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Driver Workspace</span>
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

      <div className="mt-6 flex flex-col gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-secondary/40"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <card.icon className="size-5" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">{card.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              </div>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}
