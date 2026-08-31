import type { RentalVehicle } from "@/features/rental/types";

/** Demo catalogue, seeded under a placeholder owner so it never collides with a real Rental Owner's own listings. */
const OWNER = "ReturnGo Fleet Partner";

export const SEED_RENTAL_VEHICLES: RentalVehicle[] = [
  { id: "rental::seed::1", ownerName: OWNER, brand: "Honda", model: "Activa 6G", category: "scooter", transmission: "automatic", fuel: "petrol", seats: 2, pricePerDay: 400, locationId: "mangalore", driverAvailable: false, available: true },
  { id: "rental::seed::2", ownerName: OWNER, brand: "Royal Enfield", model: "Classic 350", category: "bike", transmission: "manual", fuel: "petrol", seats: 2, pricePerDay: 900, locationId: "udupi", driverAvailable: false, available: true },
  { id: "rental::seed::3", ownerName: OWNER, brand: "Maruti Suzuki", model: "Alto K10", category: "hatchback", transmission: "manual", fuel: "petrol", seats: 4, pricePerDay: 1200, locationId: "mangalore", driverAvailable: true, available: true },
  { id: "rental::seed::4", ownerName: OWNER, brand: "Hyundai", model: "i20", category: "hatchback", transmission: "automatic", fuel: "petrol", seats: 4, pricePerDay: 1500, locationId: "udupi", driverAvailable: true, available: true },
  { id: "rental::seed::5", ownerName: OWNER, brand: "Honda", model: "City", category: "sedan", transmission: "automatic", fuel: "petrol", seats: 4, pricePerDay: 2200, locationId: "mangalore", driverAvailable: true, available: true },
  { id: "rental::seed::6", ownerName: OWNER, brand: "Maruti Suzuki", model: "Swift Dzire", category: "sedan", transmission: "manual", fuel: "petrol", seats: 4, pricePerDay: 1700, locationId: "mangalore-airport", driverAvailable: true, available: true },
  { id: "rental::seed::7", ownerName: OWNER, brand: "Mahindra", model: "Scorpio-N", category: "suv", transmission: "manual", fuel: "diesel", seats: 7, pricePerDay: 3200, locationId: "mangalore", driverAvailable: true, available: true },
  { id: "rental::seed::8", ownerName: OWNER, brand: "Toyota", model: "Innova Crysta", category: "suv", transmission: "manual", fuel: "diesel", seats: 6, pricePerDay: 3600, locationId: "udupi", driverAvailable: true, available: true },
  { id: "rental::seed::9", ownerName: OWNER, brand: "Hyundai", model: "Creta", category: "suv", transmission: "automatic", fuel: "diesel", seats: 5, pricePerDay: 3000, locationId: "mangalore-airport", driverAvailable: false, available: true },
  { id: "rental::seed::10", ownerName: OWNER, brand: "Force", model: "Traveller", category: "traveller", transmission: "manual", fuel: "diesel", seats: 12, pricePerDay: 5500, locationId: "mangalore", driverAvailable: true, available: true },
  { id: "rental::seed::11", ownerName: OWNER, brand: "Tata", model: "Winger", category: "traveller", transmission: "manual", fuel: "diesel", seats: 12, pricePerDay: 5200, locationId: "udupi", driverAvailable: true, available: true },
  { id: "rental::seed::12", ownerName: OWNER, brand: "Toyota", model: "Fortuner", category: "luxury", transmission: "automatic", fuel: "diesel", seats: 6, pricePerDay: 6500, locationId: "mangalore-airport", driverAvailable: true, available: true },
  { id: "rental::seed::13", ownerName: OWNER, brand: "Mercedes-Benz", model: "E-Class", category: "luxury", transmission: "automatic", fuel: "diesel", seats: 4, pricePerDay: 9500, locationId: "mangalore", driverAvailable: true, available: true },
];
