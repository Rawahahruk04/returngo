import { DashboardNav } from "@/components/layout/dashboard-nav";

const LINKS = [
  { href: "/passenger", label: "Dashboard" },
  { href: "/passenger/trips", label: "My Trips" },
  { href: "/passenger/saved", label: "Saved Locations" },
  { href: "/passenger/bookings", label: "Bookings" },
  { href: "/passenger/profile", label: "Profile" },
];

export function PassengerNav({ active }: { active: string }) {
  return <DashboardNav links={LINKS} active={active} />;
}
