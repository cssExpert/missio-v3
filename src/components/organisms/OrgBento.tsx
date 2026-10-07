"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Arrow } from "@/components/atoms/ui";
import CutEdge from "@/components/atoms/CutEdge";
import { items as orgTypes, type Feature } from "@/components/organisms/Integrations";

const ease = [0.16, 1, 0.3, 1] as const;

// Photo mosaic. On desktop a 4 x 3 grid: Relief is the large tile, Churches and Schools are wide, plus a gold
// "let's talk" tile. Photos are the closest matches in public/images; swap any of them for a better one.
const tiles: { photo: string; place: string; big?: boolean }[] = [
  { photo: "/images/nonprofit-benefits.jpg", place: "lg:col-span-2 lg:row-span-2", big: true }, // Relief
  { photo: "/images/Missio-Help-Grow.jpg", place: "" }, // Local nonprofits
  { photo: "/images/img-12.jpg", place: "" }, // Foundations
  { photo: "/images/banner/01.jpg", place: "lg:col-span-2" }, // Churches
  { photo: "/images/Missio-Trust.jpg", place: "" }, // Advocacy groups
  { photo: "/images/service-1.jpg", place: "lg:col-span-2" }, // Private schools
];

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function Tile({ org, i, photo, place, big }: { org: Feature; i: number; photo: string; place: string; big?: boolean }) {
  const reduce = useReducedMotion();
  const Icon = typeof org.icon === "string" ? null : org.icon;
  // Single-column tiles are short and narrow: keep the hover details to three lines and two tags so they fit
  const narrow = !big && !place.includes("col-span-2");
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <motion.article
      variants={rise}
      tabIndex={0}
      className={`group angle relative min-h-[320px] overflow-hidden bg-ink outline-none focus-visible:ring-2 focus-visible:ring-gold lg:min-h-0 ${place}`}
    >
      {/* Photo: slow zoom on hover */}
      <Image
        src={photo}
        alt=""
        fill
        sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
        className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-focus-visible:scale-110"
      />
      {/* Slate gradient so the text always reads; deepens on hover as the details slide up */}
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
      <span
        aria-hidden
        className="absolute inset-0 bg-ink/35 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-paper/10" />
      <CutEdge className="bg-paper/15" />

      {/* Number, and an arrow that appears on hover */}
      <span className="absolute left-5 top-5 rounded-full bg-ink/45 px-2.5 py-1 font-mono text-[11px] tracking-[0.2em] text-paper/80 ring-1 ring-paper/15 backdrop-blur">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span
        aria-hidden
        className="absolute right-14 top-5 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Arrow className="-rotate-45" />
      </span>

      <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 ${big ? "lg:p-9" : ""}`}>
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-paper/15 text-gold ring-1 ring-paper/20 backdrop-blur">
              <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
            </span>
          )}
          <h3
            className={`font-extrabold leading-tight tracking-tight text-mist ${big ? "text-2xl lg:text-4xl" : "text-xl"}`}
          >
            {org.title}
          </h3>
        </div>
        {/* Details: always open on the large tile and on touch screens; elsewhere they slide up on hover */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100 ${
            big
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={`mt-3 text-paper/80 ${big ? "max-w-xl text-base leading-7" : "text-sm leading-6"} ${narrow ? "lg:line-clamp-3" : ""}`}
            >
              {org.text.trim()}
            </p>
            {org.tags && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {org.tags.map((t, n) => (
                  <li
                    key={t}
                    className={`rounded-full bg-paper/15 px-2.5 py-1 text-[11px] font-semibold text-paper/90 ring-1 ring-paper/20 backdrop-blur ${narrow && n > 1 ? "lg:hidden" : ""}`}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// About page: "Built for any organization" as a photo mosaic, one tile per kind of organization
export default function OrgBento() {
  const reduce = useReducedMotion();
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section className="relative overflow-hidden py-18 lg:py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="grid gap-6 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <span className="eyebrow">Built for any organization</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              However you&rsquo;re built to do good, Missio <span className="text-gold">flexes</span> to fit.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-ink/70 lg:justify-self-end">
            Whether you&rsquo;re a local community co-op, a new church, or a 200-person international relief org,
            Missio&rsquo;s engines configure to your size and workflow.
          </p>
        </motion.div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(3,260px)]"
        >
          {orgTypes.map((org, i) => (
            <Tile key={org.title} org={org} i={i} {...tiles[i]} />
          ))}

          {/* Gold call to action closes the grid */}
          <motion.a
            variants={rise}
            href="/demo"
            className="group angle relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-gold p-6 text-ink"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-white/30 blur-3xl transition-transform duration-700 group-hover:scale-125"
            />
            <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">Something else?</p>
            <div className="relative">
              <p className="text-2xl font-extrabold leading-tight tracking-tight">
                Don&rsquo;t see your kind of organization?
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/70">Missio configures to your size and workflow.</p>
              <span className="mt-5 inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-sm font-semibold text-paper">
                Let&rsquo;s talk
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-ink">
                  <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </span>
            </div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
