import { CalendarClock, ShieldCheck, Undo2, type LucideIcon } from "lucide-react";

// Plain-English summary of the refund policy for its hero; every line restates the policy text and nothing more
const summary: { Icon: LucideIcon; title: string; text: string; href: string }[] = [
  {
    Icon: ShieldCheck,
    title: "Refunds when you're genuinely unhappy",
    text: "If you're displeased with the services, we refund when the reasons are genuine and proven after investigation.",
    href: "#return-policy",
  },
  {
    Icon: CalendarClock,
    title: "Cancel by contacting us",
    text: "Requests received in the last 7 business days of a service period are treated as cancellation for the next period.",
    href: "#cancellation-policy",
  },
  {
    Icon: Undo2,
    title: "Money goes back the way it came",
    text: "Card payments are refunded to the original card; other payments to the same account.",
    href: "#refund-policy",
  },
];

export default function RefundSummary() {
  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-paper/45">
        In plain English &middot; a summary, not the policy itself
      </p>
      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {summary.map(({ Icon, title: t, text, href }) => (
          <li key={t}>
            <a
              href={href}
              className="group angle-sm flex h-full flex-col bg-paper/[0.05] p-5 ring-1 ring-inset ring-paper/10 transition-colors duration-300 hover:bg-paper/[0.09]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold transition-transform duration-500 group-hover:-rotate-6">
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </span>
              <span className="mt-4 font-heading text-lg font-extrabold leading-snug text-mist">{t}</span>
              <span className="mt-2 text-sm leading-6 text-paper/65">{text}</span>
              <span className="mt-auto pt-4 text-xs font-semibold text-accent-soft group-hover:text-gold">
                Read the clause &darr;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
