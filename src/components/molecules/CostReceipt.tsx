"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import Ticker from "@/components/atoms/Ticker";
import type { Tool } from "@/components/molecules/pricingData";

type Props = {
  items: Tool[]; // ticked tools, already scaled to the revenue band
  stack: number;
  missio: number;
  hours: number;
  band: string;
  // Changes on every edit so the stamp lands again
  stampKey: string;
};

const ease = [0.16, 1, 0.3, 1] as const;
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// Paper receipt that prints a line per ticked tool, strikes the total through and stamps the saving.
// A slate "printer slot" sits on top; the scalloped bottom edge is cut with a repeating radial gradient.
export default function CostReceipt({ items, stack, missio, hours, band, stampKey }: Props) {
  const reduce = useReducedMotion();
  const [paper, animate] = useAnimate<HTMLDivElement>();
  const first = useRef(true);

  // Every edit pulls the paper back into the slot and rolls it out again, like a printer feeding
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce || !paper.current) return;
    animate(paper.current, { y: [-18, 4, 0] }, { duration: 0.6, times: [0, 0.6, 1], ease: "easeOut" });
  }, [stampKey, reduce, animate, paper]);
  const savings = Math.max(stack - missio, 0);
  const pct = stack ? Math.round((savings / stack) * 100) : 0;
  const ratio = stack ? Math.min(missio / stack, 1) : 1;

  return (
    <div className="relative">
      {/* Printer slot */}
      <div className="relative z-10 mx-auto flex h-4 w-[calc(100%+24px)] -translate-x-3 items-center justify-end rounded-full bg-[#141c20] px-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-1 ring-paper/10">
        <motion.span
          key={stampKey}
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-gold"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.2, 1, 0.2, 1] }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div ref={paper} className="relative -mt-2 mx-1 font-mono text-ink">
        <div className="bg-paper px-6 pb-6 pt-8 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] sm:px-8">
          <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] text-ink/50">
            <span>Your stack · annual</span>
            <span>{band}</span>
          </div>
          <div className="mt-4 border-t border-dashed border-ink/25" />

          {/* Line items */}
          <ul className="min-h-[120px] py-3 text-[13px]" aria-live="polite">
            <AnimatePresence initial={false}>
              {items.map((t) => (
                <motion.li
                  key={t.name}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, height: 0, rotateX: -90 }}
                  animate={{ opacity: 1, height: "auto", rotateX: 0 }}
                  exit={reduce ? undefined : { opacity: 0, height: 0, rotateX: 90 }}
                  transition={{ duration: 0.5, ease }}
                  style={{ transformPerspective: 500, originY: 0 }}
                  className="overflow-hidden"
                >
                  <span className="flex items-baseline gap-2 py-1">
                    <span className="shrink-0">{t.name}</span>
                    <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-ink/30" />
                    <span className="shrink-0 tabular-nums">{money(t.cost)}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
            {!items.length && <li className="py-8 text-center text-ink/45">Tick a tool to start the tally</li>}
          </ul>

          <div className="border-t border-dashed border-ink/25 pt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink/60">What you pay today</span>
              <span className="relative font-bold">
                <Ticker value={stack} prefix="$" />
                {/* Red pen strike once Missio is cheaper */}
                <motion.span
                  aria-hidden
                  className="absolute -inset-x-1 top-1/2 h-[2px] origin-left -rotate-6 rounded bg-[#D9694A]"
                  initial={false}
                  animate={{ scaleX: savings > 0 ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease }}
                />
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="text-ink/60">Same work in Missio</span>
              <Ticker value={missio} prefix="$" className="font-bold text-primary" />
            </div>

            {/* Bars: today's stack against Missio */}
            <div className="mt-5 space-y-2" aria-hidden>
              <div className="h-2 rounded-full bg-[#D9694A]/70" />
              <motion.div
                className="h-2 origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: ratio }}
                transition={{ duration: 0.8, ease }}
              />
            </div>
          </div>

          <div className="mt-6 border-t-2 border-ink pt-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/50">You keep each year</p>
            <Ticker value={savings} prefix="$" className="mt-1 block font-heading text-5xl font-extrabold tracking-tight text-primary sm:text-6xl" />
            <p className="mt-3 text-[13px] text-ink/70">
              + <Ticker value={hours} className="font-bold text-ink" /> staff hours a year back from moving data between
              systems
            </p>
          </div>
        </div>

        {/* Scalloped tear-off edge */}
        <div
          aria-hidden
          className="h-2.5"
          style={{ background: "radial-gradient(circle at 8px 10px, transparent 6px, var(--paper) 6.5px) 0 0 / 16px 10px repeat-x" }}
        />

        {/* Stamp: thumps down again on every change */}
        <AnimatePresence mode="popLayout">
          {pct > 0 && (
            <motion.div
              key={stampKey}
              aria-hidden
              className="pointer-events-none absolute bottom-28 right-4 z-20 grid h-28 w-28 place-items-center rounded-full border-[3px] border-gold bg-paper text-center text-gold shadow-[0_6px_20px_-8px_rgba(36,47,53,0.35)] sm:right-6 sm:h-32 sm:w-32"
              initial={reduce ? { opacity: 1, rotate: -14 } : { opacity: 0, scale: 2.2, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: -14 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <span className="absolute inset-1.5 rounded-full border border-dashed border-gold/80" />
              <span className="leading-none">
                <span className="block text-[9px] font-bold uppercase tracking-[0.25em]">One record</span>
                <span className="mt-1 block font-heading text-3xl font-extrabold">−{pct}%</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.25em]">Missio</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
