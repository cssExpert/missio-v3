import HeroLeft from "@/components/organisms/HeroLeft"; // left-aligned hero; use "@/components/organisms/Hero" for the centred version
import About from "@/components/organisms/About";
import Mission from "@/components/organisms/Mission";
import CtaBanner from "@/components/organisms/CtaBanner";
import Faq from "@/components/organisms/Faq";
import Integrations from "@/components/organisms/Integrations";
import Features from "@/components/organisms/Features";
import GrowthEngine from "@/components/organisms/GrowthEngine";
import Obstacles from "@/components/organisms/Obstacles";
import Testimonials from "@/components/organisms/Testimonials";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Pricing from "@/components/organisms/Pricing";
import ScrollDock from "@/components/molecules/ScrollDock";

export default function HomeFive() {
  return (
    <>
      <Header />
      <main>
        <HeroLeft />
        <About />
        <Integrations />
        <Mission />
        <Features />
        <GrowthEngine />
        <Obstacles />
        <Testimonials />
        <CtaBanner />
        <Pricing />
        <Faq />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
