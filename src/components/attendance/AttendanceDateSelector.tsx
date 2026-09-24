import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { IconButton } from "../ui/IconButton";

export interface AttendanceDateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  disabled?: boolean;
  className?: string;
}

// Utility: format YYYY-MM-DD sang tiếng Việt dạng "Chúa Nhật, 24/09/2026"
export function formatVietnameseDate(dateStr: string): {
  dayOfWeek: string;
  formattedDate: string;
  isToday: boolean;
} {
  const parts = dateStr.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  const days = [
    "Chúa Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  const now = new Date();
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  const dayOfWeek = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return {
    dayOfWeek,
    formattedDate: `${dd}/${mm}/${yyyy}`,
    isToday,
  };
}

export function shiftDate(dateStr: string, daysToAdd: number): string {
  const parts = dateStr.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + daysToAdd);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * AttendanceDateSelector Component
 * Dành cho GLV chọn ngày điểm danh (thường là Chúa Nhật hoặc các buổi học)
 * Có phím chuyển nhanh về "Hôm nay", tiến/lùi tuần và chọn ngày lịch.
 */
export const AttendanceDateSelector: React.FC<AttendanceDateSelectorProps> = ({
  selectedDate,
  onDateChange,
  disabled = false,
  className = "",
}) => {
  const { dayOfWeek, formattedDate, isToday } = formatVietnameseDate(selectedDate);
  const todayStr = getTodayDateString();

  const handlePrevDay = () => {
    // Thường các buổi giáo lý cách nhau 7 ngày (mỗi Chúa Nhật) hoặc 1 ngày
    onDateChange(shiftDate(selectedDate, -7));
  };

  const handleNextDay = () => {
    onDateChange(shiftDate(selectedDate, 7));
  };

  const handleGoToday = () => {
    onDateChange(todayStr);
  };

  return (
    <div
      className={`
        flex flex-wrap items-center justify-between gap-2.5 sm:gap-3
        p-3 sm:p-3.5 bg-white rounded-[14px] border border-[#E7E5E4] shadow-xs
        ${className}
      `}
    >
      {/* Tiêu đề & Thông tin ngày hiện tại */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#B4232C] shrink-0">
          <CalendarIcon className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px] sm:text-[16px] text-[#1C1917] font-serif">
              {dayOfWeek}
            </span>
            {isToday ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF3] text-[#168154] border border-[#A7F3D0]">
                Hôm nay
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F5F4] text-[#78716C]">
                Lịch sử
              </span>
            )}
          </div>
          <div className="text-[13px] text-[#57534E] font-medium mt-0.5">
            Ngày {formattedDate}
          </div>
        </div>
      </div>

      {/* Bộ điều hướng Ngày: Tuần trước | Hôm nay | Tuần tới */}
      <div className="flex items-center gap-1.5 ml-auto">
        <IconButton
          variant="outline"
          size="md"
          aria-label="Xem buổi Chúa Nhật trước (trừ 7 ngày)"
          title="Chúa Nhật trước"
          onClick={handlePrevDay}
          disabled={disabled}
          className="text-[#57534E]"
        >
          <ChevronLeft className="w-5 h-5" />
        </IconButton>

        {!isToday && (
          <button
            type="button"
            onClick={handleGoToday}
            disabled={disabled}
            className="
              flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-semibold
              bg-[#FFF1F2] text-[#B4232C] border border-[#FECDD3] hover:bg-[#FFE4E6]
              transition-colors cursor-pointer min-h-[44px]
            "
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Về Hôm nay</span>
          </button>
        )}

        <IconButton
          variant="outline"
          size="md"
          aria-label="Xem buổi Chúa Nhật kế tiếp (cộng 7 ngày)"
          title="Chúa Nhật sau"
          onClick={handleNextDay}
          disabled={disabled}
          className="text-[#57534E]"
        >
          <ChevronRight className="w-5 h-5" />
        </IconButton>

        {/* Input ẩn để chọn bất kỳ ngày nào từ bộ chọn trình duyệt */}
        <label
          className="
            relative flex items-center justify-center px-3 py-2 rounded-[10px]
            border border-[#E7E5E4] bg-[#FAFAF9] hover:bg-[#F5F5F4]
            text-[13px] font-semibold text-[#57534E] cursor-pointer min-h-[44px]
            transition-colors
          "
          title="Chọn ngày khác"
        >
          <span>Đổi ngày</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            disabled={disabled}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Chọn ngày cụ thể trong lịch"
          />
        </label>
      </div>
    </div>
  );
};
