"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { engineHex } from "@/components/organisms/EngineShowcase";
import { engines, type Engine } from "@/components/organisms/GrowthEngine";

// The 3D pieces of EngineWarp's flight: one gate per engine and the core they lead to
export const GAP = 1500; // px of depth between gates
const AHEAD = 700; // how far ahead of the camera the current gate sits when its story is told
const STAGES = engines.length + 1;

// Depth of a thing placed at `slot` (1-4 gates, 5 the core) for camera position `s` (0-5)
const depthAt = (slot: number, s: number) => -slot * GAP + s * GAP - AHEAD;

// One engine as a giant glowing gate: rings turn as you fly, the number and icon float in the middle
export function Gate({ e, slot, s, still }: { e: Engine; slot: number; s: MotionValue<number>; still: boolean }) {
  const hex = engineHex[e.name];
  const Icon = e.icon;
  const z = useTransform(s, (v) => depthAt(slot, v));
  const opacity = useTransform(z, [-6000, -3000, -380, -60], [0, 1, 1, 0]);
  const turn = useTransform(s, (v) => (still ? 0 : v * 40 * (slot % 2 ? 1 : -1)));
  const counter = useTransform(turn, (t) => -t * 1.6);

  return (
    <motion.div
      style={{ z, opacity, x: "-50%", y: "-50%" }}
      className="absolute left-1/2 top-1/2 aspect-square w-[min(92vmin,880px)]"
    >
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: hex, boxShadow: `0 0 90px ${hex}66, inset 0 0 90px ${hex}33` }}
      />
      <motion.div
        style={{ rotate: turn, borderColor: `${hex}99` }}
        className="absolute inset-[7%] rounded-full border border-dashed"
      />
      <motion.div style={{ rotate: counter }} className="absolute inset-[16%] rounded-full">
        {/* Twelve tick marks around the inner ring */}
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 h-[6%] w-[3px] -translate-x-1/2 rounded-full"
            style={{ background: hex, transformOrigin: "50% 833%", rotate: `${i * 30}deg`, opacity: 0.7 }}
          />
        ))}
      </motion.div>
      <span
        className="absolute left-1/2 top-0 grid h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30%] text-ink"
        style={{ background: hex, boxShadow: `0 0 60px ${hex}` }}
      >
        <Icon className="h-1/2 w-1/2" strokeWidth={1.5} aria-hidden />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 grid place-items-center font-heading text-[min(26vmin,250px)] font-extrabold leading-none text-transparent"
        style={{ WebkitTextStroke: `2px ${hex}55` }}
      >
        {e.n}
      </span>
    </motion.div>
  );
}

// One engine's orbit around the core, tilted and turning with the flight
function Orbit({ hex, i, spin }: { hex: string; i: number; spin: MotionValue<number> }) {
  const rotateZ = useTransform(spin, (r) => r * (i % 2 ? 1 : -1) + i * 45);
  return (
    <motion.span
      className="absolute inset-0 rounded-full border"
      style={{ borderColor: `${hex}aa`, rotateX: 70, rotateZ, scale: 1 - i * 0.12 }}
    />
  );
}

// The end of the flight: a gold core with the four engines' orbits around it
export function Core({ s, still }: { s: MotionValue<number>; still: boolean }) {
  const z = useTransform(s, (v) => depthAt(STAGES, v));
  const opacity = useTransform(z, [-8000, -3000, -300], [0, 1, 1]);
  const spin = useTransform(s, (v) => (still ? 0 : v * 25));
  return (
    <motion.div
      style={{ z, opacity, x: "-50%", y: "-50%" }}
      className="absolute left-1/2 top-1/2 aspect-square w-[min(70vmin,640px)]"
    >
      {engines.map((e, i) => (
        <Orbit key={e.name} hex={engineHex[e.name]} i={i} spin={spin} />
      ))}
      <span className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffe2ad,#f2a73d_45%,#9a5a10)] shadow-[0_0_120px_rgba(242,167,61,0.9)]" />
    </motion.div>
  );
}

