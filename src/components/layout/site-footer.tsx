import Link from "next/link";

import { footerNav } from "@/config/nav";
import { Logomark, Wordmark } from "@/components/brand/logomark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-foreground">
              <Logomark className="text-secondary" />
              <Wordmark />
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A regional mobility coordination network for Coastal Karnataka.
              Every return journey matters.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Serving Bhatkal, Murudeshwar, Honnavar, Kumta, Kundapura, Udupi, Manipal, Mangalore &amp; Goa Airport.</p>
          <p>&copy; {new Date().getFullYear()} ReturnGo.</p>
        </div>
      </div>
    </footer>
  );
}
