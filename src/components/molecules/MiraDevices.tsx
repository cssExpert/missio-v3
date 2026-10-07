"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { engineHex } from "@/components/organisms/EngineShowcase";

// Laptop and phone illustrations for the AI layer cards (the tablet is in MiraTablet) (adapted from the open-design "feature grid" reference).

const GOLD = "#f2a73d";

// Scroll-driven entrance: the card sets --p (0 to 1) from its scroll position, and each piece of a screen fades
// and rises across its own slice of that progress, starting at `start`. Pure CSS, so it follows the scroll smoothly.
export const prog = (start: number, span = 0.12) => `clamp(0, calc((var(--p, 1) - ${start}) / ${span}), 1)`;
export const rise = (start: number): CSSProperties => ({
  opacity: prog(start),
  transform: `translateY(calc((1 - ${prog(start)}) * 10px))`,
});

const avatars: Record<string, [string, string]> = {
  MW: ["#02647e", "#4fb3cc"],
  D: ["#7c5c4b", "#3b2a22"],
  Y: ["#5e8d94", "#2a4448"],
  M: ["#f2a73d", "#9a5a10"],
};
export function Avatar({ i, size = 16 }: { i: string; size?: number }) {
  const [a, b] = avatars[i] ?? ["#777", "#333"];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        background: `linear-gradient(135deg, ${a}, ${b})`,
        boxShadow: "0 0 0 1.5px rgba(127,127,127,.35)",
      }}
    >
      {i === "M" ? <Sparkles style={{ width: size * 0.55, height: size * 0.55 }} aria-hidden /> : i}
    </span>
  );
}

