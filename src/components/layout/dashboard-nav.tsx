import Link from "next/link";

import { cn } from "@/lib/utils";

export type DashboardNavLink = { href: string; label: string };

/**
 * The pill-tab nav shared by every role's dashboard — generalized
 * from the Driver Workspace's original `WorkspaceNav` so Passenger,
 * Rental Owner, and Fleet Owner dashboards get the same navigation
 * feel instead of a one-off per role.
 */
export function DashboardNav({ links, active }: { links: DashboardNavLink[]; active: string }) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            link.href === active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
