import Image from "next/image";
import CountUp from "./CountUp";
import ScrollScale from "./ScrollScale";
import TrustedBy from "./TrustedBy";
import { PillButton, TextLink } from "./ui";

const stats = [
  {
    label: ["Ready-made", "integrations"],
    value: 50,
    suffix: "+",
    gold: false,
  },
  {
    label: ["Apps connected", "via Zapier"],
    value: 5000,
    suffix: "+",
    gold: true,
  },
];

const avatars = [
  "/images/users-1.jpg",
  "/images/users-2.jpg",
  "/images/users-3.jpg",
  "/images/users-4.jpg",
];

// About, under the hero: text and team avatars on the left, photo with stat cards on the right, logo wall below
export default function About() {
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1340px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Image
            src="/images/icons-6.png"
            alt="Icon"
            width={50}
            height={50}
            className="h-[60px] w-[60px]"
          />
          <h2 className="mt-8 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Every hour spent wrestling with software steals an{" "}
            <span className="text-gold">hour</span> from the mission.
          </h2>
          <h3 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-gold">
            Missio gives that time back.
          </h3>
          <div className="mt-8 max-w-2lg space-y-4 text-base leading-6 text-ink/80">
            <p>
              Your team&rsquo;s time is too valuable to lose to complicated
              tools and disconnected workflows. Missio brings your work into one
              place, so you can spend less time managing software and more time
              making an impact.
            </p>
            <p>
              When systems get in the way, meaningful work slows down. Missio
              helps your team stay organized, work together, and focus on the
              people you serve.
            </p>
          </div>
          <ul className="mt-8 flex -space-x-3">
            {avatars.map((src) => (
              <li key={src}>
                <Image
                  src={src}
                  alt=""
                  width={100}
                  height={100}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-paper"
                />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <PillButton href="#services">Services</PillButton>
            <TextLink href="#contact">Contact us</TextLink>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="angle relative aspect-[2/3] max-h-[680px] w-full overflow-hidden">
            <ScrollScale>
              <Image
                src="/images/Missio-Trust.jpg"
                alt="A Missio advisor reviewing documents with a client"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </ScrollScale>
            <div className="absolute inset-0 bg-ink/30" />
            <div className="absolute inset-x-5 bottom-5 space-y-2 sm:inset-x-8 sm:bottom-8">
              {stats.map((s) => (
                <div
                  key={s.label.join(" ")}
                  className="flex items-center justify-between gap-4 rounded-lg bg-ink/50 px-6 py-5 backdrop-blur-md sm:px-8"
                >
                  <h6 className="text-sm font-bold leading-tight text-mist">
                    <span className="text-gold">{s.label[0]}</span>
                    <br />
                    {s.label[1]}
                  </h6>
                  <span
                    className={`text-4xl font-extrabold sm:text-5xl ${s.gold ? "text-gold" : "text-mist"}`}
                  >
                    <CountUp to={s.value} />
                    <span className={s.gold ? "text-mist" : "text-gold"}>
                      {s.suffix}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client logos: animated count-up and two scroll-reactive marquee rows */}
      <TrustedBy />
    </section>
  );
}
