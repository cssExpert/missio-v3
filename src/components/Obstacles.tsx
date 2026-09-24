"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Arrow } from "./ui";

// "Obstacles to overcome" from missio.io: three board objections, the myth behind each, and the reality
const objections = [
  {
    quote: "All-in-one platforms are too expensive and complicated for us.",
    myth: "Switching to an all-in-one platform will cost more, take months to migrate, and be too complicated for our team to learn.",
    reality:
      "Missio replaces your entire software stack for less than what you're paying for separate tools, our team handles the migration for you, and most staff are up and running in days — no IT department required.",
  },
  {
    quote: "Migration will eat our fundraising season.",
    myth: "Moving donor records, giving history, pledges and event data will take months, and something will break in the middle of an appeal.",
    reality:
      "Our team runs the migration and reconciles every total against your current system. You keep both systems live in parallel until the numbers match, and you pick the cutover date around your calendar — for most organizations that means after year-end appeals and before spring events.",
  },
  {
    quote: "Our team isn't technical enough for a platform this big.",
    myth: "A system that does this much will need an administrator we can't afford to hire, and our staff will never adopt it.",
    reality:
      "The reason your current setup feels hard is that it's seven products with seven logins, seven support teams, and seven ways of spelling the same donor's name. One system is less to learn, not more — and you turn engines on when you're ready for them, not all at once.",
  },
];

const AUTO_MS = 8000; // each objection shows for 8s before moving on (paused on hover, off for reduced motion)

export default function Obstacles() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const o = objections[active];

  const go = (i: number, focus = false) => {
    const next = (i + objections.length) % objections.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  return (
    <section id="obstacles" className="relative overflow-hidden py-24 lg:py-32">
      {/* Oversized faint quote mark in the background */}
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-16 select-none font-hand text-[420px] leading-none text-primary/[0.05]">
        &ldquo;
      </span>

      <div
        className="relative mx-auto grid max-w-[1340px] gap-14 px-4 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left: heading and the three objections as tabs */}
        <div>
          <span className="eyebrow">Obstacles to overcome</span>
          <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            What boards say before they <span className="text-gold">say yes</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/70">
            Three objections we hear in almost every evaluation — and what&rsquo;s actually true.
          </p>

          <div role="tablist" aria-label="Objections" aria-orientation="vertical" className="mt-10 space-y-3">
            {objections.map((ob, i) => {
              const on = i === active;
              return (
                <button
                  key={ob.quote}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`objection-tab-${i}`}
                  aria-selected={on}
                  aria-controls="objection-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); }
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); }
                  }}
                  className={`group relative w-full overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
                    on ? "bg-ink text-paper shadow-[0_20px_50px_-20px_rgba(36,47,53,0.55)]" : "bg-mist/60 text-ink hover:bg-mist"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`mt-0.5 text-xs font-bold tracking-[0.2em] ${on ? "text-gold" : "text-ink/40"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className={`block text-[11px] font-bold uppercase tracking-[0.18em] ${on ? "text-paper/50" : "text-ink/40"}`}>
                        Objection
                      </span>
                      <span className="mt-1 block text-base font-bold leading-snug">&ldquo;{ob.quote}&rdquo;</span>
                    </span>
                    <Arrow className={`mt-1 shrink-0 transition-transform duration-300 ${on ? "-rotate-45 text-gold" : "text-ink/30 group-hover:-rotate-45"}`} />
                  </span>
                  {/* Progress bar: when it fills, the next objection shows */}
                  {on && !reduce && (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-paper/10" aria-hidden>
                      <span
                        key={active}
                        className="block h-full origin-left bg-gold"
                        style={{ animation: `obstacle-progress ${AUTO_MS}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                        onAnimationEnd={() => go(active + 1)}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: showcase card for the selected objection.
            All three cards share one grid cell: invisible copies reserve the tallest card's height,
            so the visible card is the same height on every tab and at every screen width. */}
        <div id="objection-panel" role="tabpanel" aria-labelledby={`objection-tab-${active}`} aria-live="polite" className="relative grid">
          {objections.map((ob) => (
            <div key={ob.quote} aria-hidden className="invisible [grid-area:1/1]">
              <ObjectionCard o={ob} still />
            </div>
          ))}
          <div className="[grid-area:1/1]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <ObjectionCard o={o} still={!!reduce} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

type Objection = (typeof objections)[number];

// The showcase card for one objection: quote, then the myth (struck through) beside the reality
function ObjectionCard({ o, still = false }: { o: Objection; still?: boolean }) {
  return (
    <div className="angle relative h-full bg-mist p-8 sm:p-12">
          <span aria-hidden className="block font-hand text-8xl leading-[0.6] text-gold">&ldquo;</span>
          <p className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">{o.quote}</p>

          <div className="relative mt-10 grid gap-4 md:grid-cols-2">
            {/* The myth: a coral strike-through draws across it */}
            <div className="rounded-2xl bg-paper p-6 ring-1 ring-ink/5">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D9694A]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F28A6B]/15" aria-hidden>
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 3l6 6M9 3l-6 6" />
                  </svg>
                </span>
                The myth
              </p>
              <motion.p
                initial={still ? false : { textDecorationColor: "rgba(242,138,107,0)" }}
                animate={{ textDecorationColor: "rgba(242,138,107,0.85)" }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-4 text-sm leading-6 text-ink/60 line-through decoration-2"
              >
                {o.myth}
              </motion.p>
            </div>

            {/* Arrow between the panels on wider screens */}
            <span aria-hidden className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-ink shadow-lg md:grid">
              <Arrow className="-rotate-45" />
            </span>

            {/* The reality: dark panel with a teal glow */}
            <motion.div
              initial={still ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 24 }}
              className="relative overflow-hidden rounded-2xl bg-ink p-6 text-paper shadow-[0_24px_60px_-24px_rgba(2,100,126,0.7)]"
            >
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/40 blur-3xl" />
              <p className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-ink" aria-hidden>
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.5l2.5 2 4.5-5" />
                  </svg>
                </span>
                The reality
              </p>
              <p className="relative mt-4 text-sm leading-6 text-paper/85">{o.reality}</p>
            </motion.div>
          </div>
    </div>
  );
}
