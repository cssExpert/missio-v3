import { existsSync } from "node:fs";
import path from "node:path";
import Newsletter from "./Newsletter";
import ParallaxImage from "./ParallaxImage";
import { Arrow, Logo, TextLink } from "./ui";

// Footer menus from missio.io; every link is a "#" placeholder for now.
const columns = [
  {
    title: "Engines",
    links: [
      ["Growth Engine", "#"],
      ["Relationship Engine", "#"],
      ["Execution Engine", "#"],
      ["Revenue Engine", "#"],
      ["MIRA AI", "#"],
      ["Compare Missio", "#"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Pricing", "#"],
      ["Contact Us", "#"],
      ["Book a Consultation", "#"],
      ["Careers", "#"],
      ["Newsroom", "#"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Stack audit worksheet", "#"],
      ["Migration guide", "#"],
      ["Benchmark report", "#"],
      ["Help center", "#"],
      ["Blog", "#"],
      ["Community", "#"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "#"],
      ["Terms", "#"],
      ["Refund Policy", "#"],
      ["Security", "#"],
      ["Accessibility", "#"],
      ["Cookie preferences", "#"],
      ["Data processing", "#"],
    ],
  },
];

// Missio's social profiles (from missio.io)
const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/missiosolutions/",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z",
  },
  {
    name: "X",
    href: "https://x.com/missiosolutions",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/MissioSoftwareSolutions/",
    path: "M13.5 21.9v-7.05h2.37l.36-2.76H13.5v-1.76c0-.8.22-1.34 1.37-1.34h1.46V6.53a19.6 19.6 0 0 0-2.13-.11c-2.1 0-3.55 1.29-3.55 3.65v2.02H8.27v2.76h2.38v7.05H13.5z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/missio_software_solutions/",
    path: "M12 7.25A4.75 4.75 0 1 0 12 16.75 4.75 4.75 0 0 0 12 7.25zm0 7.83a3.08 3.08 0 1 1 0-6.16 3.08 3.08 0 0 1 0 6.16zM17.3 5.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM7.6 2.5h8.8a5.1 5.1 0 0 1 5.1 5.1v8.8a5.1 5.1 0 0 1-5.1 5.1H7.6a5.1 5.1 0 0 1-5.1-5.1V7.6a5.1 5.1 0 0 1 5.1-5.1zm0 1.7A3.4 3.4 0 0 0 4.2 7.6v8.8a3.4 3.4 0 0 0 3.4 3.4h8.8a3.4 3.4 0 0 0 3.4-3.4V7.6a3.4 3.4 0 0 0-3.4-3.4H7.6z",
  },
];

// Looping background video for the brand card (public/videos); the card falls back to plain slate if the file is missing
const FOOTER_VIDEO = "/videos/missio-glow.mp4";

export default function Footer() {
  const hasVideo = existsSync(path.join(process.cwd(), "public", FOOTER_VIDEO));
  return (
    <footer id="contact">
      <div className="relative overflow-hidden">
        {/* Full-width photo under a slate overlay so the heading and buttons stay readable;
            it drifts with scroll (parallax) — see ParallaxImage */}
        <ParallaxImage
          src="/images/Parallax.jpg"
          alt="Your renewal quote. We&rsquo;ll bring the math."
          className="object-center"
        />
        {/* Blurred slate overlay: rgba(36,47,53,.7) + 10px backdrop blur */}
        <div className="absolute inset-0 bg-ink/70 backdrop-blur-[10px]" />
        <div className="relative mx-auto flex max-w-[1340px] flex-wrap items-center justify-between gap-6 px-4 py-20 sm:px-8">
          <div className="w-full max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-paper">
              Your renewal quote. We&rsquo;ll{" "}
              <span className="text-gold">bring</span> the math.
            </h2>
            <p className="mt-8 text-base leading-6 text-white/80">
              Forty-five minutes, no commitment, and a line-item comparison
              against what you pay today.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <TextLink href="#" light>
              See Demo
            </TextLink>
            <a
              href="mailto:hello@example.com"
              className="group inline-flex items-center gap-4 rounded-full bg-accent py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-highlight hover:text-ink"
            >
              Book A Consultation
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-accent">
                <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Full width, inset 12px all round like the hero banner; 12px between the cards on desktop */}
      <div className="px-3 pb-3 pt-20">
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-3">
          {/* Left: brand card with a looping background video */}
          <div className="relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-[28px] bg-ink p-8 shadow-[0_12px_40px_rgba(2,100,126,0.3)]">
            {hasVideo && (
              <video
                aria-hidden
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                src={FOOTER_VIDEO}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover motion-reduce:hidden"
              />
            )}
            {/* Tints the video to the theme primary (#02647E): "color" blend keeps its light and shadow, swaps the hue */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-primary mix-blend-color"
            />

            <div className="relative z-[1]">
              <Logo light />
            </div>
            <p className="relative z-[1] mt-auto mb-7 text-xl md:text-2xl font-extrabold leading-snug text-white">
              One platform,
              <br className="hidden md:block" />
              <span className="text-gold">Endless Impact.</span>
            </p>
            <div className="relative z-[1] flex items-center justify-between gap-3">
              <span className="font-hand text-xl text-white/90">
                Stay in touch!
              </span>
              <ul className="flex gap-2">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Missio on ${s.name} (opens in a new tab)`}
                      className="grid h-9 w-9 place-items-center rounded-[9px] bg-white text-ink shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-gold hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d={s.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: light card — floating badge, link columns, copyright and newsletter */}
          <div className="relative flex flex-col justify-between rounded-[28px] bg-mist p-6 sm:p-10">
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4 md:grid-cols-4"
            >
              {columns.map((c) => (
                <div key={c.title}>
                  <h6 className="mb-5 block text-base font-extrabold uppercase tracking-[0.1em] text-ink">
                    {c.title}
                  </h6>
                  <ul className="space-y-3">
                    {c.links.map(([label, href]) => (
                      <li key={label}>
                        <a
                          href={href}
                          className="text-sm font-medium text-ink transition-colors hover:text-primary"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-12 flex flex-col-reverse gap-8 sm:flex-row sm:items-end sm:justify-between border-t border-ink/10 pt-6">
              <p className="text-xs font-medium text-ink/50">
                © {new Date().getFullYear()} Missio.io. All rights reserved.
              </p>
              {/* Pass endpoint="/api/newsletter" (or your provider's URL) once sign-ups are connected */}
              <Newsletter className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
