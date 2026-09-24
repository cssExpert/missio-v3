"use client";

import Image from "next/image";
import CountUp from "./CountUp";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

// Client logos from missio.io
const clients = [
  {
    name: "Lakeland Habitat for Humanity",
    src: "/images/clients/client-01.png",
  },
  { name: "University of South Florida", src: "/images/clients/client-02.png" },
  { name: "African Wildlife Foundation", src: "/images/clients/client-03.png" },
  { name: "Sightsavers India", src: "/images/clients/client-04.png" },
  { name: "My Sister's Keepher Network", src: "/images/clients/client-05.png" },
  { name: "Dogs 2 DogTags", src: "/images/clients/client-06.png" },
  { name: "Rainforest Alliance", src: "/images/clients/client-07.png" },
  { name: "The Corporate Source", src: "/images/clients/client-08.png" },
  { name: "Jamie's Angels", src: "/images/clients/client-09.png" },
];

// Keeps a value inside [min, max) so the strip loops seamlessly
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const DRIFT = 40; // px per second when the cursor isn't over the section
const STEER_SPEED = 120; // px per second while the cursor is steering

// One infinite row. Idle: drifts right-to-left and reacts to page scroll speed/direction.
// Steered (cursor over the section): `steer` is 1 for right-to-left, -1 for left-to-right, 0 when idle.
function LogoRow({
  direction,
  items,
  steer,
}: {
  direction: 1 | -1;
  items: typeof clients;
  steer: MotionValue<number>;
}) {
  const x = useMotionValue(0);
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  // Signed speed (positive = right-to-left); the spring eases the strip through zero when it reverses
  const speed = useSpring(DRIFT * direction, { stiffness: 90, damping: 22 });
  const target = useRef(DRIFT * direction);
  const directionRef = useRef<number>(direction);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const boost = useTransform(smoothVelocity, [-1500, 0, 1500], [-5, 0, 5], {
    clamp: false,
  });

  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSetWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!setWidth) return;
    const s = steer.get();
    let boostFactor = 1;
    if (s === 0) {
      // Idle: scrolling up reverses the row, scrolling down restores it, and faster scrolling speeds it up
      const b = boost.get();
      if (b < 0) directionRef.current = -direction;
      else if (b > 0) directionRef.current = direction;
      boostFactor = 1 + Math.abs(b);
    }
    const next = s === 0 ? DRIFT * directionRef.current : s * STEER_SPEED;
    if (next !== target.current) {
      target.current = next;
      speed.set(next);
    }
    x.set(wrap(-setWidth, 0, x.get() - speed.get() * boostFactor * (delta / 1000)));
  });

  return (
    <div className="w-full py-3">
      <motion.div className="flex w-max gap-4" style={{ x }}>
        {[0, 1, 2].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? setRef : undefined}
            className="flex gap-4"
            aria-hidden={copy > 0}
          >
            {items.map((c) => (
              <LogoTile
                key={`${copy}-${c.name}`}
                client={c}
                hidden={copy > 0}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function LogoTile({
  client,
  hidden,
}: {
  client: (typeof clients)[number];
  hidden?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group relative grid h-28 w-48 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-lg hover:ring-primary/20"
    >
      {/* Tile 112px: logo 64 + gap 8 + name 12 = 84, so on hover the logo rises 10px and the name sits 14px from
          the bottom, giving equal 14px space above and below the pair */}
      <Image
        src={client.src}
        alt={hidden ? "" : client.name}
        width={120}
        height={120}
        className="h-16 w-auto object-contain opacity-60 grayscale transition duration-500 group-hover:-translate-y-2.5 group-hover:opacity-100 group-hover:grayscale-0"
      />
      {/* Name fades in under the logo on hover */}
      <span className="pointer-events-none absolute inset-x-3 bottom-3.5 translate-y-1 truncate text-center text-[11px] font-semibold leading-3 text-ink/60 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {client.name}
      </span>
    </motion.div>
  );
}

export default function TrustedBy() {
  const reduce = useReducedMotion();
  // 1 = cursor in the left 51% (logos move right-to-left), -1 = right 49% (left-to-right), 0 = cursor elsewhere
  const steer = useMotionValue(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Track the mouse at window level so the whole section counts, not just the logos,
  // and nothing layered on top can swallow the events
  useEffect(() => {
    let last: { x: number; y: number } | null = null;
    const update = () => {
      const el = rootRef.current;
      if (!el || !last) return;
      const r = el.getBoundingClientRect();
      // Active area: from the top of this block down to the bottom of the section it sits in
      const bottom = Math.max(r.bottom, el.closest("section")?.getBoundingClientRect().bottom ?? r.bottom);
      const inside = last.y >= r.top && last.y <= bottom && last.x >= r.left && last.x <= r.right;
      const next = inside ? ((last.x - r.left) / r.width < 0.51 ? 1 : -1) : 0;
      if (next !== steer.get()) steer.set(next);
      el.dataset.steer = next === 1 ? "left" : next === -1 ? "right" : "idle";
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY };
      update();
    };
    const onLeave = () => {
      last = null;
      steer.set(0);
      if (rootRef.current) rootRef.current.dataset.steer = "idle";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [steer]);

  return (
    <div ref={rootRef} id="clients" data-steer="idle" className="relative overflow-hidden pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[1340px] px-4 text-center sm:px-8"
      >
        <span className="eyebrow">Social proof</span>
        <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Trusted by{" "}
          <span className="text-primary">
            <CountUp to={100} />
            <span className="text-gold">+</span>
          </span>
          <br className="hidden sm:block" /> mission-driven organizations
        </h2>
      </motion.div>

      {reduce ? (
        // Reduced motion: a calm, static grid of the same logos
        <div className="mx-auto mt-12 flex max-w-[1340px] flex-wrap justify-center gap-4 px-4 sm:px-8">
          {clients.map((c) => (
            <LogoTile key={c.name} client={c} />
          ))}
        </div>
      ) : (
        // Edges fade out so logos glide in and out of view
        <div className="mt-12 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <LogoRow direction={1} items={clients} steer={steer} />
        </div>
      )}
    </div>
  );
}
