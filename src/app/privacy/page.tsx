import LegalPageView, { legalMetadata } from "@/components/organisms/LegalPageView";

// Legal page; wording from missio.io/privacy (see src/content/legal.json)
export const metadata = legalMetadata("privacy");

export default function Page() {
  return <LegalPageView slug="privacy" />;
}
