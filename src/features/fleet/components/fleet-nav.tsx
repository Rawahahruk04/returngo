import { DashboardNav } from "@/components/layout/dashboard-nav";

const LINKS = [
  { href: "/fleet", label: "Dashboard" },
  { href: "/fleet/drivers", label: "Manage Drivers" },
  { href: "/fleet/vehicles", label: "Manage Vehicles" },
  { href: "/fleet/bookings", label: "Bookings" },
  { href: "/fleet/reports", label: "Reports" },
  { href: "/fleet/revenue", label: "Revenue" },
];

export function FleetNav({ active }: { active: string }) {
  return <DashboardNav links={LINKS} active={active} />;
}
