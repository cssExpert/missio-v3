"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PillButton, TextLink } from "@/components/atoms/ui";

// Opening line of missio.io/about; words marked gold carry the point
const words =
  "Every hour spent wrestling with software steals an hour from the mission.".split(
    " ",
  );
const gold = new Set(["hour", "mission."]);

// One word: dim until the scroll reaches its slot, then fully lit
function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const y = useTransform(progress, range, [14, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block ${gold.has(word) ? "text-gold" : ""}`}
    >
      {word}&nbsp;
    </motion.span>
  );
}

// Tall section with a pinned frame: the statement lights up word by word as you scroll,
// then the supporting line and buttons rise in underneath
export default function AboutManifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // 0 when the section's top reaches the top of the screen, 1 when its bottom reaches the bottom.
  // Measured by hand: motion's useScroll with a target hands this to a native scroll timeline,
  // which lit the words and then dimmed them again further down.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight || 1;
      scrollYProgress.set(Math.min(Math.max(-r.top / travel, 0), 1));
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
  }, [scrollYProgress]);
  // Words finish lighting at 70% of the scroll; the rest belongs to the copy below
  // The first LIT words are already lit on arrival, so the line reads above the fold
  const LIT = 2;
  const step = 0.7 / (words.length - LIT);
  const restOpacity = useTransform(scrollYProgress, [0.68, 0.85], [0, 1]);
  const restY = useTransform(scrollYProgress, [0.68, 0.85], [30, 0]);

  const statement = (
    <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
      {words.map((w, i) =>
        reduce ? (
          <span key={i} className={gold.has(w) ? "text-gold" : ""}>
            {w}{" "}
          </span>
        ) : (
          <Word
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[(i - LIT) * step, (i - LIT + 1) * step]}
          />
        ),
      )}
    </h2>
  );

  const rest = (
    <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <p className="max-w-2xl text-lg leading-8 text-ink/75">
        Missio exists to give that time back. One platform, one login, and one
        record for every person who touches your mission &mdash; whether they
        give, attend, volunteer or work for you.
      </p>
      <div className="flex flex-wrap items-center gap-8">
        <PillButton href="#">See Demo</PillButton>
        <TextLink href="#">Price my stack</TextLink>
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      className={`relative ${reduce ? "pb-24 pt-16" : "h-[220vh]"}`}
    >
      {/* Text sits at the top of the pinned frame, just under the fixed header, so it starts close to the banner */}
      <div className={reduce ? "" : "sticky top-0 h-svh overflow-hidden pt-28"}>
        {/* Soft brand glows behind the text */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[1340px] px-4 sm:px-8">
          <span className="eyebrow">Why we exist</span>
          <div className="mt-5">{statement}</div>
          {reduce ? (
            rest
          ) : (
            <motion.div style={{ opacity: restOpacity, y: restY }}>
              {rest}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
