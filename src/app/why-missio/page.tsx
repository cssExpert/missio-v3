import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import PageBanner from "@/components/organisms/PageBanner";
import Comparison from "@/components/organisms/Comparison";
import Solutions from "@/components/organisms/Solutions";
import ImpactBand from "@/components/organisms/ImpactBand";
import Obstacles from "@/components/organisms/Obstacles";
import SimplerPath from "@/components/organisms/SimplerPath";
import Testimonials from "@/components/organisms/Testimonials";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "Why Missio | What Other Nonprofit Platforms Leave Out",
  description:
    "Every system can take a gift. See what happens to everything that gift sets in motion — and what the other platforms leave out.",
};

// Sections follow missio.io/why-missio: comparison, solutions, impact, objections, how it works, customer story
export default function WhyMissioPage() {
  return (
    <>
      <Header />
      <main>
        <PageBanner
          title="What the other platforms"
          dim="leave out."
          text="Every system can take a gift. The question is what happens to everything that gift sets in motion — the event, the volunteers, the staff who deliver the program, and the books at the end of the month."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Why Missio" }]}
        />
        <Comparison />
        <Solutions />
        <ImpactBand />
        <Obstacles />
        <SimplerPath />
        <Testimonials />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
