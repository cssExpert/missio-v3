import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
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
    <html lang="en" className={`${jakarta.variable} ${caveat.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
