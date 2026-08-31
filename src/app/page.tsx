import Link from "next/link";
import { ArrowRight, Car, Fuel, Quote, Route as RouteIcon, ShieldCheck, Sparkles, Users } from "lucide-react";

import { locations } from "@/features/journey/data/locations";
import { formatFare } from "@/features/journey/lib/geo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { getInitials } from "@/lib/utils";

const PRODUCTS = [
  {
    icon: Users,
    title: "Book Taxi",
    items: ["Airport", "Hospital", "Intercity", "Local"],
    href: "/plan",
    cta: "Book a taxi",
  },
  {
    icon: Car,
    title: "Rent Vehicle",
    items: ["Bike", "Car", "SUV", "Traveller", "Luxury"],
    href: "/rentals",
    cta: "Rent a vehicle",
  },
  {
    icon: RouteIcon,
    title: "Drive & Earn",
    items: ["Publish Return Journey", "Receive Passenger Matches", "Earn on Empty Trips"],
    href: "/driver",
    cta: "Start driving",
  },
];

const STEPS = [
  {
    label: "Publish",
    title: "A driver publishes a journey",
    description:
      "Origin, destination, seats, and a vehicle ReturnGo can verify — takes under a minute in the Driver Workspace.",
    href: "/driver/publish",
  },
  {
    label: "Match",
    title: "The Match Engine ranks the region",
    description:
      "Every empty return leg, shared departure, and nearby flexible journey — scored and explained, never a black box.",
    href: "/matches/engine?from=bhatkal&to=mangalore-airport&date=&time=07%3A00&passengers=1&type=airport",
  },
  {
    label: "Travel together",
    title: "A passenger reserves the seat",
    description: `Fixed fare, verified driver, and a saving shown up front — the Bhatkal → Mangalore Airport return leg saves ${formatFare(450)} on its own.`,
    href: "/plan",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I used to drive back from Mangalore Airport empty almost every morning. Now that leg pays for itself before I've even left the parking lot.",
    name: "Mohammed Ashfaq",
    role: "Driver, Bhatkal",
  },
  {
    quote:
      "Booked a return-leg seat to the airport for a third of what a direct taxi would've cost — same driver, same comfort, just smarter timing.",
    name: "Anjali Rao",
    role: "Passenger, Udupi",
  },
  {
    quote:
      "Listing my SUV took five minutes and it's already been booked three times this month. The dashboard makes it easy to see what's earning.",
    name: "Suresh Kulal",
    role: "Rental Owner, Mangalore",
  },
];

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Verified drivers, every time",
    description: "Licence, registration, and photo ID reviewed before a journey is published — shown on every match.",
  },
  {
    icon: Sparkles,
    title: "Explainable, not a black box",
    description: "Every match carries a match score and a plain-language reason — \"why am I seeing this?\" answered inline.",
  },
  {
    icon: Fuel,
    title: "Regional impact, made visible",
    description: "Fuel saved, empty kilometres prevented, and community impact — surfaced on every return match.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-widest text-secondary">
          <RouteIcon className="size-3.5" /> Regional mobility, Coastal Karnataka
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
          One Platform for Taxi, Vehicle Rentals and Return Journeys.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Book a taxi. Rent a vehicle. Or earn money from your empty return trips across Coastal Karnataka.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/plan">
              Book Taxi <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/driver">Drive &amp; Earn</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/rentals">Rent Vehicle</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          <StripStat value={String(locations.length)} label="Towns, airports & hospitals on one corridor" />
          <StripStat value="5" label="Ranked match tiers, always explained" />
          <StripStat value={formatFare(450)} label="Typical saving on a matched return leg" />
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">One network, three products</h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Taxi booking, vehicle rental, and the driver side each stand on their own — pick whichever fits what you
          need right now.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Link
              key={product.title}
              href={product.href}
              className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <product.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{product.title}</h3>
              <ul className="mt-3 flex-1 space-y-1.5">
                {product.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                {product.cta} <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">How ReturnGo works</h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          One coordination loop connects both sides of the network — no separate systems for drivers and
          passengers.
        </p>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.label} className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
                {String(index + 1).padStart(2, "0")} &middot; {step.label}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{step.description}</p>
              <Link
                href={step.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
              >
                See it in action <ArrowRight className="size-3.5" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">Built for trust</h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Coordination only works if both sides believe the numbers. Every screen shows its work.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <point.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">From the network</h2>
        <p className="mt-2 max-w-lg text-muted-foreground">Drivers, passengers, and rental owners already coordinating smarter trips.</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <Quote className="size-5 text-secondary/40" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-sm text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Avatar className="size-9">
                  <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
                <RatingStars rating={5} />
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-24 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-widest text-secondary">
          <Users className="size-3.5" /> Wherever you&apos;re starting from
        </span>
        <h2 className="max-w-xl font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Book a taxi, rent a vehicle, or start driving.
        </h2>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/plan">
              Book Taxi <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/rentals">Rent Vehicle</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/driver">Drive &amp; Earn</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function StripStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-mono text-3xl font-semibold tabular-nums text-foreground">{value}</dt>
      <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
    </div>
  );
}