function Wave({ color = "#e2eeee" }: { color?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="flex h-2 items-center gap-[1px]" aria-hidden>
      {[5, 8, 4, 7, 9, 5, 6, 8, 4, 6].map((h, b) => (
        <motion.span
          key={b}
          className="w-[2px] rounded-full"
          style={{ height: h, background: color }}
          animate={reduce ? undefined : { scaleY: [0.35, 1, 0.35] }}
          transition={{ duration: 1, repeat: Infinity, delay: b * 0.09, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export const Blink = ({ className = "" }: { className?: string }) => (
  <span className={`animate-pulse rounded-full ${className}`} />
);

// 1. Laptop: MIRA drafting the spring appeal in the Growth Engine
export function Laptop() {
  const growth = engineHex["Growth Engine"];
  return (
    <div className="w-full max-w-[320px]">
      <div
        className="mx-auto w-[90%] rounded-t-xl border-[5px] border-b-0 border-[#3a4950] bg-[#2a363c] p-[3px] shadow-sm"
        style={{
          transformOrigin: "bottom center",
          // The lid opens over the first part of the scroll
          transform: `perspective(900px) rotateX(calc(-78deg * (1 - ${prog(0, 0.32)})))`,
        }}
      >
        <div className="aspect-[16/10] overflow-hidden rounded-t-[6px] bg-[#0e1417] text-[6.5px] text-paper/80">
          <div className="flex h-full flex-col">
            <div style={rise(0.4)} className="flex items-center justify-between bg-black/50 px-2 py-1">
              <div className="flex gap-2">
                <b className="font-semibold text-paper">Missio</b>
                <span>Pages</span>
                <span>Email</span>
                <span>Forms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Blink className="h-1 w-1 bg-gold" />
                MIRA drafting
              </div>
            </div>
            <div
              style={rise(0.51)}
              className="mx-4 mt-2 flex flex-1 flex-col rounded border border-paper/10 bg-[#141c20]"
            >
              <div className="flex items-center justify-between border-b border-paper/10 px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[#ff5f57]" />
                  <span className="h-1 w-1 rounded-full bg-[#febc2e]" />
                  <span className="h-1 w-1 rounded-full bg-[#28c840]" />
                  <span className="ml-1.5 text-paper">Spring appeal · draft</span>
                </div>
                <span className="rounded-full px-1.5 py-[1px]" style={{ background: `${growth}26`, color: growth }}>
                  Growth Engine
                </span>
              </div>
              <div className="flex-1 space-y-1 p-2">
                <p className="text-[7.5px] font-semibold text-paper">Every Saturday, the warehouse fills up.</p>
                <p className="leading-[1.4] text-paper/60">
                  Last spring, volunteers like Marcus packed 1,200 boxes. This year we want to double that, and we
                  can&rsquo;t do it without you.
                </p>
                <div className="space-y-1 pt-0.5">
                  <span className="block h-1 w-[92%] rounded bg-paper/10" />
                  <span className="block h-1 w-[78%] rounded bg-paper/10" />
                  <span className="block h-1 w-[60%] rounded bg-gold/30" />
                </div>
              </div>
            </div>
            <div
              style={rise(0.61)}
              className="mx-auto my-1.5 flex items-center gap-1 rounded-full border border-paper/10 bg-black p-[2px]"
            >
              <div className="flex items-center gap-1 rounded-full bg-paper/10 px-1.5 py-0.5">
                <Sparkles className="h-1.5 w-1.5 text-gold" aria-hidden />
                MIRA writing
                <Wave color={GOLD} />
              </div>
              <span className="rounded-full bg-paper/10 px-1.5 py-0.5">Regenerate</span>
              <span className="rounded-full bg-gold px-1.5 py-0.5 font-semibold text-ink">Insert</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-3 rounded-b-xl rounded-t-sm bg-gradient-to-b from-[#4a5a62] to-[#2a363c] shadow-lg">
        <div className="absolute left-1/2 top-0 h-1 w-14 -translate-x-1/2 rounded-b-md bg-[#5c6d75]" />
      </div>
    </div>
  );
}

// 2. Phone: the major-gift flag for Marcus, with checkable next steps
export function Phone() {
  const [done, setDone] = useState<number[]>([]);
  const steps: [string, string][] = [
    ["Draft the opening paragraph", "M"],
    ["Book coffee before Nov 1", "D"],
    ["Add to the Q4 major-gift list", "Y"],
  ];
  return (
    <div className="absolute left-1/2 top-[11%] w-[58%] -translate-x-1/2">
      <span className="absolute -left-[4px] top-[30%] h-5 w-[3px] rounded-l bg-[#3a4950]" />
      <span className="absolute -left-[4px] top-[42%] h-10 w-[3px] rounded-l bg-[#3a4950]" />
      <span className="absolute -right-[4px] top-[40%] h-16 w-[3px] rounded-r bg-[#3a4950]" />
      <div className="h-[420px] rounded-t-[38px] border-[6px] border-b-0 border-[#2a363c] bg-[#0e1417] px-4 pt-3 text-paper/85">
        <div style={rise(0.23)} className="flex items-center justify-between text-[10px] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-6 rounded-full bg-black px-2.5 py-1 text-[8px] text-paper">
            <Blink className="h-1.5 w-1.5 bg-gold" />
            MIRA
          </span>
          <span className="h-2 w-3.5 rounded-sm bg-paper/80" />
        </div>
        <p style={rise(0.31)} className="mt-5 text-[9px] text-paper/45">
          Tuesday, Oct 14
        </p>
        <p style={rise(0.37)} className="mt-1 font-heading text-[15px] font-semibold text-mist">
          Marcus Webb
        </p>
        <div style={rise(0.42)} className="mt-1.5 flex items-center gap-2">
          <Avatar i="MW" />
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[8px] font-semibold text-gold">
            Major-gift flag
          </span>
        </div>
        <p style={rise(0.48)} className="mt-3 text-[9.5px] leading-[1.45]">
          Has given after every gala for three years and now volunteers monthly. Ask before November 1.
        </p>
        <p style={rise(0.52)} className="mt-1.5 text-[9px] font-semibold text-gold">
          Suggested ask $10,000 · confidence high
        </p>
        <p style={rise(0.56)} className="mt-3 text-[8px] font-medium tracking-wider text-paper/40">
          SIGNALS
        </p>
        <ul style={rise(0.61)} className="mt-1.5 space-y-1.5 text-[9px]">
          {[
            ["Gala tickets, three years running", engineHex["Growth Engine"]],
            ["A monthly gift already in place", engineHex["Revenue Engine"]],
            ["Saturday shifts every month", engineHex["Execution Engine"]],
          ].map(([t, c]) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full" style={{ background: c }} />
              {t}
            </li>
          ))}
        </ul>
        <p style={rise(0.67)} className="mt-3 text-[8px] font-medium tracking-wider text-paper/40">
          NEXT STEPS
        </p>
        <ul style={rise(0.73)} className="mt-1 space-y-1 text-[9px]">
          {steps.map(([t, who], n) => {
            const ok = done.includes(n);
            return (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => setDone((d) => (ok ? d.filter((x) => x !== n) : [...d, n]))}
                  aria-pressed={ok}
                  className="flex w-full items-center gap-2 rounded-md bg-white/[.04] px-1.5 py-1.5 text-left"
                >
                  <span
                    className={`grid h-2.5 w-2.5 place-items-center rounded-[3px] border ${ok ? "border-gold bg-gold" : "border-paper/40"}`}
                  >
                    {ok && <Check className="h-2 w-2 text-ink" strokeWidth={4} aria-hidden />}
                  </span>
                  <span className={`flex-1 ${ok ? "text-paper/40 line-through" : ""}`}>{t}</span>
                  <Avatar i={who} size={12} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
