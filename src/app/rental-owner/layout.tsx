import type { ReactNode } from "react";

import { RoleGuard } from "@/features/auth/components/role-guard";

export default function RentalOwnerLayout({ children }: { children: ReactNode }) {
  return <RoleGuard role="rental-owner">{children}</RoleGuard>;
}
