"use client";

import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import NavMenu from "./NavMenu";
import { Logo } from "./ui";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Inset 12px with rounded corners, matching the hero card: transparent inside the card at the top,
    // a floating dark rounded bar once the page scrolls
    <header className="fixed inset-x-3 top-3 z-50 rounded-3xl">
      {/* The scrolled bar's tint and blur live on this background layer, not on <header> itself:
          a backdrop-filter on <header> would stop the mega menu's own backdrop blur from seeing the page */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-ink/70 shadow-lg backdrop-blur-[10px] transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* -mx-3 stretches this row back to full window width so the container lines up with every other section */}
      <div className="-mx-3">
        <div className="relative mx-auto flex h-24 max-w-[1340px] items-center justify-between px-6 sm:px-8">
          <Logo light />
          {/* Main navigation; Products opens the animated mega menu */}
        <NavMenu />
          <div className="flex items-center gap-3">
          <a
            href="#"
            // Ghost button, same 46px height as Schedule A Demo
            className="hidden h-[46px] items-center rounded-full border border-white px-6 text-sm font-medium text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink sm:inline-flex"
          >
            Log In
          </a>
          <a
            href="#"
            className={`group hidden h-[46px] items-center gap-4 rounded-full pl-6 pr-[5px] text-sm font-medium sm:inline-flex transition-colors duration-300 hover:bg-highlight hover:text-ink ${
              scrolled ? "bg-accent text-white" : "bg-black/80 text-paper"
            }`}
          >
            Schedule A Demo
            <span
              className={`grid h-9 w-9 place-items-center rounded-full text-white transition-colors duration-300 group-hover:bg-accent ${
                scrolled ? "bg-ink" : "bg-accent"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </span>
          </a>
            {/* Phones and small tablets: menu button that opens the drawer */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
