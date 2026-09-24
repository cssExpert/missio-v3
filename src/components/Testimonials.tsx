"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import CountUp from "./CountUp";
import { Arrow } from "./ui";

// Real client quotes from missio.io. Julienne's has spelling fixes only (wonderfull, infrormation, availble, missing space).
// missio.io's third quote (Richard Hartisona) is placeholder filler text, so it's left out.
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  featured?: boolean;
};

// Add more quotes here. The one marked `featured` (or the first) gets the big dark card;
// all the others rotate in the light card, with arrows, dots and auto-advance once there are two or more.
const testimonials: Testimonial[] = [
  {
    quote:
      "The Missio platform has transformed the way that people around the world support Team Rubicon veterans as we respond to natural disasters.",
    name: "Jake Wood",
    role: "CEO & Co-Founder, Team Rubicon",
    initials: "JW",
    featured: true,
  },
  {
    quote:
      "It was a wonderful experience working with the Missio team, they kept it professional. I was impressed how they organized meetings to present their works and made sure their clients had all the detailed information needed. They were very cooperative and always available when needed. The finished product is nothing short of perfection. I will definitely recommend them anytime, anyday. It was amazing working with you.",
    name: "Julienne",
    role: "Team AGN",
    initials: "J",
  },
  {
    quote:
      "The Missio platform has transformed the way that people around the world support Team Rubicon veterans as we respond to natural disasters.  They were very cooperative and always available when needed. The finished product is nothing short of perfection. I will definitely recommend them anytime, anyday. It was amazing working with you.",
    name: "Habitat",
    role: "Habitat for Humanity",
    initials: "H",
  },
];

const featured = testimonials.find((t) => t.featured) ?? testimonials[0];
const rest = testimonials.filter((t) => t !== featured);

const ROTATE_MS = 7000;

const logos = ["client-01", "client-02", "client-03", "client-07", "client-09"];

const trackSpotlight = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

