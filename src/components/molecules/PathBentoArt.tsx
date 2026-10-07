"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Download, Sparkles, WandSparkles } from "lucide-react";
import { MISSIO_BASE, tools } from "@/components/molecules/pricingData";

// Illustrations for the demo page's "How it works" bento (after the bentogrids.com "Save 6+ hours" shot):
// soft floating UI pieces on white, in Missio teal and gold. Each animates in whenever its card scrolls into view.

const ease = [0.16, 1, 0.3, 1] as const;
// Replays every time a card comes back into view, scrolling down or back up
const view = { once: false, margin: "-80px" } as const;

// Missio's node mark
function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="7" cy="22" r="3.2" />
      <circle cx="16" cy="13" r="3.2" />
      <circle cx="25" cy="20" r="3.2" />
      <path d="M9.2 19.8l4.6-4.6M18.6 14.8l3.8 3" />
    </svg>
  );
}

// 1. The stack audit: tools float around the Missio orb inside soft rings; the audit result pops up below
const docs = [
  { tag: "CRM", x: "-118%", y: "-62%", r: -10 },
  { tag: "EVENTS", x: "-12%", y: "-118%", r: 0 },
  { tag: "FORMS", x: "92%", y: "-70%", r: 12 },
  { tag: "EMAIL", x: "-150%", y: "36%", r: -4 },
];
const today = tools.slice(0, 5).reduce((s, t) => s + t.cost, 0);
export function AuditArt() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Concentric rings, anchored right of centre and running off the card */}
      {[320, 470, 620, 770].map((d, i) => (
        <span
          key={d}
          className="absolute left-[62%] top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/[0.07]"
          style={{ width: d, height: d, borderStyle: i === 1 ? "dashed" : "solid" }}
        />
      ))}
      <div className="absolute left-[62%] top-[46%]">
        {/* The orb */}
        <motion.span
          className="absolute -left-[72px] -top-[72px] grid h-36 w-36 place-items-center rounded-full bg-gradient-to-br from-accent-soft via-primary to-[#0b3a47] text-white shadow-[0_24px_60px_-12px_rgba(2,100,126,0.6),0_0_0_14px_rgba(79,179,204,0.12)]"
          initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={view}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
        >
          <Mark className="h-14 w-14" />
          <span className="absolute -right-0 -top-0 grid h-11 w-11 place-items-center rounded-full bg-white text-gold shadow-md">
            <Sparkles className="h-4 w-4" />
          </span>
        </motion.span>
        {/* Tools you pay for, floating */}
        {docs.map((d, i) => (
          <motion.span
            key={d.tag}
            className="absolute -left-[46px] -top-[56px] h-[112px] w-[92px] rounded-xl bg-white p-3 shadow-[0_18px_40px_-16px_rgba(36,47,53,0.35)] ring-1 ring-ink/5"
            style={{ x: d.x, y: d.y, rotate: d.r }}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={view}
            transition={{ duration: 0.7, delay: 0.25 + i * 0.1, ease }}
          >
            <motion.span
              className="block"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {[70, 90, 55, 80].map((w, k) => (
                <span key={k} className="mb-1.5 block h-1 rounded-full bg-ink/10" style={{ width: `${w}%` }} />
              ))}
            </motion.span>
            <span className="absolute -bottom-2 -right-3 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-md">
              {d.tag}
            </span>
          </motion.span>
        ))}
      </div>
      {/* The result */}
      <motion.div
        className="absolute bottom-[9%] left-[62%] w-[min(360px,80%)] -translate-x-1/2"
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.7, delay: 0.75, ease }}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-[0_20px_50px_-20px_rgba(36,47,53,0.45)] ring-1 ring-ink/5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-primary">
            <Mark className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-sm font-extrabold text-ink">Your stack audit is ready.</span>
            <span className="block text-xs text-ink/55">
              ${(today - MISSIO_BASE).toLocaleString("en-US")} a year back, in writing
            </span>
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Download className="h-4 w-4" />
          </span>
        </div>
        <div className="mx-4 h-3 rounded-b-2xl bg-white/70 shadow-sm ring-1 ring-ink/5" />
      </motion.div>
    </div>
  );
}

