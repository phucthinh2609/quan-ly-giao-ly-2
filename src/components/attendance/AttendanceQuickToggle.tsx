import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, MoreHorizontal } from "lucide-react";
import { AttendanceStatus } from "../../types";
import { cn } from "../../lib/cn";
import { gsap, haptic, prefersReducedMotion } from "../../lib/motion";
import { IconButton } from "../ui/IconButton";
import { TONE_SOFT } from "../ui/tone";
import { AttendanceStatusChip } from "./AttendanceStatusChip";
import { ATTENDANCE_CYCLE, ATTENDANCE_STATUS_META } from "./attendanceStatus";

export { ATTENDANCE_CYCLE, getNextAttendanceStatus } from "./attendanceStatus";

export interface AttendanceQuickToggleProps {
  status: AttendanceStatus;
  onChange: (nextStatus: AttendanceStatus) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
  ariaLabel?: string;
}

export interface StatusMeta {
  status: AttendanceStatus;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  activeRing: string;
  badgeBg: string;
}

/**
 * Cấu hình hiển thị (giữ API v1). Giá trị class đã chuyển sang token v2.
 * Nguồn chuẩn mới: ATTENDANCE_STATUS_META trong ./attendanceStatus.
 */
export const ATTENDANCE_STATUS_CONFIG: Record<AttendanceStatus, StatusMeta> = {
  PRESENT: {
    status: "PRESENT",
    label: ATTENDANCE_STATUS_META.PRESENT.label,
    shortLabel: ATTENDANCE_STATUS_META.PRESENT.shortLabel,
    icon: React.createElement(ATTENDANCE_STATUS_META.PRESENT.Icon, { className: "size-5", "aria-hidden": true }),
    bg: "bg-success-soft hover:bg-success-soft/70",
    text: "text-success",
    border: "border-success/30",
    activeRing: "focus-visible:outline-success/50",
    badgeBg: "bg-success",
  },
  ABSENT: {
    status: "ABSENT",
    label: ATTENDANCE_STATUS_META.ABSENT.label,
    shortLabel: ATTENDANCE_STATUS_META.ABSENT.shortLabel,
    icon: React.createElement(ATTENDANCE_STATUS_META.ABSENT.Icon, { className: "size-5", "aria-hidden": true }),
    bg: "bg-danger-soft hover:bg-danger-soft/70",
    text: "text-danger",
    border: "border-danger/30",
    activeRing: "focus-visible:outline-danger/50",
    badgeBg: "bg-danger",
  },
  EXCUSED: {
    status: "EXCUSED",
    label: ATTENDANCE_STATUS_META.EXCUSED.label,
    shortLabel: ATTENDANCE_STATUS_META.EXCUSED.shortLabel,
    icon: React.createElement(ATTENDANCE_STATUS_META.EXCUSED.Icon, { className: "size-5", "aria-hidden": true }),
    bg: "bg-info-soft hover:bg-info-soft/70",
    text: "text-info",
    border: "border-info/30",
    activeRing: "focus-visible:outline-info/50",
    badgeBg: "bg-info",
  },
  LATE: {
    status: "LATE",
    label: ATTENDANCE_STATUS_META.LATE.label,
    shortLabel: ATTENDANCE_STATUS_META.LATE.shortLabel,
    icon: React.createElement(ATTENDANCE_STATUS_META.LATE.Icon, { className: "size-5", "aria-hidden": true }),
    bg: "bg-warning-soft hover:bg-warning-soft/70",
    text: "text-warning",
    border: "border-warning/30",
    activeRing: "focus-visible:outline-warning/50",
    badgeBg: "bg-warning",
  },
};

/**
 * AttendanceQuickToggle (03 §7): chip xoay vòng 1 chạm + nút "..." mở menu chọn trực tiếp.
 * Menu tự mở lên trên khi gần đáy màn hình (tránh SaveBar và bottom nav).
 */
export const AttendanceQuickToggle: React.FC<AttendanceQuickToggleProps> = ({
  status,
  onChange,
  disabled = false,
  compact = false,
  className,
  ariaLabel,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const closeMenu = (returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const openMenu = () => {
    if (disabled) return;
    const trigger = triggerRef.current;
    if (trigger && typeof window !== "undefined") {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const spaceBelow = window.innerHeight - trigger.getBoundingClientRect().bottom;
      // Menu cao ~16rem; chừa thêm ~10rem cho SaveBar + bottom nav nổi
      setPlacement(spaceBelow < rem * 26 ? "top" : "bottom");
    }
    setMenuOpen(true);
  };

  // Mở menu: focus mục đang chọn + hiệu ứng xuất hiện
  useLayoutEffect(() => {
    if (!menuOpen) return;
    const selectedIndex = Math.max(0, ATTENDANCE_CYCLE.indexOf(status));
    itemRefs.current[selectedIndex]?.focus();
    const el = menuRef.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, scale: 0.96, y: placement === "top" ? 6 : -6 },
      { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: "power2.out", clearProps: "transform,opacity" }
    );
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // Đóng khi chạm ra ngoài
  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    if (disabled) setMenuOpen(false);
  }, [disabled]);

  const handleSelect = (next: AttendanceStatus) => {
    if (next !== status) {
      haptic();
      onChange(next);
    }
    closeMenu(true);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const index = items.findIndex((item) => item === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === "Tab") {
      closeMenu();
    }
  };

  const prefix = ariaLabel ?? "Trạng thái điểm danh";

  return (
    <div ref={containerRef} className={cn("relative inline-flex items-center gap-1", className)}>
      <AttendanceStatusChip
        status={status}
        onCycle={onChange}
        disabled={disabled}
        compact={compact}
        ariaLabelPrefix={prefix}
      />

      <IconButton
        ref={triggerRef}
        aria-label={`Chọn trực tiếp trạng thái${ariaLabel ? ` · ${ariaLabel}` : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? menuId : undefined}
        variant="ghost"
        size="md"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          if (menuOpen) closeMenu();
          else openMenu();
        }}
        icon={<MoreHorizontal />}
        className={cn(menuOpen && "bg-surface-2 text-ink")}
      />

      {menuOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={`Chọn trạng thái · ${prefix}`}
          onKeyDown={handleMenuKeyDown}
          className={cn(
            "absolute right-0 z-50 w-60 max-w-[calc(100vw_-_2rem)] origin-top-right rounded-card border border-line bg-surface p-1.5 shadow-float",
            placement === "top" ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2"
          )}
        >
          <p className="px-3 pt-1.5 pb-2 text-sm font-medium text-ink-3">Chọn trạng thái</p>
          <div className="flex flex-col gap-0.5">
            {ATTENDANCE_CYCLE.map((option, index) => {
              const meta = ATTENDANCE_STATUS_META[option];
              const Icon = meta.Icon;
              const selected = option === status;
              return (
                <button
                  key={option}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  tabIndex={-1}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-control px-2.5 text-left text-base font-semibold",
                    "transition-colors duration-150 focus-visible:outline-3 focus-visible:-outline-offset-2",
                    selected ? "bg-surface-2 text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <span
                    className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full", TONE_SOFT[meta.tone])}
                    aria-hidden="true"
                  >
                    <Icon className="size-[1.125rem]" />
                  </span>
                  <span className="min-w-0 flex-1">{meta.label}</span>
                  {selected && <Check className="size-5 shrink-0 text-ink" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