function Spotlight({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), ${color}, transparent 65%)`,
      }}
    />
  );
}

function Author({
  initials,
  name,
  role,
  dark,
}: {
  initials: string;
  name: string;
  role: string;
  dark?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-4">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-extrabold ring-2 ring-gold ring-offset-2 ${dark ? "bg-primary text-paper ring-offset-ink" : "bg-ink text-gold ring-offset-paper"}`}
      >
        {initials}
      </span>
      <span>
        <span className={`block font-bold ${dark ? "text-paper" : "text-ink"}`}>
          {name}
        </span>
        <span
          className={`block text-sm ${dark ? "text-paper/60" : "text-ink/60"}`}
        >
          {role}
        </span>
      </span>
    </div>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const words = featured.quote.split(" ");

  const grid: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const tile: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 26 },
    },
  };
  // Featured quote reveals word by word
  const wordList: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035, delayChildren: 0.35 } },
  };
  const word: Variants = {
    hidden: { opacity: reduce ? 1 : 0.12, y: reduce ? 0 : 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const lift = reduce ? undefined : { y: -6 };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-mist py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <span className="eyebrow">Testimonials</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              In the words of the teams{" "}
              <span className="text-gold">we serve</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-ink/70">
              Mission-driven organizations use Missio to spend less time on
              software and more on the people they serve.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-5 lg:grid-cols-12"
        >
          {/* Featured: dark card, word-by-word reveal */}
          <motion.figure
            variants={tile}
            whileHover={lift}
            onMouseMove={trackSpotlight}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-ink p-8 shadow-[0_30px_80px_-30px_rgba(2,100,126,0.6)] sm:p-12 lg:col-span-7 lg:row-span-2"
          >
            <Spotlight color="rgba(79,179,204,0.14)" />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-[100px]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-gold/10 blur-[90px]"
            />

            <div className="relative">
              <span
                aria-hidden
                className="block font-hand text-[140px] leading-[0.5] text-gold"
              >
                &ldquo;
              </span>
              <motion.blockquote
                variants={wordList}
                className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug tracking-tight text-mist lg:leading-[1.35]"
              >
                {words.map((w, i) => (
                  <motion.span key={i} variants={word} className="inline-block">
                    {w}&nbsp;
                  </motion.span>
                ))}
              </motion.blockquote>
            </div>
            <figcaption className="relative mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-paper/10 pt-8">
              <Author {...featured} dark />
              <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/60 ring-1 ring-paper/15">
                Featured story
              </span>
            </figcaption>
          </motion.figure>

          {/* Other quotes: light cut-corner card that rotates through them */}
          {rest.length > 0 && (
            <motion.figure
              variants={tile}
              whileHover={lift}
              onMouseMove={trackSpotlight}
              className="group angle relative flex flex-col overflow-hidden bg-paper p-8 ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(2,100,126,0.35)] lg:col-span-5"
            >
              <Spotlight color="rgba(2,100,126,0.1)" />
              <QuoteRotator items={rest} />
            </motion.figure>
          )}

          {/* Proof tile: count-up plus a row of client logos, linking to the Trusted-by section */}
          <motion.a
            href="#clients"
            variants={tile}
            whileHover={lift}
            onMouseMove={trackSpotlight}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-paper lg:col-span-5"
          >
            <Spotlight color="rgba(236,178,46,0.18)" />
            <div className="relative flex items-start justify-between gap-4">
              <p className="text-6xl font-extrabold leading-none tracking-tight">
                <CountUp to={100} />
                <span className="text-gold">+</span>
              </p>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-paper/15 transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
              </span>
            </div>
            <p className="relative mt-3 text-base font-semibold text-paper/85">
              mission-driven organizations trust Missio
            </p>
            <ul className="relative mt-6 flex -space-x-3">
              {logos.map((l) => (
                <li
                  key={l}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white ring-2 ring-primary transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <Image
                    src={`/images/clients/${l}.png`}
                    alt=""
                    width={120}
                    height={120}
                    className="h-8 w-8 object-contain"
                  />
                </li>
              ))}
            </ul>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function QuoteBody({ t }: { t: Testimonial }) {
  return (
    <>
      <blockquote className="relative flex-1 text-sm leading-6 text-ink/75">
        {t.quote}
      </blockquote>
      <figcaption className="relative mt-6 border-t border-dashed border-ink/15 pt-6">
        <Author {...t} />
      </figcaption>
    </>
  );
}

// Shows one quote at a time. With two or more: auto-advances (paused on hover/focus, off for reduced motion),
// with arrows and dots. Invisible copies of every quote share the grid cell so the card keeps the tallest height.
function QuoteRotator({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const many = items.length > 1;

  useEffect(() => {
    if (!many || paused || reduce) return;
    const timer = window.setTimeout(
      () => setI((n) => (n + 1) % items.length),
      ROTATE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [i, many, paused, reduce, items.length]);

  const go = (step: number) =>
    setI((n) => (n + step + items.length) % items.length);

  return (
    <div
      className="relative flex h-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden
          className="relative block font-hand text-7xl leading-[0.5] text-primary/70"
        >
          &ldquo;
        </span>
        {/* {many && (
          <div className="flex gap-2">
            {[-1, 1].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => go(step)}
                aria-label={
                  step < 0 ? "Previous testimonial" : "Next testimonial"
                }
                className="grid h-9 w-9 place-items-center rounded-full text-primary ring-1 ring-ink/10 transition-colors hover:bg-gold hover:text-ink hover:ring-gold"
              >
                <Arrow
                  className={step < 0 ? "rotate-[135deg]" : "-rotate-45"}
                />
              </button>
            ))}
          </div>
        )} */}
      </div>

      <div
        className="relative mt-2 grid flex-1"
        aria-live={many ? "polite" : undefined}
      >
        {many &&
          items.map((t) => (
            <div
              key={t.name + t.quote.slice(0, 12)}
              aria-hidden
              className="invisible flex flex-col [grid-area:1/1]"
            >
              <QuoteBody t={t} />
            </div>
          ))}
        <div className="flex flex-col [grid-area:1/1]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full flex-col"
            >
              <QuoteBody t={items[i]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {many && (
        <div className="mt-6 flex gap-2">
          {items.map((t, n) => (
            <button
              key={t.name + n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show testimonial ${n + 1} of ${items.length}`}
              aria-current={n === i}
              className={`h-1.5 rounded-full transition-all duration-300 ${n === i ? "w-8 bg-gold" : "w-3 bg-ink/15 hover:bg-ink/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
