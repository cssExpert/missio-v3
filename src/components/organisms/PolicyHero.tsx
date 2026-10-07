"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;
const intro: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

// Legal page hero: breadcrumb, title, lead and quick facts over a faint ledger grid, inset like the other heroes.
// `children` adds content under it (the refund page's plain-English summary).
export default function PolicyHero({
  title,
  lead,
  crumb,
  eyebrow = "Legal",
  facts = [],
  children,
}: {
  title: string;
  lead: string;
  crumb: string;
  eyebrow?: string;
  facts?: string[];
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink">
      {/* Ledger grid and glows */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(90%_80%_at_30%_20%,black,transparent_75%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[120px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 h-[360px] w-[360px] rounded-full bg-gold/15 blur-[120px]"
      />

      {/* -mx-3 undoes the card inset so the content lines up with the logo */}
      <div className="relative -mx-3">
        <motion.div
          variants={intro}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-[1340px] px-6 pb-14 pt-36 sm:px-8 lg:pb-16 lg:pt-40"
        >
          <motion.nav variants={rise} aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center text-sm text-mist">
              <li>
                <Link href="/" className="transition-colors hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden className="mx-3 text-paper/40">
                /
              </li>
              <li className="text-paper/60">Legal</li>
              <li aria-hidden className="mx-3 text-paper/40">
                /
              </li>
              <li aria-current="page" className="text-gold">
                {crumb}
              </li>
            </ol>
          </motion.nav>

          <motion.span variants={rise} className="eyebrow gold mt-8">
            {eyebrow}
          </motion.span>
          <motion.h1
            variants={rise}
            className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-mist sm:text-6xl lg:text-[68px]"
          >
            {title}
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-2xl text-lg leading-8 text-paper/70">
            {lead}
          </motion.p>

          {/* Quick facts about the document */}
          {facts.length > 0 && (
            <motion.ul variants={rise} className="mt-8 flex flex-wrap gap-2">
              {facts.map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-paper/[0.07] px-3.5 py-1.5 text-xs font-semibold text-paper/80 ring-1 ring-paper/10"
                >
                  {f}
                </li>
              ))}
            </motion.ul>
          )}
          {/* Optional extra content, such as the refund page's plain-English summary */}
          {children && (
            <motion.div variants={rise} className="mt-12">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
