"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

type Crumb = { label: string; href?: string };

type Props = {
  title: ReactNode;
  // Faded tail of the title, like the dim word in the home hero
  dim?: string;
  // Optional supporting line under the title
  text?: string;
  breadcrumbs: Crumb[];
  image?: string;
};

// Inner-page banner: photo under a dark overlay, centred title and breadcrumb trail.
// Inset with rounded corners to match the home hero; the photo zooms in as the banner scrolls away.
export default function PageBanner({
  title,
  dim,
  text,
  breadcrumbs,
  image = "/images/banner/img-5-old.jpg",
}: Props) {
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = zoomRef.current;
      if (!el) return;
      const height = el.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
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
    // Capped at 530px tall; content is centred in the space below the fixed header
    <section className="relative isolate m-3 flex max-h-[530px] overflow-hidden rounded-3xl bg-ink lg:h-[530px]">
      <div
        ref={zoomRef}
        className="absolute inset-0 origin-top will-change-transform"
      >
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="absolute inset-0 bg-ink/80" />

      {/* Top padding clears the fixed header */}
      <div className="relative mx-auto flex w-full max-w-[1340px] flex-col justify-center px-6 pb-16 pt-36 text-center sm:px-8 lg:pb-12 lg:pt-28">
        <h1 className="mx-auto max-w-6xl text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-mist">
          {title}
          {dim && (
            <>
              {" "}
              <span className="text-[#2CB7DC]/65">{dim}</span>
            </>
          )}
        </h1>

        {text && (
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-paper/75 sm:text-lg sm:leading-8">
            {text}
          </p>
        )}

        <nav aria-label="Breadcrumb" className="mt-5 lg:mt-8">
          <ol className="flex flex-wrap items-center justify-center gap-y-2 text-base text-mist">
            {breadcrumbs.map((c, n) => {
              const last = n === breadcrumbs.length - 1;
              return (
                <li key={c.label} className="flex items-center">
                  {last ? (
                    <span aria-current="page" className="text-gold">
                      {c.label}
                    </span>
                  ) : (
                    <a
                      href={c.href ?? "#"}
                      className="transition-colors duration-200 hover:text-gold"
                    >
                      {c.label}
                    </a>
                  )}
                  {!last && (
                    <span aria-hidden className="mx-5 text-paper/50">
                      /
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
