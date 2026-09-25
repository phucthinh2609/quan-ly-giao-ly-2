import React from "react";
import { Bell, CalendarCheck, ClipboardList, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { IconTile } from "../ui/IconTile";
import type { Tone } from "../ui/tone";

export interface ShortcutGridProps {
  onNavigate: (path: string) => void;
  /** Số thông báo chưa đọc (hiện trên ô Thông báo) */
  unreadCount?: number;
  /** Số điện thoại GLV để gọi (href="tel:...") */
  teacherTel?: string | null;
  /** Số hiển thị, VD "0903 456 721" */
  teacherPhone?: string | null;
  teacherName?: string | null;
  className?: string;
}

interface TileContentProps {
  icon: React.ReactNode;
  tone: Tone;
  label: string;
  hint?: React.ReactNode;
  count?: number;
}

const tileClass = cn(
  "group relative flex min-h-28 w-full flex-col items-start justify-between gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-card sm:p-5",
  "transition-[transform,box-shadow,border-color] duration-200 ease-out-soft",
  "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float active:scale-[0.98]",
  "focus-visible:outline-3 focus-visible:outline-offset-2"
);

const TileContent: React.FC<TileContentProps> = ({ icon, tone, label, hint, count }) => (
  <>
    <span className="relative inline-flex">
      <IconTile icon={icon} tone={tone} size="lg" />
      {count !== undefined && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-sm font-bold text-on-primary tabular-nums ring-2 ring-surface"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
    <span className="block min-w-0">
      <span className="block text-lg leading-tight font-semibold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-sm leading-snug text-ink-2">{hint}</span>}
    </span>
  </>
);

/**
 * ShortcutGrid (B-PH-03, 03 §9, 04 §10) — lưới 2×2 lối tắt lớn có nhãn:
 * Bảng điểm · Điểm danh · Thông báo (n) · Gọi GLV (tel:).
 */
export const ShortcutGrid: React.FC<ShortcutGridProps> = ({
  onNavigate,
  unreadCount = 0,
  teacherTel,
  teacherPhone,
  teacherName,
  className,
}) => {
  const callLabel = teacherName ? `Gọi ${teacherName}` : "Gọi giáo lý viên";

  return (
    <nav aria-label="Lối tắt" className={cn("grid grid-cols-2 gap-3 sm:gap-4", className)}>
      <button type="button" className={tileClass} onClick={() => onNavigate("/parent/scores")}>
        <TileContent icon={<ClipboardList />} tone="info" label="Bảng điểm" hint="Điểm từng môn" />
      </button>

      <button type="button" className={tileClass} onClick={() => onNavigate("/parent/attendance")}>
        <TileContent icon={<CalendarCheck />} tone="success" label="Điểm danh" hint="Các buổi đã học" />
      </button>

      <button
        type="button"
        className={tileClass}
        onClick={() => onNavigate("/parent/notifications")}
        aria-label={unreadCount > 0 ? `Thông báo, ${unreadCount} tin chưa đọc` : "Thông báo"}
      >
        <TileContent
          icon={<Bell />}
          tone="primary"
          label="Thông báo"
          count={unreadCount}
          hint={
            unreadCount > 0 ? (
              <span className="font-semibold text-primary-ink">{unreadCount} tin mới</span>
            ) : (
              "Đã đọc hết"
            )
          }
        />
      </button>

      {teacherTel ? (
        <a href={`tel:${teacherTel}`} className={tileClass} aria-label={`${callLabel}${teacherPhone ? `, số ${teacherPhone}` : ""}`}>
          <TileContent
            icon={<Phone />}
            tone="gold"
            label="Gọi GLV"
            hint={teacherPhone ? <span className="tabular-nums">{teacherPhone}</span> : undefined}
          />
        </a>
      ) : (
        <div className={cn(tileClass, "cursor-not-allowed opacity-60 shadow-none hover:translate-y-0 hover:shadow-none")} aria-disabled="true">
          <TileContent icon={<Phone />} tone="neutral" label="Gọi GLV" hint="Chưa có số điện thoại" />
        </div>
      )}
    </nav>
  );
};
