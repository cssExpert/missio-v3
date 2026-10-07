"use client";

import { motion, useReducedMotion } from "motion/react";
import DeviceCard from "@/components/molecules/DeviceCard";
import { Laptop, Phone } from "@/components/molecules/MiraDevices";
import { Tablet } from "@/components/molecules/MiraTablet";

const ease = [0.16, 1, 0.3, 1] as const;
const capabilities = [
  "Draft appeals & pages",
  "Lapse signals",
  "Major-gift flags",
  "Campaign forecasting",
  "Capacity vs. demand",
  "Plain-English reporting",
];

// Engines page v2, "The AI layer" (layout from the open-design feature grid): three devices show MIRA at work.
// Scrolling scrubs them: the laptop opens, the phone lights up and the thread plays, one after another.
export default function MiraAiLayer() {
  const reduce = useReducedMotion();
  return (
    <section id="mira" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">The AI layer</span>
          <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            MIRA sees across <span className="text-gold">all four engines</span> at once
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink/70">
            Bolt-on AI reads one silo. MIRA reads giving, events, volunteers, programs and staffing together &mdash; so
            it can tell you not just who is likely to give, but whether you have the people to deliver what that gift
            funds.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {capabilities.map((c) => (
              <li key={c} className="rounded-full bg-mist px-3.5 py-1.5 text-xs font-semibold text-ink/75">
                {c}
              </li>
            ))}
          </ul>
        </motion.header>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-5">
          <DeviceCard
            lag={0}
            title="Drafts while you plan"
            text="Appeals and donation pages written from what is already in your record, so your team edits instead of starting blank."
            label="A laptop opening on a spring appeal that MIRA is drafting in the Growth Engine."
          >
            {() => <Laptop />}
          </DeviceCard>
          <DeviceCard
            lag={0.08}
            title="Flags the ask in your pocket"
            text="Lapse signals and major-gift flags arrive with their reasons, drawn from giving, events and volunteering together."
            label="A phone showing MIRA's major-gift flag for Marcus Webb with a suggested ask of $10,000."
          >
            {() => <Phone />}
          </DeviceCard>
          <DeviceCard
            lag={0.16}
            title="Sees both sides at once"
            text="Plain-English answers that weigh what you are raising against whether you have the people to deliver it."
            label="A tablet thread where MIRA reports the appeal 22% ahead of plan but Saturday shifts 40% unstaffed."
          >
            {(on) => <Tablet on={on} />}
          </DeviceCard>
        </div>
      </div>
    </section>
  );
}
