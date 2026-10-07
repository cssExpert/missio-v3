"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import PostCard from "@/components/molecules/PostCard";
import {
  categories,
  posts,
  type Category,
} from "@/components/molecules/blogData";

const ease = [0.16, 1, 0.3, 1] as const;
const FIRST = 7; // the wide lead card plus two rows of three
const MORE = 6;
const newest = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const count = (c: Category) => posts.filter((p) => p.category === c).length;

// "What's new": every post, newest first. Topic chips and search narrow the grid (cards glide into place);
// the newest match leads as a wide card, and Load more reveals the rest six at a time.
export default function BlogLatest() {
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(FIRST);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return newest.filter(
      (p) =>
        (topic === "All" || p.category === topic) &&
        (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q)),
    );
  }, [topic, query]);
  const shown = matches.slice(0, limit);

  const pick = (t: Category | "All") => {
    setTopic(t);
    setLimit(FIRST);
  };

  return (
    <section id="whats-new" className="relative py-18 lg:py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="grid gap-8 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <span className="eyebrow">What&rsquo;s new</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Fresh from the <span className="text-gold">blog</span>
            </h2>
          </div>
          <label className="group relative block w-full max-w-md lg:justify-self-end">
            <span className="sr-only">Search articles</span>
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 transition-colors group-focus-within:text-primary"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(FIRST);
              }}
              placeholder="Search articles"
              className="h-14 w-full rounded-full bg-white pl-12 pr-12 text-sm text-ink outline-none ring-1 ring-ink/10 transition-shadow placeholder:text-ink/40 focus:ring-2 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/50 transition-colors hover:bg-mist hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </label>
        </motion.div>

        {/* Topic rail, styled like the pricing revenue switch: the dark pill slides to the chosen topic.
            Scrolls sideways on phones */}
        <div className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div
            role="group"
            aria-label="Filter by topic"
            className="inline-flex gap-1 rounded-full bg-mist p-1.5"
          >
            {(["All", ...categories] as const).map((t) => {
              const on = topic === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(t)}
                  className={`group relative flex shrink-0 items-center gap-2.5 rounded-full py-2 pl-5 pr-2 text-sm font-semibold transition-colors duration-300 ${on ? "text-paper" : "text-ink/65 hover:text-ink"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="topic-pill"
                      className="absolute inset-0 rounded-full bg-ink shadow-[0_8px_20px_-8px_rgba(36,47,53,0.6)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t}</span>
                  <span
                    className={`relative grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[11px] font-bold tabular-nums transition-colors duration-300 ${on ? "bg-gold text-ink" : "bg-white text-ink/50 group-hover:bg-primary group-hover:text-white"}`}
                  >
                    {t === "All" ? posts.length : count(t)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul
          layout={!reduce}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduce
                    ? undefined
                    : { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
                }
                transition={{
                  duration: 0.6,
                  ease,
                  delay: reduce ? 0 : Math.min(i % MORE, 5) * 0.05,
                }}
                className={i === 0 ? "sm:col-span-2 lg:col-span-3" : ""}
              >
                <PostCard post={p} wide={i === 0} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {!matches.length && (
          <div className="angle mt-4 bg-mist px-8 py-16 text-center">
            <p className="text-lg font-extrabold">
              Nothing matches &ldquo;{query}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                pick("All");
              }}
              className="mt-3 text-sm font-semibold text-primary hover:text-ink"
            >
              Show all articles
            </button>
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <p
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink/45"
              aria-live="polite"
            >
              Showing {shown.length} of {matches.length}
            </p>
            {/* Thin bar showing how much of the list is on screen */}
            <span
              aria-hidden
              className="block h-0.5 w-48 overflow-hidden rounded-full bg-ink/10"
            >
              <motion.span
                className="block h-full origin-left bg-gold"
                initial={false}
                animate={{ scaleX: shown.length / matches.length }}
                transition={{ duration: 0.6, ease }}
              />
            </span>
            {shown.length < matches.length && (
              <button
                type="button"
                onClick={() => setLimit((l) => l + MORE)}
                className="group mt-2 inline-flex items-center gap-6 rounded-full bg-black py-2 pl-7 pr-2 text-sm font-medium text-paper transition-colors duration-300 hover:bg-accent"
              >
                Load more articles
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:rotate-90 group-hover:bg-ink">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
