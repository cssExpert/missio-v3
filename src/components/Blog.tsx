import Image from "next/image";
import { PillButton, TextLink } from "./ui";

const posts = [
  {
    category: "Strategy",
    date: "Sep 12, 2026",
    title: "Five Questions to Ask Before Writing Next Year's Plan",
    excerpt:
      "Most annual plans fail in the first quarter. A short set of honest questions up front can save months of rework later.",
    image: "/images/service-1.jpg",
  },
  {
    category: "Operations",
    date: "Aug 28, 2026",
    title: "Where Growing Teams Quietly Lose Their Time",
    excerpt:
      "Handoffs, duplicate reports and unclear owners add up. Here is how we find the hidden hours in a typical week.",
    image: "/images/service-2.jpg",
  },
  {
    category: "Leadership",
    date: "Aug 9, 2026",
    title: "Making Change Stick After the Consultants Leave",
    excerpt:
      "The real test of any project is month six. A few habits make the difference between a new process and an old one.",
    image: "/images/service-3.jpg",
  },
];

function CalendarIcon() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-mist text-ink/70">
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <rect x="2.5" y="3.5" width="11" height="10" rx="1" />
        <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
      </svg>
    </span>
  );
}

export default function Blog() {
  return (
    <section id="blog" className="bg-mist py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Blog</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Notes From the Field
              <br className="hidden md:block" />
              on <span className="text-gold">Growing</span> Well
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="text-sm text-ink/65 mb-0">
              Lessons from recent client work
            </p>
            <TextLink href="#">View all</TextLink>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="flex flex-col bg-paper">
              <div className="angle relative aspect-[1.54] overflow-hidden">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <span className="absolute left-6 top-6 rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-paper">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-8 sm:px-9">
                <div className="flex items-center gap-4 text-xs text-ink/80">
                  <span>Missio team</span>
                  <CalendarIcon />
                  <time>{p.date}</time>
                </div>
                <div className="my-6 border-t border-dashed border-ink/20" />
                <h4 className="text-lg font-extrabold leading-snug">
                  {p.title}
                </h4>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-ink/70">
                  {p.excerpt}
                </p>
                <div className="mt-auto pt-8">
                  <PillButton href="#">Read more</PillButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
