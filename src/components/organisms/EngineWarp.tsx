"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
} from "motion/react";
import { PillButton, TextLink } from "@/components/atoms/ui";
import WarpField from "@/components/atoms/WarpField";
import { engineHex, engineId } from "@/components/organisms/EngineShowcase";
import { engines } from "@/components/organisms/GrowthEngine";
import { Core, Gate } from "@/components/molecules/WarpGates";

const ease = [0.16, 1, 0.3, 1] as const;
const STAGES = engines.length + 1; // intro (0), one per engine (1-4), the core (5)
const GOLD = "#f2a73d";

// Engines page, version 2 (see /engines-2): a pinned flight through space. Scrolling moves a camera through
// four glowing gates, one per engine, and ends at the core where they meet. Stars streak with scroll speed.
// Each stage is one screen of scroll; the engine anchors (#growth-engine …) sit at their stage.
export default function EngineWarp() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const still = !!reduce;
  const { scrollYProgress, scrollY } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const s = useTransform(scrollYProgress, (p) => p * STAGES);
  const velocity = useVelocity(scrollY);
  const speed = useTransform(velocity, (v) => Math.abs(v) / 60);
  const [stage, setStage] = useState(0);
  useMotionValueEvent(s, "change", (v) => setStage(Math.min(STAGES, Math.max(0, Math.round(v)))));

  const e = stage >= 1 && stage <= engines.length ? engines[stage - 1] : null;
  const hex = e ? engineHex[e.name] : stage === STAGES ? GOLD : "#4fb3cc";
  const goTo = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (k / STAGES) * (el.offsetHeight - window.innerHeight),
      behavior: reduce ? "auto" : "smooth",
    });
  };
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="engines" className="relative" style={{ height: `${(STAGES + 1) * 100}svh` }}>
      {/* Anchors for the header's mega menu, one per stage */}
      {engines.map((x, i) => (
        <span
          key={x.name}
          id={engineId(x.name)}
          aria-hidden
          className="absolute left-0"
          style={{ top: `${(i + 1) * 100}svh` }}
        />
      ))}

      <div className="sticky top-3 m-3 h-[calc(100svh-1.5rem)] overflow-hidden rounded-3xl bg-[#0a1013]">
        {/* Deep-space glow that takes the current engine's colour */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ background: `radial-gradient(60% 55% at 50% 50%, ${hex}2e, transparent 70%)` }}
          transition={{ duration: 0.8 }}
        />
        <WarpField speed={speed} tint={hex} />

        {/* The 3D world */}
        <div aria-hidden className="absolute inset-0 [perspective:900px]">
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            <Core s={s} still={still} />
            {engines.map((x, i) => (
              <Gate key={x.name} e={x} slot={i + 1} s={s} still={still} />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(10,16,19,0.85))]"
        />

        {/* The story for the current stage */}
        {/* -inset-x-3 undoes the card's 12px inset, so this lines up with the header's container */}
        <div className="absolute -inset-x-3 bottom-0 top-24 mx-auto flex max-w-[1340px] items-end px-6 pb-10 sm:px-8 lg:items-center lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: reduce ? 0 : 24, filter: reduce ? "none" : "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } }}
              exit={{
                opacity: 0,
                y: reduce ? 0 : -16,
                filter: reduce ? "none" : "blur(8px)",
                transition: { duration: 0.25 },
              }}
              className={
                e
                  ? "max-w-md rounded-3xl bg-[#0a1013]/55 p-6 ring-1 ring-paper/10 backdrop-blur-md sm:p-8"
                  : "max-w-2xl"
              }
            >
              {stage === 0 && (
                <>
                  <span className="eyebrow gold">The platform</span>
                  <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-mist sm:text-6xl lg:text-7xl">
                    Four engines.
                    <br />
                    <span className="whitespace-nowrap text-gold">One mission.</span>
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-paper/75">
                    Raise more, serve more, and never lose an opportunity. <br className="hidden sm:block" />
                    Mix and match the engines your mission needs.
                  </p>
                  <p className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-paper/50">
                    <span className="relative h-9 w-6 rounded-full border-2 border-paper/40">
                      <motion.span
                        className="absolute left-1/2 top-1.5 h-2 w-1 -translate-x-1/2 rounded-full bg-gold"
                        animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                    </span>
                    Scroll to fly through
                  </p>
                </>
              )}

              {e && (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: hex }}>
                    Engine {e.n} · {e.area}
                  </p>
                  <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist sm:text-5xl">
                    {e.name}
                  </h2>
                  <p className="mt-4 text-lg font-semibold leading-snug text-paper">{e.tagline}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-paper/65">{e.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {e.features.map((f, i) => (
                      <motion.li
                        key={f}
                        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 320, damping: 22 }}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold text-paper/90"
                        style={{ background: `${hex}22`, boxShadow: `inset 0 0 0 1px ${hex}55` }}
                      >
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}

              {stage === STAGES && (
                <>
                  <span className="eyebrow gold">Where they meet</span>
                  <h2 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-mist sm:text-6xl">
                    Four engines.
                    <br />
                    <span className="whitespace-nowrap text-gold">One record.</span>
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-paper/75">
                    Each engine stands on its own, and every one of them writes to the same record, with MIRA reading
                    across all four.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-8">
                    <PillButton href="/pricing">See Pricing</PillButton>
                    <TextLink href="/demo" light>
                      Book a demo
                    </TextLink>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flight path: one stop per engine, the line fills as you travel */}
        <div className="pointer-events-none absolute -inset-x-3 inset-y-0 mx-auto max-w-[1340px] px-6 sm:px-8">
          <nav
            aria-label="Engines"
            className="pointer-events-auto absolute right-6 top-1/2 hidden -translate-y-1/2 sm:right-8 sm:block"
          >
            <span aria-hidden className="absolute bottom-4 left-[15px] top-4 w-px bg-paper/15">
              <motion.span className="absolute inset-x-0 top-0 h-full origin-top bg-gold" style={{ scaleY: fill }} />
            </span>
            <ol className="relative flex flex-col gap-6">
              {engines.map((x, i) => {
                const on = stage === i + 1;
                return (
                  <li key={x.name}>
                    <button
                      type="button"
                      onClick={() => goTo(i + 1)}
                      aria-label={`Fly to the ${x.name}`}
                      aria-current={on ? "step" : undefined}
                      className="group flex items-center gap-3"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0a1013] ring-1 ring-paper/20">
                        <span
                          className="block h-2.5 w-2.5 rounded-full transition-transform duration-500"
                          style={{
                            background: engineHex[x.name],
                            transform: `scale(${on ? 1.6 : 1})`,
                            boxShadow: on ? `0 0 14px ${engineHex[x.name]}` : "none",
                          }}
                        />
                      </span>
                      <span
                        className={`text-xs font-semibold transition-colors ${on ? "text-paper" : "text-paper/40 group-hover:text-paper/80"}`}
                      >
                        {x.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
