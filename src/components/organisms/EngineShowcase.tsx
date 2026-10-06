"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { PillButton, TextLink } from "@/components/atoms/ui";
import { engines, type Engine } from "@/components/organisms/GrowthEngine";

// Note: the section uses overflow-clip, not overflow-hidden, so the pinned panel can stay sticky
// Each engine's colour as a hex, for gradients and glows (matches the tones in GrowthEngine)
export const engineHex: Record<string, string> = {
  "Growth Engine": "#F28A6B",
  "Relationship Engine": "#4fb3cc",
  "Execution Engine": "#f2a73d",
  "Revenue Engine": "#5FCFA8",
};
export const engineId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const ease = [0.16, 1, 0.3, 1] as const;

// One engine's copy block; reports itself as active while it holds the middle of the screen
function EngineBlock({ e, index, onActive }: { e: Engine; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const reduce = useReducedMotion();
  const hex = engineHex[e.name];
  const Icon = e.icon;

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div id={engineId(e.name)} ref={ref} className="scroll-mt-28 py-12 lg:flex lg:min-h-[78svh] lg:items-center lg:py-0">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        {/* Phones: the engine's icon sits with its copy (the sticky panel is desktop only) */}
        <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl lg:hidden" style={{ background: `${hex}22`, color: hex }}>
          <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: hex }}>
          Engine {e.n} · {e.area}
        </p>
        <h3 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">{e.name}</h3>
        <p className="mt-5 text-xl font-semibold leading-snug text-paper md:text-2xl">{e.tagline}</p>
        <p className="mt-5 max-w-xl text-base leading-7 text-paper/65">{e.text}</p>
        <ul className="mt-8 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
          {e.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm font-semibold text-paper/85">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: `${hex}26`, color: hex }}>
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// The four engines as a scroll story: the copy scrolls on the right while a pinned panel on the left
// changes colour, icon and features to match the engine in view
export default function EngineShowcase() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const e = engines[active];
  const hex = engineHex[e.name];
  const Icon = e.icon;

  return (
    <section id="engines" className="relative isolate m-3 overflow-clip rounded-3xl bg-ink">
      {/* Background wash follows the active engine's colour */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-[560px] w-[560px] rounded-full blur-[140px]"
        animate={{ backgroundColor: `${hex}33` }}
        transition={{ duration: 0.8 }}
      />

      <div className="-mx-3">
        <div className="mx-auto max-w-[1340px] px-6 pt-24 sm:px-8 lg:pt-32">
          <div className="max-w-3xl">
            <span className="eyebrow gold">The platform</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">
              Mix and match the engines <span className="text-gold">your mission</span> needs
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-paper/70">
              Raise more, serve more, and never lose an opportunity. Each engine stands on its own, and every one of
              them writes to the same record.
            </p>
          </div>

          <div className="mt-8 grid gap-10 lg:mt-0 lg:grid-cols-[5fr_6fr] lg:gap-20">
            {/* Pinned panel (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-0 flex h-svh items-center pt-16">
                <div
                  className="angle relative aspect-[4/5] w-full overflow-hidden transition-[background] duration-700"
                  style={{ background: `radial-gradient(120% 90% at 20% 10%, ${hex}40, transparent 60%), linear-gradient(160deg, #2c3a41, #1b2429)` }}
                >
                  {/* Faint grid */}
                  <div aria-hidden className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(120%_80%_at_20%_0%,black,transparent_75%)]" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      className="absolute inset-0 flex flex-col p-10"
                      initial={reduce ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <span aria-hidden className="text-[150px] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(243,247,248,0.18)]">
                        {e.n}
                      </span>
                      <div className="relative mt-auto">
                        <motion.span
                          className="grid h-24 w-24 place-items-center rounded-3xl text-ink"
                          style={{ background: hex, boxShadow: `0 0 80px ${hex}88` }}
                          initial={reduce ? false : { scale: 0.6, rotate: -12 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                        >
                          <Icon className="h-11 w-11" strokeWidth={1.5} aria-hidden />
                        </motion.span>
                        <p className="mt-8 text-3xl font-extrabold tracking-tight text-mist">{e.name}</p>
                        <p className="mt-1 text-sm font-semibold text-paper/55">{e.area}</p>
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {e.features.map((f, i) => (
                            <motion.li
                              key={f}
                              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + i * 0.05, type: "spring", stiffness: 320, damping: 22 }}
                              className="rounded-full bg-paper/[0.08] px-3 py-1.5 text-xs font-semibold text-paper/85 ring-1 ring-paper/10"
                            >
                              {f}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Engine index: jump to any engine */}
                  <nav aria-label="Engines" className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-2">
                    {engines.map((x, i) => (
                      <a
                        key={x.name}
                        href={`#${engineId(x.name)}`}
                        aria-label={x.name}
                        aria-current={i === active ? "true" : undefined}
                        className="group grid h-8 w-8 place-items-center"
                      >
                        <span
                          className="block h-2.5 rounded-full transition-all duration-500"
                          style={{ width: i === active ? 26 : 10, background: i === active ? engineHex[x.name] : "rgba(243,247,248,0.25)" }}
                        />
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Scrolling copy */}
            <div className="pb-16 lg:pb-24">
              {engines.map((x, i) => (
                <EngineBlock key={x.name} e={x} index={i} onActive={setActive} />
              ))}
              <div className="flex flex-wrap items-center gap-8 pt-4 lg:pt-0">
                <PillButton href="#">See Pricing</PillButton>
                <TextLink href="/demo" light>
                  Book a demo
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
