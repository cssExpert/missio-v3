import Image from "next/image";
import { PillButton, TextLink } from "./ui";

export default function Mission() {
  return (
    <section
      id="mission"
      className="relative lg:grid lg:min-h-[760px] lg:grid-cols-2"
    >
      <div className="px-4 py-24 sm:px-8 lg:py-32 lg:pl-[max(2rem,calc((100vw-1340px)/2+2rem))] lg:pr-16">
        <span className="eyebrow">Focus On Your Mission</span>
        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
          We will help you <span className="text-gold">Grow</span>
        </h2>
        <p className="mt-8 max-w-lg text-base leading-6 text-ink/80">
          Missio.io is the smart, scalable software built for businesses on a
          mission to grow. Whether you&rsquo;re a startup, nonprofit, coach,
          educator, or eCommerce brand, our ERP-style platform helps you
          streamline operations, automate daily workflows, and reduce manual
          workloads—so you can focus on impact and growth.
        </p>
        <p className="mt-5 max-w-lg text-base leading-6 text-ink/80">
          From workflow automation to centralized business processes, we provide
          the digital tools that modern, purpose-driven leaders need to thrive.
        </p>

        {/* Founder card: portrait on a tilted backing panel, name and a handwritten note */}
        <div className="mt-14 flex flex-col gap-10 sm:flex-row sm:items-center">
          <div className="relative w-40 shrink-0">
            <div className="absolute inset-0 -rotate-6 bg-mist" aria-hidden />
            <Image
              src="/images/ria.png"
              alt="Portrait of our founder"
              width={501}
              height={701}
              sizes="160px"
              className="relative h-56 w-40 object-cover"
            />
          </div>
          <div>
            <span
              className="block font-hand text-5xl leading-none text-primary"
              aria-hidden
            >
              &ldquo;
            </span>
            <p className="mt-2 text-sm">
              <span className="font-bold">Ria Nancoo</span>
              <span className="mx-2 text-ink/40">/</span>
              <span className="text-xs text-ink/60">Founder</span>
            </p>
            <p className="mt-5 max-w-xs font-hand text-2xl leading-snug text-ink">
              We listen first, then help you move with confidence.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <PillButton href="#">Services</PillButton>
          <TextLink href="#">Read More</TextLink>
        </div>
      </div>

      {/* Photo fills the right half, edge to edge, with the cut top-right corner */}
      <div className="angle relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto">
        <Image
          src="/images/Missio-Help-Grow.jpg"
          alt="The team outside the office"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </section>
  );
}
