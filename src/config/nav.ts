export type NavItem = {
  label: string;
  href: string;
  description: string;
};

/**
 * Primary wayfinding for the two sides of the network. Passenger
 * and driver surfaces are deliberately listed separately in the
 * mobile nav (see MobileNav) so a driver never has to wade through
 * passenger-facing labels to find their dashboard, and vice versa.
 */
export const passengerNav: NavItem[] = [
  {
    label: "Plan a journey",
    href: "/plan",
    description: "Tell us where you're going — we match you to a driver already heading there.",
  },
  {
    label: "Rentals",
    href: "/rentals",
    description: "Self-drive cars and bikes across the corridor for when a shared journey isn't the fit.",
  },
];

export const driverNav: NavItem[] = [
  {
    label: "Driver workspace",
    href: "/driver",
    description: "Publish a journey and see who's already waiting for it.",
  },
];

/** Flat shortlist for the desktop header — passenger items first, driver last. */
export const primaryNav: NavItem[] = [...passengerNav, ...driverNav];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Passengers",
    items: [
      { label: "Plan a journey", href: "/plan", description: "" },
      { label: "Airport travel", href: "/plan?purpose=airport", description: "" },
      { label: "Hospital travel", href: "/plan?purpose=hospital", description: "" },
      { label: "Rentals", href: "/rentals", description: "" },
    ],
  },
  {
    title: "Drivers & fleets",
    items: [
      { label: "Publish a journey", href: "/driver/publish", description: "" },
      { label: "Passenger requests", href: "/driver/requests", description: "" },
      { label: "Driver workspace", href: "/driver", description: "" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", description: "" },
      { label: "Settings", href: "/settings", description: "" },
    ],
  },
];
