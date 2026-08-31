"use client";

import * as React from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAccount, useAccount } from "@/features/auth/data/account-store";
import type { Account } from "@/features/auth/types";
import { PassengerNav } from "@/features/passenger/components/passenger-nav";

export default function PassengerProfilePage() {
  const { account } = useAccount();
  if (!account) return null;
  return <ProfileForm account={account} />;
}

function ProfileForm({ account }: { account: Account }) {
  const [name, setName] = React.useState(account.name);
  const [phone, setPhone] = React.useState(account.phone);
  const [email, setEmail] = React.useState(account.email);
  const [saved, setSaved] = React.useState(false);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    updateAccount({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Passenger</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Profile</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Your account details.</p>

      <div className="mt-8">
        <PassengerNav active="/passenger/profile" />
      </div>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="passenger-profile-name" className="mb-2 block">
              Full name
            </Label>
            <Input id="passenger-profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="passenger-profile-phone" className="mb-2 block">
              Phone
            </Label>
            <Input id="passenger-profile-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>
        <div>
          <Label htmlFor="passenger-profile-email" className="mb-2 block">
            Email
          </Label>
          <Input id="passenger-profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" size="lg" className="mt-2 self-start">
          <Save /> {saved ? "Saved" : "Save profile"}
        </Button>
      </form>
    </section>
  );
}
