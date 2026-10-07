import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import EngineWarp from "@/components/organisms/EngineWarp";
import JourneyConstellation from "@/components/organisms/JourneyConstellation";
import MiraAiLayer from "@/components/organisms/MiraAiLayer";
import WatchCinema from "@/components/organisms/WatchCinema";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "Four Engines, One Mission | The Missio Platform",
  description:
    "Growth, Relationship, Execution and Revenue engines on one record, with MIRA reading across all four.",
};

// Version 2 of /engines: a dark flight through the four engines, then light sections: Marcus's journey as a
// constellation, MIRA at work on three devices, and the videos in a cinema. /engines keeps version 1
export default function EnginesPage() {
  return (
    <>
      <Header />
      <main>
        <EngineWarp />
        <JourneyConstellation />
        <MiraAiLayer />
        <WatchCinema />
      </main>
      {/* The videos section carries the "Book a demo" call to action, so the footer skips its dark strip */}
      <Footer cta={false} />
      <ScrollDock />
    </>
  );
}
