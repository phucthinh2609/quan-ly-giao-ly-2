import React from "react";
import { History } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatTime } from "../../lib/format";
import { Button } from "../ui/Button";
import { IconTile } from "../ui/IconTile";

export interface AttendanceDraftBannerProps {
  /** ISO time lúc lưu nháp (DraftRecord.savedAt) */
  savedAt: string;
  onRestore: () => void;
  onDismiss: () => void;
  /** Số em trong nháp khác với dữ liệu đã lưu */
  changedCount?: number;
  className?: string;
}

function draftTimeLabel(savedAt: string): string {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  const time = formatTime(date);
  if (sameDay) return time;
  return `${time} ngày ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * AttendanceDraftBanner (03 §7, B-GLV-04): "Có bản nháp chưa lưu lúc HH:mm" [Khôi phục] [Bỏ qua].
 */
export const AttendanceDraftBanner: React.FC<AttendanceDraftBannerProps> = ({
  savedAt,
  onRestore,
  onDismiss,
  changedCount,
  className,
}) => {
  const time = draftTimeLabel(savedAt);

  return (
    <div
      role="region"
      aria-label="Bản nháp điểm danh chưa lưu"
      aria-live="polite"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-card border border-info/30 bg-info-soft p-3 sm:p-4",
        className
      )}
    >
      <div className="flex min-w-0 grow basis-56 items-center gap-3">
        <IconTile icon={<History />} tone="info" size="md" solid />
        <div className="min-w-0">
          <p className="text-base leading-snug font-semibold text-ink">
            Có bản nháp chưa lưu{time ? ` lúc ${time}` : ""}
          </p>
          <p className="text-sm text-ink-2">
            {changedCount && changedCount > 0
              ? `${changedCount} em có trạng thái khác dữ liệu đã lưu.`
              : "Khôi phục để tiếp tục điểm danh dang dở."}
          </p>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Button variant="secondary" onClick={onRestore}>
          Khôi phục
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          Bỏ qua
        </Button>
      </div>
    </div>
  );
};
