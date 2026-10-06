"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";

// Before and after: "seven products with seven logins" (missio.io's line) against one Missio login.
// When it scrolls into view the tools get crossed out one by one, the arrow appears, then Missio pops in.
const tools = ["Donor CRM", "Event tool", "Form builder", "Email & SMS", "Payments", "HR & payroll", "Spreadsheets"];

const ease = [0.16, 1, 0.3, 1] as const;
const STRIKE_START = 0.3;
const STRIKE_STEP = 0.12;
const AFTER = STRIKE_START + tools.length * STRIKE_STEP + 0.1; // when the arrow and Missio arrive

export default function StackCollapse() {
  const reduce = useReducedMotion();

  const chip = (i: number): Variants => ({
    idle: { opacity: 1 },
    struck: { opacity: 0.45, transition: { delay: STRIKE_START + i * STRIKE_STEP + 0.25, duration: 0.3 } },
  });
  const strike = (i: number): Variants => ({
    idle: { scaleX: 0 },
    struck: { scaleX: 1, transition: { delay: STRIKE_START + i * STRIKE_STEP, duration: 0.3, ease } },
  });
  const arrive: Variants = {
    idle: { opacity: 0, scale: 0.6 },
    struck: { opacity: 1, scale: 1, transition: { delay: AFTER, type: "spring", stiffness: 300, damping: 18 } },
  };

  return (
    <motion.div
      initial={reduce ? "struck" : "idle"}
      whileInView="struck"
      viewport={{ once: true, amount: 0.7 }}
      className="angle-sm grid items-center gap-4 bg-paper/[0.06] p-5 backdrop-blur-md sm:grid-cols-[1fr_auto_auto] sm:gap-5"
    >
      <p className="sr-only">Seven products and seven logins today; one Missio login with one record.</p>

      <div aria-hidden>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-paper/45">Today · 7 logins</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tools.map((t, i) => (
            <motion.li key={t} variants={chip(i)} className="relative rounded-full bg-paper/[0.08] px-2.5 py-1 text-xs font-semibold text-paper/85 ring-1 ring-paper/10">
              {t}
              <motion.span variants={strike(i)} className="absolute left-2 right-2 top-1/2 h-[1.5px] origin-left bg-[#F28A6B]" />
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.span aria-hidden variants={arrive} className="grid h-9 w-9 place-items-center justify-self-center rounded-full bg-paper/10 text-gold ring-1 ring-paper/15">
        <ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" strokeWidth={2.2} />
      </motion.span>

      <motion.div aria-hidden variants={arrive} className="justify-self-center sm:justify-self-auto">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gold sm:text-left">With Missio</p>
        <div className="mt-3 flex items-center gap-3 rounded-full bg-gold py-1.5 pl-1.5 pr-5 text-ink shadow-[0_0_40px_rgba(242,167,61,0.45)]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-base font-extrabold text-gold">1</span>
          <span className="leading-tight">
            <span className="block whitespace-nowrap text-sm font-extrabold">One login</span>
            <span className="block text-[11px] font-semibold text-ink/70">one record</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
