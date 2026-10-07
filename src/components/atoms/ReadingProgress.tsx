"use client";

import { useEffect, useRef } from "react";

// Gold bar across the top of the window that fills as the reader moves through the element with `targetId`
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = document.getElementById(targetId);
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const progress = Math.min(Math.max(-r.top + window.innerHeight * 0.4, 0) / (total || 1), 1);
      bar.current.style.transform = `scaleX(${progress})`;
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
  }, [targetId]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
      <span ref={bar} className="block h-full origin-left scale-x-0 bg-gold shadow-[0_0_12px_rgba(242,167,61,0.7)]" />
    </div>
  );
}
