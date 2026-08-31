import { DashboardNav } from "@/components/layout/dashboard-nav";

const LINKS = [
  { href: "/driver", label: "Dashboard" },
  { href: "/driver/publish", label: "Publish" },
  { href: "/driver/requests", label: "Requests" },
  { href: "/driver/journeys", label: "Journeys" },
  { href: "/driver/profile", label: "Profile" },
];

export function WorkspaceNav({ active }: { active: string }) {
  return <DashboardNav links={LINKS} active={active} />;
}
