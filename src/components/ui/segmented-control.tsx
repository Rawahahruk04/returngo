import * as React from "react";

import { cn } from "@/lib/utils";

export type SegmentedOption = {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

/**
 * Built on real radio inputs (not ARIA-only `div`s) so it works
 * with `react-hook-form`'s native registration and screen readers
 * get correct "1 of 4" grouping semantics for free.
 */
function SegmentedControl({
  name,
  options,
  value,
  onChange,
  className,
}: {
  name: string;
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const checked = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-md border px-3 py-3 text-center text-xs font-medium transition-colors",
              checked
                ? "border-secondary bg-secondary/8 text-secondary"
                : "border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <Icon className="size-5" />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
