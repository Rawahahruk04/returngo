"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { primaryNav } from "@/config/nav";
import { Logomark, Wordmark } from "@/components/brand/logomark";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { logoutAccount, useAccount } from "@/features/auth/data/account-store";
import { ROLE_DASHBOARD_PATH } from "@/features/auth/lib/roles";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { account, isAuthenticated } = useAccount();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Logomark className="text-secondary" />
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && account ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={ROLE_DASHBOARD_PATH[account.role]}>Dashboard</Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => logoutAccount()}>
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          <Button asChild size="sm">
            <Link href="/plan">Book Taxi</Link>
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
