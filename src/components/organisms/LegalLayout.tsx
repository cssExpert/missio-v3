"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { TextLink } from "@/components/atoms/ui";

export type LegalNavItem = { id: string; title: string };

// Every page in the footer's Legal column, for the "More legal pages" list in the rail
export const legalPages = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-and-cancellation-policy", label: "Refund Policy" },
  { href: "/security", label: "Security" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/cookie-preferences", label: "Cookie preferences" },
  { href: "/data-processing", label: "Data processing" },
];

// Legal page body: sticky rail (contents with the current section marked, a contact card, the other legal pages)
// beside the document. The document is #policy, which the reading-progress bar follows.
export default function LegalLayout({
  sections,
  current: page,
  contact = { title: "Questions?", text: "Contact us and we’ll take it from there." },
  children,
}: {
  sections: LegalNavItem[];
  current: string;
  contact?: { title: string; text: string };
  children: ReactNode;
}) {
  const [current, setCurrent] = useState(sections[0]?.id ?? "");

  // Mark the section whose top has passed the upper third of the window
  useEffect(() => {
    const onScroll = () => {
      let id = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) id = s.id;
      }
      setCurrent(id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <div className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1340px] gap-12 px-4 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-20">
        <aside className="lg:sticky lg:top-32 lg:max-h-[calc(100svh-9rem)] lg:self-start lg:overflow-y-auto lg:[scrollbar-width:none]">
          {sections.length > 1 && (
            <nav aria-label="On this page">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">On this page</p>
              <ol className="mt-5 space-y-0.5 border-l border-ink/10">
                {sections.map((s, i) => {
                  const on = s.id === current;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        aria-current={on ? "location" : undefined}
                        className={`-ml-px flex items-baseline gap-3 border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors duration-300 ${on ? "border-gold font-semibold text-ink" : "border-transparent text-ink/50 hover:text-ink"}`}
                      >
                        <span className="font-mono text-xs text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <div className="angle-sm mt-10 hidden bg-mist p-5 lg:block">
            <p className="text-sm font-bold">{contact.title}</p>
            <p className="mt-1 text-sm leading-6 text-ink/65">{contact.text}</p>
            <div className="mt-4">
              <TextLink href="/contact">Contact us</TextLink>
            </div>
          </div>

          <nav aria-label="More legal pages" className="mt-10 hidden lg:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">More legal pages</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {legalPages.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.href === page ? "page" : undefined}
                    className={`block rounded-full px-3 py-1 text-xs font-semibold transition-colors ${l.href === page ? "bg-ink text-paper" : "bg-mist text-ink/65 hover:text-ink"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article id="policy" className="max-w-3xl space-y-12">
          {children}
        </article>
      </div>
    </div>
  );
}
