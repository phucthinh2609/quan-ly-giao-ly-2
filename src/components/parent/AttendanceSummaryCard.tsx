import React, { useMemo } from "react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { AttendanceStatus, ParentAttendanceSummary } from "../../types";
import { cn } from "../../lib/cn";
import { formatWeekdayDate } from "../../lib/format";
import { Button } from "../ui/Button";
import { CountUp } from "../ui/CountUp";
import { IconTile } from "../ui/IconTile";
import { ProgressBar } from "../ui/ProgressBar";
import { Skeleton } from "../ui/Skeleton";
import { TONE_SOFT, TONE_TEXT } from "../ui/tone";
import type { ParentAttendanceSession } from "../../services/parentMockData";
import { PARENT_ATTENDANCE_STATUS, attendanceLabel, attendancePercent, attendanceTone } from "./parentInsights";

export interface AttendanceSummaryCardProps {
  attendance: ParentAttendanceSummary;
  studentName?: string;
  onViewHistory?: () => void;
  isLoading?: boolean;
  className?: string;
  /** Lịch sử từng buổi (mới nhất trước) — dùng cho dải chấm các buổi gần nhất */
  sessions?: ParentAttendanceSession[];
  /** VD "Học kỳ I" */
  periodLabel?: string;
  /** Số buổi gần nhất hiển thị dạng chấm (mặc định 10) */
  recentCount?: number;
}

/** "2026-09-20" → "Chúa Nhật, 20/09" */
export function formatSessionDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return formatWeekdayDate(new Date(y, m - 1, d));
}

/** Chip trạng thái điểm danh: icon + nhãn (không chỉ màu). */
export const AttendanceStatusPill: React.FC<{ status: AttendanceStatus; className?: string }> = ({
  status,
  className,
}) => {
  const meta = PARENT_ATTENDANCE_STATUS[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold whitespace-nowrap",
        TONE_SOFT[meta.tone],
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {meta.label}
    </span>
  );
};

/**
 * AttendanceSummaryCard (03 §9, 04 §12) — tỷ lệ chuyên cần + "18/20 buổi" + thanh tiến độ +
 * số buổi theo trạng thái + dải chấm các buổi gần nhất (mỗi chấm có icon và nhãn đọc được).
 */
export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  attendance,
  studentName,
  onViewHistory,
  isLoading = false,
  className,
  sessions,
  periodLabel,
  recentCount = 10,
}) => {
  const lateCount = useMemo(() => (sessions ?? []).filter((s) => s.status === "LATE").length, [sessions]);

  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className={cn("space-y-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}
      >
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-control" />
          <Skeleton className="h-6 w-1/3 rounded-full" />
          <Skeleton className="ml-auto h-9 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-full rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} variant="circular" className="size-9" />
          ))}
        </div>
      </div>
    );
  }

  const { totalSessions, attendedSessions, absentSessions, excusedSessions } = attendance;
  const percent = attendancePercent(attendance);
  const tone = attendanceTone(percent);
  const unexcused = Math.max(0, absentSessions - excusedSessions);
  const breakdown: { status: AttendanceStatus; count: number }[] = [
    { status: "PRESENT", count: Math.max(0, attendedSessions - lateCount) },
    { status: "LATE", count: lateCount },
    { status: "ABSENT", count: unexcused },
    { status: "EXCUSED", count: excusedSessions },
  ];
  const recent = (sessions ?? []).slice(0, recentCount);
  const subtitle = [studentName, periodLabel].filter(Boolean).join(" · ");

  return (
    <section
      aria-labelledby="attendance-summary-heading"
      className={cn("rounded-card border border-line bg-surface p-5 shadow-card sm:p-6", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile icon={<CalendarCheck />} tone="success" size="md" />
          <div className="min-w-0">
            <h2 id="attendance-summary-heading" className="text-xl font-semibold tracking-tight text-ink">
              Chuyên cần
            </h2>
            {subtitle && <p className="text-sm text-ink-3">{subtitle}</p>}
          </div>
        </div>
        <p className="text-right">
          <span className="block text-3xl leading-none font-bold tracking-tight text-ink">
            <CountUp value={Math.round(percent)} />
            <span className="text-xl font-semibold">%</span>
          </span>
          <span className={cn("mt-1 block text-sm font-semibold", TONE_TEXT[tone])}>{attendanceLabel(percent)}</span>
        </p>
      </div>

      <p className="mt-4 text-lg text-ink">
        Đi học <span className="font-bold tabular-nums">{attendedSessions}</span>
        <span className="text-ink-2">/{totalSessions} buổi</span>
      </p>
      <ProgressBar
        value={attendedSessions}
        max={Math.max(totalSessions, 1)}
        tone={tone}
        size="lg"
        label={`Đã đi học ${attendedSessions} trên ${totalSessions} buổi`}
        className="mt-2"
      />

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Số buổi theo trạng thái">
        {breakdown
          .filter((item) => item.status === "PRESENT" || item.count > 0)
          .map((item) => {
            const meta = PARENT_ATTENDANCE_STATUS[item.status];
            const Icon = meta.icon;
            return (
              <li
                key={item.status}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold",
                  TONE_SOFT[meta.tone]
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="tabular-nums">{item.count}</span> {meta.label}
              </li>
            );
          })}
      </ul>

      {recent.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-ink-2">{recent.length} buổi gần nhất, mới nhất ở đầu</p>
          <ol className="mt-2 flex flex-wrap gap-1.5">
            {recent.map((session) => {
              const meta = PARENT_ATTENDANCE_STATUS[session.status];
              const Icon = meta.icon;
              const label = `${formatSessionDate(session.date)}: ${meta.label}`;
              return (
                <li key={session.id}>
                  <span
                    role="img"
                    aria-label={label}
                    title={label}
                    className={cn("inline-flex size-9 items-center justify-center rounded-full", TONE_SOFT[meta.tone])}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {onViewHistory && (
        <Button
          variant="soft"
          rightIcon={<ArrowRight />}
          onClick={onViewHistory}
          className="mt-5 w-full sm:w-auto"
        >
          Xem lịch sử điểm danh
        </Button>
      )}
    </section>
  );
};
