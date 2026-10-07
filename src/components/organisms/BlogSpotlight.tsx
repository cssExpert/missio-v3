"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Arrow } from "@/components/atoms/ui";
import CutEdge from "@/components/atoms/CutEdge";
import BlogIntro from "@/components/molecules/BlogIntro";
import { AUTHOR, formatDate, postHref, posts } from "@/components/molecules/blogData";

const ease = [0.16, 1, 0.3, 1] as const;
const SECONDS = 7; // each featured story stays up this long
const featured = posts.filter((p) => p.featured);
const pad = (n: number) => String(n).padStart(2, "0");

// Blog hero: the featured posts (blogData `featured: true`) take turns in a large photo card with a slow zoom.
// The list on the right shows what's next; a gold bar fills under the active story, pauses on hover, then moves on.
export default function BlogSpotlight() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  // Highlight behind the active row: measured from the row and sprung into place (no layout animation,
  // so it can't lag behind the panel's own entrance)
  const list = useRef<HTMLOListElement>(null);
  const hy = useSpring(0, { stiffness: 380, damping: 36 });
  const hh = useSpring(0, { stiffness: 380, damping: 36 });
  const placed = useRef(false);
  const post = featured[active];
  const next = () => setActive((a) => (a + 1) % featured.length);

  // "Read" bubble that trails the cursor over the photo card (mouse only)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bx = useSpring(x, { stiffness: 350, damping: 30 });
  const by = useSpring(y, { stiffness: 350, damping: 30 });
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const place = (jump: boolean) => {
      const row = ol.children[active] as HTMLElement | undefined;
      if (!row) return;
      if (jump || reduce) {
        hy.jump(row.offsetTop);
        hh.jump(row.offsetHeight);
      } else {
        hy.set(row.offsetTop);
        hh.set(row.offsetHeight);
      }
    };
    place(!placed.current);
    placed.current = true;
    const ro = new ResizeObserver(() => place(true));
    ro.observe(ol);
    return () => ro.disconnect();
  }, [active, reduce, hy, hh]);

  const track = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - 48);
    y.set(e.clientY - r.top - 48);
  };

  return (
    <section className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink">
      {!reduce && (
        <>
          <motion.span aria-hidden className="pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-primary/30 blur-[120px]" animate={{ x: [0, 70, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
          <motion.span aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-[380px] w-[380px] rounded-full bg-gold/15 blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        </>
      )}

      {/* -mx-3 undoes the card inset so the content lines up with the logo */}
      <div className="relative -mx-3">
        <div className="mx-auto max-w-[1340px] px-6 pb-12 pt-32 sm:px-8 lg:pb-16 lg:pt-40">
          <BlogIntro />

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[7fr_5fr]"
          >
            {/* Lead story */}
            <a
              href={postHref(post.slug)}
              onMouseMove={track}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="group angle relative flex flex-col overflow-hidden bg-[#141c20] [@media(pointer:fine)]:cursor-none"
            >
              {/* Photo on its own, never under text: many covers are infographics with their own lettering */}
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={post.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: reduce ? 1 : 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 0.9, ease }, scale: { duration: SECONDS + 2, ease: "easeOut" } }}
                  >
                    <Image src={post.image} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                {/* Short fade where the photo meets the text panel */}
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141c20] to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink sm:left-8 sm:top-6">
                  Featured
                </span>
              </div>

              <div className="relative flex-1 px-6 pb-8 pt-4 sm:px-10 sm:pb-10">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={post.slug}
                    className="relative"
                    initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.15 } }}
                    exit={{ opacity: 0, y: reduce ? 0 : -12, transition: { duration: 0.25 } }}
                  >
                    <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em]">
                      <span className="text-accent-soft">{post.category}</span>
                      <span className="font-mono font-normal text-paper/45">
                        {pad(active + 1)} / {pad(featured.length)}
                      </span>
                    </p>
                    <h2 className="mt-3 max-w-2xl text-2xl font-extrabold leading-[1.15] tracking-tight text-mist sm:text-3xl lg:text-4xl">{post.title}</h2>
                    <p className="mt-4 line-clamp-2 max-w-xl text-base leading-7 text-paper/75">{post.excerpt}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper/70">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-bold text-white">{AUTHOR[0]}</span>
                      <span className="font-semibold text-paper">{AUTHOR}</span>
                      <span aria-hidden className="text-paper/30">/</span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden className="text-paper/30">/</span>
                      <span>{post.readMins} min read</span>
                    </div>
                    {/* Touch screens get a visible button in place of the cursor bubble */}
                    <span className="mt-6 hidden items-center gap-3 rounded-full bg-gold py-2 pl-6 pr-2 text-sm font-semibold text-ink [@media(pointer:coarse)]:inline-flex">
                      Read the story
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white"><Arrow /></span>
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card outline, slanted corner included, drawn over the photo */}
              <span aria-hidden className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-paper/10" />
              <CutEdge className="z-10 bg-paper/10" />

              {/* Cursor bubble */}
              <motion.span
                aria-hidden
                style={{ x: bx, y: by }}
                animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden h-24 w-24 flex-col place-items-center content-center rounded-full bg-gold text-sm font-bold text-ink shadow-[0_10px_40px_rgba(242,167,61,0.45)] [@media(pointer:fine)]:grid"
              >
                Read
                <Arrow className="-rotate-45" />
              </motion.span>
            </a>

            {/* Up next */}
            <div className="angle relative flex flex-col bg-paper/[0.04] p-3 ring-1 ring-inset ring-paper/10 sm:p-4">
              <CutEdge className="bg-paper/10" />
              <p className="px-3 pb-3 pt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50">Featured stories</p>
              {/* Compact rows spread evenly down the panel; one highlight glides to the active row
                  and carries the gold progress bar with it */}
              <div className="relative flex flex-1 flex-col">
                <motion.span
                  aria-hidden
                  style={{ y: hy, height: hh }}
                  className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden rounded-2xl bg-paper/[0.08] ring-1 ring-inset ring-paper/10"
                >
                  <span className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-paper/10">
                    {/* Fills over SECONDS, pauses while the pointer is over the spotlight, then moves on */}
                    <span
                      key={active}
                      onAnimationEnd={next}
                      className="block h-full origin-left bg-gold"
                      style={reduce ? undefined : { animation: `obstacle-progress ${SECONDS}s linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                    />
                  </span>
                </motion.span>
                <ol ref={list} className="relative flex flex-1 flex-col justify-between gap-1">
                  {featured.map((p, i) => {
                    const on = i === active;
                    return (
                      <li key={p.slug}>
                        <button
                          type="button"
                          onClick={() => setActive(i)}
                          aria-current={on ? "true" : undefined}
                          className="group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
                        >
                          <span className={`w-5 shrink-0 font-mono text-[11px] transition-colors duration-500 ${on ? "text-gold" : "text-paper/30"}`}>{pad(i + 1)}</span>
                          <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-paper/10">
                            <Image src={p.image} alt="" fill sizes="64px" className={`object-cover transition-transform duration-700 ${on ? "scale-110" : "group-hover:scale-110"}`} />
                          </span>
                          <span className="min-w-0">
                            <span className={`block text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-500 ${on ? "text-accent-soft" : "text-paper/35"}`}>
                              {p.category} · {p.readMins} min
                            </span>
                            <span className={`mt-1 line-clamp-2 block text-[13px] font-semibold leading-snug transition-colors duration-500 ${on ? "text-paper" : "text-paper/60 group-hover:text-paper/90"}`}>
                              {p.title}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
