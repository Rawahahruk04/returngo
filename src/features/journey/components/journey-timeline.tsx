import type { TimelineStep } from "@/features/journey/types";

export function JourneyTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
      {steps.map((step, index) => (
        <li key={index} className="relative">
          <span className="absolute -left-[1.65rem] top-0.5 size-2.5 rounded-full border-2 border-secondary bg-card" />
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-secondary">
            {step.time}
          </p>
          <p className="mt-0.5 font-medium text-foreground">{step.label}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
