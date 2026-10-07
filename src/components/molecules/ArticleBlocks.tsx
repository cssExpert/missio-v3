import Image from "next/image";

// Article bodies are stored as plain blocks (src/content/blog-posts.json) and rendered here as React,
// never as raw HTML, so nothing from the CMS can inject markup or scripts.
export type Span = { text: string; bold?: boolean; italic?: boolean; href?: string };
export type Block =
  | { type: "p" | "h2" | "h3" | "quote"; spans: Span[] }
  | { type: "list"; ordered: boolean; items: Span[][] }
  | { type: "image"; src: string; alt: string };

export const blockText = (spans: Span[]) => spans.map((s) => s.text).join("");
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

// Contents list: the h2s, or the h3s when an article has fewer than two h2s
export function outline(blocks: Block[]) {
  const pick = (t: "h2" | "h3") =>
    blocks.flatMap((b) => (b.type === t ? [{ id: headingId(blockText(b.spans)), text: blockText(b.spans) }] : []));
  const h2 = pick("h2");
  return h2.length >= 2 ? h2 : pick("h3");
}

function Inline({ spans }: { spans: Span[] }) {
  return spans.map((s, i) => {
    let node: React.ReactNode = s.text;
    if (s.italic) node = <em>{node}</em>;
    if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
    // External links open in a new tab; links within the site stay in this one
    if (s.href)
      node = (
        <a
          href={s.href}
          {...(/^https?:/.test(s.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          {node}
        </a>
      );
    return <span key={i}>{node}</span>;
  });
}

// dropCap: gold initial on the first paragraph (blog articles); legal pages turn it off
export default function ArticleBlocks({ blocks, dropCap = true }: { blocks: Block[]; dropCap?: boolean }) {
  const firstP = dropCap ? blocks.findIndex((b) => b.type === "p") : -1;
  return blocks.map((b, i) => {
    switch (b.type) {
      case "h2":
      case "h3": {
        const text = blockText(b.spans);
        const Tag = b.type;
        return (
          <Tag
            key={i}
            id={headingId(text)}
            className={`scroll-mt-32 font-extrabold tracking-tight text-ink ${Tag === "h2" ? "mt-14 text-3xl leading-tight" : "mt-10 text-xl leading-snug"}`}
          >
            {text}
          </Tag>
        );
      }
      case "p":
        return (
          <p
            key={i}
            className={`mt-6 text-[17px] leading-8 text-ink/75 ${i === firstP ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-[64px] first-letter:font-extrabold first-letter:leading-[0.85] first-letter:text-gold" : ""}`}
          >
            <Inline spans={b.spans} />
          </p>
        );
      case "quote":
        return (
          <blockquote
            key={i}
            className="angle-sm relative mt-10 bg-ink px-8 py-7 text-xl font-semibold leading-8 text-mist"
          >
            <span aria-hidden className="absolute left-0 top-0 h-full w-1 bg-gold" />
            <Inline spans={b.spans} />
          </blockquote>
        );
      case "list": {
        const List = b.ordered ? "ol" : "ul";
        return (
          <List key={i} className="mt-6 space-y-3">
            {b.items.map((item, n) => (
              <li key={n} className="flex gap-4 text-[17px] leading-8 text-ink/75">
                <span
                  aria-hidden
                  className={`mt-3 shrink-0 ${b.ordered ? "-mt-0 font-mono text-sm font-bold text-gold" : "h-2 w-2 rounded-full bg-gold"}`}
                >
                  {b.ordered ? String(n + 1).padStart(2, "0") : null}
                </span>
                <span>
                  <Inline spans={item} />
                </span>
              </li>
            ))}
          </List>
        );
      }
      case "image":
        return (
          <figure key={i} className="angle-sm mt-10 overflow-hidden bg-mist">
            <Image
              src={b.src}
              alt={b.alt}
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 720px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        );
    }
  });
}
