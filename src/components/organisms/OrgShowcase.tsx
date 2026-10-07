"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Arrow, TextLink } from "@/components/atoms/ui";
import {
  items as orgTypes,
  type Feature,
} from "@/components/organisms/Integrations";

const AUTO_MS = 6000; // each organization type shows for 6s (paused on hover, off for reduced motion)

const tagList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};
const tag: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

// "Built for any organization" from missio.io/about: pick an organization type on the left,
// a dark showcase card on the right shows how Missio fits it. Auto-advances like Obstacles.
export default function OrgShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number, focus = false) => {
    const next = (i + orgTypes.length) % orgTypes.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  // Spotlight that follows the cursor across the card
  const track = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section className="relative overflow-hidden py-18 lg:py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <span className="eyebrow">Built for any organization</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              However you&rsquo;re built to do good, Missio{" "}
              <span className="text-gold">flexes</span> to fit.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-ink/70 lg:justify-self-end">
            Whether you&rsquo;re a local community co-op, a new church, or a
            200-person international relief org, Missio&rsquo;s engines
            configure to your size and workflow.
          </p>
        </motion.div>

        <div
          className="mt-14 grid gap-6 lg:grid-cols-[4fr_8fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            role="tablist"
            aria-label="Organization types"
            aria-orientation="vertical"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
          >
            {orgTypes.map((o, i) => {
              const on = i === active;
              const Icon = typeof o.icon === "string" ? null : o.icon;
              return (
                <button
                  key={o.title}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`org-tab-${i}`}
                  aria-selected={on}
                  aria-controls="org-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                      e.preventDefault();
                      go(i + 1, true);
                    }
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      go(i - 1, true);
                    }
                  }}
                  className={`group relative flex items-center gap-3 overflow-hidden angle-sm p-3 text-left transition-all duration-300 lg:p-4 ${
                    on
                      ? "bg-ink text-paper shadow-[0_20px_50px_-20px_rgba(36,47,53,0.55)]"
                      : "bg-mist/60 text-ink hover:bg-mist"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${on ? "bg-gold text-ink" : "bg-primary/10 text-primary"}`}
                  >
                    {Icon && (
                      <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                    )}
                  </span>
                  <span className="flex-1 text-sm font-bold leading-snug lg:text-base">
                    {o.title}
                  </span>
                  <Arrow
                    className={`hidden shrink-0 transition-transform duration-300 lg:block ${on ? "-rotate-45 text-gold" : "text-ink/30 group-hover:-rotate-45"}`}
                  />
                  {on && !reduce && (
                    <span
                      className="absolute inset-x-0 bottom-0 h-1 bg-paper/10"
                      aria-hidden
                    >
                      <span
                        key={active}
                        className="block h-full origin-left bg-gold"
                        style={{
                          animation: `obstacle-progress ${AUTO_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                        onAnimationEnd={() => go(active + 1)}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* All cards share one grid cell; invisible copies reserve the tallest card's height */}
          <div
            id="org-panel"
            role="tabpanel"
            aria-labelledby={`org-tab-${active}`}
            aria-live="polite"
            onMouseMove={track}
            className="angle group/card relative grid overflow-hidden bg-ink text-paper"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
              style={{
                background:
                  "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(79,179,204,0.18), transparent 70%)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/40 blur-[100px]"
            />
            {orgTypes.map((o) => (
              <div
                key={o.title}
                aria-hidden
                className="invisible [grid-area:1/1]"
              >
                <OrgCard o={o} index={0} still />
              </div>
            ))}
            <div className="[grid-area:1/1]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={
                    reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduce
                      ? undefined
                      : { opacity: 0, y: -16, filter: "blur(6px)" }
                  }
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <OrgCard
                    o={orgTypes[active]}
                    index={active}
                    still={!!reduce}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// One organization type: counter, oversized watermark icon, title, text and tags
function OrgCard({
  o,
  index,
  still = false,
}: {
  o: Feature;
  index: number;
  still?: boolean;
}) {
  const Icon = typeof o.icon === "string" ? null : o.icon;
  return (
    <div className="relative flex h-full flex-col p-8 sm:p-12">
      {Icon && (
        <Icon
          aria-hidden
          strokeWidth={0.6}
          className="pointer-events-none absolute -right-10 -top-6 h-72 w-72 text-paper/[0.06] sm:h-96 sm:w-96"
        />
      )}
      <p className="relative text-xs font-bold tracking-[0.2em] text-gold">
        {String(index + 1).padStart(2, "0")}{" "}
        <span className="text-paper/30">
          / {String(orgTypes.length).padStart(2, "0")}
        </span>
      </p>
      <h3 className="relative mt-6 text-3xl font-extrabold leading-tight tracking-tight text-mist md:text-5xl">
        {o.title}
      </h3>
      <p className="relative mt-6 max-w-xl text-base leading-7 text-paper/75 md:text-lg md:leading-8">
        {o.text.trim()}
      </p>
      {o.tags && (
        <motion.ul
          variants={tagList}
          initial={still ? false : "hidden"}
          animate="show"
          className="relative mt-8 flex flex-wrap gap-2"
        >
          {o.tags.map((t) => (
            <motion.li
              key={t}
              variants={tag}
              className="flex items-center gap-2 rounded-full bg-paper/[0.07] py-2 pl-2 pr-4 text-sm font-semibold text-paper ring-1 ring-paper/10"
            >
              <span
                className="grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40"
                aria-hidden
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 6.5l2.5 2 4.5-5" />
                </svg>
              </span>
              {t}
            </motion.li>
          ))}
        </motion.ul>
      )}
      <div className="relative mt-auto pt-10">
        <TextLink href="#" light>
          See how it fits
        </TextLink>
      </div>
    </div>
  );
}
