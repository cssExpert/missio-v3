"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { HandHelping, HeartHandshake, IdCard, Presentation, ShoppingBag, Ticket, type LucideIcon } from "lucide-react";
import { Arrow } from "@/components/atoms/ui";

// "Everything you need to run your mission" from missio.io/why-missio
const solutions: { title: string; text: string; does: string; icon: LucideIcon }[] = [
  { title: "Donor CRM", icon: HeartHandshake, text: "Build stronger donor connections and boost giving with Missio Donor CRM solutions.", does: "Centralize donor information and strengthen your fundraising relationships." },
  { title: "Events & Ticketing", icon: Ticket, text: "Effortlessly create your event and ticketing pages with Missio and start selling tickets right away.", does: "Simplify event management and ticket sales in one platform." },
  { title: "E-commerce", icon: ShoppingBag, text: "Leverage e-commerce to create sustainable revenue streams beyond traditional donations.", does: "Give your organization another way to generate sustainable revenue." },
  { title: "Member Management", icon: IdCard, text: "Organize, engage, and grow your community with Missio’s Member Management Software.", does: "Keep your community organized while building stronger member engagement." },
  { title: "Volunteer Management", icon: HandHelping, text: "Manage your volunteers with tools designed to simplify your organization’s operations.", does: "Streamline volunteer coordination and keep your teams connected." },
  { title: "Coaching Solutions", icon: Presentation, text: "Share your knowledge, inspire growth, and earn doing what you’re great at — all on one platform.", does: "Give coaches the tools to share knowledge, grow their audience, and manage their work." },
];

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// Hover-capable screens ([@media(hover:hover)]): the dark "What Missio does" panel rises over the card.
// Touch screens: that panel sits under the text, always visible.
// Class names are written out in full so Tailwind can find them.

export default function Solutions() {
  const reduce = useReducedMotion();
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 26 } },
  };

  return (
    <section className="bg-mist py-24 lg:py-32">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="max-w-2xl">
          <span className="eyebrow">Built for your mission</span>
          <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            Everything you need to <span className="text-gold">run your mission</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-ink/70">
            Explore the tools designed to streamline operations, strengthen engagement, and support sustainable growth.
          </p>
        </div>

        <motion.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {solutions.map(({ title, text, does, icon: Icon }, i) => (
            <motion.li key={title} variants={card}>
              <a
                href="#"
                className="group relative flex h-full flex-col overflow-hidden angle bg-paper p-8 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span aria-hidden className="absolute right-8 top-8 text-xs font-bold tracking-[0.2em] text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" strokeWidth={1.4} aria-hidden />
                </span>
                <h3 className="mt-8 text-2xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-3 text-base leading-7 text-ink/70">{text}</p>

                <div
                  className="angle-sm mt-8 bg-ink p-6 text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-0 [@media(hover:hover)]:mt-0 [@media(hover:hover)]:flex [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:flex-col [@media(hover:hover)]:justify-end [@media(hover:hover)]:[clip-path:none] [@media(hover:hover)]:p-8 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus-visible:translate-y-0"
                >
                  <Icon aria-hidden strokeWidth={0.6} className="pointer-events-none absolute -right-6 -top-6 hidden h-48 w-48 text-paper/[0.06] [@media(hover:hover)]:block [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100" />
                  <span aria-hidden className="pointer-events-none absolute -left-16 -top-16 hidden h-48 w-48 rounded-full bg-primary/40 blur-3xl [@media(hover:hover)]:block [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:duration-500 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100" />
                  <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-gold">What Missio does</p>
                  <p className="relative mt-3 text-lg font-bold leading-snug">{does}</p>
                  <span className="relative mt-6 inline-flex items-center gap-3 text-sm font-medium text-paper">
                    This is us
                    <Arrow className="text-accent-soft transition-transform duration-300 group-hover:-rotate-45" />
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
