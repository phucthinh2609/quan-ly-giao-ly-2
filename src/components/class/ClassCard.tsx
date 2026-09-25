import React from "react";
import { CalendarCheck, ChevronRight, MapPin, PenLine, Users } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ProgressRing } from "../ui/ProgressRing";
import { Tone } from "../ui/tone";
import { cn } from "../../lib/cn";
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

/** "GLV. Maria Nguyễn Thị Hoa" → "Maria Nguyễn Thị Hoa" */
const cleanTeacherName = (name: string) => name.replace(/^GLV\.?\s*/i, "").trim();

export const attendanceTone = (rate: number): Tone => (rate >= 90 ? "success" : rate >= 80 ? "warning" : "danger");

/**
 * ClassCard (03 §11) — tên lớp, khối (badge), sĩ số, GLV (avatar chồng), vòng chuyên cần; hover nâng nhẹ.
 */
export const ClassCard: React.FC<ClassCardProps> = ({
  classInfo,
  disabled = false,
  onClick,
  onViewDetails,
  onAttendanceClick,
  onScoreClick,
  className,
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
    lastUpdated,
  } = classInfo;

  const clickable = !disabled && Boolean(onClick || onViewDetails);
  const rate = Math.max(0, Math.min(100, Math.round(attendanceRate)));
  const tone = attendanceTone(rate);
  const names = teachers.map(cleanTeacherName).filter(Boolean);
  const hasActions = Boolean(onAttendanceClick || onScoreClick);

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick(id);
    else if (onViewDetails) onViewDetails(id);
  };

  // Không để phím Enter/Space trên nút con kích hoạt luôn cả thẻ
  const stopKeys = (event: React.KeyboardEvent) => event.stopPropagation();

  return (
    <Card
      as="article"
      interactive={clickable}
      onClick={clickable ? handleClick : undefined}
      aria-disabled={disabled || undefined}
      className={cn("group flex h-full flex-col gap-4", disabled && "opacity-60", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Badge variant="neutral" size="sm">
            {grade}
          </Badge>
          <h3 className="mt-2 truncate text-lg font-semibold tracking-tight text-ink">{name}</h3>
          {room && (
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-3">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{room}</span>
            </p>
          )}
          {presentCount !== undefined && (
            <p className="mt-1 text-xs text-ink-3">
              Có mặt{" "}
              <span className="font-mono font-semibold text-ink-2">
                {presentCount}/{studentCount}
              </span>
              {lastUpdated && <> · {lastUpdated}</>}
            </p>
          )}
        </div>
        <ProgressRing value={rate} size="sm" tone={tone} label={`Chuyên cần ${rate}%`}>
          <span className="text-xs font-semibold tabular-nums text-ink">{rate}%</span>
        </ProgressRing>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex min-w-0 items-center gap-2">
          {names.length > 0 ? (
            <>
              <div className="flex shrink-0 -space-x-2" aria-hidden="true">
                {names.slice(0, 3).map((teacher) => (
                  <span key={teacher} className="rounded-full ring-2 ring-surface">
                    <Avatar name={teacher} size="xs" />
                  </span>
                ))}
                {names.length > 3 && (
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-ink-2 ring-2 ring-surface">
                    +{names.length - 3}
                  </span>
                )}
              </div>
              <span className="truncate text-sm text-ink-2" title={names.join(", ")}>
                <span className="sr-only">Giáo lý viên: {names.join(", ")}</span>
                <span aria-hidden="true">{names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`}</span>
              </span>
            </>
          ) : (
            <span className="text-sm text-ink-3">Chưa phân công GLV</span>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-sm text-ink-2">
          <Users className="size-4" aria-hidden="true" />
          <span className="font-mono font-semibold text-ink">{studentCount}</span>
          <span>em</span>
          {clickable && (
            <ChevronRight
              className="size-4 text-ink-3 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </span>
      </div>

      {hasActions && (
        <div className="flex flex-wrap gap-2">
          {onAttendanceClick && (
            <Button
              variant="soft"
              disabled={disabled}
              leftIcon={<CalendarCheck />}
              className="min-w-0 flex-1 basis-36"
              onKeyDown={stopKeys}
              onClick={(e) => {
                e.stopPropagation();
                onAttendanceClick(id);
              }}
            >
              Điểm danh
            </Button>
          )}
          {onScoreClick && (
            <Button
              variant="outline"
              disabled={disabled}
              leftIcon={<PenLine />}
              className="min-w-0 flex-1 basis-36"
              onKeyDown={stopKeys}
              onClick={(e) => {
                e.stopPropagation();
                onScoreClick(id);
              }}
            >
              Nhập điểm
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