// 2. We move your data: the migration toggle, then each kind of record checked off as it lands
const records = ["Donors", "Giving history", "Pledges", "Recurring gifts", "Event records", "Volunteers"];
export function MoveArt() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative">
      <motion.div
        className="relative z-10 rounded-2xl bg-white p-5 shadow-[0_20px_50px_-24px_rgba(36,47,53,0.45)] ring-1 ring-ink/5"
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.6, ease }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-[0_8px_20px_-6px_rgba(2,100,126,0.7)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="flex-1 font-heading text-lg font-extrabold text-ink">Migration, handled</span>
          {/* Toggle switches on */}
          <span className="relative h-6 w-11 rounded-full bg-ink/10">
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={view}
              transition={{ delay: 0.5, duration: 0.3 }}
            />
            <motion.span
              className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
              initial={{ left: reduce ? 24 : 4 }}
              whileInView={{ left: 24 }}
              viewport={view}
              transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 24 }}
            />
          </span>
        </div>
        <p className="mt-2 pl-12 text-sm leading-6 text-ink/60">
          Our team moves every record and reconciles the totals against your current system.
        </p>
      </motion.div>
      {/* Records, hanging off a thin tree line and fading out at the bottom */}
      <div className="relative ml-6 border-l border-ink/10 pb-2 pl-6 pt-4 [mask-image:linear-gradient(180deg,black_55%,transparent)]">
        {records.map((r, i) => (
          <motion.div
            key={r}
            className="relative mb-2.5 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-[0_10px_30px_-20px_rgba(36,47,53,0.5)] ring-1 ring-ink/5"
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={view}
            transition={{ duration: 0.6, delay: 0.6 + i * 0.12, ease }}
          >
            <span aria-hidden className="absolute -left-6 top-1/2 h-px w-6 bg-ink/10" />
            <span className="text-[15px] font-semibold text-primary">{r}</span>
            <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/10 text-primary">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 3. Parallel run, then cutover: stacked notes building up to the cutover, the last one glowing
const notes = [
  { t: "Your current system — still live", dim: true },
  { t: "Team trained on Missio" },
  { t: "Numbers verified side by side" },
];
export function CutoverArt() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative space-y-3">
      {notes.map((n, i) => (
        <motion.div
          key={n.t}
          className={`flex items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-ink/5 ${n.dim ? "opacity-45" : "shadow-[0_16px_40px_-24px_rgba(36,47,53,0.5)]"}`}
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          whileInView={{ opacity: n.dim ? 0.45 : 1, y: 0 }}
          viewport={view}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.15, ease }}
        >
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${n.dim ? "bg-ink/5 text-ink/40" : "bg-primary/10 text-primary"}`}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <span className="flex-1 text-[15px] leading-6 text-ink/85">{n.t}</span>
        </motion.div>
      ))}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: reduce ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.6, delay: 0.7, ease }}
      >
        {/* Warm glow behind the final card */}
        <span className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-gold/25 via-accent-soft/20 to-gold/25 blur-xl" />
        <div className="relative flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_50px_-20px_rgba(242,167,61,0.55)] ring-1 ring-gold/30">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-[#b87512]">
            <WandSparkles className="h-4 w-4" />
          </span>
          <span className="flex-1 text-[15px] font-semibold text-ink">
            Cutover set for the week you choose
            {!reduce && (
              <span
                className="ml-0.5 inline-block w-0.5 animate-pulse bg-gold align-middle"
                style={{ height: "1em" }}
              />
            )}
          </span>
        </div>
        <div className="mx-5 h-3 rounded-b-2xl bg-white/70 ring-1 ring-ink/5" />
      </motion.div>
    </div>
  );
}
