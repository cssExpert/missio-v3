import Moments from "./Moments";
import { TextLink } from "./ui";

export default function Features() {
  return (
    <section className="bg-mist py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="w-full max-w-xl">
            <span className="eyebrow">Sound familiar?</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Teams come to us at one of <span className="text-gold">six</span>{" "}
              moments
            </h2>
            <p className="mt-5 max-w-lg text-base leading-6 text-ink/80">
              If any of these is happening right now, the cost of waiting
              another renewal cycle is measured in staff hours.
            </p>
          </div>
          <TextLink href="#">Let&apos;s Talk</TextLink>
        </div>
        {/* "Six moments" cards from missio.io */}
        <Moments />
      </div>
    </section>
  );
}
