"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, FileSpreadsheet, HelpCircle, Layers, Megaphone, Database } from "lucide-react";
import { Arrow } from "@/components/atoms/ui";
import { items as orgTypes } from "@/components/organisms/Integrations";

// "Book A Demo" form from missio.io/demo, split into two steps.
// TODO: nothing is sent yet; post `values` to the CRM / booking endpoint in `submit`.
type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  orgType: string;
  currentSystem: string;
};
type Key = keyof Values;

const empty: Values = { firstName: "", lastName: "", email: "", phone: "", organization: "", orgType: "", currentSystem: "" };

const systems = [
  { label: "Legacy donor CRM", icon: Database },
  { label: "Enterprise CRM", icon: Layers },
  { label: "Marketing CRM", icon: Megaphone },
  { label: "Spreadsheets", icon: FileSpreadsheet },
  { label: "Other", icon: HelpCircle },
];

const PHONE = "(844) 568-0941";

const rules: Partial<Record<Key, (v: string) => string | null>> = {
  firstName: (v) => (v.trim() ? null : "Add your first name"),
  lastName: (v) => (v.trim() ? null : "Add your last name"),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a valid work email"),
  organization: (v) => (v.trim() ? null : "Add your organization"),
};
const stepFields: Key[][] = [["firstName", "lastName", "email", "phone"], ["organization", "orgType", "currentSystem"]];

