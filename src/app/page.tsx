import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  ChevronRight,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LivePlatformMetrics } from "@/features/metrics/components/live-metrics";

const WHY_RETURANGO = [
  {
    emoji: "🚖",
    icon: Users,
    title: "Book Taxi",
    description: "Point-to-point and regional rides tailored to your schedule.",
    points: [
      "Book an entire taxi",
      "Share available seats",
      "Airport, Hospital, Intercity and Local travel",
    ],
    href: "/plan",
    cta: "Book a taxi",
    highlight: false,
  },
  {
    emoji: "🚗",
    icon: Car,
    title: "Rent Vehicles",
    description: "Diverse fleet ready for flexible personal or business trips.",
    points: [
      "Cars",
      "Bikes",
      "SUVs",
      "Self-drive or with driver (chosen after selecting a vehicle)",
      "Daily and hourly rentals",
    ],
    href: "/rentals",
    cta: "Explore rentals",
    highlight: false,
  },
  {
    emoji: "👨‍✈️",
    icon: RouteIcon,
    title: "Drive & Earn",
    description: "Turn empty return legs into predictable revenue.",
    points: [
      "Publish return journeys",
      "Accept passenger requests",
      "Earn from empty seats",
    ],
    href: "/driver",
    cta: "Start driving",
    highlight: false,
  },
  {
    emoji: "🛡️",
    icon: ShieldCheck,
    title: "Safe & Verified",
    description: "Trust and transparency built into every single trip.",
    points: [
      "Verified drivers",
      "Verified rental owners",
      "Transparent pricing",
      "Secure booking flow",
    ],
    href: "/about",
    cta: "How verification works",
    highlight: true,
  },
];

const STEPS = [
  {
    label: "Publish",
    title: "A driver publishes a journey",
    description:
      "Origin, destination, available seats, and vehicle details — submitted in under a minute via the Driver Workspace.",
    href: "/driver/publish",
  },
  {
    label: "Match",
    title: "The Match Engine scores the route",
    description:
      "Empty return legs and scheduled departures are paired with passenger requests with transparent criteria and explainable scores.",
    href: "/matches/engine?from=bhatkal&to=mangalore-airport&date=&time=07%3A00&passengers=1&type=airport",
  },
  {
    label: "Travel together",
    title: "Passengers reserve & ride",
    description:
      "Instant confirmation, upfront transparent pricing, and verified driver credentials before departure.",
    href: "/plan",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: 50–55% */}
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 font-mono text-xs font-semibold text-secondary">
              <RouteIcon className="size-3.5" /> Regional Mobility Corridor &middot; Coastal Karnataka
            </div>
            
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              One Platform for Taxi, Vehicle Rentals and Return Journeys.
            </h1>
            
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Book an entire taxi or share seats, rent cars and bikes, or monetize empty return legs across Coastal Karnataka.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="h-11 px-6 shadow-sm">
                <Link href="/plan">
                  Book Taxi <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6">
                <Link href="/rentals">Rent Vehicles</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6">
                <Link href="/driver">Drive &amp; Earn</Link>
              </Button>
            </div>
          </div>

          {/* Right Column: 45–50% */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {/* Soft radial glow (#F8F8F8) behind image */}
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-90 blur-3xl"
              style={{
                background: "radial-gradient(circle, #F8F8F8 0%, rgba(248, 248, 248, 0.4) 60%, transparent 80%)",
              }}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-[520px] animate-subtle-float">
              <Image
                src="/hero-illustration.jpg"
                alt="ReturnGo vehicle driving along Coastal Karnataka coastal route"
                width={1024}
                height={853}
                priority
                className="h-auto w-full object-contain rounded-2xl select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real-time MVP Platform Activity (Calculated purely from stores) */}
      <LivePlatformMetrics />

      {/* Why ReturnGo Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              Core Services &amp; Standards
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why ReturnGo
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A cohesive regional mobility stack built for passengers, commercial drivers, vehicle owners, and operators.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_RETURANGO.map((card) => {
            return (
              <div
                key={card.title}
                className={`flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  card.highlight
                    ? "border-secondary/30 bg-secondary/[0.03] hover:border-secondary/60"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" role="img" aria-label={card.title}>
                      {card.emoji}
                    </span>
                    {card.highlight && (
                      <span className="inline-flex items-center gap-1 rounded bg-secondary/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-secondary">
                        <Sparkles className="size-3" /> Core Promise
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.description}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-xs text-foreground/90">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-secondary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
                  >
                    {card.cta} <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How ReturnGo Works */}
      <section className="border-t border-border bg-surface-muted/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              Operational Workflow
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How ReturnGo works
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Direct coordination connects empty return legs with waiting travelers — cutting down waste without complex intermediaries.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.label}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-secondary">
                    {String(index + 1).padStart(2, "0")} &middot; {step.label}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <div className="mt-5 pt-3">
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                  >
                    View workflow <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
              Get Started
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Ready to travel, rent, or drive?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select your role or choose a service to experience Coastal Karnataka&apos;s return-mobility network.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/plan">
                Book Taxi <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/rentals">Rent Vehicles</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/driver">Drive &amp; Earn</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/fleet">Fleet Operators</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
