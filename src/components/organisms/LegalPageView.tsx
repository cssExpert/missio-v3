import type { Metadata } from "next";
import Header from "@/components/organisms/Header";
import PolicyHero from "@/components/organisms/PolicyHero";
import LegalLayout from "@/components/organisms/LegalLayout";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";
import ReadingProgress from "@/components/atoms/ReadingProgress";
import LegalSection from "@/components/molecules/LegalSection";
import ArticleBlocks, { blockText, type Block } from "@/components/molecules/ArticleBlocks";
import content from "@/content/legal.json";

// The legal pages from missio.io (privacy, terms, security, accessibility, cookie preferences, data processing).
// Their wording lives in src/content/legal.json, copied word for word; this only lays it out.
type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  updated: string | null;
  intro: Block[];
  sections: { id: string; title: string; blocks: Block[] }[];
};
const docs = content as unknown as Record<string, LegalDoc>;

export const legalMetadata = (slug: string): Metadata => ({
  title: `${docs[slug].title} | Missio`,
  description: docs[slug].description,
});

const words = (blocks: Block[]) =>
  blocks.reduce(
    (n, b) =>
      n +
      (b.type === "list" ? b.items.map(blockText).join(" ") : b.type === "image" ? "" : blockText(b.spans)).split(/\s+/)
        .length,
    0,
  );

export default function LegalPageView({ slug }: { slug: string }) {
  const doc = docs[slug];
  const readMins = Math.max(
    1,
    Math.round((words(doc.intro) + doc.sections.reduce((n, s) => n + words(s.blocks), 0)) / 220),
  );
  const facts = [doc.updated, `${doc.sections.length} sections`, `${readMins} min read`].filter(Boolean) as string[];

  return (
    <>
      <ReadingProgress targetId="policy" />
      <Header />
      <main>
        <PolicyHero title={doc.title} lead={doc.description} crumb={doc.title} eyebrow={doc.eyebrow} facts={facts} />
        <LegalLayout sections={doc.sections.map(({ id, title }) => ({ id, title }))} current={`/${slug}`}>
          {doc.intro.length > 0 && (
            <div className="text-lg leading-8 text-ink/80 [&_p]:mt-0 [&_p]:text-lg [&_p+p]:mt-5">
              <ArticleBlocks blocks={doc.intro} dropCap={false} />
            </div>
          )}
          {doc.sections.map((s, i) => (
            <LegalSection key={s.id} n={i + 1} id={s.id} title={s.title}>
              {/* ArticleBlocks spaces its own blocks; drop the first block's top margin under the heading */}
              <div className="[&>*:first-child]:mt-0">
                <ArticleBlocks blocks={s.blocks} dropCap={false} />
              </div>
            </LegalSection>
          ))}
        </LegalLayout>
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
