import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import DemoHero from "@/components/organisms/DemoHero";
import Procurement from "@/components/organisms/Procurement";
import SimplerPath from "@/components/organisms/SimplerPath";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "See a Missio Demo | Bring Your Renewal Quote",
  description:
    "Show us what you're paying across every tool today, and we'll show you the same work in one system — with the real annual difference in writing.",
};

// Sections follow missio.io/demo: booking form, then trust and procurement; plus what happens next and social proof
export default function DemoPage() {
  return (
    <>
      <Header />
      <main>
        <DemoHero />
        <Procurement />
        <SimplerPath />
      </main>
      {/* The hero already makes the "renewal quote" pitch, so the footer skips its strip */}
      <Footer cta={false} />
      <ScrollDock />
    </>
  );
}
