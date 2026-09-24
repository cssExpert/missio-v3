"use client";

import { useEffect, useState } from "react";

// Floating pill with back-to-top and call buttons; appears once the page is scrolled
export default function ScrollDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      // Brighter ring + deeper shadow keep it visible over the dark hero; short ease-out so it shows promptly
      className={`fixed bottom-8 right-4 z-40 flex flex-col overflow-hidden rounded-full bg-ink/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.45)] ring-1 ring-paper/30 backdrop-blur transition-[opacity,translate] duration-250 ease-out sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="grid h-14 w-14 place-items-center text-accent-soft transition hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M8 6L12 2L16 6" />
          <path d="M12 2V22" />
        </svg>
      </button>
      <span className="mx-auto h-px w-8 bg-paper/10" />
      <a
        href="tel:+14160000000"
        aria-label="Call us"
        className="grid h-14 w-14 place-items-center text-accent-soft transition hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4.5 w-4.5"
          aria-hidden
        >
          <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
        </svg>
      </a>
    </div>
  );
}
