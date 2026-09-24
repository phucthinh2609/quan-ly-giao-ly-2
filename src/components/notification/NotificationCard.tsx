import React from "react";
import {
  AlertTriangle,
  GraduationCap,
  School,
  Megaphone,
  Info,
  ChevronRight,
  Clock,
} from "lucide-react";
import { NotificationData, NotificationType } from "../../types";

export interface NotificationCardProps {
  notification: NotificationData;
  onClick?: (notification: NotificationData) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

// Config for visual tags per notification type
const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  URGENT: {
    label: "KHẨN CẤP",
    bg: "bg-[#FFF1F2]",
    text: "text-[#B4232C]",
    border: "border-[#FECDD3]",
    icon: <AlertTriangle className="w-5 h-5 text-[#B4232C]" />,
  },
  STUDENT: {
    label: "HỌC SINH",
    bg: "bg-[#FFFBEB]",
    text: "text-[#B45309]",
    border: "border-[#FDE68A]",
    icon: <GraduationCap className="w-5 h-5 text-[#B45309]" />,
  },
  CLASS: {
    label: "LỚP HỌC",
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    border: "border-[#BFDBFE]",
    icon: <School className="w-5 h-5 text-[#1D4ED8]" />,
  },
  GENERAL: {
    label: "THÔNG BÁO CHUNG",
    bg: "bg-[#F5F5F4]",
    text: "text-[#57534E]",
    border: "border-[#E7E5E4]",
    icon: <Megaphone className="w-5 h-5 text-[#57534E]" />,
  },
  SYSTEM: {
    label: "HỆ THỐNG",
    bg: "bg-[#F5F3FF]",
    text: "text-[#6D28D9]",
    border: "border-[#DDD6FE]",
    icon: <Info className="w-5 h-5 text-[#6D28D9]" />,
  },
};

/**
 * NotificationCard (§24, §30, Wireframe §11)
 *
 * Structure:
 * <NotificationCard>
 * ├── TypeIcon & Badge
 * ├── Title (body-lg / >= 18px font for Parent)
 * ├── Preview
 * ├── Timestamp & Student/Class meta
 * ├── UnreadIndicator
 * └── Chevron (RULE-010: touch target >= 52-56px)
 */
export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  disabled = false,
  compact = false,
  className = "",
}) => {
  const { type, title, preview, timestamp, isRead, studentName, className: clsName } =
    notification;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.GENERAL;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(notification);
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Thông báo: ${title}. ${isRead ? "Đã đọc" : "Chưa đọc"}`}
      className={`relative w-full text-left rounded-[14px] transition-all cursor-pointer border select-none ${
        compact ? "p-4 min-h-[56px]" : "p-4 sm:p-5 min-h-[64px]"
      } ${
        !isRead
          ? "bg-white border-[#B4232C]/30 shadow-xs hover:border-[#B4232C]/60 hover:shadow-sm"
          : "bg-[#FAFAF9] border-[#E7E5E4] hover:bg-white hover:border-[#D6D3D1]"
      } ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "active:scale-[0.99]"} ${className}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Type Icon Box */}
        <div
          className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center border ${config.bg} ${config.border}`}
        >
          {config.icon}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Header row: Badge + Meta + Unread dot */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold tracking-wide border uppercase ${config.bg} ${config.text} ${config.border}`}
            >
              {config.label}
            </span>

            {studentName && (
              <span className="text-[13px] font-medium text-[#78716C] bg-[#F5F5F4] px-2 py-0.5 rounded-md">
                {studentName}
              </span>
            )}

            {clsName && !studentName && (
              <span className="text-[13px] font-medium text-[#78716C] bg-[#F5F5F4] px-2 py-0.5 rounded-md">
                {clsName}
              </span>
            )}

            {!isRead && (
              <span className="inline-flex items-center gap-1 ml-auto text-[12px] font-semibold text-[#B4232C] bg-[#FFF1F2] px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#B4232C] animate-pulse" />
                <span>Mới</span>
              </span>
            )}
          </div>

          {/* Title: Parent Typography >= 18px (RULE-010) */}
          <h4
            className={`font-serif tracking-tight leading-snug break-words ${
              compact ? "text-[16px] sm:text-[18px]" : "text-[18px] sm:text-[19px]"
            } ${!isRead ? "font-bold text-[#1C1917]" : "font-semibold text-[#44403C]"}`}
          >
            {title}
          </h4>

          {/* Preview: body-sm/body-md */}
          <p
            className={`text-[#57534E] mt-1 line-clamp-2 leading-relaxed ${
              compact ? "text-[14px]" : "text-[15px] sm:text-[16px]"
            }`}
          >
            {preview}
          </p>

          {/* Footer: Timestamp & Action helper */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F5F5F4] text-[13px] text-[#78716C]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#A8A29E]" />
              <span>{timestamp}</span>
            </div>
            <span className="text-[#B4232C] font-semibold flex items-center gap-1">
              <span>Xem chi tiết</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
