"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import CutEdge from "@/components/atoms/CutEdge";
import { AUTHOR, formatDate, type Post } from "@/components/molecules/blogData";

const ease = [0.16, 1, 0.3, 1] as const;

// Article page hero: breadcrumb, a title that rises word by word, and the cover in its own card on the right
// (never under text, since many covers are infographics). The cover drifts up slightly as the page scrolls.
export default function ArticleHero({ post }: { post: Post }) {
  const reduce = useReducedMotion();
  const cover = useRef<HTMLDivElement>(null);
  const words = post.title.split(" ");
  const line: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } };
  const word: Variants = {
    hidden: { y: reduce ? 0 : "110%" },
    show: { y: 0, transition: { duration: 0.9, ease } },
  };
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const update = () => {
      if (cover.current) cover.current.style.transform = `translateY(${Math.min(window.scrollY, 600) * -0.08}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  return (
    <section className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink">
      <span aria-hidden className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[120px]" />
      <span aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative -mx-3">
        <div className="mx-auto grid max-w-[1340px] items-center gap-12 px-6 pb-16 pt-32 sm:px-8 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:pb-20 lg:pt-40">
          <div>
            <motion.nav aria-label="Breadcrumb" {...fade(0)}>
              <ol className="flex flex-wrap items-center gap-y-2 text-sm text-mist">
                <li><Link href="/" className="transition-colors hover:text-gold">Home</Link></li>
                <li aria-hidden className="mx-3 text-paper/40">/</li>
                <li><Link href="/blog" className="transition-colors hover:text-gold">Blog</Link></li>
                <li aria-hidden className="mx-3 text-paper/40">/</li>
                <li aria-current="page" className="text-gold">{post.category}</li>
              </ol>
            </motion.nav>

            <motion.h1
              variants={line}
              initial="hidden"
              animate="show"
              aria-label={post.title}
              className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-tight text-mist sm:text-5xl lg:text-[56px]"
            >
              {words.map((w, i) => (
                <span key={i} aria-hidden className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span variants={word} className="inline-block">
                    {w}
                    {i < words.length - 1 ? " " : ""}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p {...fade(0.5)} className="mt-6 max-w-2xl text-lg leading-8 text-paper/70">
              {post.excerpt}
            </motion.p>

            <motion.div {...fade(0.65)} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-paper/70">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-base font-bold text-white ring-4 ring-primary/25">
                {AUTHOR[0]}
              </span>
              <span>
                <span className="block font-semibold text-paper">{AUTHOR}</span>
                <span className="block text-xs text-paper/50">Missio Blog</span>
              </span>
              <span aria-hidden className="mx-1 h-8 w-px bg-paper/15" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden className="text-paper/30">/</span>
              <span>{post.readMins} min read</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease }}
          >
            <div ref={cover} className="will-change-transform">
              <div className="angle relative aspect-[4/3] overflow-hidden bg-[#141c20] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                <Image src={post.image} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-paper/10" />
                <CutEdge className="bg-paper/10" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
