import React from "react";
import { cn } from "../../lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor = "primary" | "white" | "neutral" | "gold" | "current";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  label?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
  xl: "size-9",
};

const colorMap: Record<SpinnerColor, string> = {
  primary: "text-primary",
  white: "text-on-primary",
  neutral: "text-ink-3",
  gold: "text-gold",
  current: "text-current",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  label = "Đang tải…",
}) => {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center justify-center", className)}>
      <svg
        className={cn("animate-spin", sizeMap[size], colorMap[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-20" cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="3" />
        <path
          className="opacity-90"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
};
