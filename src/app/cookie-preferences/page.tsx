import LegalPageView, { legalMetadata } from "@/components/organisms/LegalPageView";

// Legal page; wording from missio.io/cookie-preferences (see src/content/legal.json)
export const metadata = legalMetadata("cookie-preferences");

export default function Page() {
  return <LegalPageView slug="cookie-preferences" />;
}
