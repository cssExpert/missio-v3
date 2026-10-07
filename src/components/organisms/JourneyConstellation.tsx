"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { StepBody, colorOf, steps } from "@/components/molecules/JourneyStep";

const ease = [0.16, 1, 0.3, 1] as const;
// Stars of the constellation (SVG units, viewBox 1000 x 640), one per step of Marcus's journey
const stars = [
  { x: 70, y: 540 },
  { x: 250, y: 340 },
  { x: 430, y: 500 },
  { x: 600, y: 250 },
  { x: 790, y: 410 },
  { x: 930, y: 110 },
];

// Smooth curve through every star (Catmull-Rom turned into cubic Béziers)
function curve(p: { x: number; y: number }[]) {
  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(i - 1, 0)];
    const b = p[i];
    const c = p[i + 1];
    const e = p[Math.min(i + 2, p.length - 1)];
    d += ` C${b.x + (c.x - a.x) / 6},${b.y + (c.y - a.y) / 6} ${c.x - (e.x - b.x) / 6},${c.y - (e.y - b.y) / 6} ${c.x},${c.y}`;
  }
  return d;
}
const PATH = curve(stars);

// Engines page v2 (light section): Marcus's journey as a constellation. The section pins while you scroll; a comet travels the
// path star to star, drawing the line, the story card follows the lit star, and his record fills in below.
export default function JourneyConstellation() {
  const track = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const comet = useRef<SVGGElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [lens, setLens] = useState<number[] | null>(null);
  const record = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  // Where each star sits along the path, so the comet can stop on it
  useEffect(() => {
    const el = path.current;
    if (!el) return;
    const total = el.getTotalLength();
    const found = stars.map((s) => {
      let best = 0;
      let dist = Infinity;
      for (let l = 0; l <= total; l += total / 600) {
        const pt = el.getPointAtLength(l);
        const dd = (pt.x - s.x) ** 2 + (pt.y - s.y) ** 2;
        if (dd < dist) [dist, best] = [dd, l];
      }
      return best;
    });
    setLens(found);
  }, []);

  // Keep the newest record pill in view: glide the row to its end whenever a step is added (or removed)
  useEffect(() => {
    const el = record.current;
    if (!el) return;
    const id = setTimeout(() => el.scrollTo({ left: el.scrollWidth, behavior: reduce ? "auto" : "smooth" }), 60);
    return () => clearTimeout(id);
  }, [active, reduce]);

  // Each step owns an equal slice of the scroll; the comet rests on its star in the middle of the slice
  const stops = useMemo(() => steps.map((_, i) => (i + 0.5) / steps.length), []);
  const length = useTransform(scrollYProgress, stops, lens ?? stops.map(() => 0));
  const drawn = useTransform(length, (l) => (lens ? l / lens[lens.length - 1] : 0));

  useMotionValueEvent(length, "change", (l) => {
    const el = path.current;
    if (el && comet.current) {
      const pt = el.getPointAtLength(l);
      comet.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    }
  });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(Math.min(steps.length - 1, Math.floor(p * steps.length))),
  );

  const step = steps[active];
  const hex = colorOf(step.engine);
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + stops[i] * (el.offsetHeight - window.innerHeight),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section ref={track} className="relative" style={{ height: `${steps.length * 85 + 100}svh` }}>
      {/* Full-width light grey panel, like the home page's second section; a faint dot grid stands in for the sky */}
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-mist">
        <div
          aria-hidden
          className="absolute inset-0 [background-image:radial-gradient(rgba(36,47,53,0.13)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ background: `radial-gradient(50% 50% at 70% 45%, ${hex}22, transparent 70%)` }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative flex flex-1 flex-col">
          <div className="relative mx-auto flex w-full max-w-[1340px] flex-1 flex-col px-6 pb-6 pt-24 sm:px-8 lg:pt-28 short:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">One supporter · six moments</span>
                <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl short:lg:text-4xl">
                  Follow one supporter through <span className="text-gold">all four engines</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-ink/65">
                Every engine writes to the same record. Watch one person&rsquo;s actions join up into a single story.
              </p>
            </div>

            <div className="mt-4 grid min-h-0 flex-1 gap-6 lg:grid-cols-[5fr_7fr] lg:gap-10">
              {/* The story at the lit star: as tall as the constellation column, story at the bottom, so both sides line up */}
              <div className="relative order-2 min-h-0 lg:order-1 lg:h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: reduce ? 0 : -24, filter: reduce ? "none" : "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } }}
                    exit={{
                      opacity: 0,
                      x: reduce ? 0 : 16,
                      filter: reduce ? "none" : "blur(6px)",
                      transition: { duration: 0.25 },
                    }}
                    // Tighter than StepBody's defaults so the longest step still fits the pinned screen
                    className="angle relative flex h-full flex-col overflow-hidden bg-ink p-6 shadow-[0_30px_60px_-30px_rgba(36,47,53,0.6)] sm:p-7 short:p-5 [&_.angle-sm]:mt-5 [&_h3]:mt-4 [&_h3]:text-2xl md:[&_h3]:text-3xl short:md:[&_h3]:text-2xl [&_h3+p]:mt-3 [&_p]:text-sm [&_p]:leading-6 md:[&_p]:text-[15px]"
                  >
                    <p className="mb-4 font-mono text-xs tracking-[0.2em] text-paper/45">
                      {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                    </p>
                    {/* Large outlined step number fills the space above the story, in the step's colour */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-6 top-8 hidden select-none font-heading text-[clamp(120px,14vw,200px)] font-extrabold leading-none text-transparent lg:block"
                      style={{ WebkitTextStroke: `1.5px ${hex}55` }}
                    >
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <div className="relative mt-auto">
                      <StepBody step={step} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* The constellation, with Marcus's record under it (so the story card gets the full height) */}
              <div className="order-1 flex min-h-0 flex-col lg:order-2">
                <div className="relative min-h-[200px] flex-1">
                  <svg
                    viewBox="0 0 1000 640"
                    className="absolute inset-0 h-full w-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="trail" x1="0" x2="1" y1="1" y2="0">
                        {steps.map((s, i) => (
                          <stop key={i} offset={`${(i / (steps.length - 1)) * 100}%`} stopColor={colorOf(s.engine)} />
                        ))}
                      </linearGradient>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" />
                      </filter>
                    </defs>
                    {/* Faint full route, then the drawn trail on top */}
                    <path d={PATH} fill="none" stroke="rgba(36,47,53,0.22)" strokeWidth="2" strokeDasharray="3 10" />
                    <motion.path
                      ref={path}
                      d={PATH}
                      fill="none"
                      stroke="url(#trail)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{ pathLength: drawn }}
                    />
                    <motion.path
                      d={PATH}
                      fill="none"
                      stroke="url(#trail)"
                      strokeWidth="10"
                      opacity="0.35"
                      filter="url(#glow)"
                      style={{ pathLength: drawn }}
                    />

                    {stars.map((st, i) => {
                      const c = colorOf(steps[i].engine);
                      const lit = i <= active;
                      const on = i === active;
                      return (
                        <g
                          key={i}
                          transform={`translate(${st.x} ${st.y})`}
                          className="cursor-pointer"
                          onClick={() => goTo(i)}
                          role="button"
                          aria-label={`Step ${i + 1}: ${steps[i].title}`}
                        >
                          <circle
                            r="34"
                            fill={c}
                            opacity={on ? 0.25 : 0}
                            filter="url(#glow)"
                            style={{ transition: "opacity .5s" }}
                          />
                          <circle
                            r={on ? 11 : 7}
                            fill={lit ? c : "#e2eeee"}
                            stroke={c}
                            strokeWidth="2"
                            style={{ transition: "r .4s, fill .4s" }}
                          />
                          <text
                            y={-24}
                            textAnchor="middle"
                            className="fill-ink font-sans text-[18px] font-semibold"
                            opacity={lit ? 0.85 : 0.4}
                            style={{ transition: "opacity .4s" }}
                          >
                            {steps[i].note.length > 26 ? `${steps[i].note.slice(0, 24)}…` : steps[i].note}
                          </text>
                        </g>
                      );
                    })}

                    {/* The comet */}
                    <g ref={comet} transform={`translate(${stars[0].x} ${stars[0].y})`} aria-hidden>
                      <circle r="22" fill="#f2a73d" opacity="0.45" filter="url(#glow)" />
                      <circle r="7" fill="#242f35" stroke="#f2a73d" strokeWidth="3" />
                    </g>
                  </svg>
                </div>
                {/* Marcus's record fills as the comet passes each star */}
                <div className="relative mt-4 flex shrink-0 items-center gap-4 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-ink/10">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent-soft text-sm font-extrabold text-white">
                    MW
                  </span>
                  <span className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-ink/50 xl:block">
                    Marcus&rsquo;s record
                  </span>
                  {/* Newest pill slides in from the right and the row glides left to keep it in view; older ones fade off the left edge */}
                  <ol
                    ref={record}
                    className="flex min-w-0 flex-1 gap-2 overflow-x-auto [mask-image:linear-gradient(90deg,transparent,black_28px,black)] [scrollbar-width:none] pl-2"
                  >
                    <AnimatePresence initial={false}>
                      {steps.slice(0, active + 1).map((s, i) => (
                        <motion.li
                          key={i}
                          initial={reduce ? false : { opacity: 0, x: 48, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={reduce ? undefined : { opacity: 0, x: 48, scale: 0.9, transition: { duration: 0.2 } }}
                          transition={{ type: "spring", stiffness: 380, damping: 24 }}
                          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/80"
                          style={{
                            background: `${colorOf(s.engine)}22`,
                            boxShadow: `inset 0 0 0 1px ${colorOf(s.engine)}66`,
                          }}
                        >
                          {s.note}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
