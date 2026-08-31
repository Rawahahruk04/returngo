export type NavItem = {
  label: string;
  href: string;
  description: string;
};

/**
 * Primary wayfinding across ReturnGo's three products — Book Taxi,
 * Rent Vehicle, and Drive & Earn — plus the two static company pages.
 * Drives both the desktop header and the mobile nav.
 */
export const primaryNav: NavItem[] = [
  {
    label: "Book Taxi",
    href: "/plan",
    description: "Tell us where you're going — we match you to a driver already heading there, or book the whole taxi.",
  },
  {
    label: "Rent Vehicle",
    href: "/rentals",
    description: "Self-drive or with-driver vehicle hire across the corridor — a separate product from Book Taxi.",
  },
  {
    label: "Drive & Earn",
    href: "/driver",
    description: "Publish a journey and see who's already waiting for it.",
  },
  {
    label: "About",
    href: "/about",
    description: "How ReturnGo's return-journey matching works, and the products built on it.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with the ReturnGo team.",
  },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Taxi",
    items: [
      { label: "Book a taxi", href: "/plan", description: "" },
      { label: "Airport travel", href: "/plan?purpose=airport", description: "" },
      { label: "Hospital travel", href: "/plan?purpose=hospital", description: "" },
    ],
  },
  {
    title: "Rentals",
    items: [{ label: "Rent a vehicle", href: "/rentals", description: "" }],
  },
  {
    title: "Drivers",
    items: [
      { label: "Drive & Earn", href: "/driver", description: "" },
      { label: "Publish a journey", href: "/driver/publish", description: "" },
      { label: "Passenger requests", href: "/driver/requests", description: "" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about", description: "" },
      { label: "Contact", href: "/contact", description: "" },
    ],
  },
];
