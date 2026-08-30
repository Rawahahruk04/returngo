import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A single boolean control doesn't earn a Radix primitive — a
 * native checkbox already gives correct keyboard, label and form
 * semantics for free. Visuals are layered on with the peer trick.
 */
function Checkbox({ className, id, ...props }: React.ComponentProps<"input">) {
  return (
    <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        id={id}
        data-slot="checkbox"
        className={cn(
          "peer size-5 shrink-0 cursor-pointer appearance-none rounded-[0.3rem] border border-input bg-surface transition-colors checked:border-secondary checked:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <Check className="pointer-events-none absolute size-3.5 text-secondary-foreground opacity-0 peer-checked:opacity-100" />
    </span>
  );
}

export { Checkbox };
