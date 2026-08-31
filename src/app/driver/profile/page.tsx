"use client";

import * as React from "react";
import { BadgeCheck, Camera, Save } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDriverProfile, useDriverAuth } from "@/features/driver/data/auth-store";
import { VehicleSelector } from "@/features/driver/components/vehicle-selector";
import { WorkspaceNav } from "@/features/driver/components/workspace-nav";
import type { DriverProfile, DriverVehicle } from "@/features/driver/types";

export default function DriverProfilePage() {
  const { profile } = useDriverAuth();
  if (!profile) return null;
  return <ProfileForm profile={profile} />;
}

/**
 * A separate component (rather than a useEffect syncing local state
 * from `profile`) so react-hook-form-style local state only ever
 * initializes once, on the mount that already has a real profile —
 * the page-level gate above guarantees that.
 */
function ProfileForm({ profile }: { profile: DriverProfile }) {
  const [name, setName] = React.useState(profile.name);
  const [phone, setPhone] = React.useState(profile.phone);
  const [vehicleRegistration, setVehicleRegistration] = React.useState(profile.vehicleRegistration);
  const [vehicle, setVehicle] = React.useState<DriverVehicle | null>(profile.vehicle);
  const [saved, setSaved] = React.useState(false);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    updateDriverProfile({ name: name.trim(), phone: phone.trim(), vehicleRegistration: vehicleRegistration.trim(), vehicle });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDriverProfile({ photoDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
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
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoDataUrl} alt="" className="size-full object-cover" />
            ) : (
              <AvatarFallback>{(profile.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <label
            htmlFor="driver-photo"
            className="absolute -bottom-1 -right-1 flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm hover:text-foreground"
          >
            <Camera className="size-3.5" />
            <input id="driver-photo" type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
          </label>
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-semibold text-foreground">{profile.name || "Unnamed driver"}</p>
          <Badge variant={profile.verified ? "success" : "warning"} className="mt-1">
            <BadgeCheck className="size-3" /> {profile.verified ? "Verified" : "Pending verification"}
          </Badge>
        </div>
        {!profile.verified && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => updateDriverProfile({ verified: true })}
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
