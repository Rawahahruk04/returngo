"use client";

import { useSyncExternalStore } from "react";

import type {
  PassengerTrip,
  PassengerTripInput,
  SavedLocation,
  SavedLocationInput,
} from "@/features/passenger/types";

const STORAGE_KEY = "returngo:passenger:v1";

type PassengerState = { savedLocations: SavedLocation[]; trips: PassengerTrip[] };

let state: PassengerState = { savedLocations: [], trips: [] };

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrate() {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PassengerState;
      if (Array.isArray(parsed.savedLocations) && Array.isArray(parsed.trips)) state = parsed;
    } catch {
      // Corrupted storage — start empty.
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
const SERVER_SNAPSHOT: PassengerState = { savedLocations: [], trips: [] };
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}
function setState(next: PassengerState) {
  state = next;
  persist();
  notify();
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}::${Date.now()}::${idCounter}`;
}

export function addSavedLocation(input: SavedLocationInput): SavedLocation {
  const saved: SavedLocation = { ...input, id: nextId("saved-location") };
  setState({ ...state, savedLocations: [saved, ...state.savedLocations] });
  return saved;
}

export function removeSavedLocation(id: string) {
  setState({ ...state, savedLocations: state.savedLocations.filter((l) => l.id !== id) });
}

export function addTrip(input: PassengerTripInput): PassengerTrip {
  const trip: PassengerTrip = { ...input, id: nextId("trip"), createdAt: Date.now() };
  setState({ ...state, trips: [trip, ...state.trips] });
  return trip;
}

export function usePassengerStore(): PassengerState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
