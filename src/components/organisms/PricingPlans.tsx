"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Check, Plus } from "lucide-react";
import CountUp from "@/components/atoms/CountUp";
import { PillButton, TextLink } from "@/components/atoms/ui";
import { plans, type Plan } from "@/components/molecules/pricingData";

const ease = [0.16, 1, 0.3, 1] as const;
const VISIBLE = 6; // features shown before "more"
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
// Wide screens: one row of equal-height cards, with Pro standing taller than its neighbours
const lift = ["", "lg:-my-8", ""];

// Cursor spotlight, as on the procurement tiles
const track = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const dark = index === 1;
  const shown = open ? plan.features : plan.features.slice(0, VISIBLE);
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 60 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  return (
    <motion.li variants={card} className={lift[index]}>
      <div
        onMouseMove={track}
        className={`group angle relative h-full overflow-hidden p-8 transition-transform duration-500 hover:-translate-y-1.5 sm:p-10 ${dark ? "bg-ink text-paper lg:py-[72px] shadow-[0_30px_80px_-30px_rgba(2,100,126,0.8)]" : "bg-white text-ink"}`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), ${dark ? "rgba(79,179,204,0.2)" : "rgba(2,100,126,0.08)"}, transparent 70%)`,
          }}
        />
        {dark && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-[90px]"
          />
        )}
        {/* Oversized outline numeral in the corner */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -bottom-10 -right-2 select-none font-heading text-[180px] font-extrabold leading-none text-transparent transition-transform duration-700 group-hover:-translate-y-3 ${dark ? "[-webkit-text-stroke:1px_rgba(243,247,248,0.12)]" : "[-webkit-text-stroke:1px_rgba(36,47,53,0.08)]"}`}
        >
          0{index + 1}
        </span>

        <div className="relative">
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.18em] ${dark ? "text-gold" : "text-primary"}`}
          >
            {plan.tier}
          </p>
          <h3
            className={`mt-2 text-4xl font-extrabold tracking-tight ${dark ? "text-mist" : ""}`}
          >
            {plan.name}
          </h3>
          <p
            className={`mt-3 max-w-xs text-sm leading-6 ${dark ? "text-paper/70" : "text-ink/65"}`}
          >
            {plan.tagline}
          </p>

          <div className="mt-8 flex items-start gap-1">
            <span
              className={`mt-2 text-2xl font-extrabold ${dark ? "text-gold" : "text-primary"}`}
            >
              $
            </span>
            <CountUp
              to={plan.price}
              duration={1.4}
              className="font-heading text-7xl font-extrabold leading-none tracking-tight"
            />
            <span
              className={`ml-2 self-end pb-2 text-sm ${dark ? "text-paper/55" : "text-ink/55"}`}
            >
              / month
            </span>
          </div>

          <div className="mt-8">
            <PillButton href="#" variant={dark ? "accent" : "dark"}>
              Get started
            </PillButton>
          </div>

          <ul
            className={`mt-10 border-t border-dashed pt-6 text-sm ${dark ? "border-paper/20" : "border-ink/20"}`}
          >
            <AnimatePresence initial={false}>
              {shown.map((f) => (
                <motion.li
                  key={f}
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="overflow-hidden"
                >
                  <span className="flex items-center gap-3 py-[7px]">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${dark ? "bg-gold text-ink" : "bg-primary/10 text-primary"}`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    <span className={dark ? "text-paper/85" : "text-ink/80"}>
                      {f}
                    </span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${dark ? "text-accent-soft hover:text-gold" : "text-primary hover:text-ink"}`}
          >
            <Plus
              className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
              aria-hidden
            />
            {open
              ? "Show fewer"
              : `${plan.features.length - VISIBLE} more features`}
          </button>
        </div>
      </div>
    </motion.li>
  );
}

// The three plans from missio.io/pricing, in one row with the middle plan taller and on slate
export default function PricingPlans() {
  const reduce = useReducedMotion();
  return (
    <section id="plans" className="relative overflow-hidden pt-18 lg:pt-24">
      {/* Faint teal wash behind the cards */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[1100px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.07] blur-[120px]"
      />
      <div className="relative mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="grid gap-6 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <span className="eyebrow">Plans</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              One platform. <span className="text-gold">Three ways</span> to
              start.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-ink/70 lg:justify-self-end">
            Flat monthly pricing, one login, and one record for every person who
            touches your mission. Start where you are and add the rest as you
            grow.
          </p>
        </motion.div>

        <motion.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-20 grid gap-4 lg:grid-cols-3 lg:items-stretch"
        >
          {plans.map((p, i) => (
            <PlanCard key={p.name} plan={p} index={i} />
          ))}
        </motion.ul>

        <div className="angle-sm mt-10 flex flex-wrap lg:mt-20 items-center justify-between gap-6 bg-mist px-8 py-6">
          <p className="max-w-2xl text-sm leading-6 text-ink/75">
            <span className="font-bold text-ink">
              Running more than one plan&rsquo;s worth of work?
            </span>{" "}
            Bring your invoices and we will build the real line-item comparison.
          </p>
          <TextLink href="/demo">Book a consultation</TextLink>
        </div>
      </div>
    </section>
  );
}
