"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Autoplay,
  Controller,
  EffectFade,
  Navigation,
  Pagination,
  Parallax,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import { PillButton } from "./ui";

const slides = [
  {
    lead: "One Login,",
    tail: "Endless",
    dim: "Impact.",
    image: "/images/banner/01.jpg",
  },
  {
    lead: "Sharper Focus",
    tail: "For Bolder",
    dim: "Moves",
    image: "/images/banner/02.jpg",
  },
  {
    lead: "Steady Growth",
    tail: "Without the",
    dim: "Guesswork",
    image: "/images/banner/03.jpg",
  },
];

const trustPoints = [
  "Migration included",
  "No IT department required",
  "Up and running in days",
];

const shared = {
  effect: "fade" as const,
  fadeEffect: { crossFade: true },
  speed: 800,
  parallax: true,
  // After the last slide, go back to the first so autoplay keeps cycling (with fade this looks like a loop)
  rewind: true,
};

// Left-aligned version of Hero: content lines up with the logo and the left edge of the other sections
export default function HeroLeft() {
  // The title slider drives the background slider through Swiper's Controller module
  const [bg, setBg] = useState<SwiperType | null>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Zoom the background in as the hero scrolls out of view
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = zoomRef.current;
      if (!el) return;
      const height = el.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
      el.style.transform = `scale(${1 + progress * 0.65})`;
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
    <section
      id="home"
      // Height = viewport minus the 12px top and 12px bottom inset (1.5rem), so the gap shows on every screen height
      className="relative isolate m-3 min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-3xl bg-ink text-left"
    >
      <div
        ref={zoomRef}
        className="absolute inset-0 origin-center will-change-transform"
      >
        <Swiper
          {...shared}
          modules={[EffectFade, Parallax]}
          onSwiper={setBg}
          allowTouchMove={false}
          className="!absolute inset-0"
        >
          {slides.map((s, n) => (
            <SwiperSlide key={s.lead} className="overflow-hidden bg-ink">
              {/* Swiper Parallax zooms the incoming background from 1.4 down to 1 */}
              <div
                className="absolute inset-0"
                data-swiper-parallax-scale="1.4"
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  priority={n === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hero-overlay absolute inset-0 z-[1]" />

      {/* -mx-3 undoes the card inset so the text lines up with the logo and the other sections */}
      <div className="relative z-10 -mx-3">
        <div className="relative mx-auto flex min-h-[calc(100svh-1.5rem)] max-w-[1340px] flex-col items-start justify-center px-6 pb-16 pt-28 sm:px-8">
          <Swiper
            {...shared}
            modules={[
              Autoplay,
              Controller,
              EffectFade,
              Navigation,
              Pagination,
              Parallax,
            ]}
            controller={{ control: bg }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
            pagination={{ el: ".hero-pagination", clickable: true }}
            className="mt-6 w-full max-w-5xl !mx-0 short:mt-3"
          >
            {slides.map((s) => (
              <SwiperSlide key={s.lead}>
                {/* Outgoing title slides sideways, shrinks to 0.4 and fades; incoming one reverses it */}
                <div
                  data-swiper-parallax="-50%"
                  data-swiper-parallax-opacity="0"
                  data-swiper-parallax-scale="0.4"
                >
                  <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight text-mist sm:text-7xl lg:text-[90px] short:sm:text-6xl short:lg:text-[68px]">
                    {s.lead}
                    <br className="hidden md:block" />
                    {s.tail} <span className="text-[#2CB7DC]/65">{s.dim}</span>
                  </h1>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <p className="my-6 short:my-8 max-w-2xl text-xl font-medium leading-8 text-paper">
            Run your mission, not your software stack. That&rsquo;s Missio.
          </p>
          <div className="flex flex-wrap items-center justify-start gap-8">
            <PillButton href="#services">See Demo</PillButton>
            <PillButton href="#contact" variant="light">
              Watch the 2-min Overview
            </PillButton>
          </div>
          {/* Trust points under the buttons: gold ticks, thin dividers between items on wider screens */}
          <ul className="mt-10 short:mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-paper/90 sm:text-base">
            {trustPoints.map((t, n) => (
              <li
                key={t}
                className={`flex items-center gap-3 ${n > 0 ? "sm:border-l sm:border-paper/15 sm:pl-8" : ""}`}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40">
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.5 6.5l2.5 2 4.5-5" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
          {/* Slide bars pinned 40px above the banner's bottom edge, lined up with the text */}
          <div className="hero-pagination absolute bottom-10 left-6 flex justify-start gap-2 sm:left-8" />
        </div>
      </div>

      {/* <button
        aria-label="Previous slide"
        className="hero-prev absolute bottom-24 left-6 z-10 grid h-9 w-9 rotate-90 place-items-center rounded-full bg-accent text-white sm:left-24"
      >
        <Arrow />
      </button>
      <button
        aria-label="Next slide"
        className="hero-next absolute bottom-24 right-6 z-10 grid h-9 w-9 place-items-center rounded-full bg-accent text-white sm:right-24"
      >
        <Arrow />
      </button> */}
    </section>
  );
}
