import React from "react";
import { Student, AttendanceStatus } from "../../types";
import { cn } from "../../lib/cn";
import { haptic } from "../../lib/motion";
import { Avatar } from "../ui/Avatar";
import { SegmentedControl, SegmentedOption } from "../ui/SegmentedControl";
import { AttendanceQuickToggle } from "./AttendanceQuickToggle";
import { ATTENDANCE_CYCLE, ATTENDANCE_STATUS_META } from "./attendanceStatus";

export interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus;
  disabled?: boolean;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  // Optional extension props for rich feedback without breaking interface
  isDirty?: boolean;
  isSaved?: boolean;
  hasError?: boolean;
  className?: string;
}

const SEGMENT_OPTIONS: SegmentedOption<AttendanceStatus>[] = ATTENDANCE_CYCLE.map((status) => {
  const meta = ATTENDANCE_STATUS_META[status];
  const Icon = meta.Icon;
  return { value: status, label: meta.label, tone: meta.tone, icon: <Icon /> };
});

/** Họ tên đầy đủ kèm tên Thánh: "Giuse Nguyễn Văn An" */
export function studentFullName(student: Student): string {
  return student.christianName ? `${student.christianName} ${student.name}` : student.name;
}

/**
 * AttendanceRow (03 §7)
 * - Trái: Avatar · Tên Thánh + họ tên · mã học sinh
 * - Phải (< md): AttendanceStatusChip xoay vòng + nút "..." chọn trực tiếp
 * - Phải (≥ md): SegmentedControl 4 trạng thái, chọn trực tiếp 1 chạm
 * Hàng tự xuống dòng khi chữ lớn / màn hẹp để không tràn ngang.
 */
export const AttendanceRow: React.FC<AttendanceRowProps> = ({
  student,
  status,
  disabled = false,
  onStatusChange,
  isDirty = false,
  isSaved = false,
  hasError = false,
  className,
}) => {
  const fullName = studentFullName(student);
  const rowLabel = `Điểm danh em ${fullName}`;

  const handleChange = (next: AttendanceStatus) => {
    onStatusChange(student.id, next);
  };

  const handleSegmentChange = (next: AttendanceStatus) => {
    haptic();
    handleChange(next);
  };

  return (
    <div
      role="listitem"
      data-testid={`attendance-row-${student.id}`}
      data-dirty={isDirty || undefined}
      className={cn(
        "relative flex min-h-15 flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:px-4",
        "transition-colors duration-200 first:rounded-t-card last:rounded-b-card",
        hasError ? "bg-danger-soft/60" : "hover:bg-surface-2/60",
        disabled && "opacity-70",
        className
      )}
    >
      {/* Dấu hiệu "chưa lưu": vạch vàng mép trái + chữ cho screen reader */}
      {isDirty && (
        <span aria-hidden="true" className="absolute inset-y-2.5 left-0 w-1 rounded-full bg-gold" />
      )}

      <div className="flex min-w-0 grow basis-36 items-center gap-3">
        <Avatar src={student.avatarUrl} name={student.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-base leading-snug font-semibold break-words text-ink">
            {student.christianName && <span className="font-medium text-ink-2">{student.christianName} </span>}
            {student.name}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-3">
            <span className="font-mono">{student.code}</span>
            {isDirty && <span className="sr-only">Chưa lưu</span>}
            {isSaved && !isDirty && <span className="sr-only">Đã lưu</span>}
            {hasError && <span className="font-medium text-danger">Chưa gửi được</span>}
          </p>
        </div>
      </div>

      {/* Mobile: chip xoay vòng + menu chọn trực tiếp */}
      <div className="ml-auto flex shrink-0 items-center md:hidden">
        <AttendanceQuickToggle status={status} onChange={handleChange} disabled={disabled} ariaLabel={rowLabel} />
      </div>

      {/* Tablet / desktop: phân đoạn 4 trạng thái */}
      <div className="ml-auto hidden shrink-0 md:block">
        <SegmentedControl<AttendanceStatus>
          value={status}
          options={SEGMENT_OPTIONS}
          onChange={handleSegmentChange}
          ariaLabel={rowLabel}
          disabled={disabled}
          size="md"
        />
      </div>
    </div>
  );
};
