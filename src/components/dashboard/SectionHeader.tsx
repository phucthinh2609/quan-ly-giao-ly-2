import React from "react";
import { cn } from "../../lib/cn";
import { IconTile } from "../ui/IconTile";
import { Tone } from "../ui/tone";

export interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Icon Lucide đặt trong IconTile bên trái tiêu đề */
  icon?: React.ReactNode;
  iconTone?: Tone;
  /** Hành động bên phải (VD nút "Xem tất cả") */
  action?: React.ReactNode;
  /** Cấp heading, mặc định h2 */
  as?: "h2" | "h3";
  id?: string;
  size?: "md" | "lg";
  className?: string;
}

/**
 * Tiêu đề khối nội dung trong trang (card, section) — sentence case, không meta-label.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon,
  iconTone = "neutral",
  action,
  as: Heading = "h2",
  id,
  size = "md",
  className,
}) => (
  <div className={cn("flex items-center justify-between gap-3", className)}>
    <div className="flex min-w-0 items-center gap-3">
      {icon && <IconTile icon={icon} tone={iconTone} size="md" />}
      <div className="min-w-0">
        <Heading
          id={id}
          className={cn(
            "tracking-tight text-ink",
            size === "lg" ? "text-xl font-bold sm:text-2xl" : "text-base font-semibold sm:text-lg"
          )}
        >
          {title}
        </Heading>
        {description && <p className="mt-0.5 text-sm text-ink-3">{description}</p>}
      </div>
    </div>
    {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
  </div>
);
