import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/organisms/Header";
import ArticleHero from "@/components/organisms/ArticleHero";
import ArticleBody from "@/components/organisms/ArticleBody";
import RelatedPosts from "@/components/organisms/RelatedPosts";
import Footer from "@/components/organisms/Footer";
import ScrollDock from "@/components/molecules/ScrollDock";
import ReadingProgress from "@/components/atoms/ReadingProgress";
import { getPost, posts } from "@/components/molecules/blogData";
import type { Block } from "@/components/molecules/ArticleBlocks";
import content from "@/content/blog-posts.json";

const bodies = content as Record<string, Block[]>;

// One page per post in blogData; any other slug is a 404
export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | Missio Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image], type: "article" },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress targetId="article" />
      <Header />
      <main>
        <ArticleHero post={post} />
        <ArticleBody post={post} blocks={bodies[slug] ?? []} />
        <RelatedPosts post={post} />
      </main>
      <Footer />
      <ScrollDock />
    </>
  );
}
