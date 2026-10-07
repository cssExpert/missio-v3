"use client";

import { useEffect, useRef } from "react";

// Muted background video that really autoplays on iPhone. iOS Safari only autoplays a video that is muted at the
// moment it starts, and React sets `muted` as a property only, so we set it every way here and call play()
// ourselves. Low Power Mode blocks autoplay until the visitor interacts, so we also retry on the first touch,
// scroll or return to the tab.
export default function AutoplayVideo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    const tryPlay = () => {
      if (v.paused) v.play().catch(() => {});
    };
    tryPlay();
    const events = ["touchstart", "pointerdown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));
    document.addEventListener("visibilitychange", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      events.forEach((e) => window.removeEventListener(e, tryPlay));
      document.removeEventListener("visibilitychange", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <video ref={ref} aria-hidden autoPlay muted loop playsInline preload="auto" src={src} className={className} />
  );
}
