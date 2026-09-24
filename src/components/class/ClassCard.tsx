import React from "react";
import { Users, UserCheck, ChevronRight, MapPin, CalendarCheck, FileEdit } from "lucide-react";
import { Badge } from "../ui/Badge";
import { ClassInfo } from "../../types";

export interface ClassCardProps {
  /**
   * Thông tin chi tiết của lớp học
   */
  classInfo: ClassInfo & {
    presentCount?: number;
    attendanceRate?: number;
    lastUpdated?: string;
  };
  /**
   * Trạng thái vô hiệu hóa
   */
  disabled?: boolean;
  /**
   * Callback khi nhấn vào thẻ lớp
   */
  onClick?: (classId: string) => void;
  /**
   * Callback khi nhấn hành động xem chi tiết
   */
  onViewDetails?: (classId: string) => void;
  /**
   * Callback trực tiếp điểm danh lớp (cho GLV)
   */
  onAttendanceClick?: (classId: string) => void;
  /**
   * Callback trực tiếp nhập điểm lớp (cho GLV)
   */
  onScoreClick?: (classId: string) => void;
  className?: string;
}

/**
 * ClassCard Component (§20 03_Component_Library & Wireframe A/B)
 *
 * Cấu trúc phân cấp chuẩn:
 * ├── ClassName
 * ├── Grade
 * ├── StudentCount
 * ├── Teacher
 * ├── AttendanceSummary
 * └── ViewAction
 *
 * States: Default, Hover, Active, Disabled.
 */
export const ClassCard: React.FC<ClassCardProps> = ({
  classInfo,
  disabled = false,
  onClick,
  onViewDetails,
  onAttendanceClick,
  onScoreClick,
  className = "",
}) => {
  const {
    id,
    name,
    grade,
    studentCount,
    teachers = [],
    room,
    presentCount,
    attendanceRate = 95,
  } = classInfo;

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick(id);
    else if (onViewDetails) onViewDetails(id);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group relative bg-white rounded-[14px] border transition-all duration-200 text-left ${
        disabled
          ? "opacity-60 cursor-not-allowed border-[#E7E5E4] bg-[#FAFAF9]"
          : "border-[#E7E5E4] hover:border-[#B4232C] hover:shadow-md cursor-pointer active:scale-[0.99]"
      } p-4 sm:p-4.5 flex flex-col justify-between ${className}`}
    >
      {/* Top Header: ClassName + Grade Badge */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="space-y-0.5">
            <h4 className="text-[16px] sm:text-[17px] font-bold text-[#1C1917] group-hover:text-[#B4232C] transition-colors font-serif">
              {name}
            </h4>
            <div className="flex items-center gap-2 text-[12px] text-[#78716C]">
              <Badge variant="neutral" size="sm">
                {grade}
              </Badge>
              {room && (
                <span className="flex items-center gap-1 text-[#A8A29E]">
                  <MapPin className="w-3 h-3" />
                  {room}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A8A29E] group-hover:text-[#B4232C] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
        </div>

        {/* Student Count & Teacher */}
        <div className="space-y-1.5 mt-3 pt-2.5 border-t border-[#F5F5F4] text-[13px]">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#78716C]" />
              <span>Sĩ số:</span>
            </span>
            <span className="font-semibold text-[#1C1917]">{studentCount} học sinh</span>
          </div>

          <div className="flex items-start justify-between text-[#57534E] gap-2">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <UserCheck className="w-4 h-4 text-[#78716C]" />
              <span>GLV:</span>
            </span>
            <span className="text-right text-[#1C1917] line-clamp-1 font-medium">
              {teachers.length > 0 ? teachers.join(", ") : "Chưa phân công"}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="mt-3.5 pt-3 border-t border-[#F5F5F4]">
        <div className="flex items-center justify-between text-[12px] mb-1.5">
          <span className="text-[#78716C] font-medium">Chuyên cần hôm nay</span>
          <span className="font-bold text-[#168154]">{attendanceRate}%</span>
        </div>
        <div className="w-full bg-[#E7E5E4] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#22A06B] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, attendanceRate))}%` }}
          />
        </div>
        {presentCount !== undefined && (
          <div className="mt-1 text-[11px] text-[#A8A29E] text-right">
            Có mặt: <span className="font-medium text-[#1C1917]">{presentCount}</span>/{studentCount}
          </div>
        )}
      </div>

      {/* Optional Quick Action Buttons (e.g. For Teacher view) */}
      {(onAttendanceClick || onScoreClick) && (
        <div className="mt-3 pt-3 border-t border-[#F5F5F4] flex items-center gap-2">
          {onAttendanceClick && (
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onAttendanceClick(id);
              }}
              className="flex-1 py-1.5 px-2 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#B4232C] text-[12px] font-semibold rounded-lg border border-[#FECDD3] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Điểm danh</span>
            </button>
          )}
          {onScoreClick && (
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onScoreClick(id);
              }}
              className="flex-1 py-1.5 px-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-[12px] font-semibold rounded-lg border border-[#BFDBFE] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Nhập điểm</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
