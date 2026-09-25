import React from "react";
import { ChevronRight, Award, CheckCircle2, XCircle, Clock, Check, FileCheck2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Student, AttendanceStatus } from "../../types";

export interface StudentCardProps {
  /** Thông tin học sinh */
  student: Student;
  /** Có hiển thị tóm tắt điểm số hay không */
  showScore?: boolean;
  /** Điểm trung bình hoặc điểm số hiện tại */
  score?: number | null;
  /** Có hiển thị trạng thái điểm danh hay không */
  showAttendance?: boolean;
  /** Trạng thái điểm danh (PRESENT, ABSENT, EXCUSED, LATE) */
  attendanceStatus?: AttendanceStatus;
  /** Có hiển thị nút hành động hay không */
  showAction?: boolean;
  /** Nhãn nút hành động */
  actionLabel?: string;
  /** Callback khi nhấn nút hành động */
  onAction?: (student: Student) => void;
  /** Callback khi nhấn vào toàn bộ thẻ */
  onClick?: () => void;
  /** Trạng thái đang được chọn (Selected) */
  selected?: boolean;
  /** Trạng thái vô hiệu hóa (Disabled) */
  disabled?: boolean;
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
 * StudentCard (03 §10) — thẻ học sinh dùng trong trang quản lý (không hiển thị ở Góc của em).
 * Avatar · tên Thánh + họ tên · lớp · điểm danh · điểm TB · hành động.
 * States: Default, Hover, Focus, Active, Selected, Disabled.
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
  className,
}) => {
  const { code, orderNumber, name, christianName, className: studentClassName, avatarUrl } = student;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected || undefined}
      aria-disabled={disabled || undefined}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between rounded-card border bg-surface p-4 text-left sm:p-5",
        "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out-soft",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
        disabled
          ? "cursor-not-allowed border-line bg-surface-2 opacity-60"
          : selected
            ? "cursor-pointer border-primary bg-primary-soft/40 shadow-card ring-2 ring-primary/20"
            : "cursor-pointer border-line shadow-xs hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card active:scale-[0.99]",
        className
      )}
    >
      {/* Avatar + thông tin */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar name={name} src={avatarUrl || undefined} size="md" />
          {selected && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-on-primary shadow-xs ring-2 ring-surface"
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {christianName && <span className="text-sm font-medium text-ink-2">{christianName}</span>}
            <span className="rounded-xs bg-surface-2 px-1.5 font-mono text-xs text-ink-3">
              #{orderNumber || code}
            </span>
          </div>

          <h4 className="truncate text-base font-semibold text-ink transition-colors group-hover:text-primary-ink sm:text-lg">
            {name}
          </h4>

          {studentClassName && (
            <div className="mt-1.5">
              <Badge variant="neutral" size="sm">
                {studentClassName}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Điểm danh & điểm */}
      {(showAttendance || showScore) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
          {showAttendance && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-2">Điểm danh:</span>
              {getAttendanceBadge(attendanceStatus) || <span className="text-ink-3">Chưa ghi</span>}
            </div>
          )}

          {showScore && (
            <div className="ml-auto flex items-center gap-1.5">
              <Award className="size-4 text-gold-ink" aria-hidden="true" />
              <span className="text-ink-2">Điểm TB:</span>
              <span className="font-mono text-base font-semibold text-ink">
                {score !== null && score !== undefined ? score.toFixed(1) : "—"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hành động */}
      {showAction && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-2">
          <span className="font-mono text-xs text-ink-3">Mã: {code}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (onAction) onAction(student);
              else handleClick();
            }}
            className="-mr-2 inline-flex min-h-11 items-center gap-0.5 rounded-full px-2 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-soft focus-visible:outline-3 focus-visible:outline-offset-1 disabled:cursor-not-allowed"
          >
            <span>{actionLabel}</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
