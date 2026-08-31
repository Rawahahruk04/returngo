import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

/**
 * The single label/value stat block used across every match, journey,
 * and booking card in the product (`<dt>`/`<dd>` pair, meant to live
 * inside a parent `<dl>`). Consolidated from five near-identical local
 * implementations so every card in ReturnGo renders numbers and facts
 * with the same type scale, spacing, and icon sizing.
 */
export function Stat({
  icon: Icon,
  label,
  value,
  emphasis,
  mono = true,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  /** Highlights the value in the success color — use for savings, gains, positive deltas. */
  emphasis?: boolean;
  /** Tabular, monospaced figures for numbers/times; set false for free-text values like an address. */
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-1 font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="size-3" />}
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 text-sm font-semibold",
          mono ? "font-mono tabular-nums" : "font-medium",
          emphasis ? "text-success-text" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
