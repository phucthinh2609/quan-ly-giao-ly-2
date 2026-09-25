import React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { NotificationData } from "../../types";
import { cn } from "../../lib/cn";
import { IconTile } from "../ui/IconTile";
import { Badge } from "../ui/Badge";
import { getNotificationTimeLabel, getNotificationTypeMeta } from "./notificationMeta";

export interface NotificationCardProps {
  notification: NotificationData;
  onClick?: (notification: NotificationData) => void;
  disabled?: boolean;
  /** Bản gọn cho danh sách xem trước (dashboard) */
  compact?: boolean;
  className?: string;
}

/**
 * NotificationCard (03 §11, 04 §16) — dùng chung mọi vai trò.
 * IconTile theo loại · nhãn loại (Khẩn có icon cảnh báo) · thời gian tương đối ·
 * tiêu đề đậm + chấm "Mới" khi chưa đọc · xem trước 2 dòng.
 */
export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  disabled = false,
  compact = false,
  className,
}) => {
  const { type, title, preview, isRead, studentName, className: classLabel } = notification;
  const meta = getNotificationTypeMeta(type);
  const TypeIcon = meta.icon;
  const isUrgent = type === "URGENT";
  const timeLabel = getNotificationTimeLabel(notification);
  const audience = studentName || classLabel;
  const interactive = Boolean(onClick) && !disabled;

  const handleClick = () => {
    if (interactive) onClick?.(notification);
  };

  const body = (
    <>
      <IconTile icon={<TypeIcon />} tone={meta.tone} size="md" className="mt-0.5" />

      <span className="flex min-w-0 flex-1 flex-col">
        {/* Hàng meta: loại · thời gian · đối tượng */}
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
          {isUrgent ? (
            <Badge variant="error" size="lg" icon={<AlertTriangle />}>
              Khẩn
            </Badge>
          ) : (
            <span className="font-semibold text-ink-2">{meta.label}</span>
          )}
          {timeLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{timeLabel}</span>
            </>
          )}
          {!compact && audience && (
            <>
              <span aria-hidden="true">·</span>
              <span className="min-w-0 truncate">{audience}</span>
            </>
          )}
          {!isRead && (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary-ink">
              <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
              Mới
            </span>
          )}
        </span>

        <span
          className={cn(
            "mt-1.5 block leading-snug text-pretty break-words",
            compact ? "text-base" : "text-lg",
            isRead ? "font-medium text-ink-2" : "font-semibold text-ink"
          )}
        >
          {title}
        </span>

        {preview && (
          <span
            className={cn(
              "mt-1 line-clamp-2 leading-relaxed text-ink-2",
              compact ? "text-sm" : "text-base"
            )}
          >
            {preview}
          </span>
        )}
      </span>

      {interactive && (
        <ChevronRight className="mt-1 size-5 shrink-0 self-center text-ink-3" aria-hidden="true" />
      )}
    </>
  );

  const shellClass = cn(
    "relative flex w-full items-start gap-3 rounded-card border text-left sm:gap-4",
    compact ? "p-4" : "p-4 sm:p-5",
    isRead ? "border-line bg-surface/70" : "border-line bg-surface shadow-card",
    isUrgent && !isRead && "border-danger/40",
    disabled && "opacity-60",
    className
  );

  if (!interactive) {
    return (
      <article className={shellClass} aria-disabled={disabled || undefined}>
        {body}
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        shellClass,
        "min-h-16 select-none transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out-soft",
        "hover:border-line-strong hover:bg-surface hover:shadow-card active:scale-[0.99]",
        "focus-visible:outline-3 focus-visible:outline-offset-2"
      )}
    >
      {body}
    </button>
  );
};
