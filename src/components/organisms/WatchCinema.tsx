"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Play } from "lucide-react";
import { PillButton } from "@/components/atoms/ui";
import { OVERVIEW_SRC, clips } from "@/components/organisms/WatchShowcase";

// Engines page v2 (light section): "See it in action" as a holographic cinema. The screen hangs tilted back under a projector
// beam and swings upright as it scrolls into view; a film strip below picks the clip. Same clips as WatchShowcase
// (the three short clips play the overview until their own files exist).
export default function WatchCinema() {
  const section = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [pick, setPick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const clip = clips[pick];
  const Icon = clip.icon;

  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.82, 1]);
  const beam = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  // Start as soon as the video replaces the cover; fall back to muted if sound is blocked
  useEffect(() => {
    const v = video.current;
    if (!playing || !v) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [playing, pick]);

  const choose = (i: number) => {
    setPick(i);
    setPlaying(false);
    screen.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    // Full-width light grey section, like the home page's second section; the screen stays dark as the focus
    <section ref={section} className="relative isolate overflow-hidden bg-mist py-24 lg:py-32">
      <div className="relative">
        <div className="mx-auto max-w-[1340px] px-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="eyebrow">See it in action</span>
              <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
                Two minutes is enough to see the <span className="text-gold">difference</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-ink/70">
                Watch one gift move through the Growth, Relationship, and Revenue engines &mdash; without a single
                export.
              </p>
            </div>
            <PillButton href="/demo">Book a demo</PillButton>
          </div>

          {/* The theatre */}
          <div className="relative mt-16 [perspective:1400px]">
            {/* Projector beam from above, in the clip's colour */}
            <motion.div
              aria-hidden
              style={{ opacity: beam, background: `linear-gradient(180deg, ${clip.hex}55, transparent 85%)` }}
              className="pointer-events-none absolute -top-24 left-1/2 h-[70%] w-[90%] -translate-x-1/2 blur-2xl [clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)]"
            />
            <motion.div
              ref={screen}
              style={{ rotateX, scale, transformOrigin: "50% 100%" }}
              className="relative mx-auto max-w-5xl"
            >
              <div
                className="angle relative aspect-video overflow-hidden bg-black shadow-[0_60px_120px_-40px_rgba(36,47,53,0.7)]"
                style={{ boxShadow: `0 0 0 1px ${clip.hex}55, 0 0 80px ${clip.hex}33` }}
              >
                {playing ? (
                  <video
                    key={pick}
                    ref={video}
                    src={clip.src ?? OVERVIEW_SRC}
                    poster={clip.poster}
                    controls
                    playsInline
                    preload="auto"
                    className="h-full w-full bg-black object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play: ${clip.label} (${clip.duration})`}
                    className="group absolute inset-0 block"
                  >
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={pick}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={
                          clip.poster
                            ? undefined
                            : {
                                background: `radial-gradient(120% 100% at 80% 0%, ${clip.hex}55, transparent 60%), linear-gradient(160deg, #2c3a41, #1b2429)`,
                              }
                        }
                      >
                        {clip.poster ? (
                          <Image
                            src={clip.poster}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 1024px, 100vw"
                            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                          />
                        ) : (
                          <Icon
                            className="absolute right-[8%] top-[12%] h-1/3 w-1/3 opacity-20"
                            style={{ color: clip.hex }}
                            strokeWidth={1}
                            aria-hidden
                          />
                        )}
                      </motion.span>
                    </AnimatePresence>
                    {/* Scanlines for the hologram feel */}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_4px)]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                    />
                    {/* Play button with pulsing rings */}
                    <span className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center">
                      {!reduce &&
                        [0, 1].map((r) => (
                          <motion.span
                            key={r}
                            className="absolute inset-0 rounded-full border-2"
                            style={{ borderColor: clip.hex }}
                            animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: r * 1.1, ease: "easeOut" }}
                          />
                        ))}
                      <span
                        className="grid h-20 w-20 place-items-center rounded-full text-ink transition-transform duration-300 group-hover:scale-110"
                        style={{ background: clip.hex }}
                      >
                        <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
                      </span>
                    </span>
                    <span className="absolute bottom-6 left-6 right-6 text-left sm:bottom-8 sm:left-8">
                      <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: clip.hex }}>
                        {clip.title} · {clip.duration}
                      </span>
                      <span className="mt-2 block text-2xl font-extrabold tracking-tight text-mist sm:text-3xl">
                        {clip.label}
                      </span>
                      <span className="mt-2 hidden max-w-xl text-sm leading-6 text-paper/70 sm:block">{clip.body}</span>
                    </span>
                  </button>
                )}
              </div>
              {/* Light pooling on the floor under the screen */}
              <div
                aria-hidden
                className="mx-auto -mt-2 h-16 w-3/4 rounded-[50%] blur-2xl"
                style={{ background: `${clip.hex}33` }}
              />
            </motion.div>
          </div>

          {/* Film strip */}
          <ol className="relative mt-8 grid gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Sprocket holes along both edges */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-4 top-1 h-1.5 [background:radial-gradient(circle,rgba(36,47,53,0.15)_2px,transparent_2.5px)_0_0/18px_6px_repeat-x]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-4 bottom-1 h-1.5 [background:radial-gradient(circle,rgba(36,47,53,0.15)_2px,transparent_2.5px)_0_0/18px_6px_repeat-x]"
            />
            {clips.map((c, i) => {
              const on = i === pick;
              const CIcon = c.icon;
              return (
                <li key={c.label}>
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    aria-pressed={on}
                    className={`group relative flex h-full w-full items-center gap-4 rounded-xl p-4 text-left transition-colors duration-300 ${on ? "bg-mist" : "hover:bg-mist/60"}`}
                    style={on ? { boxShadow: `inset 0 0 0 1px ${c.hex}88` } : undefined}
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${c.hex}22`, color: c.hex }}
                    >
                      <CIcon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">
                        {c.title} · {c.duration}
                      </span>
                      <span
                        className={`mt-1 block truncate text-sm font-semibold transition-colors ${on ? "text-ink" : "text-ink/70"}`}
                      >
                        {c.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
