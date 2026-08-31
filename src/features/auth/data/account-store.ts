"use client";

import { useSyncExternalStore } from "react";

import type { Account, RegisterInput } from "@/features/auth/types";

/**
 * The one signed-in account on this device — `localStorage`-backed,
 * no backend, no password. Hydrates synchronously at module load
 * (not in a `useEffect`) because several independent components
 * (header, mobile nav, every role's layout guard) all read this at
 * once; hydrating in an effect races across them — whichever
 * component's effect runs first claims the "already hydrated" flag
 * and the rest never get notified. See the driver vehicle-profile
 * store for the same fix applied there.
 */
const STORAGE_KEY = "returngo:account:v1";

export type AccountSnapshot = { account: Account | null; hydrated: boolean };

let snapshot: AccountSnapshot = { account: null, hydrated: false };
const listeners = new Set<() => void>();

function readStoredAccount(): Account | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Account;
    return parsed && typeof parsed.name === "string" && typeof parsed.role === "string" ? parsed : null;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  snapshot = { account: readStoredAccount(), hydrated: true };
}

function persist(account: Account | null) {
  if (typeof window === "undefined") return;
  if (account) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function setAccount(account: Account | null) {
  snapshot = { account, hydrated: true };
  persist(account);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

const SERVER_SNAPSHOT: AccountSnapshot = { account: null, hydrated: false };
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function registerAccount(input: RegisterInput) {
  setAccount({ name: input.name, email: input.email, phone: input.phone, role: input.role });
}

export function logoutAccount() {
  setAccount(null);
}

export function updateAccount(partial: Partial<Account>) {
  if (!snapshot.account) return;
  setAccount({ ...snapshot.account, ...partial });
}

export function useAccount(): { account: Account | null; isAuthenticated: boolean; hydrated: boolean } {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { account: current.account, isAuthenticated: current.account !== null, hydrated: current.hydrated };
}
