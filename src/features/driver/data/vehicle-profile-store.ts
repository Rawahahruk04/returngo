"use client";

import { useSyncExternalStore } from "react";

import type { DriverVehicleProfile } from "@/features/driver/types";

/**
 * The vehicle half of a driver's identity — registration, vehicle
 * spec, verification, photo. Name/phone live on the shared `Account`
 * (`features/auth`); this store only exists once someone is signed
 * in as a driver. Same synchronous-hydration pattern as
 * `features/auth/data/account-store.ts`.
 */
const STORAGE_KEY = "returngo:driver:vehicle-profile:v1";

const EMPTY_PROFILE: DriverVehicleProfile = { vehicleRegistration: "", vehicle: null, verified: false };

let snapshot: DriverVehicleProfile = EMPTY_PROFILE;
const listeners = new Set<() => void>();

function readStored(): DriverVehicleProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_PROFILE;
  try {
    const parsed = JSON.parse(raw) as DriverVehicleProfile;
    return parsed && typeof parsed.vehicleRegistration === "string" ? parsed : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

if (typeof window !== "undefined") {
  snapshot = readStored();
}

function persist(profile: DriverVehicleProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function setProfile(profile: DriverVehicleProfile) {
  snapshot = profile;
  persist(profile);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_PROFILE;
}

export function updateDriverVehicleProfile(partial: Partial<DriverVehicleProfile>) {
  setProfile({ ...snapshot, ...partial });
}

export function useDriverVehicleProfile(): DriverVehicleProfile {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
