import { DashboardNav } from "@/components/layout/dashboard-nav";

const LINKS = [
  { href: "/rental-owner", label: "Dashboard" },
  { href: "/rental-owner/vehicles", label: "My Vehicles" },
  { href: "/rental-owner/bookings", label: "Bookings" },
  { href: "/rental-owner/availability", label: "Availability" },
  { href: "/rental-owner/revenue", label: "Revenue" },
  { href: "/rental-owner/profile", label: "Profile" },
];

export function OwnerNav({ active }: { active: string }) {
  return <DashboardNav links={LINKS} active={active} />;
}
