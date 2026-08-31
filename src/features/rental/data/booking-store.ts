"use client";

import { useSyncExternalStore } from "react";

import type { RentalBooking, RentalBookingInput } from "@/features/rental/types";

const STORAGE_KEY = "returngo:rental:bookings:v1";

let bookings: RentalBooking[] = [];

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function hydrate() {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as RentalBooking[];
      if (Array.isArray(parsed)) bookings = parsed;
    } catch {
      // Corrupted storage — stay empty.
    }
  }
}

if (typeof window !== "undefined") hydrate();

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function getSnapshot() {
  return bookings;
}
function getServerSnapshot() {
  return [] as RentalBooking[];
}

let idCounter = 0;
export function createBooking(input: RentalBookingInput): RentalBooking {
  idCounter += 1;
  const booking: RentalBooking = { ...input, id: `rental-booking::${Date.now()}::${idCounter}`, createdAt: Date.now() };
  bookings = [booking, ...bookings];
  persist();
  notify();
  return booking;
}

export function useRentalBookings(): RentalBooking[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
