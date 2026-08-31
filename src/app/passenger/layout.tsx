import type { ReactNode } from "react";

import { RoleGuard } from "@/features/auth/components/role-guard";

export default function PassengerLayout({ children }: { children: ReactNode }) {
  return <RoleGuard role="passenger">{children}</RoleGuard>;
}
