// Content from missio.io/pricing: the stack calculator's tools and sizes, and the three plans

export type Tool = { name: string; cost: number };

// Typical annual list price per tool (missio.io's preloaded figures)
export const tools: Tool[] = [
  { name: "Donor CRM", cost: 12000 },
  { name: "Events & ticketing", cost: 6000 },
  { name: "Online giving pages", cost: 4200 },
  { name: "Email marketing", cost: 3600 },
  { name: "Volunteer management", cost: 3000 },
  { name: "Payment platform fees", cost: 5400 },
  { name: "HR & scheduling", cost: 7200 },
  { name: "Website CMS", cost: 4800 },
  { name: "Accounting connector", cost: 2400 },
];

// Tools ticked when the page loads, so the receipt opens with a realistic stack
export const defaultTools = ["Donor CRM", "Events & ticketing", "Online giving pages", "Email marketing", "Payment platform fees"];

// Revenue bands. The multipliers are placeholders for the demo: missio.io only states the $18,000 baseline
// for the smallest band. Confirm them with sales before this ships.
export const scales = [
  { label: "Under $10M", stack: 1, missio: 1 },
  { label: "$10M–$25M", stack: 1.8, missio: 1.4 },
  { label: "$25M–$50M", stack: 3, missio: 2 },
  { label: "$50M+", stack: 4.5, missio: 2.8 },
];

export const MISSIO_BASE = 18000;

// Hours lost re-keying data: every pair of disconnected systems is a hand-off, about 12 hours a year each
export const HOURS_PER_HANDOFF = 12;

export const DISCLAIMER =
  "Illustrative estimates only, based on typical list pricing. Your actual numbers depend on seats, modules and processing volume — bring your invoices and we will build the real line-item comparison.";

export type Plan = { tier: string; name: string; price: number; tagline: string; features: string[] };

export const plans: Plan[] = [
  {
    tier: "Missio Business",
    name: "Starter",
    price: 99,
    tagline: "Your website, contacts and campaigns in one place.",
    features: [
      "Website CMS Management",
      "Contacts & Organization Management",
      "Lead Tracking & Prospect Management",
      "Campaign Management Tools",
      "Task & Activity Management",
      "Customer Communication Tools",
      "Email Campaigns",
      "SMS Messaging Integration",
      "Lead Capture Forms",
      "Subscriber & Contact Lists",
      "Marketing Activity Logs",
      "Customer Engagement Tracking",
      "Basic Sales Pipeline Tracking",
      "Reports & Business Insights",
      "Team Collaboration Tools",
    ],
  },
  {
    tier: "Missio Business",
    name: "Pro",
    price: 199,
    tagline: "Sell, invoice and get paid without leaving the record.",
    features: [
      "Online Store Management",
      "Product & Catalog Management",
      "Orders & Customer Management",
      "Product Categories & Attributes",
      "Discount Coupons & Promotions",
      "Customer Groups Management",
      "Invoices & Billing Management",
      "Estimates & Quotation Tools",
      "Payment Tracking",
      "Expense Management",
      "Credit Notes Management",
      "Marketing Automation Tools",
      "Customer Conversations Tracking",
      "Sales Reports & Insights",
      "Customer Purchase History",
    ],
  },
  {
    tier: "Missio Enterprise",
    name: "Suite",
    price: 399,
    tagline: "People, projects and knowledge for the whole organization.",
    features: [
      "Employee Management System",
      "Attendance Tracking",
      "Leave & Holiday Management",
      "Departments & Designations",
      "Staff Shift Management",
      "Timesheets & Work Logs",
      "Project Management Tools",
      "Team Task Assignment",
      "Internal Knowledge Base",
      "Notices & Internal Announcements",
      "Content Pages & Posts Management",
      "Content Categories Management",
      "Community Forums & Discussions",
      "Internal Collaboration Tools",
      "Advanced Business Reports",
    ],
  },
];
