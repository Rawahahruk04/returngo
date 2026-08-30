import type { ComponentType } from "react";
import { Fuel, Leaf, Route as RouteIcon, TrendingUp, Users } from "lucide-react";

import { formatFare } from "@/features/journey/lib/geo";
import { cn } from "@/lib/utils";

export type ImpactCardData = {
  passengersCoordinated: number;
  driverRevenueIncreasedRupees: number;
  fuelSavedLitres: number;
  emptyKmPrevented: number;
  carbonSavedKg: number;
  communityImpactNote: string;
};

/**
 * The ReturnGo Impact Card — the signature visual of the matching
 * engine. Every figure traces back to `utils/impact.ts`'s formula, so
 * it never overstates a match that has no coordination behind it.
 */
export function ImpactCard({ impact, title = "ReturnGo Impact" }: { impact: ImpactCardData; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-accent/30 bg-gradient-to-br from-accent/8 via-card to-card p-5 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Leaf className="size-4 text-accent" />
        <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ImpactStat icon={Users} label="Passengers coordinated" value={String(impact.passengersCoordinated)} />
        <ImpactStat
          icon={TrendingUp}
          label="Driver revenue increased"
          value={impact.driverRevenueIncreasedRupees > 0 ? formatFare(impact.driverRevenueIncreasedRupees) : "—"}
          emphasis={impact.driverRevenueIncreasedRupees > 0}
        />
        <ImpactStat
          icon={Fuel}
          label="Fuel saved"
          value={impact.fuelSavedLitres > 0 ? `${impact.fuelSavedLitres} L` : "—"}
          emphasis={impact.fuelSavedLitres > 0}
        />
        <ImpactStat
          icon={RouteIcon}
          label="Empty km prevented"
          value={impact.emptyKmPrevented > 0 ? `${impact.emptyKmPrevented} km` : "—"}
          emphasis={impact.emptyKmPrevented > 0}
        />
      </dl>

      {impact.carbonSavedKg > 0 && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-semibold text-accent">
          <Leaf className="size-3.5" /> {impact.carbonSavedKg} kg CO₂ saved (estimated)
        </p>
      )}

      <p className="mt-3 text-sm text-muted-foreground">{impact.communityImpactNote}</p>
    </div>
  );
}

function ImpactStat({
  icon: Icon,
  label,
  value,
  emphasis,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" /> {label}
      </dt>
      <dd className={cn("mt-1 font-mono text-base font-semibold tabular-nums", emphasis ? "text-accent" : "text-foreground")}>
        {value}
      </dd>
    </div>
  );
}
