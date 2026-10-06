import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import PageBanner from "@/components/organisms/PageBanner";
import EngineShowcase from "@/components/organisms/EngineShowcase";
import SupporterJourney from "@/components/organisms/SupporterJourney";
import MiraLayer from "@/components/organisms/MiraLayer";
import WatchShowcase from "@/components/organisms/WatchShowcase";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "Four Engines, One Mission | The Missio Platform",
  description:
    "Growth, Relationship, Execution and Revenue engines on one record, with MIRA reading across all four.",
};

// Content from missio.io/engines: one supporter's journey, the four engines, MIRA, then the videos
export default function EnginesPage() {
  return (
    <>
      <Header />
      <main>
        <PageBanner
          title="Four engines."
          dim="One mission."
          text="Raise more, serve more, and never lose an opportunity. Mix and match the solutions your mission needs."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engines" }]}
        />
        {/* Sections alternate dark and light: banner, journey, engines, MIRA, videos, then the footer's light cards */}
        <SupporterJourney />
        <EngineShowcase />
        <MiraLayer />
        <WatchShowcase />
      </main>
      {/* The videos section carries the "Book a demo" call to action, so the footer skips its dark strip */}
      <Footer cta={false} />
      <ScrollDock />
    </>
  );
}
