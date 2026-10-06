import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import PageBanner from "@/components/organisms/PageBanner";
import AboutManifesto from "@/components/organisms/AboutManifesto";
import OneRecord from "@/components/organisms/OneRecord";
import TrustedBy from "@/components/molecules/TrustedBy";
import Testimonials from "@/components/organisms/Testimonials";
import OrgShowcase from "@/components/organisms/OrgShowcase";
import CtaBanner from "@/components/organisms/CtaBanner";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "About Missio | Built for Mission-Driven Teams",
  description:
    "Every hour spent wrestling with software steals an hour from the mission. Missio exists to give that time back.",
};

// Sections follow missio.io/about: why we exist, one record, social proof, who it's built for, then the stats
export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageBanner
          title="Every hour spent wrestling with software steals an hour from"
          dim="the mission."
          text="Missio exists to give that time back. One platform, one login, and one record for every person who touches your mission — whether they give, attend, volunteer or work for you."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        />
        <AboutManifesto />
        <OneRecord />
        <section className="pb-24">
          <TrustedBy />
        </section>
        <OrgShowcase />
        <CtaBanner />
        <Testimonials />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
