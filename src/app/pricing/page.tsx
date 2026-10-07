import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import PricingHero from "@/components/organisms/PricingHero";
import PricingPlans from "@/components/organisms/PricingPlans";
import Procurement from "@/components/organisms/Procurement";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "Missio Pricing | Price Your Stack in Sixty Seconds",
  description:
    "Tick the systems you pay for today and see your annual spend, what the same work costs in Missio, and the hours your team loses moving data between them.",
};

// Sections follow missio.io/pricing: stack calculator, plans, procurement review; the footer strip is the closing call to action
export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PricingHero />
        <PricingPlans />
        <Procurement />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
