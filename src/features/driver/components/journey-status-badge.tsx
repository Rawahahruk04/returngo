import { Badge } from "@/components/ui/badge";
import type { JourneyStatus } from "@/features/driver/types";

const STATUS_META: Record<JourneyStatus, { label: string; variant: "info" | "success" | "neutral" }> = {
  upcoming: { label: "Upcoming", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "neutral" },
};

export function JourneyStatusBadge({ status }: { status: JourneyStatus }) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
