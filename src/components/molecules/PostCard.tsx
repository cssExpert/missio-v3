import Image from "next/image";
import { Arrow } from "@/components/atoms/ui";
import { AUTHOR, formatDate, postHref, type Post } from "@/components/molecules/blogData";

// Blog card: on hover the photo zooms and the arrow straightens with the category chip over it, then date, title, excerpt and a read link.
// `wide` lays the photo and text side by side for the lead story of the grid.
export default function PostCard({ post, wide = false }: { post: Post; wide?: boolean }) {
  return (
    <a
      href={postHref(post.slug)}
      className={`group angle relative flex h-full flex-col overflow-hidden bg-white ${wide ? "lg:flex-row" : ""}`}
    >
      <div className={`relative overflow-hidden bg-mist ${wide ? "aspect-[16/10] lg:aspect-auto lg:w-[55%] lg:shrink-0" : "aspect-[16/10]"}`}>
        <Image
          src={post.image}
          alt=""
          fill
          sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
        <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
          {post.category}
        </span>
      </div>

      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${wide ? "lg:justify-center lg:p-10" : ""}`}>
        <p className="text-xs font-semibold text-ink/50">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="mx-2 text-ink/25">/</span>
          {post.readMins} min read
        </p>
        <h3
          className={`mt-3 font-extrabold leading-snug tracking-tight text-ink ${wide ? "text-2xl sm:text-3xl" : "text-lg"}`}
        >
          {post.title}
        </h3>
        <p className={`mt-3 text-sm leading-6 text-ink/65 ${wide ? "line-clamp-4" : "line-clamp-2"}`}>{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xs font-semibold text-ink/55">By {AUTHOR}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-mist text-primary">
            <Arrow className="transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </div>
      </div>
    </a>
  );
}
