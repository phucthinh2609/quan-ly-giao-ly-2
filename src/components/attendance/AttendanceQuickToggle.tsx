import React, { useState, useRef, useEffect } from "react";
import { Check, X, Clock, FileCheck, ChevronDown, CheckCircle2 } from "lucide-react";
import { AttendanceStatus } from "../../types";

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

export const ATTENDANCE_STATUS_CONFIG: Record<AttendanceStatus, StatusMeta> = {
  PRESENT: {
    status: "PRESENT",
    label: "Có mặt",
    shortLabel: "Có",
    icon: <Check className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />,
    bg: "bg-[#ECFDF3] hover:bg-[#D1FAE5] active:bg-[#A7F3D0]",
    text: "text-[#146C47]",
    border: "border-[#A7F3D0]",
    activeRing: "focus:ring-[#168154]",
    badgeBg: "bg-[#168154]",
  },
  ABSENT: {
    status: "ABSENT",
    label: "Vắng",
    shortLabel: "Vắng",
    icon: <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />,
    bg: "bg-[#FEF2F2] hover:bg-[#FEE2E2] active:bg-[#FECDD3]",
    text: "text-[#C73A3A]",
    border: "border-[#FECDD3]",
    activeRing: "focus:ring-[#DC4C4C]",
    badgeBg: "bg-[#C73A3A]",
  },
  EXCUSED: {
    status: "EXCUSED",
    label: "Có phép",
    shortLabel: "Phép",
    icon: <FileCheck className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />,
    bg: "bg-[#FFF8E7] hover:bg-[#FEF0C7] active:bg-[#FDE68A]",
    text: "text-[#B86F08]",
    border: "border-[#FEF0C7]",
    activeRing: "focus:ring-[#D9901A]",
    badgeBg: "bg-[#B86F08]",
  },
  LATE: {
    status: "LATE",
    label: "Đi muộn",
    shortLabel: "Muộn",
    icon: <Clock className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />,
    bg: "bg-[#FFF7ED] hover:bg-[#FFEDD5] active:bg-[#FED7AA]",
    text: "text-[#C2410C]",
    border: "border-[#FED7AA]",
    activeRing: "focus:ring-[#EA580C]",
    badgeBg: "bg-[#EA580C]",
  },
};

// Chu trình 1 chạm chuẩn theo yêu cầu: Có mặt → Vắng → Có phép → Đi muộn → Có mặt (§21, §8)
export const ATTENDANCE_CYCLE: AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "EXCUSED",
  "LATE",
];

export function getNextAttendanceStatus(current: AttendanceStatus): AttendanceStatus {
  const currentIndex = ATTENDANCE_CYCLE.indexOf(current);
  if (currentIndex === -1) return "PRESENT";
  const nextIndex = (currentIndex + 1) % ATTENDANCE_CYCLE.length;
  return ATTENDANCE_CYCLE[nextIndex];
}

/**
 * AttendanceQuickToggle (§21, §8)
 * - One-touch cycle: Chạm nút chính để xoay vòng trạng thái Có mặt → Vắng → Có phép → Đi muộn
 * - Menu đầy đủ: Cho phép mở menu danh sách chọn trực tiếp bất kỳ trạng thái nào
 * - Touch target chuẩn ≥ 48px, tối ưu cho người lớn tuổi và Giáo lý viên thao tác nhanh
 */
