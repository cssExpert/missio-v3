"use client";

import {
  BriefcaseBusiness,
  ChartColumnIncreasing,
  Globe,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

type Engine = {
  n: string;
  name: string;
  area: string;
  tagline: string;
  text: string;
  features: string[];
  icon: LucideIcon;
  // Full class strings per colour so Tailwind can see them
  tone: {
    text: string;
    tile: string;
    tileHover: string;
    chip: string;
    ring: string;
    glow: string;
    spot: string;
  };
};

// The four engines from missio.io, colour-coded like the original (red, teal, orange, green) in this site's palette
const engines: Engine[] = [
  {
    n: "01",
    name: "Growth Engine",
    area: "Web Presence",
    tagline: "Bring in support without bringing in another tool.",
    text: "Website, donation pages, events, forms, email, and SMS — all in one connected system, with MIRA ready to draft your first page or appeal. Every form feeds the same donor record, so no supporter falls through the cracks.",
    features: [
      "Website & CMS",
      "Donation pages",
      "Events & ticketing",
      "Volunteer forms",
      "Email & SMS",
      "MIRA drafting",
    ],
    icon: Globe,
    tone: {
      text: "text-[#F28A6B]",
      tile: "bg-[#F28A6B]/10 text-[#F28A6B] ring-[#F28A6B]/25",
      tileHover: "group-hover:bg-[#F28A6B] group-hover:text-ink",
      chip: "bg-[#F28A6B]/10 text-[#F7A68D] ring-[#F28A6B]/25",
      ring: "hover:ring-[#F28A6B]/50",
      glow: "hover:shadow-[0_30px_80px_-30px_rgba(242,138,107,0.55)]",
      spot: "rgba(242,138,107,0.14)",
    },
  },
  {
    n: "02",
    name: "Relationship Engine",
    area: "Donor CRM & Comms",
    tagline: "Every donor in one view, even when staff leave.",
    text: "Every contact, conversation, gift, pledge, and task lives on one shared timeline. When staff turn over, the organizational knowledge stays in Missio — not someone's inbox.",
    features: [
      "Donor CRM",
      "Shared timeline",
      "Moves management",
      "Segments",
      "Tasks & reminders",
    ],
    icon: HeartHandshake,
    tone: {
      text: "text-accent-soft",
      tile: "bg-accent-soft/10 text-accent-soft ring-accent-soft/25",
      tileHover: "group-hover:bg-accent-soft group-hover:text-ink",
      chip: "bg-accent-soft/10 text-accent-soft ring-accent-soft/25",
      ring: "hover:ring-accent-soft/50",
      glow: "hover:shadow-[0_30px_80px_-30px_rgba(79,179,204,0.55)]",
      spot: "rgba(79,179,204,0.14)",
    },
  },
  {
    n: "03",
    name: "Execution Engine",
    area: "HR & Team Management",
    tagline: "The part most nonprofit systems miss: your people.",
    text: "Hiring, onboarding, scheduling, time tracking, and project work — all in the same system as your mission operations. Post a job, run a background check, and onboard a hire without adding another tool.",
    features: [
      "Hiring & job posts",
      "Onboarding",
      "Scheduling",
      "Time tracking",
      "Background checks",
      "Project work",
    ],
    icon: BriefcaseBusiness,
    tone: {
      text: "text-gold",
      tile: "bg-gold/10 text-gold ring-gold/25",
      tileHover: "group-hover:bg-gold group-hover:text-ink",
      chip: "bg-gold/10 text-gold ring-gold/25",
      ring: "hover:ring-gold/50",
      glow: "hover:shadow-[0_30px_80px_-30px_rgba(236,178,46,0.5)]",
      spot: "rgba(236,178,46,0.13)",
    },
  },
  {
    n: "04",
    name: "Revenue Engine",
    area: "Finance & Reporting",
    tagline: "From the gift to the books, without the handoff.",
    text: "Online giving, pledges, recurring donations, invoicing, and QuickBooks sync all flow through one workflow. Giving and finance teams work from the same numbers, so nothing needs re-keying.",
    features: [
      "Fundraising",
      "Payments",
      "Pledges & recurring",
      "Invoicing",
      "QuickBooks sync",
      "Reporting",
    ],
    icon: ChartColumnIncreasing,
    tone: {
      text: "text-[#5FCFA8]",
      tile: "bg-[#5FCFA8]/10 text-[#5FCFA8] ring-[#5FCFA8]/25",
      tileHover: "group-hover:bg-[#5FCFA8] group-hover:text-ink",
      chip: "bg-[#5FCFA8]/10 text-[#7FDBBB] ring-[#5FCFA8]/25",
      ring: "hover:ring-[#5FCFA8]/50",
      glow: "hover:shadow-[0_30px_80px_-30px_rgba(95,207,168,0.5)]",
      spot: "rgba(95,207,168,0.13)",
    },
  },
];

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// Cursor-following spotlight: the card stores the pointer position in CSS variables its glow layer reads
const trackSpotlight = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export default function GrowthEngine() {
  const reduce = useReducedMotion();
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 26 },
    },
  };

  return (
    // Inset dark card with rounded corners, like the hero banner
    <section
      id="engines"
      className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink py-24 lg:py-32"
    >
      {/* Soft colour washes behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-primary/30 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]"
      />

      <div className="-mx-3">
        <div className="mx-auto max-w-[1340px] px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="eyebrow gold">The Missio engines</span>
            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-mist">
              Four engines. One platform.
              <br className="hidden md:block" />
              Built for <span className="text-gold">impact.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-paper/70">
              Growth, relationships, people and revenue run on the same record,
              so nothing is re-typed and no supporter falls through the cracks.
            </p>
          </motion.div>

          <motion.ul
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 grid gap-5 lg:grid-cols-2"
          >
            {engines.map((e) => {
              const Icon = e.icon;
              return (
                <motion.li key={e.name} variants={card} className="h-full">
                  <motion.article
                    onMouseMove={trackSpotlight}
                    whileHover={reduce ? undefined : { y: -6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-paper/[0.03] p-8 ring-1 ring-paper/10 transition-[box-shadow,--tw-ring-color] duration-500 sm:p-10 ${e.tone.ring} ${e.tone.glow}`}
                  >
                    {/* Spotlight in the engine's colour, following the cursor */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), ${e.tone.spot}, transparent 65%)`,
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 transition-colors duration-500 ${e.tone.tile} ${e.tone.tileHover}`}
                      >
                        <Icon
                          className="h-6 w-6"
                          strokeWidth={1.6}
                          aria-hidden
                        />
                      </span>
                      <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/60 ring-1 ring-paper/15">
                        Engine {e.n}
                      </span>
                    </div>

                    <h3 className="relative mt-8 text-2xl font-extrabold leading-tight tracking-tight text-mist md:text-[28px]">
                      {e.name} <span className="text-paper/40">— {e.area}</span>
                    </h3>
                    <p
                      className={`relative mt-3 text-lg font-bold leading-snug ${e.tone.text}`}
                    >
                      {e.tagline}
                    </p>
                    <p className="relative mt-4 text-base leading-7 text-paper/70">
                      {e.text}
                    </p>

                    <ul className="relative mt-auto flex flex-wrap gap-2 pt-8">
                      {e.features.map((f) => (
                        <li
                          key={f}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${e.tone.chip}`}
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
