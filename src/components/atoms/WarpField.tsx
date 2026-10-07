"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

// Stars flying out of the centre of the canvas. They drift slowly at rest and stretch into warp streaks
// while `speed` is high (pass a MotionValue fed from scroll velocity). `tint` colours a share of the streaks.
// Static dots for reduced-motion users.
export default function WarpField({ speed, tint = "#4fb3cc", count = 260 }: { speed: MotionValue<number>; tint?: string; count?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tintRef = useRef(tint);
  useEffect(() => {
    tintRef.current = tint;
  }, [tint]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const DEPTH = 1600;
    const spawn = (z = Math.random() * DEPTH) => ({
      x: (Math.random() - 0.5) * 2400,
      y: (Math.random() - 0.5) * 2400,
      z,
      tinted: Math.random() < 0.25,
    });
    const stars = Array.from({ length: count }, () => spawn());
    let w = 0;
    let h = 0;
    let frame = 0;
    let warp = 0;

    const size = () => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const project = (x: number, y: number, z: number) => {
      const f = Math.min(w, h) * 0.9;
      return [w / 2 + (x / z) * f, h / 2 + (y / z) * f];
    };

    const draw = () => {
      // Ease towards the target so streaks grow and fade smoothly
      warp += (Math.min(Math.abs(speed.get()), 60) - warp) * 0.08;
      const step = still ? 0 : 2 + warp * 3;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of stars) {
        const prevZ = s.z + step * (1 + warp * 0.25);
        s.z -= step;
        if (s.z < 1) Object.assign(s, spawn(DEPTH));
        const [x, y] = project(s.x, s.y, s.z);
        const [px, py] = project(s.x, s.y, Math.min(prevZ, DEPTH));
        if (x < -50 || x > w + 50 || y < -50 || y > h + 50) {
          Object.assign(s, spawn(DEPTH));
          continue;
        }
        const near = 1 - s.z / DEPTH;
        ctx.globalAlpha = Math.min(1, near * 1.4);
        ctx.strokeStyle = s.tinted ? tintRef.current : "#e2eeee";
        ctx.lineWidth = 0.6 + near * 1.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x + 0.01, y);
        ctx.stroke();
      }
      if (!still) frame = requestAnimationFrame(draw);
    };

    size();
    draw();
    const ro = new ResizeObserver(() => {
      size();
      if (still) draw();
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [count, speed]);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
