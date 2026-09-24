"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { MIRA_ICON, NavIcon, engines, links, hrefFor, sectionFor } from "./navData";
import { useActiveSection } from "./useActiveSection";
import { Arrow } from "./ui";

// Panel springs in; its columns follow one after another
const columns: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const column: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
};

export default function NavMenu() {
  const [hovered, setHovered] = useState<string | null>(null);
  // Link for the section currently on screen
  const activeSection = useActiveSection(Object.values(sectionFor));
  const current = links.find((l) => sectionFor[l] === activeSection) ?? null;
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Short delay so a quick diagonal move toward the panel doesn't snap it shut
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    // Desktop menu from 1100px: below that the logo, six items and the demo button don't fit, so MobileMenu takes over
    <nav
      ref={navRef}
      aria-label="Main"
      className="hidden self-stretch min-[1100px]:flex"
      onMouseLeave={() => {
        setHovered(null);
        closeSoon();
      }}
      onBlur={(e) => {
        if (!navRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <ul className="flex h-full items-center gap-2 text-sm font-medium text-paper/85">
        {links.map((l) => {
          const isProducts = l === "Products";
          const isCurrent = current === l;
          // Pill follows the hovered item, and rests on the current section's link when nothing is hovered
          const active = (hovered ? hovered === l : isCurrent) || (isProducts && open);
          const itemClass = `relative z-0 flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 transition-colors ${active ? "text-white" : "hover:text-white"}`;
          return (
            <li
              key={l}
              className="flex h-full items-center"
              onMouseEnter={() => {
                setHovered(l);
                if (isProducts) openMenu();
                else closeSoon();
              }}
            >
              {isProducts ? (
                <button
                  type="button"
                  className={`${itemClass} ${isCurrent ? "text-white" : ""}`}
                  aria-current={isCurrent ? "location" : undefined}
                  aria-expanded={open}
                  aria-controls="products-menu"
                  onClick={() => setOpen((o) => !o)}
                  onFocus={openMenu}
                >
                  {active && <Pill />}
                  {l}
                  <svg
                    viewBox="0 0 12 12"
                    className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden
                  >
                    <path d="M3 4.5l3 3 3-3" />
                  </svg>
                </button>
              ) : (
                <a href={hrefFor(l)} className={`${itemClass} ${isCurrent ? "text-white" : ""}`} aria-current={isCurrent ? "location" : undefined}>
                  {active && <Pill />}
                  {l}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            id="products-menu"
            key="products-menu"
            className="absolute inset-x-6 top-full origin-top sm:inset-x-8"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 380, damping: 30 },
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.99,
              transition: { duration: 0.15 },
            }}
            onMouseEnter={openMenu}
            onMouseLeave={closeSoon}
          >
            <motion.div
              variants={columns}
              initial="hidden"
              animate="show"
              className="rounded-3xl bg-ink/75 p-6 shadow-2xl ring-1 ring-paper/10 backdrop-blur-xl lg:p-8"
            >
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {engines.map((e) => (
                  <motion.a
                    key={e.name}
                    variants={column}
                    href="#"
                    className="group/col block rounded-2xl p-4 transition-colors hover:bg-paper/5"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/25 text-accent-soft ring-1 ring-accent-soft/20">
                      <NavIcon d={e.icon} />
                    </span>
                    <span className="mt-4 flex items-center gap-2 font-bold text-paper">
                      {e.name}
                      <Arrow className="text-gold opacity-0 transition duration-300 group-hover/col:-rotate-45 group-hover/col:opacity-100" />
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-paper/55">
                      {e.text}
                    </span>
                    <ul className="mt-4 space-y-2 text-sm text-paper/80">
                      {e.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span
                            className="h-1 w-1 rounded-full bg-gold"
                            aria-hidden
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.a>
                ))}
              </div>

              <motion.div
                variants={column}
                className="mt-4 grid gap-2 border-t border-paper/10 pt-4 md:grid-cols-[2fr_1fr]"
              >
                <a
                  href="#"
                  className="group/mira flex items-center gap-4 rounded-2xl bg-gradient-to-r from-primary/40 to-transparent p-4 ring-1 ring-accent-soft/15 transition hover:from-primary/60"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold text-ink">
                    <NavIcon d={MIRA_ICON} />
                  </span>
                  <span>
                    <span className="block font-bold text-paper">
                      MIRA — The AI Layer
                    </span>
                    <span className="block text-xs text-paper/60">
                      Intelligence across all four engines
                    </span>
                  </span>
                  <Arrow className="ml-auto text-gold transition duration-300 group-hover/mira:-rotate-45" />
                </a>
                <a
                  href="#"
                  className="group/cmp flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-paper/5"
                >
                  <span>
                    <span className="block font-bold text-paper">
                      Compare Missio
                    </span>
                    <span className="block text-xs text-paper/60">
                      See what other platforms leave out
                    </span>
                  </span>
                  <Arrow className="ml-auto text-accent-soft transition duration-300 group-hover/cmp:-rotate-45" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Soft highlight that glides between nav items (shared layoutId)
function Pill() {
  return (
    <motion.span
      layoutId="nav-pill"
      className="absolute inset-0 -z-10 rounded-full bg-paper/10"
      transition={{ type: "spring", stiffness: 500, damping: 38 }}
    />
  );
}
