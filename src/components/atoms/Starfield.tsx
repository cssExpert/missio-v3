"use client";

import { useEffect, useRef } from "react";

// Twinkling star canvas that fills its parent. Stars sit at three depths and drift against the mouse
// (nearer ones more), so the field reads as deep space. Static for reduced-motion users.
export default function Starfield({ count = 180, className = "" }: { count?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      depth: [0.3, 0.6, 1][Math.floor(Math.random() * 3)],
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.6,
      gold: Math.random() < 0.08,
    }));
    let w = 0;
    let h = 0;
    let mx = 0;
    let my = 0;
    let frame = 0;

    const size = () => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = still ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(t / 1000 * s.speed + s.phase));
        const x = s.x * w + mx * 24 * s.depth;
        const y = s.y * h + my * 24 * s.depth;
        ctx.globalAlpha = twinkle * (0.35 + s.depth * 0.6);
        ctx.fillStyle = s.gold ? "#f2a73d" : "#e2eeee";
        ctx.beginPath();
        ctx.arc(x, y, s.depth * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!still) frame = requestAnimationFrame(draw);
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };

    size();
    frame = requestAnimationFrame(draw);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [count]);

  return <canvas ref={canvas} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
