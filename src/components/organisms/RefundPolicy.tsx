"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import LegalSection from "@/components/molecules/LegalSection";
import LegalLayout from "@/components/organisms/LegalLayout";
import { CancellationTimeline, RefundRoutes } from "@/components/molecules/PolicyDiagrams";

const sections = [
  { id: "return-policy", title: "Return Policy" },
  { id: "cancellation-policy", title: "Cancellation Policy" },
  { id: "refund-policy", title: "Refund Policy" },
];

// Gold highlighter that sweeps across a key sentence the first time it scrolls into view
function Mark({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="bg-[linear-gradient(transparent_58%,rgba(242,167,61,0.38)_58%)] bg-no-repeat font-semibold text-ink [box-decoration-break:clone]"
      initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true, margin: "-25% 0px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}

// Refund and cancellation policy body. The wording is missio.io/refund-and-cancellation-policy word for word;
// the highlights, numbering and diagrams only make it easier to read.
export default function RefundPolicy() {
  return (
    <LegalLayout
      sections={sections}
      current="/refund-and-cancellation-policy"
      contact={{ title: "Need to cancel?", text: "Contact us and we\u2019ll take it from there." }}
    >
      <LegalSection n={1} id="return-policy" title="Return Policy">
        <p>
          Our focus is complete customer satisfaction. In the event that you are displeased with the services provided,{" "}
          <Mark>we will refund back the money, provided the reasons are genuine and proven after investigation.</Mark>{" "}
          Please read the fine print of each deal before buying it; it provides all the details about the services or
          the product you purchase.
        </p>
        <p>
          In case of dissatisfaction with our services, clients have the liberty to cancel their projects and request a
          refund from us. Our Policy for cancellation and refund will be as follows:
        </p>
      </LegalSection>

      <LegalSection n={2} id="cancellation-policy" title="Cancellation Policy">
        <p>
          For Cancellations, please contact us via the{" "}
          <Link
            href="/contact"
            className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            Contact Us
          </Link>
          .
        </p>
        <p>
          <Mark>
            Requests received later than 7 business days before the end of the current service period will be treated as
            cancellation of services for the next service period.
          </Mark>
        </p>
        <CancellationTimeline />
      </LegalSection>

      <LegalSection n={3} id="refund-policy" title="Refund Policy">
        <p>We will try our best to create suitable design concepts for our clients.</p>
        <p>
          In case any client is not completely satisfied with our products, <Mark>we can provide a refund.</Mark>
        </p>
        <p>
          {/* "payment gateway name" is a placeholder carried over verbatim from missio.io; replace it with the
                  real gateway's name once confirmed */}
          If paid by credit card, refunds will be issued to the original credit card provided at the time of purchase,
          and in case of payment gateway name payments, refunds will be made to the same account.
        </p>
        <RefundRoutes />
      </LegalSection>
    </LegalLayout>
  );
}
