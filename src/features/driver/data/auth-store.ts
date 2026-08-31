"use client";

import { useSyncExternalStore } from "react";

import type { DriverProfile } from "@/features/driver/types";

/**
 * Mock driver identity, `localStorage`-backed like `data/store.ts` —
 * no backend, no password, just enough of a session to gate
 * `/driver/*` and stop asking for the driver's name and vehicle on
 * every single publish.
 *
 * Unlike `data/store.ts`, this store is read from several independent
 * components at once (site header, mobile nav, the /driver layout
 * guard, driver pages) that all mount in the same commit. Hydrating
 * from an effect race-loses against whichever consumer's effect runs
 * first claiming the module-level "already hydrated" flag and
 * swallowing the notify for everyone else — so hydration instead runs
 * synchronously at module load, before any component subscribes.
 */
const STORAGE_KEY = "returngo:driver:auth:v1";

export type AuthSnapshot = { profile: DriverProfile | null; hydrated: boolean };

let snapshot: AuthSnapshot = { profile: null, hydrated: false };
const listeners = new Set<() => void>();

function readStoredProfile(): DriverProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DriverProfile;
    return parsed && typeof parsed.name === "string" ? parsed : null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  snapshot = { profile: readStoredProfile(), hydrated: true };
}

function persist(profile: DriverProfile | null) {
  if (typeof window === "undefined") return;
  if (profile) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function setProfile(profile: DriverProfile | null) {
  snapshot = { profile, hydrated: true };
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

const SERVER_SNAPSHOT: AuthSnapshot = { profile: null, hydrated: false };
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function loginDriver(input: { name: string; phone: string }) {
  setProfile({
    name: input.name,
    phone: input.phone,
    vehicleRegistration: "",
    vehicle: null,
    verified: false,
  });
}

export function logoutDriver() {
  setProfile(null);
}

export function updateDriverProfile(partial: Partial<DriverProfile>) {
  if (!snapshot.profile) return;
  setProfile({ ...snapshot.profile, ...partial });
}

export function useDriverAuth(): { profile: DriverProfile | null; isAuthenticated: boolean; hydrated: boolean } {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { profile: current.profile, isAuthenticated: current.profile !== null, hydrated: current.hydrated };
}
