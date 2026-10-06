import Image from "next/image";
import type { ReactNode } from "react";

// The path points right; it is tilted 45° so the arrow rests diagonal (↘) and the -rotate-45 hover classes straighten it (→)
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      className={`h-3.5 w-3.5 ${className}`}
      fill="currentColor"
      aria-hidden
    >
      <g transform="rotate(45 320 320)">
        <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
      </g>
    </svg>
  );
}

// White logo for dark backgrounds, teal logo for light ones
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#" className="block shrink-0">
      <Image
        // Trimmed copies without the transparent padding, so the height class is the logo's real size
        src={
          light ? "/images/logo-light-trim.png" : "/images/logo-dark-trim.png"
        }
        alt="Missio"
        width={480}
        height={64}
        priority={light}
        className="h-4 w-auto sm:h-5 lg:h-6"
      />
    </a>
  );
}

type PillVariant = "accent" | "dark" | "light";
type PillProps = { href?: string; variant?: PillVariant; children: ReactNode };

const pillStyles: Record<PillVariant, { pill: string; dot: string }> = {
  accent: {
    pill: "bg-accent text-white hover:bg-highlight hover:text-ink",
    dot: "bg-gold text-ink group-hover:bg-accent group-hover:text-white",
  },
  dark: {
    pill: "bg-black text-paper hover:bg-accent",
    dot: "bg-accent text-white group-hover:bg-ink",
  },
  light: {
    pill: "bg-mist text-ink hover:bg-black hover:text-white",
    dot: "bg-accent text-white group-hover:bg-gold group-hover:text-ink",
  },
};

// On hover the pill and circle swap colours and the diagonal arrow turns to point right
export function PillButton({
  href = "#",
  variant = "accent",
  children,
}: PillProps) {
  const { pill: styles, dot } = pillStyles[variant];
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-6 rounded-full py-2 pl-7 pr-2 text-sm font-medium transition-colors duration-300 ${styles}`}
    >
      {children}
      <span
        className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-300 ${dot}`}
      >
        <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
      </span>
    </a>
  );
}

export function TextLink({
  href = "#",
  light = false,
  children,
}: {
  href?: string;
  light?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 text-sm font-medium ${light ? "text-paper" : "text-ink"}`}
    >
      {children}
      {/* Diagonal arrow turns to point straight right on hover, like the pill buttons */}
      <Arrow
        className={`transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45 ${light ? "text-accent-soft" : "text-accent"}`}
      />
    </a>
  );
}

/* Stand-in for photography: swap for next/image with your own photos */
export function ImageSlot({
  tone = 0,
  className = "",
}: {
  tone?: number;
  className?: string;
}) {
  const gradients = [
    "from-[#1d3b44] via-[#2c5563] to-[#0f2229]",
    "from-[#02647e] via-[#2a8aa3] to-[#0b3a47]",
    "from-[#3a4a52] via-[#5f7680] to-[#242f35]",
    "from-[#16323b] via-[#0f4c5e] to-[#1c2a30]",
  ];
  return (
    <div
      className={`bg-gradient-to-br ${gradients[tone % gradients.length]} ${className}`}
      aria-hidden
    />
  );
}
