"use client";

import * as React from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { driverNav, passengerNav, type NavItem } from "@/config/nav";
import { Logomark, Wordmark } from "@/components/brand/logomark";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[86%] max-w-sm flex-col bg-surface p-6 shadow-(--shadow-lg) data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex items-center justify-between">
            <Dialog.Title asChild>
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Logomark className="text-secondary" />
                <Wordmark />
              </Link>
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Browse ReturnGo passenger and driver navigation links.
            </Dialog.Description>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-8">
            <NavGroup title="Passenger" items={passengerNav} onNavigate={() => setOpen(false)} />
            <NavGroup title="Driver" items={driverNav} onNavigate={() => setOpen(false)} />
          </nav>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <Button asChild size="lg">
              <Link href="/plan" onClick={() => setOpen(false)}>
                Plan a journey
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/driver/publish" onClick={() => setOpen(false)}>
                Publish as a driver
              </Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function NavGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block font-display text-xl font-medium text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