export const AttendanceQuickToggle: React.FC<AttendanceQuickToggleProps> = ({
  status,
  onChange,
  disabled = false,
  compact = false,
  className = "",
  ariaLabel,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentConfig = ATTENDANCE_STATUS_CONFIG[status] || ATTENDANCE_STATUS_CONFIG.PRESENT;

  // Xử lý cycle 1 chạm khi nhấn vào nút chính
  const handleCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const next = getNextAttendanceStatus(status);
    onChange(next);
  };

  // Mở/đóng menu chọn trực tiếp
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setMenuOpen((prev) => !prev);
  };

  // Chọn trực tiếp từ menu
  const handleSelectDirect = (selected: AttendanceStatus) => {
    onChange(selected);
    setMenuOpen(false);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center select-none ${className}`}
    >
      {/* Group button kết hợp: Nút chính (One-touch cycle) + Nút mở menu trực tiếp */}
      <div
        className={`
          inline-flex items-stretch rounded-[12px] border transition-all duration-150 shadow-xs
          ${currentConfig.border}
          ${disabled ? "opacity-60 cursor-not-allowed bg-[#F5F5F4]" : "cursor-pointer"}
        `}
      >
        {/* Nút chính: 1-touch cycle Có mặt → Vắng → Có phép → Đi muộn */}
        <button
          type="button"
          onClick={handleCycle}
          disabled={disabled}
          aria-label={
            ariaLabel
              ? `${ariaLabel}: hiện tại ${currentConfig.label}. Nhấn để chuyển sang ${
                  ATTENDANCE_STATUS_CONFIG[getNextAttendanceStatus(status)].label
                }`
              : `Trạng thái: ${currentConfig.label}. Nhấn để chuyển trạng thái`
          }
          title={`Nhấn 1 chạm để chuyển: ${ATTENDANCE_STATUS_CONFIG[getNextAttendanceStatus(status)].label}`}
          className={`
            flex items-center gap-2 font-bold transition-colors
            min-h-[46px] sm:min-h-[48px] px-3.5 sm:px-4 rounded-l-[11px]
            ${currentConfig.bg}
            ${currentConfig.text}
            ${compact ? "text-[14px]" : "text-[15px] sm:text-[16px]"}
            focus:outline-none focus:ring-2 ${currentConfig.activeRing} focus:z-10
            touch-manipulation
          `}
        >
          {/* Icon trạng thái */}
          <span className="shrink-0">{currentConfig.icon}</span>

          {/* Nhãn trạng thái (cỡ chữ lớn, độ tương phản cao cho người lớn tuổi) */}
          <span className="tracking-tight font-semibold">
            {compact ? currentConfig.shortLabel : currentConfig.label}
          </span>
        </button>

        {/* Nút dropdown mở menu chọn trực tiếp (Direct Selection Menu) */}
        <button
          type="button"
          onClick={toggleMenu}
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="Mở menu chọn trực tiếp trạng thái điểm danh"
          title="Chọn trực tiếp từ danh mục đầy đủ"
          className={`
            flex items-center justify-center border-l transition-colors
            min-w-[40px] sm:min-w-[44px] min-h-[46px] sm:min-h-[48px] rounded-r-[11px]
            ${currentConfig.border}
            ${currentConfig.bg}
            ${currentConfig.text}
            hover:brightness-95 active:brightness-90
            focus:outline-none focus:ring-2 ${currentConfig.activeRing} focus:z-10
            touch-manipulation
          `}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu chọn trực tiếp 4 trạng thái (Dropdown Popover) */}
      {menuOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="
            absolute right-0 top-full mt-1.5 z-50 min-w-[200px] w-max
            bg-white rounded-[14px] shadow-xl border border-[#E7E5E4] p-1.5
            animate-in fade-in zoom-in-95 duration-150
          "
        >
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#78716C] uppercase tracking-wider border-b border-[#F5F5F4] mb-1">
            Chọn trạng thái điểm danh
          </div>

          <div className="space-y-1">
            {ATTENDANCE_CYCLE.map((st) => {
              const cfg = ATTENDANCE_STATUS_CONFIG[st];
              const isSelected = st === status;
              return (
                <button
                  key={st}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectDirect(st)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-[10px]
                    text-left text-[14px] sm:text-[15px] font-semibold transition-colors
                    min-h-[44px] cursor-pointer touch-manipulation
                    ${
                      isSelected
                        ? `${cfg.bg} ${cfg.text} ring-1 ${cfg.border}`
                        : "text-[#292524] hover:bg-[#F5F5F4]"
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-white
                        ${cfg.badgeBg}
                      `}
                    >
                      {React.cloneElement(cfg.icon as React.ReactElement, {
                        className: "w-3.5 h-3.5 text-white stroke-[3]",
                      })}
                    </span>
                    <span>{cfg.label}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#168154]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
