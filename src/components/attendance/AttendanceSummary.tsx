import React from "react";
import { Users } from "lucide-react";
import { AttendanceStatus, AttendanceSummaryData } from "../../types";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import { CountUp } from "../ui/CountUp";
import { ProgressRing } from "../ui/ProgressRing";
import { TONE_SOFT, TONE_TEXT, Tone } from "../ui/tone";
import { ATTENDANCE_CYCLE, ATTENDANCE_STATUS_META, presentRateTone } from "./attendanceStatus";

export interface AttendanceSummaryProps {
  summary: AttendanceSummaryData;
  activeFilter?: AttendanceStatus | "ALL";
  onFilterChange?: (filter: AttendanceStatus | "ALL") => void;
  className?: string;
}

const ACTIVE_RING: Partial<Record<Tone, string>> = {
  success: "ring-success/40",
  danger: "ring-danger/40",
  info: "ring-info/40",
  warning: "ring-warning/40",
};

/**
 * AttendanceSummary (03 §7): vòng tỷ lệ có mặt + 4 ô số đếm động.
 * Có onFilterChange → mỗi ô là nút lọc nhanh danh sách (bấm lại để bỏ lọc).
 */
export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  summary,
  activeFilter = "ALL",
  onFilterChange,
  className,
}) => {
  const { total, present, absent, excused, late, presentRate } = summary;
  const counts: Record<AttendanceStatus, number> = { PRESENT: present, ABSENT: absent, EXCUSED: excused, LATE: late };
  const rate = Math.round(presentRate);

  return (
    <Card padding="md" className={cn("flex items-center gap-4 sm:gap-6", className)}>
      <ProgressRing
        value={presentRate}
        max={100}
        tone={presentRateTone(presentRate)}
        size="md"
        className="sm:size-24"
        label={`Tỷ lệ có mặt ${rate}%`}
      >
        <CountUp value={rate} suffix="%" className="font-mono text-sm leading-none font-semibold text-ink sm:text-xl" />
        <span className="mt-0.5 hidden text-xs text-ink-3 sm:block">có mặt</span>
      </ProgressRing>

      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="flex items-center gap-1.5 text-sm text-ink-2">
          <Users className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
          <span>
            Sĩ số <span className="font-mono font-semibold text-ink">{total}</span> em
            <span className="text-ink-3"> · </span>
            <span className="font-mono font-semibold text-ink">{present}</span> có mặt
          </span>
        </p>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {ATTENDANCE_CYCLE.map((status) => {
            const meta = ATTENDANCE_STATUS_META[status];
            const Icon = meta.Icon;
            const active = activeFilter === status;
            const count = counts[status];

            // Số + nhãn cùng dòng khi đủ chỗ; chữ lớn / màn hẹp thì nhãn tự xuống dòng (không cắt chữ)
            const inner = (
              <>
                <CountUp value={count} className="font-mono text-lg leading-none font-semibold text-ink md:text-xl" />
                <span className="flex items-center gap-1 text-xs font-medium whitespace-nowrap text-ink-2">
                  <Icon className={cn("size-3.5 shrink-0", TONE_TEXT[meta.tone])} aria-hidden="true" />
                  {meta.label}
                </span>
              </>
            );

            const tileClasses = cn(
              "flex min-h-11 min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-control px-3 py-2 text-left",
              "md:min-h-15 md:flex-col md:flex-nowrap md:items-start md:justify-center",
              active ? cn(TONE_SOFT[meta.tone], "ring-1 ring-inset", ACTIVE_RING[meta.tone]) : "bg-surface-2"
            );

            if (!onFilterChange) {
              return (
                <div key={status} className={tileClasses}>
                  {inner}
                </div>
              );
            }

            return (
              <button
                key={status}
                type="button"
                aria-pressed={active}
                aria-label={`${meta.label}: ${count} em${active ? ", đang lọc" : ". Bấm để lọc"}`}
                onClick={() => onFilterChange(active ? "ALL" : status)}
                className={cn(
                  tileClasses,
                  "transition-[background-color,box-shadow,transform] duration-150 ease-out-soft active:scale-[0.98]",
                  "focus-visible:outline-3 focus-visible:outline-offset-2",
                  !active && "hover:bg-surface-3"
                )}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
