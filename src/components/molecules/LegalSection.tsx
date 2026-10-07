import type { ReactNode } from "react";

// One numbered section of a legal page: outlined number, title, then the policy text
export default function LegalSection({
  n,
  id,
  title,
  children,
}: {
  n: number;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-ink/10 pt-12 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-5">
        <span
          aria-hidden
          className="font-heading text-6xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(2,100,126,0.35)]"
        >
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      </div>
      <div className="mt-6 space-y-5 text-[17px] leading-8 text-ink/75">{children}</div>
    </section>
  );
}