// Text field with a label that floats up on focus or once filled
function Field({ name, label, type = "text", value, error, onChange, autoComplete, optional }: {
  name: Key; label: string; type?: string; value: string; error?: string | null;
  onChange: (v: string) => void; autoComplete?: string; optional?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`peer h-14 w-full rounded-2xl bg-paper/[0.06] px-4 pb-2 pt-6 text-[15px] text-paper outline-none ring-1 transition-all duration-300 placeholder:text-transparent focus:bg-paper/10 focus:ring-2 ${
            error ? "ring-[#F28A6B]" : "ring-paper/15 focus:ring-gold"
          }`}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-paper/55 transition-all duration-200 peer-focus:top-4 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold"
        >
          {label}
          {optional && <span className="font-normal text-paper/35"> · optional</span>}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 pl-1 text-xs font-medium text-[#F28A6B]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// A group of pick-one chips (radio buttons underneath)
function Chips({ legend, name, options, value, onChange }: {
  legend: string; name: Key; options: { label: string; icon?: React.ComponentType<{ className?: string; strokeWidth?: number }> }[];
  value: string; onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(({ label, icon: Icon }) => {
          const on = value === label;
          return (
            <label key={label} className={`relative flex cursor-pointer items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-semibold ring-1 transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
              on ? "bg-gold text-ink ring-gold shadow-[0_8px_24px_-8px_rgba(242,167,61,0.7)]" : "bg-paper/[0.05] text-paper/85 ring-paper/15 hover:bg-paper/10"
            }`}>
              <input type="radio" name={name} value={label} checked={on} onChange={() => onChange(label)} className="sr-only" />
              <span className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${on ? "bg-ink text-gold" : "bg-paper/10 text-accent-soft"}`}>
                {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.8} /> : null}
              </span>
              {label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Submit({ children, type = "submit", onClick }: { children: ReactNode; type?: "submit" | "button"; onClick?: () => void }) {
  return (
    <button type={type} onClick={onClick} className="group inline-flex items-center gap-6 rounded-full bg-gold py-2 pl-7 pr-2 text-sm font-bold text-ink transition-colors duration-300 hover:bg-paper">
      {children}
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-gold transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
      </span>
    </button>
  );
}

export default function DemoForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // 0 about you, 1 your organization, 2 done
  const [dir, setDir] = useState(1);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<Key, string | null>>>({});

  const set = (k: Key) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: rules[k]?.(v) ?? null }));
  };
  const check = (keys: Key[]) => {
    const next = Object.fromEntries(keys.map((k) => [k, rules[k]?.(values[k]) ?? null]));
    setErrors((e) => ({ ...e, ...next }));
    return Object.values(next).every((m) => !m);
  };
  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      if (check(stepFields[0])) go(1);
      return;
    }
    if (check(stepFields[1])) go(2);
  };

  const slide = {
    initial: reduce ? false : { opacity: 0, x: 40 * dir },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? undefined : { opacity: 0, x: -40 * dir },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div className="angle relative overflow-hidden bg-ink/75 p-6 text-paper backdrop-blur-xl sm:p-9">
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/50 blur-[90px]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gold/20 blur-[90px]" />

      {step < 2 && (
        <div className="relative">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-mist sm:text-3xl">Book A Demo</h2>
            <p className="text-xs font-bold tracking-[0.2em] text-gold" aria-live="polite">
              STEP {step + 1} <span className="text-paper/40">/ 2</span>
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2" aria-hidden>
            {[0, 1].map((i) => (
              <span key={i} className="h-1 overflow-hidden rounded-full bg-paper/10">
                <motion.span className="block h-full origin-left rounded-full bg-gradient-to-r from-accent-soft to-gold" initial={false} animate={{ scaleX: step >= i ? 1 : 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
              </span>
            ))}
          </div>
        </div>
      )}

      <form noValidate onSubmit={submit} className="relative mt-7">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          {step === 0 && (
            <motion.div key="you" {...slide} className="space-y-3">
              <p className="mb-5 text-sm text-paper/60">First, a little about you.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field name="firstName" label="First name" autoComplete="given-name" value={values.firstName} error={errors.firstName} onChange={set("firstName")} />
                <Field name="lastName" label="Last name" autoComplete="family-name" value={values.lastName} error={errors.lastName} onChange={set("lastName")} />
              </div>
              <Field name="email" type="email" label="Work email" autoComplete="email" value={values.email} error={errors.email} onChange={set("email")} />
              <Field name="phone" type="tel" label="Phone number" autoComplete="tel" optional value={values.phone} onChange={set("phone")} />
              <div className="pt-4">
                <Submit>Continue</Submit>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="org" {...slide} className="space-y-6">
              <Field name="organization" label="Organization" autoComplete="organization" value={values.organization} error={errors.organization} onChange={set("organization")} />
              <Chips legend="Organization type" name="orgType" value={values.orgType} onChange={set("orgType")} options={orgTypes.map((o) => ({ label: o.title, icon: typeof o.icon === "string" ? undefined : o.icon }))} />
              <Chips legend="Current system" name="currentSystem" value={values.currentSystem} onChange={set("currentSystem")} options={systems} />
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Submit>Book A Demo</Submit>
                <button type="button" onClick={() => go(0)} className="text-sm font-semibold text-paper/60 underline-offset-4 hover:text-paper hover:underline">
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="done" {...slide} className="py-6 text-center" role="status">
              <div className="relative mx-auto grid h-24 w-24 place-items-center">
                {!reduce &&
                  Array.from({ length: 10 }, (_, i) => {
                    const a = (i / 10) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        aria-hidden
                        className={`absolute h-2 w-2 rounded-full ${i % 2 ? "bg-gold" : "bg-accent-soft"}`}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 70, opacity: 0, scale: 0.4 }}
                        transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
                      />
                    );
                  })}
                <motion.span initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="grid h-24 w-24 place-items-center rounded-full bg-gold shadow-[0_0_60px_rgba(242,167,61,0.6)]">
                  <svg viewBox="0 0 24 24" className="h-11 w-11 text-ink" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.5 }} />
                  </svg>
                </motion.span>
              </div>
              <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-mist">Thanks, {values.firstName.trim() || "friend"}.</h2>
              <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-paper/70">
                We&rsquo;ve got your details. Next up: a 45-minute stack audit, no commitment. Bring your renewal quote and we&rsquo;ll bring the math.
              </p>
              <a href={`tel:${PHONE.replace(/\D/g, "")}`} className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
                Prefer to talk now? {PHONE}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {step < 2 && (
        <p className="relative mt-6 text-xs leading-5 text-paper/45">
          By submitting, you agree Missio may contact you about products and services. Unsubscribe anytime. Your privacy is assured.
        </p>
      )}
    </div>
  );
}
