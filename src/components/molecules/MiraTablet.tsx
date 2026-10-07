"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Avatar, prog, rise } from "@/components/molecules/MiraDevices";

// Tablet illustration for the AI layer cards (see MiraDevices for the laptop and phone)

function Msg({
  who,
  name,
  time,
  children,
  hl = false,
}: {
  who: string;
  name: string;
  time: string;
  children: ReactNode;
  hl?: boolean;
}) {
  return (
    <div
      className="flex gap-2 px-5 py-1.5"
      style={hl ? { background: `rgba(242, 167, 61, calc(0.14 * ${prog(0.62)}))` } : undefined}
    >
      <Avatar i={who} />
      <div>
        <p className="text-[8px]">
          <b className="font-semibold text-paper">{name}</b> <span className="text-paper/40">{time}</span>
        </p>
        <p>{children}</p>
      </div>
    </div>
  );
}

// 3. Tablet: an "Ask MIRA" thread that weighs the appeal against staffing, with a comment that types itself
export function Tablet({ on }: { on: boolean }) {
  const reduce = useReducedMotion();
  const typed = "Looping in Dana";
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) {
      const id = setTimeout(() => setN(0), 0);
      return () => clearTimeout(id);
    }
    if (reduce) {
      const id = setTimeout(() => setN(typed.length), 0);
      return () => clearTimeout(id);
    }
    let i = 0;
    let id = setTimeout(function step() {
      setN(++i);
      if (i < typed.length) id = setTimeout(step, 70);
    }, 1700);
    return () => clearTimeout(id);
  }, [on, reduce]);

  return (
    <>
      <div className="absolute left-[8%] top-[13%] w-[120%]">
        <span className="absolute left-[7%] -top-[4px] h-[3px] w-10 rounded-t bg-[#3a4950]" />
        <span className="absolute -left-[4px] top-[14%] h-8 w-[3px] rounded-l bg-[#3a4950]" />
        <div className="h-[380px] rounded-tl-[28px] border-[6px] border-b-0 border-r-0 border-[#2a363c] bg-[#0e1417] text-paper/80">
          <div style={rise(0.23)} className="border-b border-paper/10 px-5 pb-2.5 pt-4">
            <p className="text-[11px] font-semibold text-mist">Ask MIRA · spring check-in</p>
            <p className="text-[8px] text-paper/40">Reading Revenue + Execution engines</p>
          </div>
          <div style={rise(0.34)} className="pt-2 text-[9px]">
            <Msg who="Y" name="You" time="09:12">
              How is the spring appeal pacing?
            </Msg>
            <Msg who="M" name="MIRA" time="09:12">
              22% ahead of plan across every channel.
            </Msg>
            <Msg who="M" name="MIRA" time="09:12" hl>
              But Saturday program shifts are 40% unstaffed for the same weeks.
            </Msg>
            <Msg who="Y" name="You" time="09:14">
              Who can cover them?
            </Msg>
          </div>
        </div>
      </div>
      <div
        className="absolute left-[26%] top-[62%] w-[64%] rounded-xl border border-paper/15 bg-[#1b262b] p-2.5 text-paper/85 shadow-2xl"
        style={{
          opacity: prog(0.74),
          transform: `translateY(calc((1 - ${prog(0.74)}) * 10px)) scale(calc(0.96 + 0.04 * ${prog(0.74)}))`,
        }}
      >
        <div className="flex gap-2">
          <Avatar i="Y" />
          <div className="text-[9px] leading-snug">
            <p className="text-[8px]">
              <b className="font-semibold text-paper">You</b> <span className="text-paper/40">just now</span>
            </p>
            <p>Let&rsquo;s staff the shifts before we push the appeal harder.</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-lg bg-[#0e1417] py-1.5 pl-2.5 pr-1.5 text-[9px]">
          <span>
            {typed.slice(0, n)}
            <span className="ml-px inline-block h-[1em] w-px animate-pulse bg-gold align-[-2px]" />
          </span>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-gold text-ink">
            <svg
              className="h-2.5 w-2.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
