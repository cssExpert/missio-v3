"use client";

import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { engineHex } from "@/components/organisms/EngineShowcase";

const ease = [0.16, 1, 0.3, 1] as const;

// "Follow one supporter through all four engines" from missio.io/engines
const MIRA = "#e2eeee";
export const steps = [
  {
    engine: "Growth Engine",
    title: "A supporter finds you",
    note: "Bought 2 gala tickets",
    body: "Marcus lands on your site, reads a program story, and buys two tickets to the spring gala through a page your team built in an afternoon — no developer, no separate ticketing vendor.",
    gap: "the ticketing platform never tells the CRM who he is.",
  },
  {
    engine: "Revenue Engine",
    title: "The money lands where it belongs",
    note: "Tickets, bid and monthly gift posted to QuickBooks",
    body: "Tickets, his auction bid, and the monthly gift he already had all settle through one ledger and post to QuickBooks. Finance and development are looking at the same number on the same day.",
    gap: "someone exports a CSV and re-keys it on Monday.",
  },
  {
    engine: "Relationship Engine",
    title: "The record builds itself",
    note: "Every action on one timeline",
    body: "Every one of those actions writes to Marcus's timeline automatically. When your development manager leaves in March, the relationship history stays with the organization.",
    gap: "the context lives in one person's inbox.",
  },
  {
    engine: "Growth Engine",
    title: "He shows up again — differently",
    note: "Signed up for a Saturday shift",
    body: "Two weeks later he signs up for a Saturday warehouse shift through a volunteer form. Waiver signed, background check cleared, hours logged to the same record as his giving.",
    gap: "your volunteer list and donor list never meet.",
  },
  {
    engine: "Execution Engine",
    title: "Someone has to staff that Saturday",
    note: "Two staff leads scheduled",
    body: "The shift he joined needs two staff leads. Scheduling, time tracking and onboarding for those hires run in the same platform — the part donor software leaves to a spreadsheet.",
    gap: "fundraising creates demand operations cannot see.",
  },
  {
    engine: "MIRA",
    title: "The ask writes itself",
    note: "Flagged for a major-gift ask",
    body: "MIRA notices Marcus has given after every gala for three years and is now volunteering monthly. It flags him for a major-gift ask before November 1 and drafts the opening paragraph.",
    gap: "nobody connects those five signals in time.",
  },
];
export const colorOf = (engine: string) => engineHex[engine] ?? MIRA;

type Step = (typeof steps)[number];

// Engine tag, title, story and the "Without Missio" line for one step
export function StepBody({ step }: { step: Step }) {
  const hex = colorOf(step.engine);
  return (
    <div className="relative">
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
        style={{ background: `${hex}26`, color: hex }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: hex }}
        />
        {step.engine}
      </span>
      <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-mist md:text-4xl">
        {step.title}
      </h3>
      <p className="mt-5 max-w-2xl text-base leading-7 text-paper/75 md:text-lg md:leading-8">
        {step.body}
      </p>
      <p className="angle-sm mt-8 flex items-start gap-3 bg-[#F28A6B]/10 p-4 pr-8 text-sm leading-6 text-paper/80">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F28A6B]/20 text-[#F28A6B]">
          <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
        </span>
        <span>
          <strong className="font-bold text-[#F7A68D]">Without Missio:</strong>{" "}
          {step.gap}
        </span>
      </p>
    </div>
  );
}

// Marcus Webb's record: always six rows, so the card never changes height.
// Steps reached so far fill in; the rest show as placeholders.
export function JourneyRecord({ active }: { active: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="angle relative bg-white p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent-soft text-lg font-extrabold text-white">
          MW
        </span>
        <div>
          <p className="text-lg font-extrabold">Marcus Webb</p>
          <p className="text-xs font-semibold text-ink/50">
            Supporter · one record
          </p>
        </div>
        <span className="ml-auto rounded-full bg-mist px-3 py-1 text-xs font-bold tabular-nums text-ink/60">
          {active + 1} {active ? "entries" : "entry"}
        </span>
      </div>

      <ol className="relative mt-8 space-y-1">
        <span
          aria-hidden
          className="absolute bottom-3 left-[23px] top-3 w-px -translate-x-1/2 bg-ink/10"
        />
        {/* Always six rows so the card never changes height: reached steps fill in, the rest are placeholders */}
        {steps.map((st, i) => {
          const c = colorOf(st.engine);
          const filled = i <= active;
          const latest = i === active;
          return (
            <li
              key={st.title}
              className={`relative flex items-start gap-4 p-2 transition-colors duration-300 ${latest ? "bg-mist/70" : ""}`}
            >
              <span
                className="relative z-10 mt-0.5 grid h-4 w-4 shrink-0 translate-x-[7px] place-items-center rounded-full ring-4 ring-white transition-colors duration-500"
                style={{ background: filled ? c : "#e2eeee" }}
              />
              <span className="relative pl-2">
                {/* Real text keeps the row's height; hidden until the step is reached */}
                <motion.span
                  className="block"
                  initial={false}
                  animate={{
                    opacity: filled ? 1 : 0,
                    x: filled ? 0 : reduce ? 0 : -8,
                  }}
                  transition={{ duration: 0.4, ease }}
                  aria-hidden={!filled}
                >
                  <span
                    className="block text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      color: st.engine === "MIRA" ? "#02647e" : c,
                    }}
                  >
                    {st.engine}
                  </span>
                  <span className="block text-sm font-semibold text-ink/80">
                    {st.note}
                  </span>
                </motion.span>
                {!filled && (
                  <span
                    aria-hidden
                    className="absolute inset-0 left-2 flex flex-col justify-center gap-2"
                  >
                    <span className="h-2 w-20 rounded-full bg-ink/[0.07]" />
                    <span
                      className="h-2.5 rounded-full bg-ink/[0.05]"
                      style={{ width: `${55 + ((i * 17) % 35)}%` }}
                    />
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
