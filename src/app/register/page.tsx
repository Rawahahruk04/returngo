"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Car, ShieldCheck, Truck, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAccount, useAccount } from "@/features/auth/data/account-store";
import { ROLE_DASHBOARD_PATH, ROLE_DESCRIPTION, ROLE_LABEL } from "@/features/auth/lib/roles";
import type { UserRole } from "@/features/auth/types";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { value: UserRole; icon: typeof Users }[] = [
  { value: "passenger", icon: Users },
  { value: "driver", icon: Car },
  { value: "rental-owner", icon: Truck },
  { value: "fleet-owner", icon: ShieldCheck },
];

export default function RegisterPage() {
  const router = useRouter();
  const { account, hydrated } = useAccount();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("passenger");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    registerAccount({ name: name.trim(), email: email.trim(), phone: phone.trim(), role });
    router.push(ROLE_DASHBOARD_PATH[role]);
  }

  if (hydrated && account) {
    return (
      <section className="mx-auto max-w-md px-4 py-14 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Register</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">You&apos;re already signed in</h1>
        <p className="mt-3 text-muted-foreground">
          {account.name} is signed in as a {ROLE_LABEL[account.role]} on this device.
        </p>
        <Button size="lg" className="mt-8" onClick={() => router.push(ROLE_DASHBOARD_PATH[account.role])}>
          Go to dashboard
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Register</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Create your account.</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        One account, one role — pick the one that fits how you&apos;ll use ReturnGo.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <Label className="mb-3 block">I want to join as</Label>
          <div role="radiogroup" className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const checked = role === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1.5 rounded-md border p-3.5 text-sm transition-colors",
                    checked ? "border-secondary bg-secondary/8" : "border-border hover:border-secondary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    className="sr-only"
                    checked={checked}
                    onChange={() => setRole(option.value)}
                  />
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Icon className={cn("size-4", checked ? "text-secondary" : "text-muted-foreground")} />
                    {ROLE_LABEL[option.value]}
                  </span>
                  <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTION[option.value]}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="register-name" className="mb-2 block">
              Full name
            </Label>
            <Input id="register-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="register-phone" className="mb-2 block">
              Phone
            </Label>
            <Input id="register-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </div>
        </div>

        <div>
          <Label htmlFor="register-email" className="mb-2 block">
            Email
          </Label>
          <Input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>

        <Button type="submit" size="lg" className="mt-2">
          <UserPlus /> Create account
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo registration — no password. Your account stays on this device.
        </p>
      </form>
    </section>
  );
}
