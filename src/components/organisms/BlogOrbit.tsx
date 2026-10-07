"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Arrow } from "@/components/atoms/ui";
import Starfield from "@/components/atoms/Starfield";
import BlogIntro from "@/components/molecules/BlogIntro";
import { AUTHOR, formatDate, postHref, posts, type Post } from "@/components/molecules/blogData";

const ease = [0.16, 1, 0.3, 1] as const;
const featured = posts.filter((p) => p.featured);
const n = featured.length;
const STEP = 360 / n;
const DRIFT = 0.006; // degrees per millisecond: one lap a minute
const pad = (v: number) => String(v).padStart(2, "0");
const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180; // to (-180, 180]
// Rounded so the server-rendered positions match the browser's exactly (no hydration mismatch)
const r2 = (v: number) => Math.round(v * 100) / 100;

type Orbit = { rx: number; ry: number; card: number };

// One planet: its place on the ellipse comes from the shared rotation. Front (bottom of the ellipse) is big,
// sharp and above the core; the far side is small, dim, blurred and passes behind it.
function Planet({ post, i, rot, orbit, onPick }: { post: Post; i: number; rot: MotionValue<number>; orbit: Orbit; onPick: () => void }) {
  const angle = useTransform(rot, (r) => ((r + i * STEP + 90) * Math.PI) / 180);
  const depth = useTransform(angle, (a) => r2((Math.sin(a) + 1) / 2)); // 0 far, 1 near
  const x = useTransform(angle, (a) => r2(Math.cos(a) * orbit.rx));
  const y = useTransform(angle, (a) => r2(Math.sin(a) * orbit.ry));
  const scale = useTransform(depth, (d) => r2(0.45 + d * 0.65));
  const opacity = useTransform(depth, (d) => r2(0.3 + d * 0.7));
  const zIndex = useTransform(depth, (d) => Math.round(d * 100));
  const filter = useTransform(depth, (d) => `blur(${((1 - d) * 3).toFixed(2)}px)`);
  const glow = useTransform(depth, [0.9, 1], [0, 1]);

  return (
    <motion.button
      type="button"
      onClick={onPick}
      aria-label={`Bring "${post.title}" to the front`}
      style={{ x, y, scale, opacity, zIndex, filter, width: orbit.card, marginLeft: -orbit.card / 2, marginTop: (-orbit.card * 0.75) / 2 }}
      className="absolute left-1/2 top-1/2 block aspect-[4/3] will-change-transform"
    >
      <span className="angle-sm relative block h-full w-full overflow-hidden bg-[#141c20] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
        <Image src={post.image} alt="" fill draggable={false} sizes="280px" className="object-cover" />
        <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-paper/15" />
        <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-paper backdrop-blur">{pad(i + 1)}</span>
      </span>
      {/* Gold halo once the planet reaches the front */}
      <motion.span aria-hidden style={{ opacity: glow }} className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] bg-gold/25 blur-xl" />
    </motion.button>
  );
}

