import Image from "next/image";
import { PillButton, TextLink } from "./ui";

type Feature = { title: string; text: string; icon: string };

// Line icons describe what each integration does; an icon starting with "/" is loaded as an image from public/images instead
const items: Feature[] = [
  {
    title: "Quickbooks integration",
    text: " Streamline your fundraising with a unified platform for donor and financial data, seamlessly integrated with QuickBooks. ",
    icon: "/images/integrations/Missio-Quickbooks.svg",
  },
  {
    title: "Slack integration",
    text: " Enable real-time donation alerts and team notifications with Slack. Keep your fundraising team aligned and responsive with automated communication and donor activity tracking. ",
    icon: "/images/integrations/Missio-Slack.png",
  },
  {
    title: "Zapier integration",
    text: " Boost your nonprofit's productivity by automating tasks across 5,000 apps. Zapier helps connect your donation forms, email platforms, and CRMs-making your fundraising workflows seamless. ",
    icon: "/images/integrations/Missio-Zapier.png",
  },
  {
    title: "Google integration",
    text: " Integrate with Google Sheets, Gmail, and Calendar to organize donor information, schedule follow-ups, and enhance your nonprofit's outreach strategy. ",
    icon: "/images/integrations/Missio-Google.png",
  },
  {
    title: "Okta integration",
    text: " Use Okta single sign-on (SSO) to provide secure and easy access for your staff and volunteers. Protect sensitive donor data while enabling a smooth user experience. ",
    icon: "/images/integrations/Missio-Okta.png",
  },
  {
    title: "Stripe integration",
    text: " Accept online donations securely through Stripe. Empower your nonprofit with flexible payment options, automated receipts, and real-time donor transaction tracking. ",
    icon: "/images/integrations/Missio-Stripe.png",
  },
];

function FeatureIcon({ icon }: { icon: string }) {
  if (icon.startsWith("/")) {
    return (
      <Image
        src={icon}
        alt=""
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
      strokeWidth="1.6"
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
      className="relative lg:grid lg:grid-cols-2 bg-[#f2f2f2]"
    >
      {/* Gray panel runs out to the left edge; its content stays pinned while the list scrolls */}
      <div className="bg-mist px-4 py-24 sm:px-8 lg:py-30 lg:pl-[max(2rem,calc((100vw-1340px)/2+2rem))] lg:pr-16">
        <div className="lg:sticky lg:top-40">
          <span className="eyebrow">Integrations</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Make Payments Easier with <span className="text-gold">50+</span>{" "}
            Integrations
          </h2>
          <div className="mt-8 max-w-lg space-y-4 text-base leading-6 text-ink/80">
            <p>
              Good advice is only half the job. The other half is how it gets
              delivered.
            </p>
            <p>
              We pair clear thinking with steady execution and plain-spoken
              updates, so decisions get made faster and nothing stalls between
              meetings. You always know what we are working on, why it matters,
              and what comes next.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <PillButton href="#">Our work</PillButton>
            <TextLink href="#">Let&apos;s Talk</TextLink>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-30">
        {items.map((it) => (
          <div
            key={it.title}
            className="mb-16 flex w-full flex-col items-start text-left lg:items-center lg:text-center"
          >
            <FeatureIcon icon={it.icon} />
            <h4 className="mt-6 text-xl font-extrabold text-ink">{it.title}</h4>
            <p className="mt-3 max-w-lg text-base leading-6 text-ink/80">
              {it.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
