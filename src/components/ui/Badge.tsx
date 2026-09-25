import React from "react";
import { cn } from "../../lib/cn";
import { TONE_BG, TONE_SOFT, Tone } from "./tone";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "gold"
  | "grape"
  | "sky"
  | "mint"
  | "sun"
  | "coral"
  | "rose"
  | "night";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_TONE: Record<Exclude<BadgeVariant, "night">, Tone> = {
  neutral: "neutral",
  primary: "primary",
  success: "success",
  warning: "warning",
  error: "danger",
  info: "info",
  gold: "gold",
  grape: "grape",
  sky: "sky",
  mint: "mint",
  sun: "sun",
  coral: "coral",
  rose: "rose",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-6 px-2 text-xs gap-1 [&_svg]:size-3",
  md: "h-7 px-2.5 text-xs gap-1.5 [&_svg]:size-3.5",
  lg: "h-8 px-3 text-sm gap-1.5 [&_svg]:size-4",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  dot = false,
  icon,
  children,
  className = "",
}) => {
  const tone = variant === "night" ? null : VARIANT_TONE[variant];
  const colorClass = tone ? TONE_SOFT[tone] : "bg-night text-on-night";
  const dotClass = tone ? TONE_BG[tone] : "bg-on-night";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap select-none",
        colorClass,
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn("size-1.5 shrink-0 rounded-full", dotClass)} aria-hidden="true" />}
      {icon && (
        <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
