import React from "react";
import { CheckCircle2, XCircle, Clock, ChevronRight, FileCheck2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Checkbox } from "../ui/Checkbox";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Student, AttendanceStatus } from "../../types";

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

/** Badge trạng thái điểm danh — luôn icon + chữ (01 §3.5). */
const getAttendanceBadge = (status?: AttendanceStatus) => {
  switch (status) {
    case "PRESENT":
      return (
        <Badge variant="success" size="sm" icon={<CheckCircle2 />}>
          Có mặt
        </Badge>
      );
    case "ABSENT":
      return (
        <Badge variant="error" size="sm" icon={<XCircle />}>
          Vắng
        </Badge>
      );
    case "EXCUSED":
      return (
        <Badge variant="info" size="sm" icon={<FileCheck2 />}>
          Có phép
        </Badge>
      );
    case "LATE":
      return (
        <Badge variant="warning" size="sm" icon={<Clock />}>
          Đi muộn
        </Badge>
      );
    default:
      return null;
  }
};

/**
 * StudentRow (03 §10) — dòng học sinh trong danh sách, bộ chọn, bảng quản trị lớp.
 * Hỗ trợ chọn từng em, hiển thị điểm và trạng thái chuyên cần.
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
  className,
}) => {
  const { id, code, orderNumber, name, christianName, className: studentClassName, avatarUrl } = student;
  const interactive = Boolean(onSelect || onClick);

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
      role={interactive ? "button" : undefined}
      aria-pressed={onSelect ? selected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive && !disabled ? 0 : -1}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleRowClick();
        }
      }}
      className={cn(
        "group flex min-h-14 items-center justify-between gap-3 rounded-control border px-3 py-2.5 text-left sm:px-4",
        "transition-[background-color,border-color] duration-150 ease-out-soft",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
        disabled
          ? "cursor-not-allowed border-line bg-surface-2 opacity-50"
          : selected
            ? "cursor-pointer border-primary/40 bg-primary-soft/50"
            : cn("border-line bg-surface", interactive && "cursor-pointer hover:bg-surface-2"),
        className
      )}
    >
      {/* Trái: Checkbox + STT + Avatar + Tên */}
      <div className="flex min-w-0 items-center gap-3">
        {showCheckbox && (
          <div onClick={(e) => e.stopPropagation()} className="flex shrink-0 items-center">
            <Checkbox
              checked={selected}
              disabled={disabled}
              onChange={(checked) => onSelect && onSelect(id, checked)}
              name={`select-student-${id}`}
            />
          </div>
        )}

        <div className="w-7 shrink-0 text-center font-mono text-sm font-semibold text-ink-3">
          {orderNumber ? String(orderNumber).padStart(2, "0") : code}
        </div>

        <Avatar name={name} src={avatarUrl || undefined} size="sm" className="shrink-0" />

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            {christianName && <span className="shrink-0 text-sm font-medium text-ink-2">{christianName}</span>}
            <span className="truncate text-base font-semibold text-ink transition-colors group-hover:text-primary-ink">
              {name}
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-sm text-ink-3">
            <span className="font-mono text-xs">Mã: {code}</span>
            {showClassBadge && studentClassName && (
              <span className="truncate font-medium text-ink-2">· {studentClassName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Phải: Điểm danh / Điểm + mũi tên */}
      <div className="flex shrink-0 items-center gap-3">
        {attendanceStatus && getAttendanceBadge(attendanceStatus)}

        {score !== undefined && score !== null && (
          <div className="text-right">
            <span className="font-mono text-base font-semibold text-ink">{score.toFixed(1)}</span>
            <span className="ml-1 text-xs text-ink-3">đ</span>
          </div>
        )}

        {onClick && (
          <ChevronRight
            className="size-4 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-ink"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};
