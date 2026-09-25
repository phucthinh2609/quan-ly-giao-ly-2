import React from "react";
import { cn } from "../../lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Số → quy đổi sang rem (16 = 1rem) để co giãn theo cỡ chữ người dùng; chuỗi dùng nguyên giá trị */
  width?: string | number;
  height?: string | number;
  variant?: "rectangular" | "text" | "circular";
  className?: string;
}

const variantStyles: Record<NonNullable<SkeletonProps["variant"]>, string> = {
  rectangular: "rounded-sm",
  text: "my-1 h-4 rounded-xs",
  circular: "rounded-full",
};

const toCssSize = (value?: string | number) => (typeof value === "number" ? `${value / 16}rem` : value);

/**
 * Skeleton (03 §4.12): khối bg-surface-3 + shimmer (tự tắt khi reduced-motion).
 * Ưu tiên Skeleton đúng hình dạng nội dung thay vì Spinner toàn trang.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = "rectangular",
  className = "",
  style,
  ...rest
}) => {
  const inlineStyles: React.CSSProperties = {
    width: toCssSize(width),
    height: toCssSize(height),
    ...style,
  };

  return (
    <div
      role="status"
      aria-label="Đang tải dữ liệu…"
      className={cn("shimmer relative overflow-hidden bg-surface-3", variantStyles[variant], className)}
      style={inlineStyles}
      {...rest}
    >
      <span className="sr-only">Đang tải…</span>
    </div>
  );
};
