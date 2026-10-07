"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PillButton } from "@/components/atoms/ui";
import {
  AuditArt,
  CutoverArt,
  MoveArt,
} from "@/components/molecules/PathBentoArt";

const ease = [0.16, 1, 0.3, 1] as const;

// Soft white bento card with an outlined label chip, title and text (style after the bentogrids.com reference)
function Card({
  label,
  title,
  text,
  className = "",
  spread = false,
  children,
}: {
  label: string;
  title: string;
  text: string;
  className?: string;
  // Title at the top, text pinned to the bottom of the card (the wide first card)
  spread?: boolean;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      className={`relative overflow-hidden rounded-[28px] bg-white p-8 shadow-[0_30px_80px_-50px_rgba(36,47,53,0.45)] ring-1 ring-ink/[0.07] sm:p-10 ${className}`}
    >
      <span className="inline-block self-start rounded-lg bg-white px-2.5 py-1 text-sm font-semibold text-primary shadow-[0_2px_8px_-2px_rgba(36,47,53,0.15)] ring-1 ring-ink/10">
        {label}
      </span>
      <h3 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-ink md:text-[34px]">
        {title}
      </h3>
      <p
        className={`max-w-md text-base leading-7 text-ink/60 ${spread ? "mt-6 lg:mt-auto" : "mt-4"}`}
      >
        {text}
      </p>
      {children}
    </motion.article>
  );
}

// Demo page "How it works": the three steps as a bento of soft white cards with floating illustrations.
// Copy is the same as SimplerPath (from missio.io/why-missio).
export default function SimplerPathBento() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden py-18 lg:py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-wrap items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              A simpler path to <span className="text-gold">Missio</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-ink/70">
              From understanding your current setup to moving your data and
              making the switch, our team guides you through every step.
            </p>
          </div>
          <PillButton href="#demo">Book a stack audit</PillButton>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Step 1: wide card, text left and the audit illustration right */}
          <Card
            label="01 · 45 minutes · no commitment"
            title="The stack audit"
            text="We map every tool you're paying for against what Missio covers and show the real annual difference. If consolidating doesn't save you money, we'll tell you."
            className="flex min-h-[460px] flex-col lg:col-span-2 lg:min-h-[520px] lg:pr-[52%]"
            spread
          >
            <div className="relative mt-8 h-[340px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[60%]">
              <AuditArt />
            </div>
          </Card>

          {/* Step 2 */}
          <Card
            label="02 · 2–4 weeks · included, not billed hourly"
            title="We move your data"
            text="Donors, giving history, pledges, recurring gifts, event records, and volunteers. Our team handles the migration and reconciles totals against your current system."
          >
            <div className="mt-10">
              <MoveArt />
            </div>
          </Card>

          {/* Step 3 */}
          <Card
            label="03 · You decide when"
            title="Parallel run, then cutover"
            text="Both systems stay live while your team trains and verifies the numbers. You choose the cutover date around your fundraising calendar."
          >
            <div className="mt-10">
              <CutoverArt />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
