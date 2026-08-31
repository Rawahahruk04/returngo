"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { RentalInquiry, RentalInquiryInput } from "@/features/rental/types";

/** Same localStorage + useSyncExternalStore pattern as the driver workspace store. */
const STORAGE_KEY = "returngo:rental:inquiries:v1";

let inquiries: RentalInquiry[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as RentalInquiry[];
      if (Array.isArray(parsed)) inquiries = parsed;
    } catch {
      // Corrupted storage shouldn't crash the page — stay empty.
    }
  }
  notify();
}

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return inquiries;
}

function getServerSnapshot() {
  return [] as RentalInquiry[];
}

let idCounter = 0;
export function submitRentalInquiry(input: RentalInquiryInput): RentalInquiry {
  idCounter += 1;
  const inquiry: RentalInquiry = { ...input, id: `rental::${Date.now()}::${idCounter}`, createdAt: Date.now() };
  inquiries = [inquiry, ...inquiries];
  persist();
  notify();
  return inquiry;
}

export function useRentalInquiries(): RentalInquiry[] {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    hydrate();
  }, []);
  return snapshot;
}
