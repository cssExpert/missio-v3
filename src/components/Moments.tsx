"use client";

import {
  CalendarClock,
  Merge,
  Rocket,
  TrendingUp,
  Unplug,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Arrow } from "./ui";

type Moment = {
  title: string;
  problem: string;
  answer: string;
  icon: LucideIcon;
};

// "Six moments" from missio.io: the situation a team is in, and what Missio does about it
const moments: Moment[] = [
  {
    title: "Fundraising operations are breaking",
    problem:
      "Donation pages, events, donor records, email, payments and reporting all live in different places, and someone reconciles them by hand.",
    answer:
      "Connect giving, events, donor relationships and revenue operations in one system.",
    icon: Unplug,
  },
  {
    title: "A new ED, COO or CDO just arrived",
    problem:
      "A new leader inherits a patchwork of tools and needs a modernization win in the first year.",
    answer:
      "Start with the one workflow costing your team the most hours every week.",
    icon: UserRoundPlus,
  },
  {
    title: "Renewal is coming and it stings",
    problem:
      "The incumbent feels too expensive, too limited, or too fragmented — and the quote went up again.",
    answer:
      "Before you renew, map everything you are still stitching together outside the CRM.",
    icon: CalendarClock,
  },
  {
    title: "A campaign or alumni push is starting",
    problem:
      "Advancement needs cleaner journeys, events, digital giving and reporting — and needs them this fiscal year.",
    answer:
      "Modern advancement workflows without an enterprise implementation burden.",
    icon: Rocket,
  },
  {
    title: "Programs grew faster than operations",
    problem:
      "Fundraising creates the demand, but the team struggles to staff, schedule, deliver and then report the impact.",
    answer:
      "Donor systems track the money. Missio also connects the work behind the mission.",
    icon: TrendingUp,
  },
  {
    title: "Your vendor is being consolidated",
    problem:
      "Mergers and forced migrations are pushing customers off platforms they did not choose to leave.",
    answer:
      "Consolidate what you run across multiple tools into one platform, at a fraction of your current annual spend.",
    icon: Merge,
  },
];

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// Cursor-following glow: the card stores the pointer position in CSS variables the glow layer reads
const trackSpotlight = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export default function Moments() {
  const reduce = useReducedMotion();
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 28 },
    },
  };

  return (
    <div id="moments" className="mt-16">
      <motion.ul
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {moments.map((m, n) => {
          const Icon = m.icon;
          return (
            <motion.li key={m.title} variants={card} className="h-full">
              <motion.article
                onMouseMove={trackSpotlight}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="group angle relative flex h-full flex-col overflow-hidden bg-paper p-8 ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_24px_60px_-20px_rgba(2,100,126,0.35)]"
              >
                {/* Spotlight that follows the cursor */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), rgba(2,100,126,0.12), transparent 65%)",
                  }}
                />
                {/* Large faint index number */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-16 top-5 text-6xl font-extrabold leading-none text-ink/[0.06] transition-colors duration-500 group-hover:text-gold/25"
                >
                  {String(n + 1).padStart(2, "0")}
                </span>

                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
                </span>
                <h3 className="relative mt-6 text-xl font-extrabold leading-snug text-ink">
                  {m.title}
                </h3>
                <p className="relative mt-3 text-sm leading-6 text-ink/70">
                  {m.problem}
                </p>

                <div className="relative my-6 border-t border-dashed border-ink/15" />

                <p className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-gold"
                    aria-hidden
                  />
                  What Missio does
                </p>
                <p className="relative mt-2 text-sm font-semibold leading-6 text-ink">
                  {m.answer}
                </p>

                <a
                  href="#contact"
                  className="group/link relative mt-auto inline-flex items-center gap-3 pt-6 text-sm font-bold text-ink transition-colors hover:text-primary"
                >
                  This is us
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-mist text-primary transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                    <Arrow className="transition-transform duration-300 group-hover/link:-rotate-45 group-hover:-rotate-45" />
                  </span>
                </a>
              </motion.article>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
