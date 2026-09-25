import React from "react";
import { Inbox } from "lucide-react";
import { IconTile } from "./IconTile";
import { cn } from "../../lib/cn";
import { Tone } from "./tone";

export interface EmptyStateProps {
  /** Icon trung tâm (mặc định Inbox) */
  icon?: React.ReactNode;
  /** Tiêu đề trạng thái rỗng */
  title: string;
  /** Mô tả hoặc hướng dẫn */
  description?: React.ReactNode;
  /** Nút hành động (khi phù hợp) */
  action?: React.ReactNode;
  /** Khoảng cách và cỡ icon */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Tone của IconTile (mặc định neutral; khu Học sinh có thể dùng kid palette) */
  tone?: Tone;
}

const sizeStyles = {
  sm: { padding: "px-4 py-6", tile: "lg" as const, title: "text-base", desc: "text-sm max-w-xs" },
  md: { padding: "px-6 py-10", tile: "xl" as const, title: "text-lg", desc: "text-base max-w-sm" },
  lg: { padding: "px-6 py-16", tile: "xl" as const, title: "text-xl", desc: "text-base max-w-md" },
};

/**
 * EmptyState (03 §5, 04 §17): IconTile + tiêu đề + mô tả + hành động.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = "md",
  className = "",
  tone = "neutral",
}) => {
  const styles = sizeStyles[size];

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong bg-surface text-center",
        styles.padding,
        className
      )}
    >
      <IconTile icon={icon || <Inbox />} tone={tone} size={styles.tile} className="mb-4" />

      <h3 className={cn("font-semibold tracking-tight text-ink", styles.title)}>{title}</h3>

      {description && <p className={cn("mt-1.5 leading-relaxed text-ink-2", styles.desc)}>{description}</p>}

      {action && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
};
