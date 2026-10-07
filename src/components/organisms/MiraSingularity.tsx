"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import Starfield from "@/components/atoms/Starfield";
import { engineHex } from "@/components/organisms/EngineShowcase";
import { engines } from "@/components/organisms/GrowthEngine";

const ease = [0.16, 1, 0.3, 1] as const;
// Same content as MiraLayer ("The AI layer" from missio.io/engines)
const capabilities = [
  "Draft appeals & pages",
  "Lapse signals",
  "Major-gift flags",
  "Campaign forecasting",
  "Capacity vs. demand",
  "Plain-English reporting",
];
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

// Canvas: the four engines orbit the core and shed data that spirals inward in their colours
function Accretion() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = engines.map((e) => engineHex[e.name]);
    type P = { a: number; r: number; c: string; v: number };
    let parts: P[] = [];
    let size = 0;
    let frame = 0;
    let t = 0;
    const fit = () => {
      size = el.getBoundingClientRect().width;
      el.width = el.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      t += 1;
      const c = size / 2;
      const R = size * 0.44;
      ctx.clearRect(0, 0, size, size);
      // Engines on their orbit
      colors.forEach((col, i) => {
        const a = t * 0.004 + (i * Math.PI) / 2;
        const x = c + Math.cos(a) * R;
        const y = c + Math.sin(a) * R * 0.42;
        if (!still && t % 3 === 0) parts.push({ a, r: R, c: col, v: 0.6 + Math.random() * 0.8 });
        ctx.globalAlpha = 1;
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.018, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      // Data spiralling in: faster and tighter as it nears the core
      parts = parts.filter((p) => p.r > size * 0.09);
      for (const p of parts) {
        p.r -= p.v * (1 + (R - p.r) / R) * (size / 600);
        p.a += 0.012 + (1 - p.r / R) * 0.05;
        ctx.globalAlpha = Math.min(1, p.r / (size * 0.2)) * 0.9;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(c + Math.cos(p.a) * p.r, c + Math.sin(p.a) * p.r * 0.42, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!still) frame = requestAnimationFrame(draw);
    };
    fit();
    draw();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);
  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />;
}

// Insight that types itself out once it scrolls into view
function Insight({ item, delay }: { item: (typeof insights)[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const id = setTimeout(() => setShown(item.text.length), 0);
      return () => clearTimeout(id);
    }
    let i = 0;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 2;
      setShown(Math.min(i, item.text.length));
      if (i < item.text.length) id = setTimeout(tick, 18);
    };
    id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [inView, reduce, item.text.length, delay]);
  const done = shown >= item.text.length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease, delay: delay / 1000 }}
      className="relative overflow-hidden rounded-3xl bg-[#0a1013]/70 p-6 ring-1 ring-paper/10 backdrop-blur-md sm:p-7"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold">
          <Sparkles className="h-3 w-3" aria-hidden /> MIRA
        </span>
        <span className="text-[11px] text-paper/40">reading</span>
        {item.sources.map((s) => (
          <span
            key={s}
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-paper/85"
            style={{ background: `${engineHex[s]}22`, boxShadow: `inset 0 0 0 1px ${engineHex[s]}55` }}
          >
            {s}
          </span>
        ))}
      </div>
      {/* Full text reserved underneath so the card never changes height while typing */}
      <p className="relative mt-4 text-base font-semibold leading-7 text-mist">
        <span className="invisible">{item.text}</span>
        <span className="absolute inset-0" aria-label={item.text}>
          {item.text.slice(0, shown)}
          {!done && <span aria-hidden className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-gold" />}
        </span>
      </p>
      <p
        className={`mt-3 text-sm font-bold text-gold transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}
      >
        {item.tag}
      </p>
    </motion.div>
  );
}

// Engines page v2: MIRA as a singularity. The four engines orbit it and their data spirals in; the capabilities
// circle it as a ring of text; what it sees types itself out alongside.
export default function MiraSingularity() {
  const reduce = useReducedMotion();
  const ring = capabilities.join("  ✦  ") + "  ✦  ";

  return (
    <section id="mira" className="relative isolate m-3 overflow-hidden rounded-3xl bg-[#070b0d] py-24 lg:py-32">
      <Starfield count={120} />
      {/* -mx-3 undoes the section's 12px inset, so the content lines up with the header's container */}
      <div className="relative -mx-3">
        <div className="relative mx-auto max-w-[1340px] px-6 sm:px-8">
          <div className="max-w-2xl">
            <span className="eyebrow gold">The AI layer</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">
              MIRA sees across <span className="text-gold">all four engines</span> at once
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-paper/65">
              Bolt-on AI reads one silo. MIRA reads giving, events, volunteers, programs and staffing together &mdash;
              so it can tell you not just who is likely to give, but whether you have the people to deliver what that
              gift funds.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[6fr_5fr] lg:gap-16">
            {/* The singularity */}
            <div className="relative mx-auto aspect-square w-full max-w-[620px]">
              {/* Accretion disk: a ring of light, tilted by the wrapper (flattened into an ellipse) while the
                  inner layer spins. Kept on two elements so the spin's transform doesn't replace the tilt */}
              <div aria-hidden className="absolute inset-[4%] [transform:scaleY(0.42)]">
                <motion.div
                  className="h-full w-full rounded-full [mask-image:radial-gradient(circle,transparent_36%,black_46%,black_60%,transparent_71%)]"
                  style={{
                    background: "conic-gradient(from 0deg, #f2a73d, #F28A6B, #4fb3cc, #5FCFA8, #f2a73d)",
                    filter: "blur(10px)",
                    opacity: 0.7,
                  }}
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <Accretion />
              {/* Event horizon */}
              <div className="absolute left-1/2 top-1/2 grid h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black shadow-[0_0_60px_20px_rgba(242,167,61,0.45),inset_0_0_30px_rgba(242,167,61,0.4)] ring-2 ring-gold/70">
                <span className="font-heading text-sm font-extrabold tracking-[0.3em] text-gold sm:text-base">
                  MIRA
                </span>
              </div>
              {/* Capabilities orbiting as a ring of text */}
              <motion.svg
                viewBox="0 0 400 400"
                className="absolute inset-0 h-full w-full"
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                aria-label={`MIRA can: ${capabilities.join(", ")}`}
                role="img"
              >
                <defs>
                  <path id="cap-ring" d="M200,200 m-185,0 a185,185 0 1,1 370,0 a185,185 0 1,1 -370,0" />
                </defs>
                <text className="fill-paper/55 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  <textPath href="#cap-ring">{ring}</textPath>
                </text>
              </motion.svg>
            </div>

            {/* What MIRA sees */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-paper/45">What only MIRA can see</p>
              {insights.map((item, i) => (
                <Insight key={item.tag} item={item} delay={300 + i * 1600} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
