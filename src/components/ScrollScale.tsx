"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { from?: number; to?: number; className?: string; children: ReactNode };

// Scales its content from `from` down to `to` as it travels up through the viewport
export default function ScrollScale({ from = 1.1, to = 1, className = "", children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
      // 0 when the frame's top enters the bottom of the screen, 1 when its bottom reaches the top
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      el.style.transform = `scale(${from + (to - from) * progress})`;
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
  }, [from, to]);

  return (
    <div ref={ref} className={`h-full w-full origin-center will-change-transform ${className}`}>
      {children}
    </div>
  );
}
