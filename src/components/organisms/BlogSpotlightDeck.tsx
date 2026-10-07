"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Arrow } from "@/components/atoms/ui";
import CutEdge from "@/components/atoms/CutEdge";
import BlogIntro from "@/components/molecules/BlogIntro";
import { AUTHOR, formatDate, postHref, posts } from "@/components/molecules/blogData";

const ease = [0.16, 1, 0.3, 1] as const;
const SECONDS = 7;
const featured = posts.filter((p) => p.featured);
const n = featured.length;
const pad = (v: number) => String(v).padStart(2, "0");

// Where each card sits by its place in the deck: 0 is the front, the next two fan out behind it,
// the rest wait hidden, and the card just played is tossed off to the left
function pose(place: number) {
  if (place === 0) return { x: "0%", y: 0, rotate: 0, scale: 1, opacity: 1 };
  if (place === 1) return { x: "6%", y: -18, rotate: 4, scale: 0.94, opacity: 1 };
  if (place === 2) return { x: "11%", y: -34, rotate: 8, scale: 0.88, opacity: 0.85 };
  if (place === n - 1) return { x: "-70%", y: 20, rotate: -14, scale: 0.9, opacity: 0 };
  return { x: "14%", y: -46, rotate: 11, scale: 0.84, opacity: 0 };
}

// Version 2 of the blog spotlight (see /blog-2): the featured covers as a shuffling deck of cards.
// The story's text sits beside the deck, never over a cover. Auto-advances, pauses on hover; drag the top card to flip.
export default function BlogSpotlightDeck() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragged = useRef(false);
  const post = featured[active];
  const go = (step: number) => setActive((a) => (a + step + n) % n);

  return (
    <section className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink">
      {!reduce && (
        <>
          <motion.span aria-hidden className="pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-primary/30 blur-[120px]" animate={{ x: [0, 70, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
          <motion.span aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-[380px] w-[380px] rounded-full bg-gold/15 blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        </>
      )}

      <div className="relative -mx-3">
        <div className="mx-auto max-w-[1340px] px-6 pb-16 pt-32 sm:px-8 lg:pb-20 lg:pt-40">
          <BlogIntro />

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mt-14 grid items-center gap-12 border-t border-paper/10 pt-14 lg:mt-16 lg:grid-cols-[5fr_6fr] lg:gap-16"
          >
            {/* The story */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.18em]">
                <span className="rounded-full bg-gold px-3 py-1 text-ink">Featured</span>
                <span className="font-mono font-normal text-paper/45">{pad(active + 1)} / {pad(n)}</span>
              </div>

              <div className="mt-8 grid">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={post.slug}
                    className="[grid-area:1/1]"
                    initial={{ opacity: 0, y: reduce ? 0 : 30, filter: reduce ? "none" : "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } }}
                    exit={{ opacity: 0, y: reduce ? 0 : -20, filter: reduce ? "none" : "blur(6px)", transition: { duration: 0.3 } }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-soft">{post.category}</p>
                    <h2 className="mt-3 line-clamp-2 h-[2.3em] text-3xl font-extrabold leading-[1.15] tracking-tight text-mist sm:text-4xl">
                      <a href={postHref(post.slug)} className="transition-colors hover:text-gold">{post.title}</a>
                    </h2>
                    <p className="mt-4 line-clamp-3 h-[5.25rem] text-base leading-7 text-paper/70">{post.excerpt}</p>
                    <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-paper/60">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-white">{AUTHOR[0]}</span>
                      <span className="font-semibold text-paper">{AUTHOR}</span>
                      <span aria-hidden className="text-paper/30">/</span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden className="text-paper/30">/</span>
                      <span>{post.readMins} min read</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a
                  href={postHref(post.slug)}
                  className="group inline-flex items-center gap-6 rounded-full bg-gold py-2 pl-7 pr-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-paper"
                >
                  Read the story
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
                    <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
                  </span>
                </a>
                <div className="flex gap-2">
                  {[
                    { step: -1, label: "Previous story", Icon: ArrowLeft },
                    { step: 1, label: "Next story", Icon: ArrowRight },
                  ].map(({ step, label, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => go(step)}
                      aria-label={label}
                      className="grid h-12 w-12 place-items-center rounded-full text-paper ring-1 ring-inset ring-paper/20 transition-colors duration-300 hover:bg-paper hover:text-ink"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </button>
                  ))}
                </div>
              </div>

              {/* One segment per story: done ones stay lit, the current one fills, then the deck moves on */}
              <div className="mt-10 flex gap-1.5" role="group" aria-label="Featured stories">
                {featured.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show story ${i + 1}: ${p.title}`}
                    aria-current={i === active ? "true" : undefined}
                    className="group relative h-6 flex-1"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-paper/15 transition-colors group-hover:bg-paper/30">
                      {i < active && <span className="absolute inset-0 bg-gold/50" />}
                      {i === active && (
                        <span
                          key={active}
                          onAnimationEnd={() => go(1)}
                          className="absolute inset-0 origin-left bg-gold"
                          style={reduce ? undefined : { animation: `obstacle-progress ${SECONDS}s linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 truncate text-xs text-paper/45">
                <span className="font-bold uppercase tracking-[0.18em] text-paper/60">Up next</span>
                <span className="mx-2 text-paper/25">/</span>
                {featured[(active + 1) % n].title}
              </p>
            </div>

            {/* The deck */}
            <div className="order-1 px-2 pt-12 sm:px-10 lg:order-2 lg:pr-16">
              <div className="relative aspect-[4/3]">
                {featured.map((p, i) => {
                  const place = (i - active + n) % n;
                  const front = place === 0;
                  return (
                    <motion.a
                      key={p.slug}
                      href={postHref(p.slug)}
                      tabIndex={front ? 0 : -1}
                      aria-hidden={!front}
                      aria-label={front ? `Read ${p.title}` : undefined}
                      initial={false}
                      animate={pose(place)}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 26 }}
                      style={{ zIndex: n - place }}
                      drag={front && !reduce ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.7}
                      onDragStart={() => (dragged.current = true)}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -80) go(1);
                        else if (info.offset.x > 80) go(-1);
                        setTimeout(() => (dragged.current = false), 0);
                      }}
                      onClick={(e) => dragged.current && e.preventDefault()}
                      className={`angle absolute inset-0 block overflow-hidden bg-[#141c20] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ${front ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
                    >
                      <Image src={p.image} alt="" fill draggable={false} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                      {/* Cards behind the front one are dimmed so the stack reads as depth */}
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 bg-ink"
                        initial={false}
                        animate={{ opacity: front ? 0 : 0.45 }}
                        transition={{ duration: 0.5 }}
                      />
                      <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-paper/15" />
                      <CutEdge className="bg-paper/15" />
                      <span className="absolute bottom-4 left-4 rounded-full bg-ink/80 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-paper backdrop-blur">
                        {pad(i + 1)}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
              <p className="mt-6 text-center text-xs text-paper/40 [@media(pointer:coarse)]:hidden">Drag the card to flip through</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
