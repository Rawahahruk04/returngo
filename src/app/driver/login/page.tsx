"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginDriver, useDriverAuth } from "@/features/driver/data/auth-store";

export default function DriverLoginPage() {
  const router = useRouter();
  const { profile, hydrated } = useDriverAuth();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    loginDriver({ name: name.trim(), phone: phone.trim() });
    router.push("/driver");
  }

  if (hydrated && profile) {
    return (
      <section className="mx-auto max-w-md px-4 py-14 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">Welcome back, {profile.name.split(" ")[0]}</h1>
        <p className="mt-3 text-muted-foreground">Your driver profile is already signed in on this device.</p>
        <Button size="lg" className="mt-8" onClick={() => router.push("/driver")}>
          Continue to dashboard
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Driver sign in</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        A quick sign-in gets you into the Driver Workspace — set up your vehicle once in your profile and never
        re-enter it again.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <Label htmlFor="driver-login-name" className="mb-2 block">
            Full name
          </Label>
          <Input
            id="driver-login-name"
            placeholder="e.g. Mohammed Ashfaq"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="driver-login-phone" className="mb-2 block">
            Phone number
          </Label>
          <Input
            id="driver-login-phone"
            type="tel"
            placeholder="e.g. 98765 43210"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>
        <Button type="submit" size="lg" className="mt-2">
          <LogIn /> Sign in
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo sign-in — no OTP, no password. Your details stay on this device.
        </p>
      </form>
    </section>
  );
}
