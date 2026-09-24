import React from "react";
import { Calendar, HeartHandshake } from "lucide-react";
import { LinkedStudent } from "../../types";

export interface WelcomeSummaryProps {
  parentName?: string;
  selectedChild: LinkedStudent;
  className?: string;
}

/**
 * WelcomeSummary (§30 ParentDashboard)
 *
 * Hiển thị lời chào phụ huynh, niên khóa, và tóm tắt nhanh học sinh đang theo dõi.
 */
export const WelcomeSummary: React.FC<WelcomeSummaryProps> = ({
  parentName = "Quý Phụ huynh",
  selectedChild,
  className = "",
}) => {
  return (
    <div
      className={`p-5 sm:p-6 rounded-[18px] bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFFBEB] border border-[#FECDD3] shadow-xs space-y-2.5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold bg-[#B4232C] text-white">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Gia đình Kitô Hữu</span>
        </span>

        <span className="text-[13px] font-semibold text-[#78716C] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#B4232C]" />
          <span>Chúa Nhật · Niên khóa 2026 - 2027</span>
        </span>
      </div>

      <div>
        <h2 className="text-[20px] sm:text-[23px] font-bold text-[#1C1917] font-serif leading-tight">
          Xin chào, {parentName}
        </h2>
        <p className="text-[16px] sm:text-[18px] text-[#57534E] mt-1 leading-relaxed">
          Đang theo dõi tiến độ đức tin và học tập của em{" "}
          <strong className="text-[#B4232C] font-semibold">
            {selectedChild.christianName ? `${selectedChild.christianName} ` : ""}
            {selectedChild.name}
          </strong>{" "}
          ({selectedChild.className}).
        </p>
      </div>
    </div>
  );
};
