// The .angle / .angle-sm clip-path also cuts the ring off the slanted corner, leaving a gap in the border.
// Drop this inside the clipped box (which needs `relative`) to draw that edge as a 1px line along the cut;
// pass the same colour as the ring, e.g. "bg-paper/10".
export default function CutEdge({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-[calc(100%-var(--cut))] top-0 h-px w-[calc(var(--cut)*1.4142)] origin-top-left rotate-45 transition-colors duration-300 ${className}`}
    />
  );
}
