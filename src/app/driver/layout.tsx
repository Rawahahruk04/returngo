"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useDriverAuth } from "@/features/driver/data/auth-store";

/**
 * Gates every /driver/* route behind the mock driver sign-in — the
 * Driver Workspace used to be publicly reachable with no auth at all.
 * /driver/login itself is exempt so there's somewhere to sign in from.
 */
export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hydrated } = useDriverAuth();
  const isLoginRoute = pathname === "/driver/login";

  React.useEffect(() => {
    if (hydrated && !isAuthenticated && !isLoginRoute) {
      router.replace("/driver/login");
    }
  }, [hydrated, isAuthenticated, isLoginRoute, router]);

  if (!isLoginRoute && (!hydrated || !isAuthenticated)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Checking driver sign-in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
