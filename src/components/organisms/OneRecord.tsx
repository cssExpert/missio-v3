"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { BriefcaseBusiness, CalendarCheck, HandCoins, HandHeart, type LucideIcon } from "lucide-react";
import { NavIcon, engines } from "@/components/molecules/navData";

// The four ways a person touches a mission (from missio.io/about), orbiting the single record
const roles: { label: string; icon: LucideIcon }[] = [
  { label: "Gives", icon: HandCoins },
  { label: "Attends", icon: CalendarCheck },
  { label: "Volunteers", icon: HandHeart },
  { label: "Works for you", icon: BriefcaseBusiness },
];

const ORBIT_S = 48; // seconds per full turn

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };

// Dark section: the four engines on the left, and on the right one person's record with
// everything they do for the mission circling it
export default function OneRecord() {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -24 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
  };
  const spin = reduce ? undefined : { rotate: 360 };
  const unspin = reduce ? undefined : { rotate: -360 };
  const loop = { duration: ORBIT_S, repeat: Infinity, ease: "linear" as const };

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper lg:py-32">
      <span aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1340px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-2">
        <div>
          <span className="eyebrow gold">One platform</span>
          <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist md:text-5xl">
            One login. One ledger. <br className="hidden md:block" />
            <span className="text-gold">One record</span> for everyone.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-paper/70">
            Four engines share a single record, so the donor who volunteers on Saturday and the staff member who
            runs the gala are the same person everywhere in Missio.
          </p>

          <motion.ul
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid gap-3 sm:grid-cols-2"
          >
            {engines.map((e) => (
              <motion.li
                key={e.name}
                variants={item}
                className="group angle-sm bg-paper/[0.06] p-5 transition-colors duration-300 hover:bg-paper/[0.1]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/30 text-accent-soft transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                  <NavIcon d={e.icon} />
                </span>
                <p className="mt-4 font-bold text-paper">{e.name}</p>
                <p className="mt-1 text-sm leading-6 text-paper/60">{e.text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Orbit: rings, the record card in the middle, roles circling on the inner ring */}
        <div className="relative mx-auto aspect-square w-full max-w-[540px]" aria-label="One record for every person who gives, attends, volunteers or works for you">
          <div className="absolute inset-0 rounded-full border border-paper/5" />
          <div className="absolute inset-[20%] rounded-full border border-dashed border-paper/15 sm:inset-[9%]" />
          <div className="absolute inset-[26%] hidden rounded-full border border-paper/10 sm:block" />

          {/* Outer ring: engine dots drifting the other way */}
          <motion.div animate={unspin} transition={{ ...loop, duration: ORBIT_S * 1.5 }} className="absolute inset-0">
            {engines.map((e, i) => {
              const a = (i / engines.length) * Math.PI * 2 + Math.PI / 4;
              return (
                <span
                  key={e.name}
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_16px_rgba(79,179,204,0.9)]"
                  style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                />
              );
            })}
          </motion.div>

          {/* Inner ring: the four roles; each chip counter-rotates to stay upright.
              Phones pull the ring in so the chips stay on screen. */}
          <motion.div animate={spin} transition={loop} className="absolute inset-[20%] sm:inset-[9%]">
            {roles.map(({ label, icon: Icon }, i) => {
              const a = (i / roles.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <div
                  key={label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                >
                  <motion.div
                    animate={unspin}
                    transition={loop}
                    className="flex items-center gap-2 whitespace-nowrap rounded-full bg-paper py-1.5 pl-1.5 pr-3 text-xs font-bold sm:py-2 sm:pl-2 sm:pr-4 sm:text-sm text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white sm:h-8 sm:w-8">
                      <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                    </span>
                    {label}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Centre: the single record, with a slow pulse */}
          <div className="absolute inset-[36%] grid place-items-center sm:inset-[32%]">
            {!reduce && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-gold/20"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <div className="relative grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-primary to-[#0b3a47] text-center ring-1 ring-paper/20 shadow-[0_30px_80px_-20px_rgba(2,100,126,0.9)]">
              <div>
                <p className="text-4xl font-extrabold leading-none text-gold sm:text-6xl">1</p>
                <p className="mt-1 text-[10px] font-bold sm:mt-2 sm:text-[11px] uppercase tracking-[0.2em] text-paper/80">record</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
