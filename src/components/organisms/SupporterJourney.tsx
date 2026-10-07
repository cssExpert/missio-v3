"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Arrow } from "@/components/atoms/ui";
import {
  JourneyRecord,
  StepBody,
  colorOf,
  steps,
} from "@/components/molecules/JourneyStep";

const ease = [0.16, 1, 0.3, 1] as const;

// Step through what happens to one supporter; the record card on the right fills in as you go
export default function SupporterJourney() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = steps[active];
  const hex = colorOf(s.engine);

  const trackRef = useRef<HTMLDivElement>(null);
  // Wide screens pin the stepper and cards; scrolling through the track advances the steps
  const pinned = () => window.matchMedia("(min-width: 1024px)").matches;

  const go = (i: number, focus = false) => {
    const next = Math.min(Math.max(i, 0), steps.length - 1);
    const el = trackRef.current;
    if (el && pinned()) {
      // Scroll to the middle of that step's slice of the track; the scroll listener keeps `active` in step
      const travel = el.offsetHeight - window.innerHeight;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY +
        ((next + 0.5) / steps.length) * travel;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = trackRef.current;
      if (!el || !pinned()) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight || 1;
      const p = Math.min(Math.max(-r.top / travel, 0), 0.9999);
      setActive(Math.floor(p * steps.length));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // overflow-clip, not overflow-hidden, so the pinned frame can stay sticky
    <section id="journey" className="relative overflow-clip py-18 lg:py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="eyebrow">
              Interactive · scroll or click through it
            </span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Follow one supporter through{" "}
              <span className="text-gold">all four engines</span>
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-ink/70 lg:justify-self-end">
            This is the difference between a platform and a stack. Step through
            what happens to a single person when every engine writes to the same
            record.
          </p>
        </div>

        {/* Desktop: a tall track whose sticky frame holds the stepper and cards. Phones: click through as normal */}
        <div ref={trackRef} className="lg:h-[420svh]">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pt-24">
            {/* Stepper */}
            <div
              role="tablist"
              aria-label="Journey steps"
              className="relative mt-14 grid grid-cols-6 gap-2 lg:mt-0"
            >
              <span
                aria-hidden
                className="absolute left-[8.33%] right-[8.33%] top-5 h-0.5 bg-ink/10"
              />
              <motion.span
                aria-hidden
                className="absolute left-[8.33%] top-5 h-0.5 origin-left bg-gradient-to-r from-[#F28A6B] via-accent-soft to-gold"
                style={{ width: "83.33%" }}
                initial={false}
                animate={{ scaleX: active / (steps.length - 1) }}
                transition={{ duration: 0.6, ease }}
              />
              {steps.map((st, i) => {
                const on = i === active;
                const done = i <= active;
                return (
                  <button
                    key={st.title}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`journey-tab-${i}`}
                    aria-selected={on}
                    aria-controls="journey-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        go(i + 1, true);
                      }
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        go(i - 1, true);
                      }
                    }}
                    className="group relative flex flex-col items-center gap-3 text-center"
                  >
                    <span
                      className={`relative grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold transition-all duration-500 ${on ? "scale-110" : "group-hover:scale-105"}`}
                      style={{
                        background: done ? colorOf(st.engine) : "#fff",
                        color: done ? "#242f35" : "rgba(36,47,53,0.45)",
                        boxShadow: on
                          ? `0 0 0 6px ${colorOf(st.engine)}33, 0 10px 30px -8px ${colorOf(st.engine)}`
                          : "inset 0 0 0 1px rgba(36,47,53,0.12)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`hidden text-xs font-bold leading-snug transition-colors md:block ${on ? "text-ink" : "text-ink/45 group-hover:text-ink/70"}`}
                    >
                      {st.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 grid gap-6 lg:mt-10 lg:grid-cols-[7fr_5fr]">
              {/* Step card */}
              <div
                id="journey-panel"
                role="tabpanel"
                aria-labelledby={`journey-tab-${active}`}
                className="angle relative overflow-hidden bg-ink p-8 text-paper sm:p-10"
              >
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[100px]"
                  animate={{ backgroundColor: `${hex}55` }}
                  transition={{ duration: 0.6 }}
                />
                {/* Every step sits invisibly in the same grid cell, so the card is always as tall as the longest one */}
                <div className="relative grid">
                  {steps.map((st) => (
                    <div
                      key={st.title}
                      aria-hidden
                      className="invisible [grid-area:1/1]"
                    >
                      <StepBody step={st} />
                    </div>
                  ))}
                  <div className="[grid-area:1/1]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={reduce ? false : { opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduce ? undefined : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <StepBody step={s} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4">
                  <p
                    className="text-xs font-bold tracking-[0.2em] text-paper/45"
                    aria-live="polite"
                  >
                    STEP {active + 1} OF {steps.length}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => go(active - 1)}
                      disabled={active === 0}
                      className="rounded-full px-5 py-2.5 text-sm font-semibold text-paper/70 ring-1 ring-paper/15 transition hover:bg-paper/10 hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        go(active === steps.length - 1 ? 0 : active + 1)
                      }
                      className="group inline-flex items-center gap-3 rounded-full bg-gold py-1.5 pl-5 pr-1.5 text-sm font-bold text-ink transition-colors hover:bg-paper"
                    >
                      {active === steps.length - 1
                        ? "Start again"
                        : "Next step"}
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-gold">
                        <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* The record: one entry per step so far */}
              <JourneyRecord active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
