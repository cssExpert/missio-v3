"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { categories, posts } from "@/components/molecules/blogData";

const intro: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

// Blog page heading shared by every spotlight version: title on the left, the pitch and counts on the right
export default function BlogIntro({ note }: { note?: string }) {
  const reduce = useReducedMotion();
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div variants={intro} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end">
      <div>
        <motion.span variants={rise} className="eyebrow gold">Blog</motion.span>
        <motion.h1 variants={rise} className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-mist sm:text-6xl lg:text-[72px]">
          Ideas for teams on a <span className="text-gold">mission.</span>
        </motion.h1>
      </div>
      <motion.div variants={rise}>
        <p className="max-w-lg text-lg leading-8 text-paper/75">
          Guides, stories and practical playbooks on fundraising, donors and running a modern nonprofit.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-paper/45">
          {posts.length} articles · {categories.length} topics{note ? ` · ${note}` : ""}
        </p>
      </motion.div>
    </motion.div>
  );
}
