import React from "react";
import { cn } from "../../lib/cn";
import { TONE_SOFT, TONE_SOLID, Tone } from "./tone";

export interface IconTileProps {
  icon: React.ReactNode;
  tone?: Tone;
  size?: "sm" | "md" | "lg" | "xl";
  /** solid = nền đặc (điểm nhấn mạnh), mặc định soft */
  solid?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<IconTileProps["size"]>, string> = {
  sm: "size-8 rounded-sm [&_svg]:size-4",
  md: "size-10 rounded-control [&_svg]:size-5",
  lg: "size-12 rounded-control [&_svg]:size-6",
  xl: "size-16 rounded-card [&_svg]:size-8",
};

/** Khối icon nền màu — tạo nhịp màu có kiểm soát (01 §8). */
export const IconTile: React.FC<IconTileProps> = ({ icon, tone = "neutral", size = "md", solid = false, className }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex shrink-0 items-center justify-center",
      solid ? TONE_SOLID[tone] : TONE_SOFT[tone],
      sizeClasses[size],
      className
    )}
  >
    {icon}
  </span>
);
