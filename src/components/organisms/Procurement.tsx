"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { CreditCard, FileText, KeyRound, LifeBuoy, Lock, Plug, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import { PillButton } from "@/components/atoms/ui";

// "Built for procurement review" from missio.io/demo
type Topic = { title: string; text: string; icon: LucideIcon };
const hosting: Topic = { title: "Hosting & infrastructure", icon: Server, text: "Where data lives, backup cadence, disaster recovery and uptime commitments" };
const security: Topic = { title: "Security posture", icon: ShieldCheck, text: "SOC 2 roadmap, encryption, monitoring, incident response and vulnerability management" };
const privacy: Topic = { title: "Data privacy & ownership", icon: Lock, text: "You own your data. Clear retention, export and termination terms, DPA ready" };
const payments: Topic = { title: "Payments & PCI", icon: CreditCard, text: "Card data handled by the processor and never stored in your donor records" };
const light: Topic[] = [
  { title: "Integrations", icon: Plug, text: "Native connectors, API and import/export options, with ownership boundaries in writing" },
  { title: "Access management", icon: KeyRound, text: "Role-based permissions, user provisioning and deprovisioning, admin controls, audit trail" },
  { title: "Legal & procurement", icon: FileText, text: "Standard MSA, insurance, W-9, accessibility notes and a security questionnaire template" },
  { title: "Support & SLA", icon: LifeBuoy, text: "Response targets, escalation path and named contacts documented before you sign" },
];
const securityPoints = ["SOC 2 roadmap", "Encryption", "Monitoring", "Incident response", "Vulnerability management"];

const ease = [0.16, 1, 0.3, 1] as const;
const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// Cursor spotlight on the dark tiles
const track = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};
const Spotlight = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    style={{ background: "radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), rgba(79,179,204,0.22), transparent 70%)" }}
  />
);

// One grid cell with the shared reveal animation
function Tile({ className = "", children }: { className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const tile: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
  };
  return (
    <motion.li variants={tile} className={className}>
      {children}
    </motion.li>
  );
}

// Light tile: white card whose 1px border turns into a teal-to-gold gradient on hover
function LightTile({ topic: { title, text, icon: Icon }, className = "" }: { topic: Topic; className?: string }) {
  return (
    <Tile className={className}>
      <div className="group angle relative h-full bg-ink/[0.07] p-px transition-transform duration-500 hover:-translate-y-1">
        <span aria-hidden className="absolute inset-0 bg-gradient-to-br from-accent-soft via-primary to-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="angle relative flex h-full flex-col bg-white p-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-primary group-hover:text-white">
            <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
          </span>
          <h3 className="mt-auto pt-6 text-lg font-extrabold leading-snug text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
        </div>
      </div>
    </Tile>
  );
}

