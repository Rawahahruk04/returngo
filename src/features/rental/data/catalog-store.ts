"use client";

import { useSyncExternalStore } from "react";

import { SEED_RENTAL_VEHICLES } from "@/features/rental/data/seed";
import type { RentalVehicle, RentalVehicleInput } from "@/features/rental/types";

/**
 * The rental catalogue — the single source both the public Browse
 * page and a Rental Owner's "My Vehicles" CRUD read and write. No
 * Match Engine involvement: this is a plain listings store.
 */
const STORAGE_KEY = "returngo:rental:catalog:v1";

let vehicles: RentalVehicle[] = SEED_RENTAL_VEHICLES;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

function hydrate() {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as RentalVehicle[];
      if (Array.isArray(parsed)) vehicles = parsed;
    } catch {
      // Corrupted storage — keep the seed catalogue.
    }
  }
}

if (typeof window !== "undefined") {
  hydrate();
}

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return vehicles;
}

function getServerSnapshot() {
  return SEED_RENTAL_VEHICLES;
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `rental::${Date.now()}::${idCounter}`;
}

export function addVehicle(input: RentalVehicleInput): RentalVehicle {
  const vehicle: RentalVehicle = { ...input, id: nextId() };
  vehicles = [vehicle, ...vehicles];
  persist();
  notify();
  return vehicle;
}

export function updateVehicle(id: string, partial: Partial<RentalVehicleInput>) {
  vehicles = vehicles.map((v) => (v.id === id ? { ...v, ...partial } : v));
  persist();
  notify();
}

export function removeVehicle(id: string) {
  vehicles = vehicles.filter((v) => v.id !== id);
  persist();
  notify();
}

export function setVehicleAvailability(id: string, available: boolean) {
  updateVehicle(id, { available });
}

export function getVehicleById(id: string): RentalVehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function useRentalCatalog(): RentalVehicle[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
