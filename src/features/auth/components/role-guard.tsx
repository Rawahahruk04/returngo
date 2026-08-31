"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAccount } from "@/features/auth/data/account-store";
import { ROLE_DASHBOARD_PATH } from "@/features/auth/lib/roles";
import type { UserRole } from "@/features/auth/types";

/**
 * Gates a role's dashboard segment (`/driver/*`, `/passenger/*`,
 * `/rental-owner/*`, `/fleet/*`): a guest is sent to `/login`, and an
 * account signed in under a *different* role is sent to their own
 * dashboard rather than seeing this one.
 */
export function RoleGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const router = useRouter();
  const { account, hydrated } = useAccount();

  React.useEffect(() => {
    if (!hydrated) return;
    if (!account) {
      router.replace("/login");
      return;
    }
    if (account.role !== role) {
      router.replace(ROLE_DASHBOARD_PATH[account.role]);
    }
  }, [hydrated, account, role, router]);

  if (!hydrated || !account || account.role !== role) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Checking sign-in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
