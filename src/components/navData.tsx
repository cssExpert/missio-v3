// Shared by the desktop mega menu (NavMenu) and the mobile menu (MobileMenu) so both list the same items

export const links = ["Home", "Products", "Why Missio", "About", "Pricing", "Resources"];
export const slug = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

// The page section each header link scrolls to (and is highlighted for while it's on screen)
export const sectionFor: Record<string, string> = {
  Home: "home",
  Products: "engines",
  "Why Missio": "obstacles",
  About: "about",
  Pricing: "pricing",
};

export const MISSIO = "https://www.missio.io";

// Links that go to another page instead of a section here
const external: Record<string, string> = {
  Resources: `${MISSIO}/blog`,
};

// Where a header link points: another page if listed above, otherwise its section on this page
export const hrefFor = (label: string) => external[label] ?? `#${sectionFor[label]}`;

// Product line from missio.io: four engines, the MIRA AI layer, and the comparison page
export const engines = [
  {
    name: "Growth Engine",
    text: "Website, donation pages, events, forms, email & SMS",
    features: ["Website & CMS", "Donation pages", "Events & ticketing", "Volunteer forms", "Email & SMS", "MIRA drafting"],
    icon: "M4 18l5-6 4 3 7-9 M15 6h5v5",
  },
  {
    name: "Relationship Engine",
    text: "Donor CRM, shared timeline, moves management",
    features: ["Donor CRM", "Shared timeline", "Moves management", "Segments", "Tasks & reminders"],
    icon: "M12 20s-7-4.2-7-9.5A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.5c0 5.3-7 9.5-7 9.5z",
  },
  {
    name: "Execution Engine",
    text: "Hiring, onboarding, scheduling, time tracking",
    features: ["Hiring & job posts", "Onboarding", "Scheduling", "Time tracking", "Background checks", "Project work"],
    icon: "M8 4h8v3H8z M6 5.5H5v15h14v-15h-1 M9 13l2 2 4-4",
  },
  {
    name: "Revenue Engine",
    text: "Giving, pledges, invoicing, QuickBooks sync",
    features: ["Fundraising", "Payments", "Pledges & recurring", "Invoicing", "QuickBooks sync", "Reporting"],
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4.1 0 1.1-1.1 2-2.5 2-1.2 0-2.2-.5-2.7-1.4 M12 6.5v1.5 M12 16v1.5",
  },
];

export const MIRA_ICON = "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z";

export function NavIcon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
