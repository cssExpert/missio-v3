import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import PolicyHero from "@/components/organisms/PolicyHero";
import RefundPolicy from "@/components/organisms/RefundPolicy";
import RefundSummary from "@/components/molecules/RefundSummary";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";
import ReadingProgress from "@/components/atoms/ReadingProgress";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | Missio",
  description: "How cancellations and refunds work for Missio services.",
};

// Legal page, content from missio.io/refund-and-cancellation-policy (wording unchanged)
export default function RefundPolicyPage() {
  return (
    <>
      <ReadingProgress targetId="policy" />
      <Header />
      <main>
        <PolicyHero
          title="Refund and Cancellation Policy"
          lead="How cancellations and refunds work for Missio services. Our focus is complete customer satisfaction."
          crumb="Refund Policy"
          facts={["3 sections", "2 min read"]}
        >
          <RefundSummary />
        </PolicyHero>
        <RefundPolicy />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
