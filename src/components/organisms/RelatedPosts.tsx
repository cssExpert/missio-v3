import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/atoms/ui";
import PostCard from "@/components/molecules/PostCard";
import { postHref, posts, type Post } from "@/components/molecules/blogData";

const newest = [...posts].sort((a, b) => b.date.localeCompare(a.date));

// Older and newer neighbours in date order
function Neighbour({ post, label, align }: { post?: Post; label: string; align: "left" | "right" }) {
  if (!post) return <span className="hidden sm:block" />;
  const right = align === "right";
  return (
    <a
      href={postHref(post.slug)}
      // Cut corner on the outer side: top-right for Next (.angle-sm), mirrored to top-left for Previous
      className={`group relative flex items-center gap-5 overflow-hidden bg-ink p-5 text-paper ${right ? "angle-sm flex-row-reverse text-right" : "[clip-path:polygon(28px_0,100%_0,100%_100%,0_100%,0_28px)]"}`}
    >
      <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-paper/10">
        <Image src={post.image} alt="" fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
      </span>
      <span className="min-w-0">
        <span className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold ${right ? "justify-end" : ""}`}>
          {!right && <Arrow className="rotate-[135deg]" />}
          {label}
          {right && <Arrow className="-rotate-45" />}
        </span>
        <span className="mt-2 line-clamp-2 block font-heading text-base font-extrabold leading-snug text-mist">{post.title}</span>
      </span>
    </a>
  );
}

// End of an article: previous / next, then three more to read (same topic first, then the newest)
export default function RelatedPosts({ post }: { post: Post }) {
  const i = newest.findIndex((p) => p.slug === post.slug);
  const others = newest.filter((p) => p.slug !== post.slug);
  const more = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);

  return (
    <section className="pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Neighbour post={newest[i + 1]} label="Previous article" align="left" />
          <Neighbour post={newest[i - 1]} label="Next article" align="right" />
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Keep reading</span>
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              More from the <span className="text-gold">blog</span>
            </h2>
          </div>
          <Link href="/blog" className="group inline-flex items-center gap-3 text-sm font-medium text-ink">
            All articles
            <Arrow className="text-accent transition-transform duration-300 group-hover:-rotate-45" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
