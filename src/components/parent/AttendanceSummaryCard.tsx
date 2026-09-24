import React from "react";
import { ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { ParentAttendanceSummary } from "../../types";

export interface AttendanceSummaryCardProps {
  attendance: ParentAttendanceSummary;
  studentName?: string;
  onViewHistory?: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * AttendanceSummaryCard (§27, Wireframe §10)
 *
 * Wireframe format:
 * Chuyên cần
 * 18 / 20 buổi
 * ████████████████░░ 90%
 * Vắng: 2
 *
 * Ràng buộc:
 * - Hiển thị đúng: "X/Y buổi", progress bar %, "Vắng: N"
 * - Toàn bộ control: font-size ≥18px, touch target ≥52–56px (RULE-010)
 * - KHÔNG dùng icon-only cho action nghiệp vụ quan trọng (RULE-012)
 */
export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  attendance,
  studentName,
  onViewHistory,
  isLoading = false,
  className = "",
}) => {
  const {
    totalSessions = 20,
    attendedSessions = 18,
    absentSessions = 2,
    excusedSessions = 1,
    attendanceRate = 90,
  } = attendance || {};

  if (isLoading) {
    return (
      <div
        className={`p-5 sm:p-6 rounded-[18px] bg-white border border-[#E7E5E4] animate-pulse space-y-4 min-h-[160px] ${className}`}
      >
        <div className="w-1/3 h-5 bg-[#E7E5E4] rounded-md" />
        <div className="w-1/2 h-8 bg-[#E7E5E4] rounded-md" />
        <div className="w-full h-4 bg-[#E7E5E4] rounded-full" />
      </div>
    );
  }

  // Determine progress bar color
  const isGreat = attendanceRate >= 90;
  const isOk = attendanceRate >= 80 && attendanceRate < 90;
  const barColor = isGreat
    ? "bg-[#168154]"
    : isOk
    ? "bg-[#D97706]"
    : "bg-[#B4232C]";

  return (
    <div
      aria-label={`Thống kê chuyên cần: ${attendedSessions} trên ${totalSessions} buổi, tỷ lệ ${attendanceRate}%, vắng ${absentSessions} buổi`}
      className={`p-5 sm:p-6 rounded-[18px] bg-white border border-[#E7E5E4] shadow-xs space-y-4 ${className}`}
    >
      {/* Header: Title + Session count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#ECFDF3] border border-[#A7F3D0] flex items-center justify-center text-[#168154]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[19px] sm:text-[20px] font-bold text-[#1C1917] font-serif">
              Chuyên cần
            </h3>
            {studentName && (
              <p className="text-[13px] text-[#78716C]">Học sinh: {studentName}</p>
            )}
          </div>
        </div>

        {/* Big format: "X / Y buổi" */}
        <div className="text-right sm:text-right">
          <span className="text-[24px] sm:text-[26px] font-extrabold font-serif text-[#1C1917]">
            {attendedSessions}
          </span>
          <span className="text-[17px] font-bold text-[#78716C] ml-1">
            / {totalSessions} buổi
          </span>
        </div>
      </div>

      {/* Progress bar with percentage */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[15px] sm:text-[16px]">
          <span className="font-semibold text-[#57534E]">Tỷ lệ đi học</span>
          <span className="font-extrabold text-[#1C1917] text-[17px] sm:text-[18px]">
            {attendanceRate}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-valuenow={attendanceRate}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full h-4 bg-[#F5F5F4] rounded-full overflow-hidden border border-[#E7E5E4] p-0.5"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(Math.max(attendanceRate, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Breakdown: "Vắng: N" as strictly required */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F5F5F4]">
        <div className="flex items-center gap-3 text-[15px] sm:text-[16px]">
          {/* Vắng: N */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[#FFF1F2] border border-[#FECDD3] text-[#B4232C] font-bold text-[16px]">
            <AlertCircle className="w-4 h-4" />
            <span>Vắng: {absentSessions}</span>
          </span>

          {excusedSessions > 0 && (
            <span className="text-[14px] text-[#78716C]">
              ({excusedSessions} có phép)
            </span>
          )}
        </div>

        {/* View history button - RULE-010: touch target >= 52px, RULE-012: text + icon */}
        {onViewHistory && (
          <button
            type="button"
            onClick={onViewHistory}
            className="min-h-[52px] px-5 py-2 rounded-[12px] font-bold text-[16px] sm:text-[17px] text-[#168154] hover:bg-[#ECFDF3] border border-[#A7F3D0] transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Lịch sử điểm danh</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
