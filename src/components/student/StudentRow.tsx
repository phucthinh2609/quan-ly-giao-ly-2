import React from "react";
import { Checkbox } from "../ui/Checkbox";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Student, AttendanceStatus } from "../../types";
import { CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react";

export interface StudentRowProps {
  student: Student;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onClick?: () => void;
  disabled?: boolean;
  showCheckbox?: boolean;
  score?: number | null;
  attendanceStatus?: AttendanceStatus;
  showClassBadge?: boolean;
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
 * StudentRow Component (§19 03_Component_Library)
 *
 * Dùng trong danh sách học sinh, bảng điểm danh, bảng quản trị lớp.
 * Hỗ trợ chọn đơn (Individual Select), xem điểm và trạng thái chuyên cần.
 */
export const StudentRow: React.FC<StudentRowProps> = ({
  student,
  selected = false,
  onSelect,
  onClick,
  disabled = false,
  showCheckbox = true,
  score,
  attendanceStatus,
  showClassBadge = true,
  className = "",
}) => {
  const { id, code, orderNumber, name, christianName, className: studentClassName, avatarUrl } = student;

  const handleRowClick = () => {
    if (disabled) return;
    if (onSelect) {
      onSelect(id, !selected);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleRowClick}
      role="row"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleRowClick();
        }
      }}
      className={`group flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 rounded-xl border transition-all text-left ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-[#FAFAF9] border-[#E7E5E4]"
          : selected
          ? "bg-[#FFF1F2]/30 border-[#B4232C]/40 shadow-xs cursor-pointer"
          : "bg-white hover:bg-[#FAFAF9] border-[#E7E5E4] cursor-pointer"
      } ${className}`}
    >
      {/* Left: Checkbox + STT + Avatar + Name */}
      <div className="flex items-center gap-3 min-w-0">
        {showCheckbox && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 flex items-center"
          >
            <Checkbox
              checked={selected}
              disabled={disabled}
              onChange={(checked) => onSelect && onSelect(id, checked)}
              name={`select-student-${id}`}
            />
          </div>
        )}

        <div className="w-7 text-center font-mono text-[12px] font-semibold text-[#78716C] flex-shrink-0">
          {orderNumber ? String(orderNumber).padStart(2, "0") : code}
        </div>

        <Avatar
          name={name}
          src={avatarUrl || undefined}
          size="sm"
          className="flex-shrink-0"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {christianName && (
              <span className="text-[12px] text-[#78716C] font-medium">
                {christianName}
              </span>
            )}
            <span className="text-[14px] sm:text-[14.5px] font-semibold text-[#1C1917] group-hover:text-[#B4232C] transition-colors truncate">
              {name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#A8A29E]">
            <span className="font-mono">Mã: {code}</span>
            {showClassBadge && studentClassName && (
              <span className="text-[#57534E] font-medium">
                · {studentClassName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Attendance / Score info + optional action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {attendanceStatus && getAttendanceBadge(attendanceStatus)}

        {score !== undefined && score !== null && (
          <div className="text-right">
            <span className="text-[14px] font-bold text-[#B4232C]">{score.toFixed(1)}</span>
            <span className="text-[11px] text-[#78716C] ml-1">đ</span>
          </div>
        )}

        {onClick && (
          <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#B4232C] group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
    </div>
  );
};
