import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getMatchById } from "@/features/journey/data/matches";
import { BookingSummaryClient } from "@/features/journey/components/booking-summary-client";

export const metadata: Metadata = {
  title: "Booking Summary",
  description: "Review your matched journey before reserving your seat.",
};

export default async function BookingSummaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const match = getMatchById(decodeURIComponent(id));
  if (!match) notFound();

  const query = await searchParams;
  const dateValue = firstValue(query.date);
  const travelDateLabel = dateValue
    ? new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "Flexible";

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href={`/journey/${encodeURIComponent(match.id)}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to journey details
      </Link>

      <h1 className="mt-5 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Booking summary
      </h1>
      <p className="mt-3 text-muted-foreground">
        Confirm the details below. Your fare is fixed — nothing changes at pickup.
      </p>

      <div className="mt-8">
        <BookingSummaryClient match={match} travelDateLabel={travelDateLabel} />
      </div>
    </section>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
