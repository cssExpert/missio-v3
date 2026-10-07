"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CreditCard, Landmark } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

// Cancellation timeline: one service period with its last 7 business days marked as the notice window,
// and the policy's rule for requests received inside that window.
export function CancellationTimeline() {
  const reduce = useReducedMotion();
  const show = { opacity: 1, y: 0 };
  const hide = { opacity: 0, y: reduce ? 0 : 10 };
  return (
    <figure className="angle-sm mt-8 overflow-hidden bg-ink p-6 text-paper sm:p-8">
      <figcaption className="text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50">
        How the 7-business-day notice works
      </figcaption>
      <div className="relative mt-10">
        {/* The service period bar, drawing in from the left */}
        <div className="relative h-3 overflow-hidden rounded-full bg-paper/10">
          <motion.div
            className="absolute inset-y-0 left-0 w-[78%] origin-left rounded-l-full bg-gradient-to-r from-primary to-accent-soft"
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-[22%] rounded-r-full bg-[repeating-linear-gradient(135deg,#f2a73d_0_6px,#c9842a_6px_12px)]"
            initial={{ opacity: reduce ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 1 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-semibold text-paper/50">
          <span>Current service period begins</span>
          <span>Period ends</span>
        </div>
        <span className="absolute -top-7 right-[22%] translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-ink">
          7 business days
        </span>
        <span aria-hidden className="absolute -top-1 right-[22%] h-5 w-0.5 bg-gold" />
      </div>

      {/* Restates the policy's rule only; it says nothing about requests made earlier, so neither do we */}
      <motion.p
        initial={hide}
        whileInView={show}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 1.1, ease }}
        className="mt-8 rounded-2xl bg-gold/10 p-4 text-sm leading-6 text-paper/85 ring-1 ring-gold/30"
      >
        <span className="font-bold text-gold">Inside the striped window:</span> requests received later than 7 business
        days before the end of the current service period are treated as cancellation of services for the{" "}
        <strong className="text-paper">next</strong> service period.
      </motion.p>
    </figure>
  );
}

// Refund routes: money goes back the way it came
export function RefundRoutes() {
  const reduce = useReducedMotion();
  const rows = [
    { Icon: CreditCard, from: "Paid by credit card", to: "Refunded to the original credit card used at purchase" },
    { Icon: Landmark, from: "Paid another way", to: "Refunded to the same account it was paid from" },
  ];
  return (
    <figure className="mt-8 space-y-3">
      <figcaption className="sr-only">Where refunds are sent</figcaption>
      {rows.map(({ Icon, from, to }, i) => (
        <motion.div
          key={from}
          initial={{ opacity: 0, x: reduce ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.15, ease }}
          className="angle-sm flex flex-wrap items-center gap-4 bg-mist p-4 sm:flex-nowrap sm:p-5"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-primary">
            <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </span>
          <span className="text-sm font-bold">{from}</span>
          <span className="relative mx-2 hidden h-px flex-1 bg-ink/15 sm:block" aria-hidden>
            {!reduce && (
              <motion.span
                className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-gold"
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
              />
            )}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold sm:hidden" aria-hidden />
          <span className="text-sm leading-6 text-ink/75 sm:max-w-[260px]">{to}</span>
        </motion.div>
      ))}
    </figure>
  );
}
