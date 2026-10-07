import LegalPageView, { legalMetadata } from "@/components/organisms/LegalPageView";

// Legal page; wording from missio.io/terms (see src/content/legal.json)
export const metadata = legalMetadata("terms");

export default function Page() {
  return <LegalPageView slug="terms" />;
}
