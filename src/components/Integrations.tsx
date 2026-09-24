import Image from "next/image";
import {
  Church,
  GraduationCap,
  HandHeart,
  HouseHeart,
  Landmark,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { PillButton, TextLink } from "./ui";

// tags: optional pills shown under the text
type Feature = {
  title: string;
  text: string;
  icon: string | LucideIcon;
  tags?: string[];
};

// icon: a Lucide icon component, or a path starting with "/" to an image in public/images
const items: Feature[] = [
  {
    title: "Relief Organizations",
    text: " Field teams, rapid response and donors who give when the news breaks. Surge giving pages go live in hours, not weeks. Volunteer intake, screening and deployment run in the same system as the appeal that funded them.",
    icon: HandHeart,
    tags: [
      "Surge campaigns",
      "Volunteer deployment",
      "Field scheduling",
      "Impact reporting",
    ],
  },
  {
    title: "Local Nonprofits",
    text: "Small teams wearing every hat, with no IT department behind them. One login replaces the CRM, the event tool, the form builder and the spreadsheet holding them together.",
    icon: HouseHeart,
    tags: ["Donor CRM", "Events", "Volunteer forms", "QuickBooks sync"],
  },
  {
    title: "Foundations",
    text: "Grantmaking, stewardship and boards that ask for clean numbers. Track gifts, pledges and multi-year commitments on one timeline.",
    icon: Landmark,
    tags: [
      "Pledges",
      "Multi-year giving",
      "Board reporting",
      "Fund accounting sync",
    ],
  },
  {
    title: "Churches",
    text: "Recurring giving, volunteers and staff scheduling in one community. Weekly giving, event registration, volunteer rosters and staff scheduling all live together.",
    icon: Church,
    tags: [
      "Recurring giving",
      "Volunteer rosters",
      "Staff scheduling",
      "Events",
    ],
  },
  {
    title: "Advocacy Groups",
    text: "Campaigns that spike, lists that grow fast, and moments you cannot miss. Forms, email, SMS and giving pages feed the same supporter record.",
    icon: Scale,
    tags: [
      "Petitions & forms",
      "Email & SMS",
      "Rapid giving",
      "Supporter journeys",
    ],
  },
  {
    title: "Private Schools",
    text: "Annual fund, auction, parent events and advancement records. The development office and the business office finally see the same numbers.",
    icon: GraduationCap,
    tags: ["Annual fund", "Auctions", "Parent events", "Household records"],
  },
];

function FeatureIcon({
  icon,
  title,
}: {
  icon: string | LucideIcon;
  title: string;
}) {
  if (typeof icon !== "string") {
    const Icon = icon;
    return (
      <Icon
        className="h-[70px] w-[70px] text-ink"
        strokeWidth={0.75}
        aria-hidden
      />
    );
  }
  if (icon.startsWith("/")) {
    return (
      <Image
        src={icon}
        alt={title}
        width={60}
        height={60}
        className="h-[60px] w-[60px]"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-[60px] w-[60px] text-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={icon} />
    </svg>
  );
}

export default function Integrations() {
  return (
    <section
      id="features"
      className="relative lg:grid lg:grid-cols-2 bg-[#f4f4f4]"
    >
      {/* Gray panel runs out to the left edge; its content stays pinned while the list scrolls */}
      <div className="bg-mist px-4 py-24 sm:px-8 lg:py-30 lg:pl-[max(2rem,calc((100vw-1340px)/2+2rem))] lg:pr-16">
        <div className="lg:sticky lg:top-40">
          <span className="eyebrow">Built for any organization</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            However you&rsquo;re built to do good, Missio{" "}
            <span className="text-gold">flexes</span> to fit.
          </h2>
          <div className="mt-8 max-w-lg space-y-4 text-base leading-6 text-ink/80">
            <p>
              Whether you&rsquo;re a local community co-op, a new church, or a
              200-person international relief org, Missio&rsquo;s engines
              configure to your size and workflow.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <PillButton href="#">Our work</PillButton>
            <TextLink href="#">Let&apos;s Talk</TextLink>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-30">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="mb-14 flex w-full flex-col items-start text-left lg:items-center lg:text-center"
          >
            <FeatureIcon icon={it.icon} title={it.title} />
            <h4 className="mt-4 text-xl font-extrabold text-ink">{it.title}</h4>
            <p className="mt-3 max-w-lg text-base leading-6 text-ink/80">
              {it.text}
            </p>
            {it.tags && it.tags.length > 0 && (
              <ul className="mt-5 flex max-w-lg flex-wrap justify-start gap-2 lg:justify-center">
                {it.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-ink/10 bg-mist/60 px-4 py-1.5 text-sm font-semibold text-primary"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {/* Dashed divider between items; the last item gets none */}
            {i < items.length - 1 && (
              <div className="mx-auto mt-16 h-px w-full max-w-lg border-t border-dashed border-ink/20" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
