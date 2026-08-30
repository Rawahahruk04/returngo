import { cn } from "@/lib/utils";

function scoreTone(score: number): string {
  if (score >= 80) return "text-success border-success/40 bg-success/8";
  if (score >= 60) return "text-info border-info/40 bg-info/8";
  if (score >= 40) return "text-warning border-warning/40 bg-warning/8";
  return "text-muted-foreground border-border bg-muted";
}

export function MatchScoreBadge({ score, className }: { score: number; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-14 shrink-0 flex-col items-center justify-center rounded-full border-2 font-mono",
        scoreTone(score),
        className,
      )}
      aria-label={`Match score ${score} out of 100`}
    >
      <span className="text-lg font-bold leading-none tabular-nums">{score}</span>
      <span className="text-[8px] font-medium uppercase tracking-wide leading-none">score</span>
    </div>
  );
}
