import type { ReactNode } from "react";

import { RoleGuard } from "@/features/auth/components/role-guard";

export default function FleetLayout({ children }: { children: ReactNode }) {
  return <RoleGuard role="fleet-owner">{children}</RoleGuard>;
}
