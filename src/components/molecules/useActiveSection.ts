"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { links, pages, sectionFor } from "@/components/molecules/navData";

// Scrollspy: returns the id of the section currently under a line 35% down the viewport, or null between them
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key.split(",");
    let frame = 0;
    const update = () => {
      const probe = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of list) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top <= probe && r.bottom > probe) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}

// The header link to highlight: the link for the page that's open (About, Why Missio),
// otherwise the one whose section is on screen
export function useCurrentLink() {
  const pathname = usePathname();
  const activeSection = useActiveSection(Object.values(sectionFor));
  return (
    links.find((l) => pages[l] === pathname) ??
    links.find((l) => sectionFor[l] === activeSection) ??
    null
  );
}
