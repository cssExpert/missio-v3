"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { Sparkles } from "lucide-react";
import { engines } from "@/components/organisms/GrowthEngine";
import { engineHex } from "@/components/organisms/EngineShowcase";

// "The AI layer" from missio.io/engines
const capabilities = ["Draft appeals & pages", "Lapse signals", "Major-gift flags", "Campaign forecasting", "Capacity vs. demand", "Plain-English reporting"];
const insights = [
  {
    sources: ["Relationship Engine", "Growth Engine"],
    text: "Marcus Webb has given after every gala for three years. Flag him for a major-gift ask before November 1.",
    tag: "Suggested ask $10,000 · confidence high",
  },
  {
    sources: ["Revenue Engine", "Execution Engine"],
    text: "Spring appeal is pacing 22% ahead of plan, but Saturday program shifts are 40% unstaffed for the same weeks.",
    tag: "No other platform can see both sides of this",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } } };

// Darker shade of each engine colour, readable as text on a light background
const tint: Record<string, { ink: string }> = {
  "Growth Engine": { ink: "#b8492c" },
  "Relationship Engine": { ink: "#1b7690" },
  "Execution Engine": { ink: "#a8650b" },
  "Revenue Engine": { ink: "#1c8560" },
};

// Node positions (% of the diagram) for the four engines around MIRA
const nodes = [
  { x: 12, y: 18 }, { x: 88, y: 18 }, { x: 12, y: 82 }, { x: 88, y: 82 },
];

// Light section: MIRA in the middle with the four engines feeding it, then two insights only it could see
const TRAVEL_MS = 1400;
const GOLD = "#f2a73d";

export default function MiraLayer() {
  const reduce = useReducedMotion();
  // Signal loop: a random engine sends a ball down its spoke; when it reaches MIRA the orb takes that engine's colour
  const diagramRef = useRef<HTMLDivElement>(null);
  const inView = useInView(diagramRef, { margin: "-10%" });
  const [travel, setTravel] = useState<{ i: number; key: number } | null>(null);
  const [lit, setLit] = useState<{ i: number; key: number } | null>(null);
  const orbColor = lit ? engineHex[engines[lit.i].name] : GOLD;

  useEffect(() => {
    if (reduce || !inView) return;
    let alive = true;
    let last = -1;
    let n = 0;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(500);
      while (alive) {
        let i: number;
        do i = Math.floor(Math.random() * engines.length);
        while (i === last);
        last = i;
        setTravel({ i, key: ++n });
        await wait(TRAVEL_MS);
        if (!alive) break;
        setTravel(null);
        setLit({ i, key: n });
        await wait(1200 + Math.random() * 1800);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reduce, inView]);
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <section id="mira" className="relative isolate overflow-hidden py-24 lg:py-32">
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div>
        <div className="mx-auto grid max-w-[1340px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="eyebrow">The AI layer</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              MIRA sees across <span className="text-gold">all four engines</span> at once
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-ink/70">
              Bolt-on AI reads one silo. MIRA reads giving, events, volunteers, programs and staffing together &mdash; so
              it can tell you not just who is likely to give, but whether you have the people to deliver what that gift
              funds.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {capabilities.map((c) => (
                <li key={c} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/80 ring-1 ring-ink/10">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* Diagram: engines feeding MIRA */}
            <div ref={diagramRef} aria-hidden className="relative mx-auto aspect-[16/10] w-full max-w-xl">
              {/* Thin neutral spokes from each engine to MIRA */}
              <svg viewBox="0 0 100 62.5" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                {nodes.map((n, i) => (
                  <line
                    key={i}
                    x1={n.x} y1={n.y * 0.625} x2="50" y2="31.25"
                    stroke="#242f35"
                    strokeOpacity="0.14"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              {/* The travelling ball, from the chosen engine to MIRA */}
              {travel && (
                <motion.span
                  key={travel.key}
                  className="absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: engineHex[engines[travel.i].name], boxShadow: `0 0 16px ${engineHex[engines[travel.i].name]}` }}
                  initial={{ left: `${nodes[travel.i].x}%`, top: `${nodes[travel.i].y}%`, opacity: 0, scale: 0.5 }}
                  animate={{ left: "50%", top: "50%", opacity: [0, 1, 1], scale: 1 }}
                  transition={{ duration: TRAVEL_MS / 1000, ease: [0.5, 0, 0.75, 0] }}
                />
              )}
              {engines.map((e, i) => {
                const Icon = e.icon;
                const hex = engineHex[e.name];
                return (
                  <span
                    key={e.name}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border-2 bg-white py-1.5 pl-1.5 pr-3 text-xs font-bold text-ink transition-[border-color,box-shadow] duration-300 sm:pr-5 sm:text-sm"
                    style={{
                      left: `${nodes[i].x}%`,
                      top: `${nodes[i].y}%`,
                      // White pill with a border in the engine's colour; full strength with a glow while this engine is sending
                      borderColor: travel?.i === i ? hex : `${hex}80`,
                      boxShadow: travel?.i === i ? `0 0 0 4px ${hex}26, 0 10px 30px -14px ${hex}` : "0 10px 30px -14px rgba(36,47,53,0.35)",
                    }}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full text-white sm:h-8 sm:w-8" style={{ background: hex }}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span className="hidden sm:inline">{e.name.replace(" Engine", "")}</span>
                  </span>
                );
              })}
              <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
                {!reduce &&
                  [0, 1].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute h-24 w-24 rounded-full border"
                      style={{ borderColor: `${orbColor}55` }}
                      animate={{ scale: [0.8, 1.6], opacity: [0.8, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
                    />
                  ))}
                {/* Burst when a ball lands */}
                {lit && !reduce && (
                  <motion.span
                    key={lit.key}
                    className="absolute h-24 w-24 rounded-full"
                    style={{ background: orbColor }}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.9, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
                <motion.span
                  className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full text-ink"
                  initial={false}
                  animate={{ backgroundColor: orbColor, boxShadow: `0 0 70px ${orbColor}8c` }}
                  transition={{ duration: 0.6, ease }}
                >
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                  <span className="relative text-center">
                    <Sparkles className="mx-auto h-6 w-6" strokeWidth={1.8} />
                    <span className="mt-0.5 block text-sm font-extrabold tracking-wide">MIRA</span>
                  </span>
                </motion.span>
              </div>
            </div>

            {/* Insights */}
            <motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-10 space-y-4">
              {insights.map((it) => (
                <motion.li key={it.text} variants={card} className="angle relative overflow-hidden bg-white p-6 text-ink">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[11px] font-extrabold text-ink">
                      <Sparkles className="h-3 w-3" strokeWidth={2.4} aria-hidden />
                      MIRA
                    </span>
                    {it.sources.map((src) => (
                      <span key={src} className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: tint[src].ink }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: engineHex[src] }} />
                        {src.replace(" Engine", "")}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-base font-semibold leading-7 text-ink">{it.text}</p>
                  <p className="mt-3 text-sm font-bold text-[#a8650b]">{it.tag}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
