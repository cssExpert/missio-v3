"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import CountUp from "@/components/atoms/CountUp";
import ParallaxImage from "@/components/atoms/ParallaxImage";
import { PillButton } from "@/components/atoms/ui";

// Impact figures from missio.io/why-missio; confirm them before launch like the other stats
const stats = [
  { prefix: "$", value: 30, suffix: "M+", label: "Donations raised" },
  { prefix: "", value: 1017, suffix: "", label: "Satisfied clients" },
  { prefix: "", value: 25, suffix: "", label: "Expert teams" },
];

const row: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };

// Dark band over a panning photo: the pitch on the left, big count-up figures on the right
export default function ImpactBand() {
  const reduce = useReducedMotion();
  const stat: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
  };

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper lg:py-32">
      <ParallaxImage src="/images/Missio-Benefits-Bg.jpg" alt="" strength={12} />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />

      <div className="relative mx-auto grid max-w-[1340px] items-center gap-14 px-4 sm:px-8 lg:grid-cols-[5fr_7fr]">
        <div>
          <span className="eyebrow gold">Our impact</span>
          <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">
            Trusted by people who make a <span className="text-gold">difference</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-paper/70">
            Missio is everything your nonprofit needs to get the most from the web. Let&rsquo;s start your project.
          </p>
          <div className="mt-10">
            <PillButton href="#">Start your project</PillButton>
          </div>
        </div>

        <motion.ul
          variants={row}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {stats.map((s, i) => (
            <motion.li
              key={s.label}
              variants={stat}
              className={`group relative overflow-hidden angle bg-paper/[0.07] p-7 backdrop-blur-md transition-colors duration-300 hover:bg-paper/10 ${i === 0 ? "sm:col-span-2" : ""}`}
            >
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/40 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60" />
              <p className={`relative font-extrabold leading-none tracking-tight ${i === 0 ? "text-6xl text-gold md:text-8xl" : "text-5xl text-paper md:text-6xl"}`}>
                {s.prefix}
                <CountUp to={s.value} />
                <span className="text-gold">{s.suffix}</span>
              </p>
              <p className="relative mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-paper/60">{s.label}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
