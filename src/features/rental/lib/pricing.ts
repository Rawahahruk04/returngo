/** Flat per-day fee for a "with driver" hire, added on top of the vehicle's own daily rate. */
export const DRIVER_FEE_PER_DAY = 800;

export function daysBetween(pickupDate: string, returnDate: string): number {
  const pickup = new Date(`${pickupDate}T00:00:00`);
  const dropoff = new Date(`${returnDate}T00:00:00`);
  const diff = Math.round((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

export function computeRentalTotal(pricePerDay: number, days: number, mode: "self-drive" | "with-driver"): number {
  const base = pricePerDay * days;
  const driverFee = mode === "with-driver" ? DRIVER_FEE_PER_DAY * days : 0;
  return base + driverFee;
}
