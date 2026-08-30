import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

function RatingStars({ rating, className }: { rating: number; className?: string }) {
  const rounded = Math.round(rating);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < rounded ? "fill-warning text-warning" : "fill-transparent text-border",
          )}
        />
      ))}
    </span>
  );
}

export { RatingStars };
