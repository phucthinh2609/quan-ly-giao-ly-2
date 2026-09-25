import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./Button";
import { IconTile } from "./IconTile";
import { cn } from "../../lib/cn";

export interface ErrorStateProps {
  /** Tiêu đề lỗi (mặc định: "Không thể tải dữ liệu") */
  title?: string;
  /** Nội dung chi tiết hoặc hướng dẫn khắc phục */
  message?: React.ReactNode;
  /** Gọi khi nhấn Thử lại */
  onRetry?: () => void;
  /** Nhãn nút Thử lại (mặc định: "Thử lại") */
  retryLabel?: string;
  /** Đang thử lại */
  retrying?: boolean;
  /** Icon tùy biến */
  icon?: React.ReactNode;
  /** Kích thước khung */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { padding: "px-4 py-6", tile: "lg" as const, title: "text-base", desc: "text-sm max-w-xs" },
  md: { padding: "px-6 py-10", tile: "xl" as const, title: "text-lg", desc: "text-base max-w-sm" },
  lg: { padding: "px-6 py-16", tile: "xl" as const, title: "text-xl", desc: "text-base max-w-md" },
};

/**
 * ErrorState (03 §5, 04 §17): IconTile danger + tiêu đề + mô tả + nút Thử lại (outline).
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Không thể tải dữ liệu",
  message = "Kiểm tra kết nối và thử lại.",
  onRetry,
  retryLabel = "Thử lại",
  retrying = false,
  icon,
  size = "md",
  className = "",
}) => {
  const styles = sizeStyles[size];

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-danger/25 bg-surface text-center",
        styles.padding,
        className
      )}
    >
      <IconTile icon={icon || <AlertTriangle />} tone="danger" size={styles.tile} className="mb-4" />

      <h3 className={cn("font-semibold tracking-tight text-ink", styles.title)}>{title}</h3>

      {message && <p className={cn("mt-1.5 leading-relaxed text-ink-2", styles.desc)}>{message}</p>}

      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" size="md" loading={retrying} onClick={onRetry} leftIcon={<RotateCcw />}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
