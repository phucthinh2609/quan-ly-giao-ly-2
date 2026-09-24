import React from "react";
import { Check, X, FileCheck, Clock, Users } from "lucide-react";
import { AttendanceStatus, AttendanceSummaryData } from "../../types";

export interface AttendanceSummaryProps {
  summary: AttendanceSummaryData;
  activeFilter?: AttendanceStatus | "ALL";
  onFilterChange?: (filter: AttendanceStatus | "ALL") => void;
  className?: string;
}

/**
 * AttendanceSummary Component (§21 - 03_Component_Library)
 *
 * Hiển thị thống kê tổng quan buổi điểm danh:
 * - Tổng sĩ số
 * - Có mặt (PRESENT)
 * - Vắng (ABSENT)
 * - Có phép (EXCUSED)
 * - Đi muộn (LATE)
 * - Thanh tỷ lệ phần trăm chuyên cần trực quan
 * - Hỗ trợ nhấn để lọc nhanh danh sách học sinh theo trạng thái
 */
export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  summary,
  activeFilter = "ALL",
  onFilterChange,
  className = "",
}) => {
  const { total, present, absent, excused, late, presentRate } = summary;

  return (
    <div
      className={`
        p-4 sm:p-5 bg-white rounded-[16px] border border-[#E7E5E4] shadow-xs space-y-3.5
        ${className}
      `}
    >
      {/* Hàng 1: Tổng số & Tỷ lệ chuyên cần */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[#57534E]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[16px] text-[#1C1917] font-serif">
              Tổng quan sĩ số
            </span>
            <span className="text-[13px] text-[#78716C] ml-2">
              (Tổng: <strong className="text-[#1C1917]">{total}</strong> học sinh)
            </span>
          </div>
        </div>

        {/* Tỷ lệ có mặt */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[13px] text-[#78716C]">Tỷ lệ có mặt:</span>
          <span className="font-bold font-mono text-[16px] sm:text-[18px] text-[#168154]">
            {presentRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Hàng 2: Thanh tiến trình phân bổ tỷ lệ màu trực quan */}
      <div className="w-full bg-[#F5F5F4] h-3 rounded-full overflow-hidden flex" title={`Có mặt: ${present}, Vắng: ${absent}, Có phép: ${excused}, Đi muộn: ${late}`}>
        {total > 0 && (
          <>
            {present > 0 && (
              <div
                style={{ width: `${(present / total) * 100}%` }}
                className="bg-[#168154] transition-all duration-300"
                title={`Có mặt: ${present}`}
              />
            )}
            {absent > 0 && (
              <div
                style={{ width: `${(absent / total) * 100}%` }}
                className="bg-[#DC4C4C] transition-all duration-300"
                title={`Vắng: ${absent}`}
              />
            )}
            {excused > 0 && (
              <div
                style={{ width: `${(excused / total) * 100}%` }}
                className="bg-[#D9901A] transition-all duration-300"
                title={`Có phép: ${excused}`}
              />
            )}
            {late > 0 && (
              <div
                style={{ width: `${(late / total) * 100}%` }}
                className="bg-[#EA580C] transition-all duration-300"
                title={`Đi muộn: ${late}`}
              />
            )}
          </>
        )}
      </div>

      {/* Hàng 3: 4 Thẻ đếm chi tiết (Có thể click để lọc nhanh) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Có mặt */}
        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange(activeFilter === "PRESENT" ? "ALL" : "PRESENT")}
          className={`
            flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] border text-left transition-all
            cursor-pointer min-h-[48px]
            ${
              activeFilter === "PRESENT"
                ? "bg-[#ECFDF3] border-[#168154] ring-1 ring-[#168154]"
                : "bg-[#FAFAF9] border-[#E7E5E4] hover:bg-[#F5F5F4]"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#168154] text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="text-[13px] font-semibold text-[#57534E]">Có mặt</span>
          </div>
          <span className="font-bold font-mono text-[16px] text-[#168154]">
            {present}
          </span>
        </button>

        {/* Vắng */}
        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange(activeFilter === "ABSENT" ? "ALL" : "ABSENT")}
          className={`
            flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] border text-left transition-all
            cursor-pointer min-h-[48px]
            ${
              activeFilter === "ABSENT"
                ? "bg-[#FEF2F2] border-[#DC4C4C] ring-1 ring-[#DC4C4C]"
                : "bg-[#FAFAF9] border-[#E7E5E4] hover:bg-[#F5F5F4]"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#DC4C4C] text-white flex items-center justify-center shrink-0">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="text-[13px] font-semibold text-[#57534E]">Vắng</span>
          </div>
          <span className="font-bold font-mono text-[16px] text-[#DC4C4C]">
            {absent}
          </span>
        </button>

        {/* Có phép */}
        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange(activeFilter === "EXCUSED" ? "ALL" : "EXCUSED")}
          className={`
            flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] border text-left transition-all
            cursor-pointer min-h-[48px]
            ${
              activeFilter === "EXCUSED"
                ? "bg-[#FFF8E7] border-[#D9901A] ring-1 ring-[#D9901A]"
                : "bg-[#FAFAF9] border-[#E7E5E4] hover:bg-[#F5F5F4]"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D9901A] text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span className="text-[13px] font-semibold text-[#57534E]">Có phép</span>
          </div>
          <span className="font-bold font-mono text-[16px] text-[#B86F08]">
            {excused}
          </span>
        </button>

        {/* Đi muộn */}
        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange(activeFilter === "LATE" ? "ALL" : "LATE")}
          className={`
            flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] border text-left transition-all
            cursor-pointer min-h-[48px]
            ${
              activeFilter === "LATE"
                ? "bg-[#FFF7ED] border-[#EA580C] ring-1 ring-[#EA580C]"
                : "bg-[#FAFAF9] border-[#E7E5E4] hover:bg-[#F5F5F4]"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span className="text-[13px] font-semibold text-[#57534E]">Đi muộn</span>
          </div>
          <span className="font-bold font-mono text-[16px] text-[#C2410C]">
            {late}
          </span>
        </button>
      </div>

      {/* Filter indicator nếu đang bật lọc */}
      {activeFilter !== "ALL" && (
        <div className="flex items-center justify-between text-[12px] bg-[#F5F5F4] px-3 py-1.5 rounded-[8px]">
          <span className="text-[#57534E]">
            Đang lọc danh sách theo: <strong className="text-[#1C1917]">{activeFilter}</strong>
          </span>
          <button
            type="button"
            onClick={() => onFilterChange && onFilterChange("ALL")}
            className="text-[#B4232C] font-semibold hover:underline cursor-pointer"
          >
            Hiện tất cả
          </button>
        </div>
      )}
    </div>
  );
};
