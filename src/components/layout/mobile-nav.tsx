"use client";

import * as React from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { primaryNav } from "@/config/nav";
import { Logomark, Wordmark } from "@/components/brand/logomark";
import { Button } from "@/components/ui/button";
import { useDriverAuth } from "@/features/driver/data/auth-store";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated } = useDriverAuth();

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
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[86%] max-w-sm flex-col bg-surface p-6 shadow-lg data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex items-center justify-between">
            <Dialog.Title asChild>
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Logomark className="text-secondary" />
                <Wordmark />
              </Link>
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Browse ReturnGo&apos;s navigation links.
            </Dialog.Description>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 font-display text-xl font-medium text-foreground transition-colors hover:bg-muted"
            >
              Home
            </Link>
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 font-display text-xl font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <Button asChild size="lg">
              <Link href="/plan" onClick={() => setOpen(false)}>
                Book Taxi
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={isAuthenticated ? "/driver" : "/driver/login"} onClick={() => setOpen(false)}>
                {isAuthenticated ? "Driver Dashboard" : "Sign In"}
              </Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
