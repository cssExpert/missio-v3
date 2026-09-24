"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Arrow, PillButton, TextLink } from "./ui";

const faqs = [
  [
    "What does a first engagement look like?",
    "A two-week discovery sprint: interviews, data review, and a short list of priorities with owners and timelines.",
  ],
  [
    "How do you report progress?",
    "A shared dashboard with agreed metrics, plus a short written update every two weeks.",
  ],
  [
    "Which sectors do you know best?",
    "B2B services, software, logistics, and consumer brands in their growth phase.",
  ],
  [
    "Can you run an audit of one department?",
    "Yes. Scoped audits of sales, operations, or finance usually take three to four weeks.",
  ],
  [
    "Do you help with new tools and systems?",
    "We help you pick and roll out tools, but we stay vendor-neutral and never resell software.",
  ],
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative grid lg:grid-cols-[5fr_7fr]">
      <div className="angle bg-mist px-4 py-24 sm:px-8 lg:pl-[max(2rem,calc((100vw-1340px)/2+2rem))] lg:pr-16">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
          Questions we
          <br className="hidden md:block" />
          hear most <span className="text-gold">often</span>
        </h2>
        <p className="mt-8 max-w-md text-base leading-6 text-ink/80">
          Short answers to common questions. If yours is not here, just ask.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <PillButton href="#contact">View all</PillButton>
          <TextLink href="#contact">Contact us</TextLink>
        </div>
      </div>
      <div className="px-4 py-16 sm:px-8 lg:px-12 lg:pr-[max(2rem,calc((100vw-1340px)/2+2rem))]">
        {faqs.map(([q, a], n) => (
          <div key={q} className="border-b border-ink/10">
            <button
              onClick={() => setOpen(open === n ? null : n)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-extrabold"
              aria-expanded={open === n}
            >
              {q}
              <Arrow
                className={`shrink-0 transition-transform duration-300 ${open === n ? "-rotate-90 text-accent" : ""}`}
              />
            </button>
            {/* Answer slides open from zero height; its text eases down and fades in just behind it */}
            <AnimatePresence initial={false}>
              {open === n && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.25 },
                  }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="pb-5 text-base leading-6 text-ink/80"
                  >
                    {a}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
