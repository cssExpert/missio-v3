"use client";

import { useId, useState } from "react";

type Props = {
  /** Where to POST `{ email }` (e.g. an API route or your email provider's endpoint). Until set, no address is collected. */
  endpoint?: string;
  lead?: string;
  title?: string;
  className?: string;
};

type Status = "idle" | "sending" | "done" | "error" | "unavailable";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email sign-up: lead line, bold title, and an input + button row
export default function Newsletter({
  endpoint,
  lead = "Practical ideas for mission-driven teams.",
  title = "Get the Missio newsletter.",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const id = useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // No sign-up service connected yet: say so honestly rather than pretend the address was saved
    if (!endpoint) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const message =
    error ||
    (status === "done" && "Thanks — you're on the list.") ||
    (status === "error" && "Something went wrong. Please try again.") ||
    (status === "unavailable" && "Sign-ups are opening soon — please check back shortly.") ||
    "";

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h4 className="text-[15px] leading-snug text-ink/60">
        {lead}
        <strong className="block text-lg font-extrabold text-ink">{title}</strong>
      </h4>
      {/* Status message sits just below the form without taking layout space, so the block ends
          at the form's bottom edge and lines up with neighbours aligned to the end */}
      <div className="relative">
        <form onSubmit={submit} noValidate className="flex w-full max-w-sm rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-primary/50">
          <label htmlFor={id} className="sr-only">
            Email address
          </label>
          <input
            id={id}
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={`${id}-msg`}
            className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="shrink-0 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition hover:-translate-y-px hover:bg-primary disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Subscribe"}
          </button>
        </form>
        <p id={`${id}-msg`} role="status" className={`absolute left-0 top-full mt-2 text-xs ${error || status === "error" ? "text-[#D9694A]" : "text-primary"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}
