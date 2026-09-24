import Image from "next/image";
import CtaStats from "./CtaStats";
import ParallaxImage from "./ParallaxImage";

export default function CtaBanner() {
  return (
    <section id="nonprofits" className="relative overflow-hidden bg-ink">
      {/* Photo fills the right half and fades into the slate on its left edge */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/4">
        {/* Team at a laptop with teal light trails; pans gently on scroll (ParallaxImage) */}
        <ParallaxImage
          src="/images/Missio-Benefits-Bg.jpg"
          alt="A team smiling around a laptop in a bright office"
          strength={12}
        />
        {/* Solid only at the photo's left edge (hides the seam), then quickly turns see-through */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent md:via-ink/75 md:via-35%" />
      </div>

      <div className="relative mx-auto max-w-[1340px] px-4 py-20 sm:px-8 lg:py-24">
        <div className="max-w-2xl">
          <div className="mil-icon mil-c-m-4 mil-mb-2">
            <Image
              src="/images/icons-6.png"
              alt=">Benefits for Non-Profits"
              width={50}
              height={50}
              className="mi-icon h-[60px] w-[60px]"
            />
          </div>
          <span className="mt-6 eyebrow gold">Future Starts Now</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-mist">
            Why Wait? Get Ahead
            <br className="hidden md:block" />
            of the <span className="text-gold">Change!</span>
          </h2>
        </div>

        {/* Stats strip from missio.io: count-up numbers on glass cards */}
        <CtaStats />
      </div>
    </section>
  );
}
