import { Sparkles } from "lucide-react";

export function ExplainabilityList({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) return null;

  return (
    <div className="rounded-lg border border-dashed border-secondary/40 bg-secondary/5 p-4">
      <h4 className="flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wide text-secondary">
        <Sparkles className="size-3.5" /> Why am I seeing this?
      </h4>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {reasons.map((reason) => (
          <li key={reason} className="flex gap-2 text-sm text-foreground/90">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
