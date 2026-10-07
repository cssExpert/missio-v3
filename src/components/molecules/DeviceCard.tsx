"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import CutEdge from "@/components/atoms/CutEdge";

const ease = [0.16, 1, 0.3, 1] as const;

// Shared by the engines page's AI layer and the demo page's "How it works".
// One card, scrubbed by scroll: from the moment its top enters the screen until its centre reaches the middle,
// its progress (springy, so it eases rather than jumps) is written to --p, which the device illustration reads.
// `lag` holds each card back a little so the three play one after another. Scrolling up plays it in reverse.
export default function DeviceCard({
  title,
  text,
  label,
  lag,
  kicker,
  footer,
  children,
}: {
  title: string;
  text: string;
  label: string;
  lag: number;
  // Optional line above the title (e.g. a step number) and content under the text (e.g. a time chip)
  kicker?: ReactNode;
  footer?: ReactNode;
  children: (on: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const p = useTransform(smooth, (v) => (reduce ? 1 : Math.min(1, Math.max(0, (v - lag) / (1 - lag)))));

  useMotionValueEvent(p, "change", (v) => {
    stage.current?.style.setProperty("--p", v.toFixed(3));
    // Discrete bits (the tablet's typing) start once the card has nearly settled
    const next = v > 0.82;
    setOn((o) => (o === next ? o : next));
  });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, ease }}
    >
      <div
        ref={stage}
        // Plain style (not motion's), so a re-render never resets the progress written above
        style={{ ["--p" as string]: reduce ? 1 : 0 }}
        role="img"
        aria-label={label}
        className="angle relative grid aspect-[375/356] place-items-center overflow-hidden bg-white px-6 shadow-[0_20px_50px_-30px_rgba(36,47,53,0.35)]"
      >
        {/* Soft glow behind the device that warms up while it plays */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: "var(--p, 1)",
            background: "radial-gradient(60% 50% at 50% 60%, rgba(242,167,61,0.16), transparent 70%)",
          }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/[0.06]" />
        <CutEdge className="bg-ink/[0.06]" />
        {children(on)}
      </div>
      {kicker && <div className="mt-7 flex justify-center">{kicker}</div>}
      <h3 className={`text-center text-xl font-extrabold tracking-tight ${kicker ? "mt-3" : "mt-7"}`}>{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-ink/65">{text}</p>
      {footer && <div className="mt-4 flex justify-center">{footer}</div>}
    </motion.article>
  );
}
