"use client";

import { useEffect, useSyncExternalStore } from "react";

import { SEED_JOURNEYS } from "@/features/driver/data/seed";
import type { PublishedJourney, PublishJourneyInput, Reservation, ReservationStatus } from "@/features/driver/types";

/**
 * The Driver Workspace has no backend, so published journeys and
 * reservations live in `localStorage` for the length of the demo
 * session — a real deployment swaps this module for API calls without
 * touching any component, since every component only sees `useDriverStore()`.
 */
const STORAGE_KEY = "returngo:driver:workspace:v1";

type WorkspaceState = {
  journeys: PublishedJourney[];
  reservations: Reservation[];
};

let state: WorkspaceState = { journeys: SEED_JOURNEYS, reservations: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as WorkspaceState;
      if (Array.isArray(parsed.journeys) && Array.isArray(parsed.reservations)) {
        state = parsed;
        notify();
        return;
      }
    } catch {
      // Fall through to seeding — corrupted storage shouldn't crash the workspace.
    }
  }
  persist();
}

function notify() {
  listeners.forEach((listener) => listener());
}

function setState(next: WorkspaceState) {
  state = next;
  persist();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

const SERVER_SNAPSHOT: WorkspaceState = { journeys: SEED_JOURNEYS, reservations: [] };
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}::${Date.now()}::${idCounter}`;
}

export function publishJourney(input: PublishJourneyInput): PublishedJourney {
  const journey: PublishedJourney = {
    id: nextId("journey"),
    ...input,
    seatsReserved: 0,
    category: "shared",
    status: "upcoming",
    createdAt: Date.now(),
  };
  setState({ ...state, journeys: [journey, ...state.journeys] });
  return journey;
}

export function completeJourney(journeyId: string) {
  setState({
    ...state,
    journeys: state.journeys.map((j) => (j.id === journeyId ? { ...j, status: "completed" } : j)),
  });
}

export function cancelJourney(journeyId: string) {
  setState({
    ...state,
    journeys: state.journeys.map((j) => (j.id === journeyId ? { ...j, status: "cancelled" } : j)),
  });
}

export function publishReturnJourney(baseJourney: PublishedJourney, destinationId: string, time: string): PublishedJourney {
  const journey: PublishedJourney = {
    id: nextId("return-journey"),
    driverName: baseJourney.driverName,
    vehicleName: baseJourney.vehicleName,
    vehiclePlate: baseJourney.vehiclePlate,
    originId: baseJourney.destinationId,
    destinationId,
    date: baseJourney.date,
    time,
    seatsTotal: baseJourney.seatsTotal,
    seatsReserved: 0,
    purpose: baseJourney.purpose,
    category: "return",
    status: "upcoming",
    createdAt: Date.now(),
  };
  setState({ ...state, journeys: [journey, ...state.journeys] });
  return journey;
}

export function addReservation(reservation: Omit<Reservation, "id" | "status">): Reservation {
  const created: Reservation = { ...reservation, id: nextId("reservation"), status: "pending" };
  setState({ ...state, reservations: [...state.reservations, created] });
  return created;
}

export function setReservationStatus(reservationId: string, status: ReservationStatus) {
  const reservation = state.reservations.find((r) => r.id === reservationId);
  if (!reservation) return;

  const journeys =
    status === "accepted"
      ? state.journeys.map((j) =>
          j.id === reservation.journeyId
            ? { ...j, seatsReserved: Math.min(j.seatsTotal, j.seatsReserved + reservation.passengers) }
            : j,
        )
      : state.journeys;

  setState({
    ...state,
    journeys,
    reservations: state.reservations.map((r) => (r.id === reservationId ? { ...r, status } : r)),
  });
}

export function useDriverStore(): WorkspaceState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Runs after the subscription (registered by useSyncExternalStore's own
  // effect) is active, so hydrating from localStorage here reliably
  // triggers a re-render with the persisted data instead of getting lost.
  useEffect(() => {
    hydrate();
  }, []);
  return snapshot;
}
