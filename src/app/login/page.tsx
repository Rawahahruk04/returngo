"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  LogIn,
  LogOut,
  ShieldCheck,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginAccount,
  logoutAccount,
  useAccount,
} from "@/features/auth/data/account-store";
import {
  ROLE_DASHBOARD_PATH,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
} from "@/features/auth/lib/roles";
import type { UserRole } from "@/features/auth/types";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { value: UserRole; label: string; icon: typeof Users; description: string }[] = [
  {
    value: "passenger",
    label: "Passenger",
    icon: Users,
    description: "Book taxis & rent vehicles",
  },
  {
    value: "driver",
    label: "Driver",
    icon: Car,
    description: "Publish return legs & earn",
  },
  {
    value: "rental-owner",
    label: "Rental Owner",
    icon: Truck,
    description: "List & manage rental cars/bikes",
  },
  {
    value: "fleet-owner",
    label: "Fleet Operator",
    icon: ShieldCheck,
    description: "Manage commercial fleets & drivers",
  },
];

const DEMO_PRESET_ACCOUNTS = [
  {
    name: "Anjali Rao",
    role: "passenger" as UserRole,
    identifier: "+91 98450 12345",
    email: "anjali.rao@example.com",
    badge: "Passenger",
    icon: Users,
    desc: "Active commuter on NH66 corridor",
  },
  {
    name: "Mohammed Ashfaq",
    role: "driver" as UserRole,
    identifier: "+91 97410 54321",
    email: "ashfaq.driver@example.com",
    badge: "Driver",
    icon: Car,
    desc: "Bhatkal ↔ Mangalore Airport Innova driver",
  },
  {
    name: "Suresh Kulal",
    role: "rental-owner" as UserRole,
    identifier: "+91 94480 98765",
    email: "suresh.rentals@example.com",
    badge: "Rental Owner",
    icon: Truck,
    desc: "Fleet of SUVs and sedans in Mangalore",
  },
  {
    name: "Coastal Fleet Hub",
    role: "fleet-owner" as UserRole,
    identifier: "+91 98800 11223",
    email: "ops@coastalfleet.com",
    badge: "Fleet Operator",
    icon: ShieldCheck,
    desc: "Commercial fleet operations manager",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { account, hydrated } = useAccount();

  const [identifier, setIdentifier] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("passenger");
  const [switchMode, setSwitchMode] = React.useState(false);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) return;

    loginAccount({
      identifier: identifier.trim(),
      role,
    });
    router.push(ROLE_DASHBOARD_PATH[role]);
  }

  function handleQuickLogin(preset: (typeof DEMO_PRESET_ACCOUNTS)[0]) {
    loginAccount({
      identifier: preset.identifier,
      role: preset.role,
      name: preset.name,
      email: preset.email,
      phone: preset.identifier,
    });
    router.push(ROLE_DASHBOARD_PATH[preset.role]);
  }

  // If already authenticated and not actively switching
  if (hydrated && account && !switchMode) {
    return (
      <section className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <UserCheck className="size-5" />
            </span>
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                Active Session
              </span>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Welcome back, {account.name.split(" ")[0]}
              </h1>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border/80 bg-surface-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.email || account.phone}</p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs font-semibold text-secondary-foreground">
                {ROLE_LABEL[account.role]}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push(ROLE_DASHBOARD_PATH[account.role])}
            >
              <LogIn className="mr-2 size-4" /> Go to {ROLE_LABEL[account.role]} Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSwitchMode(true)}
              >
                Switch Role / Account
              </Button>
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => logoutAccount()}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
          <LogIn className="size-3.5" /> ReturnGo Sign In
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
          Welcome to ReturnGo
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your account or pick a demo role to test the platform.
        </p>
      </div>

      <div className="mt-8 grid gap-8">
        {/* Main Sign-in Form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div>
            <Label className="mb-3 block text-sm font-semibold text-foreground">
              Select Your Role
            </Label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const checked = role === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setRole(option.value)}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all",
                      checked
                        ? "border-secondary bg-secondary/10 shadow-xs"
                        : "border-border bg-surface-muted/50 hover:border-secondary/30",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4.5",
                        checked ? "text-secondary font-bold" : "text-muted-foreground",
                      )}
                    />
                    <span className="font-medium text-xs text-foreground mt-1">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="login-identifier" className="mb-2 block text-sm font-medium">
              Phone Number or Email
            </Label>
            <Input
              id="login-identifier"
              type="text"
              placeholder="+91 98450 12345 or user@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button type="submit" size="lg" className="h-11 w-full font-medium">
            <LogIn className="mr-2 size-4" /> Sign In as {ROLE_LABEL[role]}
          </Button>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Don&apos;t have an account yet?</span>
            <Link href="/register" className="font-semibold text-secondary hover:underline">
              Create an account &rarr;
            </Link>
          </div>
        </form>

        {/* 1-Click Fast Demo Login for Testers / Judges */}
        <div className="rounded-2xl border border-border bg-surface-muted/60 p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-secondary">
                1-Click Instant Demo Login
              </span>
              <h2 className="mt-1 font-display text-lg font-bold text-foreground">
                Test with a pre-configured role
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">No password needed</span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DEMO_PRESET_ACCOUNTS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleQuickLogin(preset)}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-sm"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-xs font-semibold text-foreground">{preset.name}</p>
                      <span className="rounded bg-secondary/10 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-secondary">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground mt-0.5">{preset.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
