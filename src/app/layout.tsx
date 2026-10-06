import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Body font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Heading font (licensed files in public/fonts)
const faktum = localFont({
  variable: "--font-faktum-local",
  src: [
    { path: "../../public/fonts/faktum.woff", weight: "400", style: "normal" },
    { path: "../../public/fonts/faktum-regular-italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/faktum-medium.woff", weight: "500", style: "normal" },
    { path: "../../public/fonts/faktum-medium-italic.woff", weight: "500", style: "italic" },
    { path: "../../public/fonts/faktum-semibold.otf", weight: "600", style: "normal" },
  ],
});

// Handwritten accent font, used for the founder note in About
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Missio.io | Empowering Growth for Purpose-Driven Brands",
  description:
    "Missio.io offers powerful tools to help nonprofits, entrepreneurs, and businesses streamline operations, boost engagement, and drive lasting impact.",
  keywords: [
    "nonprofit software solutions",
    "business growth tools",
    "software for entrepreneurs",
    "nonprofit CRM",
    "operational management tools",
    "engagement tools for nonprofits",
    "small business software platform",
    "nonprofit fundraising tools",
    "donor engagement software",
    "business automation solutions",
    "software to streamline nonprofit operations",
    "tools for boosting donor and customer engagement",
    "digital solutions for entrepreneurs and nonprofits",
    "platforms to manage nonprofit and business growth",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${faktum.variable} ${caveat.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
