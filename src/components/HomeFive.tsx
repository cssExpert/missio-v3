import HeroLeft from "./HeroLeft"; // left-aligned hero; use "./Hero" for the centred version
import About from "./About";
import Mission from "./Mission";
import CtaBanner from "./CtaBanner";
import Faq from "./Faq";
import Integrations from "./Integrations";
import Features from "./Features";
import GrowthEngine from "./GrowthEngine";
import Obstacles from "./Obstacles";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import Header from "./Header";
import Pricing from "./Pricing";
import ScrollDock from "./ScrollDock";

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
