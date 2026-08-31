import type { PublishedJourney } from "@/features/driver/types";

/**
 * First-run demo data so the Driver Workspace is never empty. Mirrors
 * the same Bhatkal <-> Mangalore Airport corridor the passenger flow
 * and Match Engine already use, so the two sides of the demo visibly
 * connect.
 */
export const SEED_JOURNEYS: PublishedJourney[] = [
  {
    id: "seed::mohammed::bhatkal-mangalore-airport",
    driverName: "Mohammed Ashfaq",
    vehicleName: "Toyota Innova Crysta",
    vehiclePlate: "KA-19-B-4021",
    originId: "bhatkal",
    destinationId: "mangalore-airport",
    date: new Date().toISOString().slice(0, 10),
    time: "06:45",
    seatsTotal: 6,
    seatsReserved: 1,
    purpose: "airport",
    category: "shared",
    status: "upcoming",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    price: 950,
    notes: "AC vehicle, luggage space for 2 large bags per passenger.",
  },
  {
    id: "seed::sameer::honnavar-kmc-hospital",
    driverName: "Sameer Honnavar",
    vehicleName: "Maruti Suzuki Ertiga",
    vehiclePlate: "KA-19-C-7714",
    originId: "honnavar",
    destinationId: "kmc-hospital",
    date: new Date().toISOString().slice(0, 10),
    time: "09:15",
    seatsTotal: 6,
    seatsReserved: 2,
    purpose: "hospital",
    category: "shared",
    status: "upcoming",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    price: 620,
  },
  {
    id: "seed::imran::kundapura-mangalore",
    driverName: "Imran Bhatkal",
    vehicleName: "Maruti Suzuki Swift Dzire",
    vehiclePlate: "KA-20-A-6642",
    originId: "kundapura",
    destinationId: "mangalore",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
    time: "07:30",
    seatsTotal: 4,
    seatsReserved: 3,
    purpose: "intercity",
    category: "shared",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    price: 780,
  },
];
