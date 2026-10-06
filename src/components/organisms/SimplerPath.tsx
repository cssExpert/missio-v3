"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { Clock } from "lucide-react";
import { PillButton } from "@/components/atoms/ui";

// "How it works" from missio.io/why-missio
const steps = [
  {
    title: "The stack audit",
    text: "We map every tool you're paying for against what Missio covers and show the real annual difference. If consolidating doesn't save you money, we'll tell you.",
    meta: "45 minutes · no commitment",
  },
  {
    title: "We move your data",
    text: "Donors, giving history, pledges, recurring gifts, event records, and volunteers. Our team handles the migration and reconciles totals against your current system.",
    meta: "2–4 weeks · included, not billed hourly",
  },
  {
    title: "Parallel run, then cutover",
    text: "Both systems stay live while your team trains and verifies the numbers. You choose the cutover date around your fundraising calendar.",
    meta: "You decide when",
  },
];

// Number badge: turns gold once the line reaches it (step i sits at i / (steps - 1) along the line)
function StepBadge({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const at = i / (steps.length - 1);
  const lit = useTransform(progress, [at - 0.04, at], [0, 1]);
  const color = useTransform(lit, [0, 1], ["#f3f7f8", "#242f35"]);
  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-lg font-extrabold text-paper ring-1 ring-paper/20">
      <motion.span style={{ opacity: lit, scale: lit }} className="absolute inset-0 rounded-full bg-gold shadow-[0_0_30px_rgba(242,167,61,0.6)]" />
      <motion.span style={{ color }} className="relative">
        {i + 1}
      </motion.span>
    </span>
  );
}

// Three steps joined by a line that draws itself as the section scrolls through the screen
// (across on wide screens, down on phones); each number lights up as the line reaches it
export default function SimplerPath() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const progress = useMotionValue(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) {
      progress.set(1);
      return;
    }
    let frame = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts when the steps' top reaches 75% down the screen, done when their bottom reaches 60%
      const p = (vh * 0.75 - r.top) / (r.height + vh * 0.15);
      progress.set(Math.min(Math.max(p, 0), 1));
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
  }, [progress, reduce]);

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper lg:py-32">
      <span aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[120px]" />
      {/* Golden glow, top right */}
      <span aria-hidden className="pointer-events-none absolute -right-32 -top-40 h-[460px] w-[460px] rounded-full bg-gold/25 blur-[130px]" />

      <div className="relative mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow gold">How it works</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">
              A simpler path to <span className="text-gold">Missio</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-paper/70">
              From understanding your current setup to moving your data and making the switch, our team guides you
              through every step.
            </p>
          </div>
          <PillButton href="#">Book a stack audit</PillButton>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* Track and drawn line: across from the first badge centre to the last (two columns plus two thirds of the gaps), or down on phones */}
          <div aria-hidden className="absolute left-7 top-7 hidden h-px w-[calc(66.666%+1.667rem)] bg-paper/15 lg:block" />
          <motion.div aria-hidden style={{ scaleX: progress }} className="absolute left-7 top-7 hidden h-0.5 w-[calc(66.666%+1.667rem)] origin-left bg-gradient-to-r from-accent-soft to-gold lg:block" />
          <div aria-hidden className="absolute bottom-7 left-7 top-7 w-px bg-paper/15 lg:hidden" />
          <motion.div aria-hidden style={{ scaleY: progress }} className="absolute bottom-7 left-7 top-7 w-0.5 origin-top bg-gradient-to-b from-accent-soft to-gold lg:hidden" />

          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-10">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-6 lg:flex-col lg:gap-0">
                <StepBadge i={i} progress={progress} />
                <div className="flex flex-1 flex-col items-start lg:mt-8 lg:pr-6">
                  <h3 className="text-2xl font-extrabold tracking-tight text-mist">{s.title}</h3>
                  <p className="mb-5 mt-3 text-base leading-7 text-paper/70">{s.text}</p>
                  <p className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-paper/[0.07] px-4 py-2 text-xs font-semibold text-paper ring-1 ring-paper/10 sm:text-sm mt-auto">
                    <Clock className="h-4 w-4 text-gold" strokeWidth={2} aria-hidden />
                    {s.meta}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
