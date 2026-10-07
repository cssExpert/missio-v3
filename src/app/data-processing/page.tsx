import LegalPageView, { legalMetadata } from "@/components/organisms/LegalPageView";

// Legal page; wording from missio.io/data-processing (see src/content/legal.json)
export const metadata = legalMetadata("data-processing");

export default function Page() {
  return <LegalPageView slug="data-processing" />;
}
