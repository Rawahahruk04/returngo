"use client";

import * as React from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAccount, useAccount } from "@/features/auth/data/account-store";
import type { Account } from "@/features/auth/types";
import { OwnerNav } from "@/features/rental-owner/components/owner-nav";

export default function RentalOwnerProfilePage() {
  const { account } = useAccount();
  if (!account) return null;
  return <ProfileForm account={account} />;
}

function ProfileForm({ account }: { account: Account }) {
  const [name, setName] = React.useState(account.name);
  const [phone, setPhone] = React.useState(account.phone);
  const [businessName, setBusinessName] = React.useState(account.businessName ?? "");
  const [saved, setSaved] = React.useState(false);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    updateAccount({ name: name.trim(), phone: phone.trim(), businessName: businessName.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Rent Vehicle</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Profile</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Your details as they appear to renters and on invoices.</p>

      <div className="mt-8">
        <OwnerNav active="/rental-owner/profile" />
      </div>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="owner-profile-name" className="mb-2 block">
              Contact name
            </Label>
            <Input id="owner-profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="owner-profile-phone" className="mb-2 block">
              Phone
            </Label>
            <Input id="owner-profile-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>
        <div>
          <Label htmlFor="owner-profile-business" className="mb-2 block">
            Business name (optional)
          </Label>
          <Input
            id="owner-profile-business"
            placeholder="e.g. Coastal Self-Drive Rentals"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="mt-2 self-start">
          <Save /> {saved ? "Saved" : "Save profile"}
        </Button>
      </form>
    </section>
  );
}
