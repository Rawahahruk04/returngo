"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { formatDuration, formatFare } from "@/features/journey/lib/geo";
import { Stat } from "@/components/ui/stat";
import { cn } from "@/lib/utils";
import type { MatchDetails, MatchScoreBreakdown } from "@/features/matching/types";

export function MatchDetailsPanel({ details, score }: { details: MatchDetails; score: MatchScoreBreakdown }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-semibold text-secondary"
      >
        {open ? "Hide match details" : "How this match was generated"}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pb-4">
              <p className="rounded-md bg-surface-muted p-3 text-sm text-foreground/90">{details.howGenerated}</p>

              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat mono={false} label="Pickup adjustment" value={`${details.pickupAdjustmentKm} km`} />
                <Stat mono={false} label="Travel time" value={formatDuration(details.travelTimeMinutes)} />
                <Stat
                  mono={false}
                  label="Shared savings"
                  emphasis={details.sharedSavingsRupees > 0}
                  value={details.sharedSavingsRupees > 0 ? formatFare(details.sharedSavingsRupees) : "—"}
                />
                <Stat mono={false} label="Distance difference" value={`${details.distanceDifferenceKm} km`} />
              </dl>

              <div className="rounded-md border border-border p-3">
                <h4 className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                  Return journey benefit
                </h4>
                <p className="mt-1 text-sm text-foreground/90">{details.returnJourneyBenefit}</p>
              </div>

              <div className="rounded-md border border-border p-3">
                <h4 className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                  Regional impact
                </h4>
                <p className="mt-1 text-sm text-foreground/90">{details.regionalImpact}</p>
              </div>

              <div>
                <h4 className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                  Score breakdown ({score.total}/100)
                </h4>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {score.factors.map((factor) => (
                    <li key={factor.key} className="flex items-center gap-2 text-xs">
                      <span className="w-36 shrink-0 text-muted-foreground">{factor.label}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-secondary"
                          style={{ width: `${Math.round(factor.rawScore)}%` }}
                        />
                      </span>
                      <span className="w-20 shrink-0 text-right font-mono tabular-nums text-foreground">
                        {Math.round(factor.rawScore)} × {Math.round(factor.weight * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
