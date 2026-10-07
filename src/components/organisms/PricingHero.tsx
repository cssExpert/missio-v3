"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Check } from "lucide-react";
import { PillButton, TextLink } from "@/components/atoms/ui";
import CutEdge from "@/components/atoms/CutEdge";
import CostReceipt from "@/components/molecules/CostReceipt";
import { DISCLAIMER, HOURS_PER_HANDOFF, MISSIO_BASE, defaultTools, scales, tools } from "@/components/molecules/pricingData";

const ease = [0.16, 1, 0.3, 1] as const;
const intro: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

// Pricing hero from missio.io/pricing: the headline, then the stack calculator inside the same dark card.
// Tick tools and pick a revenue band on the left; the receipt on the right prints the bill and stamps the saving.
export default function PricingHero() {
  const reduce = useReducedMotion();
  const zoomRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string[]>(defaultTools);
  const [band, setBand] = useState(0);
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  // Photo zooms in as the card scrolls away, like the other page heroes
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = zoomRef.current;
      if (!el) return;
      const progress = Math.min(Math.max(window.scrollY / (el.offsetHeight || 1), 0), 1);
      el.style.transform = `scale(${1 + progress * 0.3})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scale = scales[band];
  const items = useMemo(
    () => tools.filter((t) => picked.includes(t.name)).map((t) => ({ ...t, cost: t.cost * scale.stack })),
    [picked, scale],
  );
  const stack = items.reduce((sum, t) => sum + t.cost, 0);
  const missio = items.length ? MISSIO_BASE * scale.missio : 0;
  // Every pair of disconnected systems is a hand-off someone re-keys by hand
  const hours = Math.round(((items.length * (items.length - 1)) / 2) * HOURS_PER_HANDOFF * scale.stack);

  const toggle = (name: string) =>
    setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));

  return (
    <section id="calculator" className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink">
      <div ref={zoomRef} className="absolute inset-0 origin-top will-change-transform">
        <Image src="/images/banner/02.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/95 via-ink/90 to-ink" />
      {!reduce && (
        <>
          <motion.span aria-hidden className="pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-primary/30 blur-[120px]" animate={{ x: [0, 70, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
          <motion.span aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-[380px] w-[380px] rounded-full bg-gold/15 blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        </>
      )}

      {/* -mx-3 undoes the card inset so the content lines up with the logo */}
      <div className="relative -mx-3">
        <div className="mx-auto max-w-[1340px] px-6 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
          <motion.div variants={intro} initial="hidden" animate="show" className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
            <div>
              <motion.span variants={rise} className="eyebrow gold">Pricing</motion.span>
              <motion.h1 variants={rise} className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist sm:text-6xl lg:text-[72px]">
                Price your stack in <span className="text-gold">sixty seconds.</span>
              </motion.h1>
            </div>
            <motion.div variants={rise}>
              <p className="max-w-lg text-lg leading-8 text-paper/75">
                Tick the systems you pay for today and we will estimate your annual spend, what the same work costs in
                Missio, and the hours your team loses moving data between them.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-8">
                <PillButton href="#plans">See the plans</PillButton>
                <TextLink href="/demo" light>Book a consultation</TextLink>
              </div>
            </motion.div>
          </motion.div>

          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
            className="mt-16 grid gap-12 border-t border-paper/10 pt-12 lg:mt-20 lg:grid-cols-[7fr_5fr] lg:gap-16"
          >
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="max-w-md text-2xl font-extrabold tracking-tight text-mist sm:text-3xl">
                  What is your stack <span className="text-accent-soft">actually</span> costing you?
                </h2>
                <div className="flex gap-4 text-xs font-semibold text-paper/60">
                  <button type="button" onClick={() => setPicked(tools.map((t) => t.name))} className="transition-colors hover:text-gold">Tick all</button>
                  <span aria-hidden className="text-paper/20">/</span>
                  <button type="button" onClick={() => setPicked([])} className="transition-colors hover:text-gold">Clear</button>
                </div>
              </div>

              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50">1 · Tools you pay for</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-3">
                {tools.map((t) => {
                  const on = picked.includes(t.name);
                  return (
                    <li key={t.name}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(t.name)}
                        className={`angle-sm group relative flex h-full w-full items-start gap-2.5 p-3 text-left sm:gap-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 ${on ? "bg-paper/[0.12] ring-1 ring-inset ring-gold/60" : "bg-paper/[0.04] ring-1 ring-inset ring-paper/10 hover:bg-paper/[0.08]"}`}
                      >
                        <CutEdge className={on ? "bg-gold/60" : "bg-paper/10"} />
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md transition-colors duration-300 ${on ? "bg-gold text-ink" : "bg-paper/10 text-transparent group-hover:bg-paper/20"}`}>
                          <motion.span initial={false} animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>
                            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                          </motion.span>
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-[13px] font-semibold leading-snug transition-colors sm:text-sm ${on ? "text-paper" : "text-paper/70"}`}>{t.name}</span>
                          <span className="mt-1 block font-mono text-xs text-paper/45">${(t.cost * scale.stack).toLocaleString("en-US")}/yr</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50">2 · Annual revenue</p>
              <div role="radiogroup" aria-label="Annual revenue" className="mt-4 grid grid-cols-2 gap-1 rounded-3xl bg-paper/[0.06] p-1 ring-1 ring-paper/10 sm:inline-grid sm:grid-cols-4 sm:rounded-full">
                {scales.map((s, n) => (
                  <button
                    key={s.label}
                    type="button"
                    role="radio"
                    aria-checked={band === n}
                    onClick={() => setBand(n)}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${band === n ? "text-ink" : "text-paper/70 hover:text-paper"}`}
                  >
                    {band === n && (
                      <motion.span layoutId="band-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                    <span className="relative">{s.label}</span>
                  </button>
                ))}
              </div>

              <p className="mt-10 max-w-xl text-xs leading-5 text-paper/45">{DISCLAIMER}</p>
            </div>

            <div className="lg:pt-2">
              <CostReceipt
                items={items}
                stack={stack}
                missio={missio}
                hours={hours}
                band={scale.label}
                stampKey={`${picked.join("|")}-${band}`}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
