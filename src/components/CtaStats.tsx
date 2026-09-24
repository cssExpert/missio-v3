"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import CountUp from "./CountUp";

// Stats from missio.io. Its source line is marked "Replace with verified figures before launch":
// confirm the 48% (Omatic 2025 survey) and the "0 competing platforms" claim before this ships.
const stats = [
  { value: 48, suffix: "%", text: "of nonprofits are considering switching CRMs in the next 12 months", bar: "bg-gold", num: "text-gold", glow: "group-hover:shadow-[0_0_24px_rgba(236,178,46,0.6)]" },
  { value: 0, suffix: "", text: "competing donor platforms that include HR, hiring and time tracking natively", bar: "bg-accent-soft", num: "text-accent-soft", glow: "group-hover:shadow-[0_0_24px_rgba(79,179,204,0.6)]" },
  { value: 1, suffix: "", text: "login, one ledger, one record for every person in your mission", bar: "bg-paper", num: "text-paper", glow: "group-hover:shadow-[0_0_24px_rgba(243,247,248,0.5)]" },
];

const row: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };

// Glass stat cards with a coloured edge bar, count-up numbers and a staggered reveal
export default function CtaStats() {
  const reduce = useReducedMotion();
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 26 } },
  };

  return (
    <div className="mt-16">
      <motion.ul
        variants={row}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 md:grid-cols-3"
      >
        {stats.map((s) => (
          <motion.li
            key={s.text}
            variants={card}
            whileHover={reduce ? undefined : { y: -4 }}
            className="group relative overflow-hidden rounded-2xl bg-ink/40 py-7 pl-9 pr-7 ring-1 ring-paper/10 backdrop-blur-md transition-colors duration-300 hover:bg-ink/60"
          >
            {/* Coloured edge bar; glows on hover */}
            <span aria-hidden className={`absolute inset-y-5 left-0 w-1 rounded-r-full transition-shadow duration-300 ${s.bar} ${s.glow}`} />
            <p className={`text-5xl font-extrabold leading-none tracking-tight md:text-6xl ${s.num}`}>
              <CountUp to={s.value} />
              {s.suffix}
            </p>
            <p className="mt-4 max-w-xs text-base leading-7 text-paper/80">{s.text}</p>
          </motion.li>
        ))}
      </motion.ul>
      <p className="mt-6 text-xs text-paper/45">Sources: Omatic 2025 Nonprofit CRM Survey; Missio competitive audit, June 2026.</p>
    </div>
  );
}
