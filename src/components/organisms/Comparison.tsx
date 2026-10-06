"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Minus, X } from "lucide-react";

// "Honest comparison" table from missio.io/why-missio. missio.io marks it
// "Have legal and marketing review every cell before publishing": confirm each cell before this ships.
type Tone = "yes" | "part" | "no";
type Cell = [string, Tone];

const platforms = ["Legacy donor CRM", "Enterprise CRM", "Marketing CRM"];

const rows: { capability: string; others: Cell[]; missio: string }[] = [
  { capability: "Donor CRM", others: [["Included", "yes"], ["Included", "yes"], ["Generic CRM", "part"]], missio: "Relationship Engine" },
  { capability: "Website, forms & email", others: [["Separate product", "no"], ["Separate cloud", "no"], ["Included", "yes"]], missio: "Growth Engine" },
  { capability: "Events & ticketing", others: [["Separate product", "no"], ["App marketplace", "part"], ["Integration only", "part"]], missio: "Growth Engine" },
  { capability: "Volunteer forms & shifts", others: [["Separate product", "no"], ["App marketplace", "part"], ["Not offered", "no"]], missio: "Growth Engine" },
  { capability: "Payments & accounting sync", others: [["Included", "yes"], ["Via partner", "part"], ["Via partner", "part"]], missio: "Revenue Engine" },
  { capability: "HR, hiring & time tracking", others: [["Not offered", "no"], ["Not offered", "no"], ["Not offered", "no"]], missio: "Execution Engine" },
  { capability: "AI across every module", others: [["Fundraising only", "part"], ["Sales-model AI", "part"], ["Marketing only", "part"]], missio: "MIRA, all four engines" },
  { capability: "Typical time to go live", others: [["3–9 months", "no"], ["6–12 months", "no"], ["Weeks, partial fit", "part"]], missio: "Days to weeks" },
  { capability: "Implementation partner required", others: [["Usually", "no"], ["Almost always", "no"], ["Sometimes", "part"]], missio: "No — we migrate you" },
];

// "Falls short" = at least one platform leaves it out or bills it separately
const shortfalls = rows.filter((r) => r.others.some(([, t]) => t === "no"));

const toneStyle: Record<Tone, { dot: string; text: string; Icon: typeof Check }> = {
  yes: { dot: "bg-primary/10 text-primary", text: "text-ink", Icon: Check },
  part: { dot: "bg-gold/15 text-[#b87512]", text: "text-ink/70", Icon: Minus },
  no: { dot: "bg-[#F28A6B]/15 text-[#D9694A]", text: "text-ink/50", Icon: X },
};

function Mark({ cell }: { cell: Cell }) {
  const [label, tone] = cell;
  const { dot, text, Icon } = toneStyle[tone];
  return (
    <span className={`flex items-center gap-2.5 text-sm font-medium ${text}`}>
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${dot}`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
      </span>
      {label}
    </span>
  );
}

function MissioMark({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2.5 text-sm font-bold text-paper">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-ink shadow-[0_0_16px_rgba(242,167,61,0.6)]">
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
      </span>
      {label}
    </span>
  );
}

// Capability table: three platform types against Missio, whose column is a glowing dark card.
// The switch narrows it to the rows where the others fall short.
export default function Comparison() {
  const [onlyGaps, setOnlyGaps] = useState(false);
  const reduce = useReducedMotion();
  const shown = onlyGaps ? shortfalls : rows;
  const cols = "md:grid-cols-[1.25fr_repeat(3,1fr)_1.2fr]";
  const rowMotion = {
    layout: !reduce,
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-8 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <span className="eyebrow">Honest comparison</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              What the other platforms <span className="text-gold">leave out</span>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-lg text-base leading-7 text-ink/70">
              Every system below can take a gift. The question is what happens to everything that gift sets in
              motion &mdash; the event, the volunteers, the staff who deliver the program, and the books at the end
              of the month.
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={onlyGaps}
              onClick={() => setOnlyGaps((v) => !v)}
              className="mt-6 flex items-center gap-3 text-sm font-semibold"
            >
              <span className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${onlyGaps ? "bg-primary" : "bg-ink/15"}`}>
                <motion.span
                  layout={!reduce}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className={`absolute top-1 h-5 w-5 rounded-full bg-paper shadow ${onlyGaps ? "right-1" : "left-1"}`}
                />
              </span>
              Show only where others fall short
              <span className="font-medium text-ink/50" aria-live="polite">
                · {onlyGaps ? `${shown.length} of ${rows.length}` : `all ${rows.length}`} capabilities
              </span>
            </button>
          </div>
        </motion.div>

        {/* Wide screens: table. The Missio column is one dark card built from its cells. */}
        <div role="table" aria-label="Capability comparison" className="mt-14 hidden md:block">
          <div role="row" className={`grid ${cols} items-end`}>
            <span role="columnheader" className="px-5 pb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink/40">Capability</span>
            {platforms.map((p) => (
              <span key={p} role="columnheader" className="px-5 pb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink/40">{p}</span>
            ))}
            <span role="columnheader" className="angle-sm relative bg-ink px-6 pb-4 pt-6 text-lg font-extrabold text-gold shadow-[0_-20px_60px_-30px_rgba(2,100,126,0.9)]">
              Missio
            </span>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((r, i) => {
              const last = i === shown.length - 1;
              return (
                <motion.div key={r.capability} role="row" {...rowMotion} className={`group grid ${cols} items-stretch`}>
                  <span role="rowheader" className="flex items-center border-t border-ink/10 px-5 py-5 font-bold transition-colors group-hover:bg-mist/70">
                    {r.capability}
                  </span>
                  {r.others.map((c, n) => (
                    <span key={n} role="cell" className="flex items-center border-t border-ink/10 px-5 py-5 transition-colors group-hover:bg-mist/70">
                      <Mark cell={c} />
                    </span>
                  ))}
                  <span
                    role="cell"
                    className={`flex items-center border-t border-paper/10 bg-ink px-6 py-5 transition-colors group-hover:bg-[#1b262b] ${last ? "pb-7" : ""}`}
                  >
                    <MissioMark label={r.missio} />
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Phones: one card per capability, Missio's answer on top */}
        <ul className="mt-12 space-y-4 md:hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((r) => (
              <motion.li key={r.capability} {...rowMotion} className="angle overflow-hidden bg-mist/70">
                <div className="bg-ink px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/50">{r.capability}</p>
                  <div className="mt-2">
                    <MissioMark label={r.missio} />
                  </div>
                </div>
                <dl className="divide-y divide-ink/10 px-5">
                  {r.others.map((c, n) => (
                    <div key={n} className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-xs font-semibold text-ink/50">{platforms[n]}</dt>
                      <dd><Mark cell={c} /></dd>
                    </div>
                  ))}
                </dl>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <p className="mt-8 max-w-3xl text-xs leading-5 text-ink/45">
          Category comparison based on publicly available product and pricing documentation as of June 2026.
          &lsquo;Separate product&rsquo; means the capability exists but is licensed and billed apart from the core CRM.
        </p>
      </div>
    </section>
  );
}
