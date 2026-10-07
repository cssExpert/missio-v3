"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

// Number that rolls from its last value to the new one whenever `value` changes (CountUp only counts once, on view)
export default function Ticker({ value, prefix = "", className = "" }: { value: number; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = last.current;
    last.current = value;
    if (reduce || from === value) {
      el.textContent = prefix + format(value);
      return;
    }
    const controls = animate(from, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = prefix + format(v)),
    });
    return () => controls.stop();
  }, [value, prefix, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix + format(value)}
    </span>
  );
}
