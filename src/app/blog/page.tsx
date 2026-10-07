import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import BlogSpotlight from "@/components/organisms/BlogSpotlight";
import BlogLatest from "@/components/organisms/BlogLatest";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "Missio Blog | Ideas for Mission-Driven Teams",
  description:
    "Guides, stories and practical playbooks on fundraising, donors and running a modern nonprofit, from the Missio team.",
};

// Sections follow missio.io/blog: featured posts, then what's new; the footer strip is the closing call to action
export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogSpotlight />
        <BlogLatest />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
