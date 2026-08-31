import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, HeartHandshake, MapPinned, Route as RouteIcon, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About ReturnGo",
  description: "Why ReturnGo exists, and how return-journey matching connects three products on one coastal corridor.",
};

const PILLARS = [
  {
    icon: Users,
    title: "Book Taxi",
    description:
      "Airport, hospital, intercity, and local trips — share a seat and save, or book the entire taxi when you'd rather not.",
    href: "/plan",
  },
  {
    icon: Car,
    title: "Rent Vehicle",
    description: "Self-drive or with-driver vehicle hire, independent of any journey matching — a separate product entirely.",
    href: "/rentals",
  },
  {
    icon: RouteIcon,
    title: "Drive & Earn",
    description: "Drivers publish journeys once and let ReturnGo find the passengers already heading the same way.",
    href: "/driver",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-widest text-secondary">
          <MapPinned className="size-3.5" /> About ReturnGo
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Every return journey matters.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Most of a taxi&apos;s regional trips involve an empty return leg — a driver dropping a passenger at an
          airport or hospital and then driving back with no one in the vehicle. ReturnGo&apos;s core innovation is
          matching that empty return leg to a passenger already waiting for the exact same journey, scored and
          explained before anyone books.
        </p>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Sharing is always optional — a family heading to the airport, a hospital emergency, or a wedding party can
          book the entire taxi instead. ReturnGo isn&apos;t a ride-hailing clone: it&apos;s a coordination layer on
          top of trips that were already happening.
        </p>
      </section>

      <section className="border-y border-border bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">Three products, one network</h2>
          <p className="mt-2 max-w-lg text-muted-foreground">Each stands on its own — Rental never mixes into Taxi, and driving is a real product with its own workspace.</p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-secondary/40"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <pillar.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{pillar.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                  Explore <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-widest text-secondary">
          <HeartHandshake className="size-3.5" /> Coastal Karnataka
        </span>
        <h2 className="max-w-xl font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Built for one real corridor first.
        </h2>
        <p className="max-w-xl text-muted-foreground">
          ReturnGo starts on the Goa–Mangalore coastal highway (NH66) — towns, airports and hospitals a driver
          already crosses every day — before expanding to other corridors.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/contact">Get in touch</Link>
        </Button>
      </section>
    </>
  );
}
