import { PillButton } from "./ui";

const features = [
  "Kickoff workshop",
  "Market snapshot",
  "Competitor review",
  "Written action plan",
  "Operations deep dive",
  "Quarterly check-ins",
  "Bespoke research",
];

const plans = [
  { name: "Starter", price: 450, included: 3 },
  { name: "Scale", price: 950, included: 5 },
  { name: "Partner", price: 2800, included: 7 },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-24">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Simple Pricing,
            <br className="hidden md:block" />
            Sized to <span className="text-gold">Your Stage</span>
          </h2>
        </div>
        <div className="mt-16 grid gap-3 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className="angle bg-mist p-10 sm:px-14">
              <h6 className="font-bold">{p.name}</h6>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="self-center text-xl font-extrabold">$</span>
                <span className="text-5xl font-extrabold">{p.price}</span>
                <span className="text-xs text-ink/60">/ one-time</span>
              </div>
              <p className="mt-6 text-sm leading-6 text-ink/75">
                A focused package for teams that need clarity on where to act
                first.
              </p>
              <ul className="my-8 space-y-4 border-y border-dashed border-ink/20 py-8 text-sm">
                {features.map((f, n) => {
                  const on = n < p.included;
                  return (
                    <li
                      key={f}
                      className={`flex items-center gap-3 ${on ? "" : "text-ink/35"}`}
                    >
                      <span
                        className={`grid h-4 w-4 place-items-center rounded-full text-white ${on ? "bg-accent" : "bg-ink/20"}`}
                      >
                        <svg
                          viewBox="0 0 12 12"
                          className="h-2.5 w-2.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path d="M2.5 6.5l2.5 2 4.5-5" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  );
                })}
              </ul>
              <PillButton href="#">Choose a plan</PillButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
