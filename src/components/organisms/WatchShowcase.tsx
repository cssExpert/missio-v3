"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { BriefcaseBusiness, Globe, LayoutGrid, Play, Sparkles, type LucideIcon } from "lucide-react";
import { PillButton } from "@/components/atoms/ui";

// "See it in action" from missio.io/engines. The overview video (~195MB) streams from missio.io and only
// loads once someone presses play; the poster is a local copy.
// TODO: missio.io lists the other three clips but has no video files for them yet, so they play the
// overview until their own `src` is added here.
const OVERVIEW_SRC = "https://adminv2.missio.io/storage/page-images/magic-editor/1790253048.Missio-Nonprofit-Outreach.mp4";
type Clip = { label: string; duration: string; title: string; body: string; icon: LucideIcon; hex: string; src?: string; poster?: string };
const clips: Clip[] = [
  {
    label: "Missio platform overview",
    duration: "1:36",
    title: "The whole platform",
    body: "Watch one gift move through the Growth, Relationship, and Revenue engines — without a single export.",
    icon: LayoutGrid,
    hex: "#f2a73d",
    src: OVERVIEW_SRC,
    poster: "/images/engines/overview-poster.jpg",
  },
  { label: "Running a gala end to end", duration: "1:38", title: "Growth Engine", body: "Tickets, tables, auction and check-in — every guest matched to their donor record.", icon: Globe, hex: "#F28A6B" },
  { label: "Scheduling a week of volunteers", duration: "1:12", title: "Execution Engine", body: "Shifts, waivers, screening and staff coverage in the same place as the giving.", icon: BriefcaseBusiness, hex: "#f2a73d" },
  { label: "What MIRA sees", duration: "1:55", title: "MIRA", body: "Lapse signals and major-gift flags drawn from all four engines at once.", icon: Sparkles, hex: "#4fb3cc" },
];
const clipId = (i: number) => `watch-clip-${i + 1}`;
const ease = [0.16, 1, 0.3, 1] as const;

// One video with its description; reports itself as active while it holds the middle of the screen
function ClipCard({ clip, index, onActive }: { clip: Clip; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { label, duration, title, body, icon: Icon, hex, src = OVERVIEW_SRC, poster } = clip;

  // Start as soon as the video replaces the cover. If the browser refuses playback with sound, play muted.
  useEffect(() => {
    const v = videoRef.current;
    if (!playing || !v) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [playing]);

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <motion.div
      id={clipId(index)}
      ref={ref}
      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      className="scroll-mt-28"
    >
      <div
        className="angle relative aspect-video overflow-hidden bg-black"
        style={poster || playing ? undefined : { background: `radial-gradient(120% 100% at 80% 0%, ${hex}55, transparent 60%), linear-gradient(160deg, #2c3a41, #1b2429)` }}
      >
        {playing ? (
          <video ref={videoRef} src={src} poster={poster} controls playsInline preload="auto" className="h-full w-full bg-black object-cover" />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play: ${label}, ${duration}`} className="group absolute inset-0 block">
            {poster ? (
              <>
                <Image src={poster} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              </>
            ) : (
              <Icon aria-hidden strokeWidth={0.7} className="absolute -bottom-10 -right-6 h-64 w-64 text-paper/[0.06] transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
            )}
            <span className="absolute inset-0 grid place-items-center">
              <span className="relative grid h-20 w-20 place-items-center">
                {!reduce && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.4s]" />}
                <span className="relative grid h-full w-full place-items-center rounded-full bg-gold text-ink shadow-[0_0_60px_rgba(242,167,61,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-current" strokeWidth={0} />
                </span>
              </span>
            </span>
            <span className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold tabular-nums text-paper">{duration}</span>
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-6">
        <span className="text-xs font-bold tracking-[0.2em] text-paper/40">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: hex }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: hex }} />
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-mist">{label}</h3>
          <p className="mt-2 max-w-xl text-base leading-7 text-paper/65">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Dark section: heading and a video index pinned on the left, the videos scrolling on the right
export default function WatchShowcase() {
  const [active, setActive] = useState(0);

  return (
    // overflow-clip, not overflow-hidden, so the left column can stay sticky
    <section id="watch" className="relative isolate m-3 overflow-clip rounded-3xl bg-ink py-24 text-paper lg:py-32">
      <span aria-hidden className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[460px] w-[460px] rounded-full bg-gold/20 blur-[130px]" />
      <span aria-hidden className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[460px] w-[460px] rounded-full bg-primary/30 blur-[130px]" />

      <div className="-mx-3">
        <div className="mx-auto grid max-w-[1340px] gap-14 px-6 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* Left: pinned */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="eyebrow gold">See it in action</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">
              Two minutes is enough to see the <span className="text-gold">difference</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-paper/70">
              Watch one gift move through the Growth, Relationship, and Revenue engines &mdash; without a single export.
            </p>

            {/* Video index: follows the scroll, click to jump */}
            <ol className="mt-10 hidden border-l border-paper/10 lg:block">
              {clips.map((c, i) => {
                const on = i === active;
                return (
                  <li key={c.label}>
                    <a href={`#${clipId(i)}`} aria-current={on ? "true" : undefined} className="group relative flex items-center gap-4 py-3 pl-6">
                      <motion.span
                        aria-hidden
                        className="absolute -left-px top-2 bottom-2 w-0.5 origin-top rounded-full bg-gold"
                        initial={false}
                        animate={{ scaleY: on ? 1 : 0 }}
                        transition={{ duration: 0.4, ease }}
                      />
                      <span className={`text-xs font-bold tabular-nums tracking-[0.2em] transition-colors ${on ? "text-gold" : "text-paper/35"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-base font-bold transition-colors ${on ? "text-paper" : "text-paper/45 group-hover:text-paper/75"}`}>{c.label}</span>
                      <span className={`ml-auto text-xs font-semibold tabular-nums transition-colors ${on ? "text-paper/60" : "text-paper/30"}`}>{c.duration}</span>
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10">
              <PillButton href="/demo">Book a demo</PillButton>
            </div>
          </div>

          {/* Right: scrolling videos */}
          <div className="space-y-16 lg:space-y-24">
            {clips.map((c, i) => (
              <ClipCard key={c.label} clip={c} index={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
