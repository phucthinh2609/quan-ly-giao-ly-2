import React from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/cn";

export interface StarRatingProps {
  /** Số sao đạt được (0 – max) */
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Ghi đè nhãn cho screen reader (mặc định "4 trên 5 sao") */
  label?: string;
  className?: string;
}

const sizeClasses: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

/** StarRating (03 §10) — 1–5 sao vàng cho điểm học sinh. Luôn đi kèm từ xếp loại (không chỉ dùng hình). */
export const StarRating: React.FC<StarRatingProps> = ({ value, max = 5, size = "md", label, className }) => {
  const filled = Math.max(0, Math.min(max, Math.round(value)));

  return (
    <span
      role="img"
      aria-label={label ?? `${filled} trên ${max} sao`}
      className={cn("inline-flex shrink-0 items-center gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          strokeWidth={2}
          className={cn(sizeClasses[size], i < filled ? "fill-gold text-gold" : "fill-transparent text-line-strong")}
        />
      ))}
    </span>
  );
};