// Version 3 of the blog spotlight (see /blog-3): the featured posts orbit a glowing core in a field of stars.
// The orbit drifts on its own (paused while the pointer is over it); drag to spin it, click a planet to bring it
// forward. The story at the front is told underneath, never over its cover.
export default function BlogOrbit() {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const rot = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [orbit, setOrbit] = useState<Orbit>({ rx: 480, ry: 140, card: 240 });
  const hold = useRef({ hover: false, drag: false, flying: false });
  const post = featured[active];

  // Orbit size follows the stage width
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      const rx = Math.min(w * 0.4, 520);
      setOrbit({ rx, ry: Math.max(rx * 0.3, 60), card: Math.max(130, Math.min(w * 0.22, 280)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slow drift
  useAnimationFrame((_, delta) => {
    const h = hold.current;
    if (reduce || h.hover || h.drag || h.flying) return;
    rot.set(rot.get() - delta * DRIFT);
  });

  // Whichever planet is nearest the front is the story we tell
  useMotionValueEvent(rot, "change", (r) => {
    const i = (((Math.round(-r / STEP) % n) + n) % n);
    setActive((a) => (a === i ? a : i));
  });

  const bringToFront = (i: number) => {
    const target = rot.get() - wrap(rot.get() + i * STEP);
    hold.current.flying = true;
    animate(rot, target, {
      ...(reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 18 }),
      onComplete: () => (hold.current.flying = false),
    });
  };

  return (
    <section className="relative isolate m-3 overflow-hidden rounded-3xl bg-[#11181c]">
      <Starfield />
      {/* Nebula washes in the brand colours */}
      <span aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[140px]" />
      <span aria-hidden className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[140px]" />

      <div className="relative -mx-3">
        <div className="mx-auto max-w-[1340px] px-6 pb-16 pt-32 sm:px-8 lg:pb-20 lg:pt-40">
          <BlogIntro note={`${n} in orbit`} />

          {/* The orbit */}
          <motion.div
            ref={stage}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
            onMouseEnter={() => (hold.current.hover = true)}
            onMouseLeave={() => (hold.current.hover = false)}
            onPanStart={() => (hold.current.drag = true)}
            onPan={(_, info) => rot.set(rot.get() + info.delta.x * 0.3)}
            onPanEnd={() => {
              hold.current.drag = false;
              bringToFront(active);
            }}
            className="relative mt-6 h-[380px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[500px] lg:h-[560px]"
          >
            {/* Orbit path */}
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <ellipse cx="50%" cy="50%" rx={orbit.rx} ry={orbit.ry} fill="none" stroke="rgba(226,238,238,0.14)" strokeDasharray="2 8" />
              <ellipse cx="50%" cy="50%" rx={orbit.rx * 1.18} ry={orbit.ry * 1.18} fill="none" stroke="rgba(79,179,204,0.08)" />
            </svg>

            {/* Core: sits between the far and near halves of the orbit */}
            <div aria-hidden className="absolute left-1/2 top-1/2 z-50 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center sm:h-36 sm:w-36">
              {!reduce &&
                [0, 1, 2].map((r) => (
                  <motion.span
                    key={r}
                    className="absolute inset-0 rounded-full border border-gold/40"
                    animate={{ scale: [0.6, 1.8], opacity: [0.7, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: r * 1.33, ease: "easeOut" }}
                  />
                ))}
              <span className="absolute inset-0 rounded-full bg-gold/30 blur-2xl" />
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffd896,#f2a73d_45%,#b8701a)] shadow-[0_0_60px_rgba(242,167,61,0.8)] sm:h-20 sm:w-20">
                <span className="font-heading text-xl font-extrabold text-ink sm:text-2xl">{pad(active + 1)}</span>
              </span>
            </div>

            {featured.map((p, i) => (
              <Planet key={p.slug} post={p} i={i} rot={rot} orbit={orbit} onPick={() => bringToFront(i)} />
            ))}
          </motion.div>

          {/* The story at the front */}
          <div className="relative z-10 mx-auto mt-4 max-w-3xl text-center">
            <div className="grid">
              <AnimatePresence initial={false}>
                <motion.div
                  key={post.slug}
                  className="[grid-area:1/1]"
                  initial={{ opacity: 0, y: reduce ? 0 : 20, filter: reduce ? "none" : "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } }}
                  exit={{ opacity: 0, y: reduce ? 0 : -12, filter: reduce ? "none" : "blur(6px)", transition: { duration: 0.25 } }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-soft">{post.category}</p>
                  <h2 className="mt-3 line-clamp-2 h-[2.3em] text-3xl font-extrabold leading-[1.15] tracking-tight text-mist sm:text-4xl">
                    <a href={postHref(post.slug)} className="transition-colors hover:text-gold">{post.title}</a>
                  </h2>
                  <p className="mx-auto mt-4 line-clamp-3 h-[5.25rem] max-w-2xl text-base leading-7 text-paper/65">{post.excerpt}</p>
                  <p className="mt-5 text-sm text-paper/55">
                    {AUTHOR} <span className="mx-2 text-paper/25">/</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time> <span className="mx-2 text-paper/25">/</span>
                    {post.readMins} min read
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button type="button" onClick={() => bringToFront((active - 1 + n) % n)} aria-label="Previous story" className="grid h-12 w-12 place-items-center rounded-full text-paper ring-1 ring-inset ring-paper/20 transition-colors duration-300 hover:bg-paper hover:text-ink">
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
              <a href={postHref(post.slug)} className="group inline-flex items-center gap-6 rounded-full bg-gold py-2 pl-7 pr-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-paper">
                Read the story
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
                  <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </a>
              <button type="button" onClick={() => bringToFront((active + 1) % n)} aria-label="Next story" className="grid h-12 w-12 place-items-center rounded-full text-paper ring-1 ring-inset ring-paper/20 transition-colors duration-300 hover:bg-paper hover:text-ink">
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <p className="mt-6 text-xs text-paper/35 [@media(pointer:coarse)]:hidden">Drag to spin the orbit · click a story to bring it forward</p>
          </div>
        </div>
      </div>
    </section>
  );
}
