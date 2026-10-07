"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Check, Link2 } from "lucide-react";
import { TextLink } from "@/components/atoms/ui";
import ArticleBlocks, { outline, type Block } from "@/components/molecules/ArticleBlocks";
import { AUTHOR, type Post } from "@/components/molecules/blogData";

const noop = () => () => {};

// Share targets; each opens the network's own share dialog for this page
const networks = [
  { name: "LinkedIn", href: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" },
  { name: "X", href: (u: string, t: string) => `https://x.com/intent/post?url=${u}&text=${t}`, path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" },
  { name: "Facebook", href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}`, path: "M13.5 21.9v-7.05h2.37l.36-2.76H13.5v-1.76c0-.8.22-1.34 1.37-1.34h1.46V6.53a19.6 19.6 0 0 0-2.13-.11c-2.1 0-3.55 1.29-3.55 3.65v2.02H8.27v2.76h2.38v7.05H13.5z" },
];

// Article layout: sticky rail with the contents (current section highlighted) and share buttons, then the text
export default function ArticleBody({ post, blocks }: { post: Post; blocks: Block[] }) {
  const toc = useMemo(() => outline(blocks), [blocks]);
  const [current, setCurrent] = useState(toc[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  // This page's address for the share links; empty during server render
  const url = useSyncExternalStore(noop, () => window.location.href.split("#")[0], () => "");

  // Highlight the last heading that has passed the upper third of the window
  useEffect(() => {
    if (!toc.length) return;
    const onScroll = () => {
      let id = toc[0].id;
      for (const t of toc) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) id = t.id;
      }
      setCurrent(id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareBtn = "grid h-10 w-10 place-items-center rounded-full bg-mist text-ink/70 transition-colors duration-300 hover:bg-primary hover:text-white";

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1340px] gap-12 px-4 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-20">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          {toc.length > 0 && (
            <nav aria-label="On this page" className="hidden lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">On this page</p>
              <ol className="mt-5 space-y-1 border-l border-ink/10">
                {toc.map((t) => {
                  const on = t.id === current;
                  return (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        aria-current={on ? "location" : undefined}
                        className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors duration-300 ${on ? "border-gold font-semibold text-ink" : "border-transparent text-ink/50 hover:text-ink"}`}
                      >
                        {t.text}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <div className="lg:mt-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">Share</p>
            <div className="mt-4 flex gap-2">
              {networks.map((n) => (
                <a
                  key={n.name}
                  href={url ? n.href(encodeURIComponent(url), encodeURIComponent(post.title)) : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${n.name}`}
                  className={shareBtn}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d={n.path} /></svg>
                </a>
              ))}
              <button type="button" onClick={copy} aria-label="Copy link" className={shareBtn}>
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
              </button>
            </div>
            <p aria-live="polite" className="mt-2 h-4 text-xs font-semibold text-primary">{copied ? "Link copied" : ""}</p>
          </div>
        </aside>

        <article id="article" className="max-w-[720px]">
          <ArticleBlocks blocks={blocks} />

          {/* Sign-off */}
          <div className="angle-sm mt-16 flex flex-wrap items-center justify-between gap-6 bg-mist p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-xl font-bold text-white">{AUTHOR[0]}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Written by</p>
                <p className="mt-1 text-lg font-extrabold">{AUTHOR}</p>
              </div>
            </div>
            <TextLink href="/blog">Back to the blog</TextLink>
          </div>
        </article>
      </div>
    </section>
  );
}
