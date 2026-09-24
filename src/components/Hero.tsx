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
import { PillButton, TextLink } from "./ui";

const slides = [
  {
    lead: "One Login,",
    tail: "Endless",
    dim: "Impact.",
    image: "/images/banner/001.jpg",
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

const shared = {
  effect: "fade" as const,
  fadeEffect: { crossFade: true },
  speed: 800,
  parallax: true,
};

export default function Hero() {
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
      className="relative min-h-screen overflow-hidden bg-ink text-center"
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

      <div className="relative z-10 mx-auto flex min-h-[755px] max-w-5xl flex-col items-center justify-center px-4 pb-16 pt-28">
        <Image
          src="/images/icons-1.png"
          alt="Icon"
          width={40}
          height={40}
          className="mi-icon h-[40px] w-[40px]"
        />
        <p className="mt-5 text-base font-bold text-[#ECB22E]">
          Welcome to Missio
        </p>

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
          className="mt-6 w-full"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.lead}>
              {/* Outgoing title slides sideways, shrinks to 0.4 and fades; incoming one reverses it */}
              <div
                data-swiper-parallax="-50%"
                data-swiper-parallax-opacity="0"
                data-swiper-parallax-scale="0.4"
              >
                <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-mist sm:text-7xl lg:text-[90px]">
                  {s.lead}
                  <br />
                  {s.tail} <span className="text-[#2CB7DC]/65">{s.dim}</span>
                </h1>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <p className="mx-auto mt-8 max-w-3xl text-xl font-medium leading-8 text-paper">
          Run your mission, not your software stack. That&rsquo;s Missio.
        </p>
        <div className="mx-auto my-8 w-50 border-t border-dashed border-paper/30" />
        <div className="flex flex-wrap items-center justify-center gap-8">
          <PillButton href="#">See Demo</PillButton>
          <TextLink href="#" light>
            Watch the 2-min Overview
          </TextLink>
        </div>
        <div className="hero-pagination mt-12 flex justify-center gap-2" />
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
