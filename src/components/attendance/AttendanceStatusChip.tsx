import React, { useEffect, useRef } from "react";
import { AttendanceStatus } from "../../types";
import { cn } from "../../lib/cn";
import { gsap, haptic, prefersReducedMotion } from "../../lib/motion";
import { TONE_BORDER, TONE_SOFT, TONE_SOLID } from "../ui/tone";
import { ATTENDANCE_STATUS_META, getNextAttendanceStatus } from "./attendanceStatus";

export interface AttendanceStatusChipProps {
  status: AttendanceStatus;
  /** Chạm → nhận trạng thái kế tiếp trong chu trình. Không truyền → chip tĩnh (chỉ hiển thị). */
  onCycle?: (nextStatus: AttendanceStatus) => void;
  disabled?: boolean;
  /**
   * soft: nền nhạt · solid: nền đặc · auto (mặc định): Có mặt nền nhạt,
   * các trạng thái còn lại nền đặc để GLV nhìn lướt thấy ngay em vắng/muộn.
   */
  variant?: "soft" | "solid" | "auto";
  size?: "sm" | "md";
  /** Dùng nhãn ngắn (Có / Vắng / Phép / Muộn) */
  compact?: boolean;
  /** Tiền tố cho aria-label, VD "Điểm danh em Giuse Nguyễn Văn An" */
  ariaLabelPrefix?: string;
  className?: string;
}

const sizeClasses = {
  sm: "min-h-9 gap-1.5 px-3 text-sm [&_svg]:size-4",
  md: "min-h-11 gap-1.5 px-3.5 text-sm [&_svg]:size-[1.125rem]",
};

/**
 * AttendanceStatusChip (03 §7): chip pill tone theo trạng thái + icon + nhãn.
 * Chạm để xoay vòng Có mặt → Vắng → Có phép → Đi muộn, rung nhẹ, spring scale khi đổi.
 */
export const AttendanceStatusChip: React.FC<AttendanceStatusChipProps> = ({
  status,
  onCycle,
  disabled = false,
  variant = "auto",
  size = "md",
  compact = false,
  ariaLabelPrefix,
  className,
}) => {
  const meta = ATTENDANCE_STATUS_META[status] ?? ATTENDANCE_STATUS_META.PRESENT;
  const Icon = meta.Icon;
  const ref = useRef<HTMLElement | null>(null);
  const isFirstRender = useRef(true);

  // Spring nhẹ mỗi khi trạng thái đổi (bỏ qua lần render đầu)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { scale: 0.86 },
      { scale: 1, duration: 0.5, ease: "back.out(3)", clearProps: "transform" }
    );
    return () => {
      tween.kill();
    };
  }, [status]);

  const solid = variant === "solid" || (variant === "auto" && status !== "PRESENT");
  const toneClasses = solid
    ? cn(TONE_SOLID[meta.tone], "border-transparent")
    : cn(TONE_SOFT[meta.tone], TONE_BORDER[meta.tone]);

  const baseClasses = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full border font-semibold whitespace-nowrap select-none",
    sizeClasses[size],
    toneClasses,
    className
  );

  const content = (
    <>
      <Icon aria-hidden="true" className="shrink-0" />
      <span>{compact ? meta.shortLabel : meta.label}</span>
    </>
  );

  if (!onCycle) {
    return (
      <span
        ref={(el) => {
          ref.current = el;
        }}
        className={baseClasses}
      >
        {content}
      </span>
    );
  }

  const next = ATTENDANCE_STATUS_META[getNextAttendanceStatus(status)];
  const ariaLabel = `${ariaLabelPrefix ? `${ariaLabelPrefix}: ` : ""}${meta.label}. Chạm để chuyển sang ${next.label}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (disabled) return;
    haptic();
    onCycle(getNextAttendanceStatus(status));
  };

  return (
    <button
      ref={(el) => {
        ref.current = el;
      }}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={`Chạm để chuyển sang ${next.label}`}
      className={cn(
        baseClasses,
        "transition-[background-color,color,border-color,box-shadow] duration-150 ease-out-soft",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
        disabled ? "cursor-not-allowed opacity-50" : "hover:shadow-xs"
      )}
    >
      {content}
    </button>
  );
};
