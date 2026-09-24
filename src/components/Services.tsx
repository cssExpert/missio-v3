import Image from "next/image";
import { TextLink } from "./ui";

const services = [
  {
    title: "Growth Strategy & Roadmaps",
    text: "Set clear goals, agree on priorities and map the steps that get your organization from plan to progress.",
    image: "/images/service-1.jpg",
  },
  {
    title: "Customer & Market Studies",
    text: "Understand who you serve and what they need, using real data from your donors, customers and market.",
    image: "/images/service-2.jpg",
  },
  {
    title: "Operating Model Redesign",
    text: "Simplify how work flows between teams and tools, so fewer tasks fall through the cracks.",
    image: "/images/service-3.jpg",
  },
  {
    title: "Leadership & Change Support",
    text: "Help your leaders bring people along, so new ways of working are adopted and actually stick.",
    image: "/images/service-4.jpg",
  },
];

export default function Services() {
  return (
    <section id="services" className="pt-20 md:pt-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Services</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight">
              Solutions That Drive
              <br className="hidden md:block" />
              <span className="text-gold">Business</span> Forward
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="text-sm text-ink/65 mb-0">
              Focused. Strategic. Built for growth.
            </p>
            <TextLink href="#contact">Let&apos;s Talk</TextLink>
          </div>
        </div>
      </div>
      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4">
        {/* On hover (desktop): photo blurs and zooms, overlay deepens, the + button fades in and the description slides open.
            Touch screens have no hover, so there the button and description are always shown. */}
        {services.map((s) => (
          <a
            key={s.title}
            href="#contact"
            className="group angle relative block aspect-[3/4] overflow-hidden"
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 ease-out lg:group-hover:scale-110 lg:group-hover:blur-md lg:group-focus-visible:scale-110 lg:group-focus-visible:blur-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute inset-0 bg-ink/45 transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100" />

            <div className="absolute inset-x-8 bottom-10">
              <span className="mb-6 grid h-11 w-11 place-items-center rounded-full bg-gold text-ink transition duration-500 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </span>
              <h4 className="text-lg font-extrabold leading-tight text-paper">
                {s.title}
              </h4>
              {/* grid-rows 0fr → 1fr animates the description's height without a fixed max-height */}
              <div className="grid transition-all duration-500 ease-out lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-visible:grid-rows-[1fr] lg:group-focus-visible:opacity-100">
                <p className="overflow-hidden">
                  <span className="mt-4 line-clamp-2 block text-sm leading-6 text-paper/70">
                    {s.text}
                  </span>
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
