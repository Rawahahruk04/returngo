import Link from "next/link";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/driver", label: "Dashboard" },
  { href: "/driver/publish", label: "Publish" },
  { href: "/driver/requests", label: "Requests" },
  { href: "/driver/journeys", label: "Journeys" },
  { href: "/driver/profile", label: "Profile" },
];

export function WorkspaceNav({ active }: { active: string }) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
      {LINKS.map((link) => (
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
