"use client";

import * as React from "react";
import { BadgeCheck, Camera, Save } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAccount, useAccount } from "@/features/auth/data/account-store";
import type { Account } from "@/features/auth/types";
import { updateDriverVehicleProfile, useDriverVehicleProfile } from "@/features/driver/data/vehicle-profile-store";
import { VehicleSelector } from "@/features/driver/components/vehicle-selector";
import { WorkspaceNav } from "@/features/driver/components/workspace-nav";
import type { DriverVehicle, DriverVehicleProfile } from "@/features/driver/types";

export default function DriverProfilePage() {
  const { account } = useAccount();
  const vehicleProfile = useDriverVehicleProfile();
  if (!account) return null;
  return <ProfileForm account={account} vehicleProfile={vehicleProfile} />;
}

/**
 * A separate component (rather than a useEffect syncing local state
 * from the account) so local state only ever initializes once, on
 * the mount that already has a real account — the page-level gate
 * above (and the `/driver` RoleGuard) guarantees that.
 */
function ProfileForm({ account, vehicleProfile }: { account: Account; vehicleProfile: DriverVehicleProfile }) {
  const [name, setName] = React.useState(account.name);
  const [phone, setPhone] = React.useState(account.phone);
  const [vehicleRegistration, setVehicleRegistration] = React.useState(vehicleProfile.vehicleRegistration);
  const [vehicle, setVehicle] = React.useState<DriverVehicle | null>(vehicleProfile.vehicle);
  const [saved, setSaved] = React.useState(false);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    updateAccount({ name: name.trim(), phone: phone.trim() });
    updateDriverVehicleProfile({ vehicleRegistration: vehicleRegistration.trim(), vehicle });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDriverVehicleProfile({ photoDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Drive &amp; Earn</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Driver profile</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Set this up once — publishing a journey will never ask for your name or vehicle again.
      </p>

      <div className="mt-8">
        <WorkspaceNav active="/driver/profile" />
      </div>

      <div className="mt-8 flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="relative">
          <Avatar className="size-16">
            {vehicleProfile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vehicleProfile.photoDataUrl} alt="" className="size-full object-cover" />
            ) : (
              <AvatarFallback>{(account.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <label
            htmlFor="driver-photo"
            className="absolute -bottom-1 -right-1 flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm hover:text-foreground"
          >
            <Camera className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Upload driver photo</span>
            <input id="driver-photo" type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
          </label>
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-semibold text-foreground">{account.name || "Unnamed driver"}</p>
          <Badge variant={vehicleProfile.verified ? "success" : "warning"} className="mt-1">
            <BadgeCheck className="size-3" /> {vehicleProfile.verified ? "Verified" : "Pending verification"}
          </Badge>
        </div>
        {!vehicleProfile.verified && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => updateDriverVehicleProfile({ verified: true })}
          >
            Mark as verified
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name" className="mb-2 block">
              Driver name
            </Label>
            <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="profile-phone" className="mb-2 block">
              Phone
            </Label>
            <Input id="profile-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </div>
        </div>

        <div>
          <Label htmlFor="profile-plate" className="mb-2 block">
            Vehicle registration
          </Label>
          <Input
            id="profile-plate"
            placeholder="e.g. KA-19-B-4021"
            value={vehicleRegistration}
            onChange={(event) => setVehicleRegistration(event.target.value)}
            required
          />
        </div>

        <div>
          <Label className="mb-2 block">Primary vehicle</Label>
          <VehicleSelector value={vehicle} onChange={setVehicle} />
        </div>

        <Button type="submit" size="lg" className="mt-2 self-start" disabled={!vehicle}>
          <Save /> {saved ? "Saved" : "Save profile"}
        </Button>
      </form>
    </section>
  );
}
