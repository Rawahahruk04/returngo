"use client";

import { useSyncExternalStore } from "react";

import type {
  FleetBooking,
  FleetBookingInput,
  FleetDriver,
  FleetDriverInput,
  FleetVehicle,
  FleetVehicleInput,
} from "@/features/fleet/types";

/**
 * A Fleet Owner's private operations roster — drivers, vehicles, and
 * a manually-logged booking history. One roster per device, same as
 * every other role's data in this no-backend MVP.
 */
const STORAGE_KEY = "returngo:fleet:v1";

type FleetState = { drivers: FleetDriver[]; vehicles: FleetVehicle[]; bookings: FleetBooking[] };

let state: FleetState = { drivers: [], vehicles: [], bookings: [] };

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrate() {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as FleetState;
      if (Array.isArray(parsed.drivers) && Array.isArray(parsed.vehicles) && Array.isArray(parsed.bookings)) {
        state = parsed;
      }
    } catch {
      // Corrupted storage — start with an empty roster.
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
  return state;
}
const SERVER_SNAPSHOT: FleetState = { drivers: [], vehicles: [], bookings: [] };
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function setState(next: FleetState) {
  state = next;
  persist();
  notify();
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}::${Date.now()}::${idCounter}`;
}

export function addDriver(input: FleetDriverInput): FleetDriver {
  const driver: FleetDriver = { ...input, id: nextId("fleet-driver") };
  setState({ ...state, drivers: [driver, ...state.drivers] });
  return driver;
}
export function updateDriver(id: string, partial: Partial<FleetDriverInput>) {
  setState({ ...state, drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...partial } : d)) });
}
export function removeDriver(id: string) {
  setState({ ...state, drivers: state.drivers.filter((d) => d.id !== id) });
}

export function addVehicle(input: FleetVehicleInput): FleetVehicle {
  const vehicle: FleetVehicle = { ...input, id: nextId("fleet-vehicle") };
  setState({ ...state, vehicles: [vehicle, ...state.vehicles] });
  return vehicle;
}
export function updateVehicle(id: string, partial: Partial<FleetVehicleInput>) {
  setState({ ...state, vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...partial } : v)) });
}
export function removeVehicle(id: string) {
  setState({ ...state, vehicles: state.vehicles.filter((v) => v.id !== id) });
}

export function addBooking(input: FleetBookingInput): FleetBooking {
  const booking: FleetBooking = { ...input, id: nextId("fleet-booking") };
  setState({ ...state, bookings: [booking, ...state.bookings] });
  return booking;
}
export function removeBooking(id: string) {
  setState({ ...state, bookings: state.bookings.filter((b) => b.id !== id) });
}

export function useFleetStore(): FleetState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
