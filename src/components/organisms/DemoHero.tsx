"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Phone } from "lucide-react";
import DemoForm from "@/components/molecules/DemoForm";
import StackCollapse from "@/components/molecules/StackCollapse";

const PHONE = "(844) 568-0941";

const intro: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

// Demo page hero: the pitch and the stack animation on the left, the booking form on the right.
// Inset rounded card like the home hero; the photo zooms in as it scrolls away.
export default function DemoHero() {
  const reduce = useReducedMotion();
  const zoomRef = useRef<HTMLDivElement>(null);
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = zoomRef.current;
      if (!el) return;
      const progress = Math.min(Math.max(window.scrollY / (el.offsetHeight || 1), 0), 1);
      el.style.transform = `scale(${1 + progress * 0.3})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="demo" className="relative isolate m-3 overflow-hidden rounded-3xl bg-ink">
      <div ref={zoomRef} className="absolute inset-0 origin-top will-change-transform">
        <Image src="/images/banner/001.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/70" />
      {/* Slow drifting glows */}
      {!reduce && (
        <>
          <motion.span aria-hidden className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[120px]" animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
          <motion.span aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-gold/15 blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        </>
      )}

      {/* -mx-3 undoes the card inset so the content lines up with the logo */}
      <div className="relative -mx-3">
        {/* Phones: pitch, form, then the stack animation. Wide screens: pitch and animation on the left, form on the right */}
        <div className="mx-auto grid max-w-[1340px] content-center gap-10 px-6 pb-16 pt-32 sm:px-8 lg:min-h-[calc(100svh-1.5rem)] lg:grid-cols-[6fr_5fr] lg:gap-x-16 lg:gap-y-8 lg:pt-36">
          <motion.div variants={intro} initial="hidden" animate="show" className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <motion.span variants={rise} className="eyebrow gold">Book a demo</motion.span>
            <motion.h1 variants={rise} className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-mist sm:text-6xl lg:text-[64px]">
              Bring your renewal quote. We&rsquo;ll <span className="text-gold">bring</span> the math.
            </motion.h1>
            <motion.p variants={rise} className="mt-6 max-w-xl text-lg leading-8 text-paper/75">
              Show us what you&rsquo;re paying across every tool today, and we&rsquo;ll show you the same work in one
              system &mdash; with the real annual difference in writing.
            </motion.p>
          </motion.div>

          <motion.div variants={intro} initial="hidden" animate="show" className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
            <motion.div variants={rise} className="max-w-xl">
              <StackCollapse />
            </motion.div>
            <motion.a
              variants={rise}
              href={`tel:${PHONE.replace(/\D/g, "")}`}
              className="group mt-8 inline-flex items-center gap-4 text-paper"
            >
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                {!reduce && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-primary/50 [animation-duration:2.4s]" />}
                <Phone className="relative h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Prefer to talk now?</span>
                <span className="block text-lg font-extrabold transition-colors group-hover:text-gold">{PHONE}</span>
              </span>
            </motion.a>
          </motion.div>

          <motion.div
            className="order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
            initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <DemoForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
