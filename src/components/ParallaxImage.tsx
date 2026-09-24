"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

type Props = {
  src: string;
  alt: string;
  /** How far the image pans, in percent either side of centre (object-position 50% ± strength) */
  strength?: number;
  className?: string;
};

// Fills its (relative, overflow-hidden) parent with an image whose own object-position pans vertically
// as the parent scrolls through the viewport — the <img> itself moves inside a fixed frame.
export default function ParallaxImage({ src, alt, strength = 20, className = "" }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();

  // 0 when the frame's top enters the bottom of the screen, 1 when its bottom leaves the top
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });

  const apply = (progress: number) => {
    const img = imgRef.current;
    if (!img || reduce) return;
    const yPos = 50 - strength + progress * strength * 2; // e.g. 30% → 70%
    img.style.objectPosition = `50% ${yPos.toFixed(2)}%`;
  };

  useMotionValueEvent(scrollYProgress, "change", apply);
  // Set the correct position on mount, before any scroll happens
  useEffect(() => apply(scrollYProgress.get()));

  return (
    <div ref={frameRef} className="absolute inset-0 overflow-hidden">
      <Image ref={imgRef} src={src} alt={alt} fill sizes="100vw" className={`object-cover ${className}`} />
    </div>
  );
}
