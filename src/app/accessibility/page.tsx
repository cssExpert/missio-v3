import LegalPageView, { legalMetadata } from "@/components/organisms/LegalPageView";

// Legal page; wording from missio.io/accessibility (see src/content/legal.json)
export const metadata = legalMetadata("accessibility");

export default function Page() {
  return <LegalPageView slug="accessibility" />;
}
