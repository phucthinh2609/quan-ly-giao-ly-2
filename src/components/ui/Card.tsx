import React from "react";
import { cn } from "../../lib/cn";
import { TONE_SOFT, Tone } from "./tone";

export type CardVariant = "surface" | "muted" | "night" | "outline" | "soft";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  /** Dùng với variant="soft" */
  tone?: Tone;
  padding?: CardPadding;
  radius?: "card" | "card-lg";
  /** Hover nâng nhẹ + press; kèm onClick sẽ có role="button" và hỗ trợ bàn phím */
  interactive?: boolean;
  as?: "div" | "section" | "article" | "li";
}

const variantClasses: Record<Exclude<CardVariant, "soft">, string> = {
  surface: "bg-surface border border-line shadow-card",
  muted: "bg-surface-2",
  night: "bg-night text-on-night",
  outline: "bg-transparent border border-line",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-7",
};

export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      variant = "surface",
      tone = "neutral",
      padding = "md",
      radius = "card",
      interactive = false,
      as: Tag = "div",
      className,
      onClick,
      onKeyDown,
      children,
      ...rest
    },
    ref
  ) => {
    const clickable = interactive && typeof onClick === "function";

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (!clickable || event.defaultPrevented) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
      }
    };

    return (
      <Tag
        ref={ref as React.Ref<never>}
        className={cn(
          "relative",
          radius === "card-lg" ? "rounded-card-lg" : "rounded-card",
          variant === "soft" ? TONE_SOFT[tone] : variantClasses[variant],
          paddingClasses[padding],
          interactive &&
            "transition-[transform,box-shadow,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:shadow-float active:scale-[0.99]",
          clickable && "cursor-pointer select-none focus-visible:outline-3 focus-visible:outline-offset-2",
          className
        )}
        onClick={onClick}
        onKeyDown={clickable ? handleKeyDown : onKeyDown}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

Card.displayName = "Card";