// Bento grid of the eight procurement topics: a large dark Security tile, a teal Payments tile
// with a card illustration, light tiles for the rest, and a gold tile that books the demo
export default function Procurement() {
  const reduce = useReducedMotion();
  const ShieldIcon = security.icon;
  const CardIcon = payments.icon;

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="eyebrow">Trust and compliance</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Built for <span className="text-gold">procurement</span> review
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-ink/70 lg:justify-self-end">
            Larger nonprofits and higher education ask these questions before signing. We answer them in writing, up
            front.
          </p>
        </div>

        <motion.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(190px,auto)] lg:grid-cols-4"
        >
          {/* Security posture: large dark tile with a pulsing shield */}
          <Tile className="sm:col-span-2 lg:row-span-2">
            <div onMouseMove={track} className="group relative flex h-full min-h-[380px] flex-col overflow-hidden angle bg-ink p-8 text-paper sm:p-10">
              <Spotlight />
              <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/40 blur-[90px]" />
              {/* Shield with expanding rings */}
              <div aria-hidden className="absolute right-8 top-8 grid h-32 w-32 place-items-center sm:right-10 sm:top-10 sm:h-40 sm:w-40">
                {!reduce &&
                  [0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-full border border-accent-soft/40"
                      animate={{ scale: [0.6, 1.4], opacity: [0.7, 0] }}
                      transition={{ duration: 3.6, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
                    />
                  ))}
                <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-[#0b3a47] text-gold shadow-[0_0_60px_rgba(79,179,204,0.45)] ring-1 ring-paper/15 sm:h-24 sm:w-24">
                  <ShieldIcon className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.4} />
                </span>
              </div>
              <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Security first</p>
              <h3 className="relative mt-auto pt-40 text-3xl font-extrabold tracking-tight text-mist sm:text-4xl">{security.title}</h3>
              <p className="relative mt-3 max-w-md text-base leading-7 text-paper/70">
                Everything your security reviewer will ask about, documented and shared before you sign.
              </p>
              <ul className="relative mt-6 flex flex-wrap gap-2">
                {securityPoints.map((s) => (
                  <li key={s} className="rounded-full bg-paper/[0.07] px-3.5 py-1.5 text-xs font-semibold text-paper/85 ring-1 ring-paper/10">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Tile>

          <LightTile topic={hosting} />
          <LightTile topic={privacy} />

          {/* Payments & PCI: teal tile with a card that hands off to the processor */}
          <Tile className="sm:col-span-2 lg:row-span-2">
            <div onMouseMove={track} className="group relative flex h-full min-h-[380px] flex-col overflow-hidden angle bg-gradient-to-br from-primary via-[#034e62] to-ink p-8 text-paper sm:p-10">
              <Spotlight />
              <div aria-hidden className="relative mx-auto mt-2 h-40 w-full max-w-sm">
                {/* Processor vault */}
                <div className="absolute right-0 top-1/2 grid h-24 w-24 -translate-y-1/2 place-items-center rounded-3xl bg-paper/10 ring-1 ring-paper/20 backdrop-blur">
                  <Lock className="h-9 w-9 text-gold" strokeWidth={1.5} />
                </div>
                {/* Dashed hand-off line from the card to the vault, with a dot travelling along it */}
                <div className="absolute left-44 right-24 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gold/70">
                  {!reduce && (
                    <motion.span
                      className="absolute -top-[5px] h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_rgba(242,167,61,0.9)]"
                      animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </div>
                {/* The card, floating */}
                <motion.div
                  className="absolute left-0 top-1/2 h-28 w-44 -translate-y-1/2 rounded-2xl bg-gradient-to-br from-paper/90 to-mist p-4 text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-rotate-3"
                  animate={reduce ? undefined : { y: ["-50%", "-58%", "-50%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CardIcon className="h-6 w-6 text-primary" strokeWidth={1.6} />
                  <p className="mt-5 font-mono text-sm tracking-widest text-ink/70">•••• •••• 4242</p>
                  <span className="absolute right-4 top-4 h-5 w-7 rounded bg-gold/80" />
                </motion.div>
              </div>
              <p className="relative mt-auto pt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Never stored by Missio</p>
              <h3 className="relative mt-2 text-3xl font-extrabold tracking-tight text-mist">{payments.title}</h3>
              <p className="relative mt-3 max-w-md text-base leading-7 text-paper/75">{payments.text}</p>
            </div>
          </Tile>

          <LightTile topic={light[0]} />
          <LightTile topic={light[1]} />

          {/* Gold call to action */}
          <Tile className="sm:col-span-2">
            <div className="group relative flex h-full min-h-[190px] flex-col justify-between gap-6 overflow-hidden angle bg-gold p-8 text-ink">
              <span aria-hidden className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-white/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <p className="relative max-w-sm text-2xl font-extrabold leading-tight tracking-tight">
                Every answer in writing, before you sign.
              </p>
              <div className="relative">
                <PillButton href="#demo" variant="dark">Book A Demo</PillButton>
              </div>
            </div>
          </Tile>

          <LightTile topic={light[2]} />
          <LightTile topic={light[3]} />
        </motion.ul>
      </div>
    </section>
  );
}
