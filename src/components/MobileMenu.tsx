"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { MIRA_ICON, NavIcon, engines, links, hrefFor, sectionFor } from "./navData";
import { useActiveSection } from "./useActiveSection";
import { Arrow, Logo } from "./ui";

const noopSubscribe = () => () => {};

// Links fade and slide in one after another once the drawer is in
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } };
const item: Variants = { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 420, damping: 34 } } };

// Phone/tablet navigation: round menu button that opens a drawer sliding in from the right
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const activeSection = useActiveSection(Object.values(sectionFor));
  const current = links.find((l) => sectionFor[l] === activeSection) ?? null;
  // true in the browser, false during server render; needed because the portal targets document.body
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Lock page scroll, move focus into the drawer, close on Esc or when the desktop menu takes over
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 1100px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    const button = buttonRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      button?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const drawer = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] min-[1100px]:hidden">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-3 right-3 flex w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl bg-ink/95 shadow-2xl ring-1 ring-paper/10 backdrop-blur-xl"
            initial={{ x: "105%" }}
            animate={{ x: 0, transition: { type: "spring", stiffness: 320, damping: 34 } }}
            exit={{ x: "105%", transition: { duration: 0.25, ease: "easeIn" } }}
          >
            <div className="flex h-20 shrink-0 items-center justify-between px-6">
              <Logo light />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full bg-paper/10 text-paper ring-1 ring-paper/15 transition hover:bg-gold hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                </svg>
              </button>
            </div>

            <motion.ul variants={list} initial="hidden" animate="show" className="flex-1 overflow-y-auto px-6 pb-6">
              {links.map((l) => (
                <motion.li key={l} variants={item} className="border-b border-paper/10">
                  {l === "Products" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setProductsOpen((o) => !o)}
                        aria-expanded={productsOpen}
                        aria-controls="mobile-products"
                        className="flex w-full items-center justify-between py-4 text-left text-xl font-extrabold text-paper"
                      >
                        {l}
                        <svg viewBox="0 0 12 12" className={`h-4 w-4 text-gold transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                          <path d="M3 4.5l3 3 3-3" />
                        </svg>
                      </button>
                      <AnimatePresence initial={false}>
                        {productsOpen && (
                          <motion.div
                            id="mobile-products"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-4">
                              {engines.map((e) => (
                                <a key={e.name} href="#" onClick={close} className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-paper/5">
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/25 text-accent-soft ring-1 ring-accent-soft/20">
                                    <NavIcon d={e.icon} className="h-4 w-4" />
                                  </span>
                                  <span>
                                    <span className="block text-sm font-bold text-paper">{e.name}</span>
                                    <span className="block text-xs leading-5 text-paper/55">{e.text}</span>
                                  </span>
                                </a>
                              ))}
                              <a href="#" onClick={close} className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/40 to-transparent p-3 ring-1 ring-accent-soft/15">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold text-ink">
                                  <NavIcon d={MIRA_ICON} className="h-4 w-4" />
                                </span>
                                <span>
                                  <span className="block text-sm font-bold text-paper">MIRA — The AI Layer</span>
                                  <span className="block text-xs text-paper/55">Intelligence across all four engines</span>
                                </span>
                              </a>
                              <a href="#" onClick={close} className="flex items-center justify-between rounded-2xl p-3 text-sm font-bold text-paper transition-colors hover:bg-paper/5">
                                Compare Missio
                                <Arrow className="text-accent-soft" />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={hrefFor(l)}
                      onClick={close}
                      aria-current={current === l ? "location" : undefined}
                      className={`group flex items-center justify-between py-4 text-xl font-extrabold ${current === l ? "text-gold" : "text-paper"}`}
                    >
                      {l}
                      <Arrow className="text-paper/40 transition duration-300 group-hover:-rotate-45 group-hover:text-gold" />
                    </a>
                  )}
                </motion.li>
              ))}
            </motion.ul>

            <div className="shrink-0 border-t border-paper/10 p-6">
              <a
                href="#"
                onClick={close}
                className="group flex items-center justify-between rounded-full bg-accent py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-highlight hover:text-ink"
              >
                Schedule A Demo
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-accent">
                  <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="group grid h-11 w-11 place-items-center rounded-full bg-paper/10 text-paper ring-1 ring-paper/15 backdrop-blur transition hover:bg-gold hover:text-ink min-[1100px]:hidden"
      >
        {/* Two lines; the lower one is shorter and stretches on hover */}
        <span className="flex w-5 flex-col items-end gap-1.5" aria-hidden>
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-3 rounded-full bg-current transition-all duration-300 group-hover:w-5" />
        </span>
      </button>
      {/* Rendered on <body>: the scrolled header's backdrop-filter would otherwise trap this fixed drawer inside it */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
