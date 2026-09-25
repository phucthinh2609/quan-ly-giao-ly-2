import React from "react";
import { LinkedStudent, StudentAcademicReport } from "../../types";
import { cn } from "../../lib/cn";
import { scoreGrade } from "../../lib/format";
import { CountUp } from "../ui/CountUp";
import { TONE_SOFT } from "../ui/tone";
import { getChildCallName } from "../../services/parentMockData";
import { attendanceLabel, attendancePercent, childOverallStatus, describeChildProgress } from "./parentInsights";

export interface WelcomeSummaryProps {
  /** Giữ để tương thích ngược — lời chào nay nằm ở tiêu đề trang */
  parentName?: string;
  selectedChild: LinkedStudent;
  /** Số liệu kỳ đang chọn; chưa có → hiển thị khung chờ */
  report?: StudentAcademicReport | null;
  isLoading?: boolean;
  className?: string;
}

/** Khung chờ trên nền night (không chớp trắng khi đổi con). */
const NightSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <span aria-hidden="true" className={cn("block animate-pulse rounded-full bg-on-night/15", className)} />
);

/**
 * WelcomeSummary → "Tuần này của {tên con}" (B-PH-02, 03 §9, 04 §10)
 * Thẻ night: trạng thái (màu + icon + chữ) · câu tóm tắt đời thường ·
 * 2 chỉ số lớn: chuyên cần % và điểm TB.
 */
export const WelcomeSummary: React.FC<WelcomeSummaryProps> = ({
  selectedChild,
  report,
  isLoading = false,
  className,
}) => {
  const callName = getChildCallName(selectedChild);
  const ready = Boolean(report) && !isLoading;

  const attendance = report?.attendance;
  const percent = attendance ? attendancePercent(attendance) : 0;
  const grade = scoreGrade(report?.gpa);
  const status = attendance ? childOverallStatus(attendance, report?.gpa) : null;
  const StatusIcon = status?.icon;

  return (
    <section
      aria-labelledby="child-week-heading"
      aria-busy={!ready || undefined}
      className={cn(
        "grain relative overflow-hidden rounded-card-lg bg-night p-6 text-on-night shadow-card",
        className
      )}
    >
      {/* Ánh sáng nền */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 -z-10 size-64 rounded-full bg-primary/30 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 -z-10 size-56 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 id="child-week-heading" className="text-xl font-semibold tracking-tight">
          Tuần này của {callName}
        </h2>
        {ready && status && StatusIcon ? (
          <span
            data-reveal
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
              TONE_SOFT[status.tone]
            )}
          >
            <StatusIcon className="size-4" aria-hidden="true" />
            {status.label}
          </span>
        ) : (
          <NightSkeleton className="h-7 w-32" />
        )}
      </div>

      {ready && report && attendance ? (
        <>
          <p data-reveal className="mt-3 text-lg leading-relaxed text-pretty sm:text-xl">
            {describeChildProgress(callName, attendance, report.gpa)}
          </p>
          <p className="mt-1 text-sm text-on-night/70">
            {report.periodLabel} · Năm học {report.academicYear}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div data-reveal className="min-w-0 rounded-card bg-on-night/10 p-3 sm:p-4">
              <dt className="text-sm text-on-night/75">Chuyên cần</dt>
              <dd className="mt-1">
                <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <CountUp value={Math.round(percent)} />
                  <span className="text-xl font-semibold">%</span>
                </span>
                <span className="mt-0.5 block text-sm text-on-night/75">
                  {attendance.attendedSessions}/{attendance.totalSessions} buổi · {attendanceLabel(percent)}
                </span>
              </dd>
            </div>
            <div data-reveal className="min-w-0 rounded-card bg-on-night/10 p-3 sm:p-4">
              <dt className="text-sm text-on-night/75">Điểm TB</dt>
              <dd className="mt-1">
                <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <CountUp value={report.gpa} decimals={1} />
                </span>
                <span className="mt-0.5 block text-sm text-on-night/75">
                  Trên 10 · {grade.label}
                </span>
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <div role="status" aria-label="Đang tải tóm tắt của con" className="mt-4 space-y-3">
          <NightSkeleton className="h-5 w-full" />
          <NightSkeleton className="h-5 w-3/4" />
          <div className="grid grid-cols-2 gap-3 pt-3">
            <span aria-hidden="true" className="block h-28 animate-pulse rounded-card bg-on-night/10" />
            <span aria-hidden="true" className="block h-28 animate-pulse rounded-card bg-on-night/10" />
          </div>
        </div>
      )}
    </section>
  );
};
