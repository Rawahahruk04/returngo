import { cn } from "@/lib/utils";

/**
 * The two arcs read as a route out and a route back — the entire
 * product thesis as a single glyph, not a generic geometric mark.
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      <path
        d="M4 20C4 20 8 8 16 8C22 8 24 13 24 13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M20 9L24 13L20 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M28 12C28 12 24 24 16 24C10 24 8 19 8 19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M12 23L8 19L12 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-lg font-semibold tracking-tight", className)}>
      Return<span className="text-secondary">Go</span>
    </span>
  );
}
