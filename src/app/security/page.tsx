import LegalPageView, { legalMetadata } from "@/components/organisms/LegalPageView";

// Legal page; wording from missio.io/security (see src/content/legal.json)
export const metadata = legalMetadata("security");

export default function Page() {
  return <LegalPageView slug="security" />;
}
