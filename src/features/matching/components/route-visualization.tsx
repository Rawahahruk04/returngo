import { ArrowRight, CornerUpLeft, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MatchCategory, RoutePoint } from "@/features/matching/types";

const ROLE_DOT: Record<RoutePoint["role"], string> = {
  origin: "bg-secondary",
  destination: "bg-primary",
  stop: "bg-muted-foreground/50",
  pickup: "bg-warning",
};

/**
 * A stylized, editorial route line — not a map. Points are placed
 * along a single axis by their corridor position (`corridorKm`), the
 * same coastal-highway abstraction the rest of the app already uses,
 * so no map tiles or geocoding are required.
 */
export function RouteVisualization({ route, category }: { route: RoutePoint[]; category: MatchCategory }) {
  if (route.length < 2) return null;

  const min = route[0].corridorKm;
  const max = route[route.length - 1].corridorKm;
  const span = Math.max(1, max - min);
  const percent = (km: number) => ((km - min) / span) * 100;

  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">Regional route</h4>
        {category === "return" && (
          <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-medium uppercase tracking-wide text-secondary">
            <CornerUpLeft className="size-3" /> Return leg
          </span>
        )}
      </div>

      <div className="relative mt-6 h-6">
        <div className="absolute inset-y-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border" />
        <div
          className="absolute inset-y-1/2 h-0.5 -translate-y-1/2 bg-secondary/70"
          style={{ left: "0%", right: "0%" }}
          aria-hidden="true"
        />
        {route.map((point) => (
          <div
            key={point.id}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${percent(point.corridorKm)}%` }}
          >
            <span
              className={cn(
                "size-2.5 rounded-full ring-2 ring-card",
                ROLE_DOT[point.role],
                point.role === "pickup" && "size-3",
              )}
            />
          </div>
        ))}
        <ArrowRight className="absolute -right-1 top-1/2 size-3.5 -translate-y-1/2 text-secondary" />
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2">
        {route.map((point) => (
          <div key={point.id} className="flex items-center gap-1 text-xs">
            <MapPin className={cn("size-3", point.role === "pickup" ? "text-warning" : "text-muted-foreground")} />
            <span className={cn("font-medium", point.role === "origin" || point.role === "pickup" ? "text-foreground" : "text-muted-foreground")}>
              {point.name}
            </span>
            {point.role === "pickup" && (
              <span className="font-mono text-[9.5px] uppercase tracking-wide text-warning">pickup</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
