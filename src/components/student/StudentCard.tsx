import React from "react";
import { ChevronRight, Award, CheckCircle2, XCircle, Clock, Check } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Student, AttendanceStatus } from "../../types";

export interface StudentCardProps {
  /**
   * Thông tin học sinh
   */
  student: Student;
  /**
   * Có hiển thị tóm tắt điểm số hay không
   */
  showScore?: boolean;
  /**
   * Điểm trung bình hoặc điểm số hiện tại
   */
  score?: number | null;
  /**
   * Có hiển thị trạng thái điểm danh hay không
   */
  showAttendance?: boolean;
  /**
   * Trạng thái điểm danh (PRESENT, ABSENT, EXCUSED, LATE)
   */
  attendanceStatus?: AttendanceStatus;
  /**
   * Có hiển thị nút hành động hay không
   */
  showAction?: boolean;
  /**
   * Nhãn nút hành động
   */
  actionLabel?: string;
  /**
   * Callback khi nhấn nút hành động
   */
  onAction?: (student: Student) => void;
  /**
   * Callback khi nhấn vào toàn bộ thẻ
   */
  onClick?: () => void;
  /**
   * Trạng thái đang được chọn (Selected)
   */
  selected?: boolean;
  /**
   * Trạng thái vô hiệu hóa (Disabled)
   */
  disabled?: boolean;
  className?: string;
}

const getAttendanceBadge = (status?: AttendanceStatus) => {
  switch (status) {
    case "PRESENT":
      return (
        <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
          Có mặt
        </Badge>
      );
    case "ABSENT":
      return (
        <Badge variant="error" size="sm" icon={<XCircle className="w-3 h-3" />}>
          Vắng
        </Badge>
      );
    case "EXCUSED":
      return (
        <Badge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>
          Có phép
        </Badge>
      );
    case "LATE":
      return (
        <Badge variant="info" size="sm" icon={<Clock className="w-3 h-3" />}>
          Muộn
        </Badge>
      );
    default:
      return null;
  }
};

/**
 * StudentCard Component (§19 03_Component_Library)
 *
 * Cấu trúc phân cấp:
 * ├── Avatar
 * ├── StudentInfo (Họ tên, Tên Thánh, Mã số / STT)
 * ├── ClassBadge
 * ├── AttendanceStatus
 * ├── ScoreSummary
 * └── Action
 *
 * States: Default, Hover, Active, Selected, Disabled.
 */
export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  showScore = false,
  score,
  showAttendance = false,
  attendanceStatus,
  showAction = true,
  actionLabel = "Chi tiết",
  onAction,
  onClick,
  selected = false,
  disabled = false,
  className = "",
}) => {
  const { code, orderNumber, name, christianName, className: studentClassName, avatarUrl } = student;

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
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
      className={`group relative bg-white rounded-[14px] border p-3.5 sm:p-4 text-left transition-all duration-200 ${
        disabled
          ? "opacity-60 cursor-not-allowed border-[#E7E5E4] bg-[#FAFAF9]"
          : selected
          ? "border-[#B4232C] bg-[#FFF1F2]/20 ring-2 ring-[#B4232C]/20 shadow-xs cursor-pointer"
          : "border-[#E7E5E4] hover:border-[#B4232C] hover:shadow-xs cursor-pointer active:scale-[0.99]"
      } flex flex-col justify-between ${className}`}
    >
      {/* Top row: Avatar + Student Info + Selected checkmark */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar
            name={name}
            src={avatarUrl || undefined}
            size="md"
          />
          {selected && (
            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#B4232C] text-white rounded-full flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {christianName && (
              <span className="text-[12px] font-medium text-[#78716C]">
                {christianName}
              </span>
            )}
            <span className="text-[11px] font-mono text-[#A8A29E] bg-[#F5F5F4] px-1.5 py-0.2 rounded">
              #{orderNumber || code}
            </span>
          </div>

          <h4 className="text-[15px] sm:text-[16px] font-bold text-[#1C1917] group-hover:text-[#B4232C] transition-colors truncate">
            {name}
          </h4>

          {studentClassName && (
            <div className="mt-1">
              <Badge variant="neutral" size="sm">
                {studentClassName}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Middle indicators: Attendance & Score */}
      {(showAttendance || showScore) && (
        <div className="mt-3 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between gap-2 text-[12px]">
          {showAttendance && (
            <div className="flex items-center gap-1.5">
              <span className="text-[#78716C]">Điểm danh:</span>
              {getAttendanceBadge(attendanceStatus) || (
                <span className="text-[#A8A29E] italic">Chưa ghi</span>
              )}
            </div>
          )}

          {showScore && (
            <div className="flex items-center gap-1 ml-auto">
              <Award className="w-3.5 h-3.5 text-[#B86F08]" />
              <span className="text-[#78716C]">Điểm TB:</span>
              <span className="font-bold text-[#B4232C]">
                {score !== null && score !== undefined ? score.toFixed(1) : "—"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer Action */}
      {showAction && (
        <div className="mt-3 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between text-[12px]">
          <span className="text-[#78716C] font-mono text-[11px]">Mã: {code}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (onAction) onAction(student);
              else handleClick();
            }}
            className="font-semibold text-[#B4232C] hover:text-[#941D25] flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
