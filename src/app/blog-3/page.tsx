import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import BlogOrbit from "@/components/organisms/BlogOrbit";
import BlogLatest from "@/components/organisms/BlogLatest";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";

export const metadata: Metadata = {
  title: "Missio Blog | Ideas for Mission-Driven Teams",
  description:
    "Guides, stories and practical playbooks on fundraising, donors and running a modern nonprofit, from the Missio team.",
};

// Version 3 of /blog: the featured posts orbit a glowing core in a field of stars. /blog keeps version 1
export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogOrbit />
        <BlogLatest />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
