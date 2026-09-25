import React from "react";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { Skeleton } from "./Skeleton";

export type TrendType = "positive" | "negative" | "neutral";

export interface StatCardProps {
  /**
   * Tiêu đề chỉ số (VD: Tổng học sinh, Chuyên cần hôm nay)
   */
  title: string;
  /**
   * Giá trị định lượng (VD: 128, 94%, 8.5)
   */
  value: React.ReactNode;
  /**
   * Icon đại diện (VD: Users, Award, Calendar, CheckSquare)
   */
  icon?: React.ReactNode;
  /**
   * Chuỗi xu hướng biến động (VD: "+5 so với tháng trước", "-2%")
   */
  trend?: string;
  /**
   * Loại biến động: positive (xanh lá), negative (đỏ), neutral (xám)
   */
  trendType?: TrendType;
  /**
   * Trạng thái đang tải dữ liệu (ưu tiên Skeleton)
   */
  loading?: boolean;
  /**
   * Lỗi tải dữ liệu cho thẻ
   */
  error?: string | null;
  /**
   * Chú thích bổ sung ở đáy thẻ
   */
  subtitle?: React.ReactNode;
  /**
   * Callback khi người dùng nhấn vào thẻ (nếu thẻ tương tác)
   */
  onClick?: () => void;
  className?: string;
}

/**
 * StatCard Component (§16 - 03_Component_Library & Wireframe KPI Grid §4, §19)
 * Dùng trong KPIGroup: Mobile 1 cột → Tablet 2 cột → Desktop 4 cột.
 * Hỗ trợ các trạng thái: Default, Loading (Skeleton), Error.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
  loading = false,
  error = null,
  subtitle,
  onClick,
  className = "",
}) => {
  // Trạng thái Loading: Page-level Skeleton theo chuẩn §18
  if (loading) {
    return (
      <div
        className={`bg-white p-5 rounded-[14px] border border-[#E7E5E4] shadow-xs space-y-3 ${className}`}
        aria-busy="true"
      >
        <div className="flex items-center justify-between">
          <Skeleton width="45%" height={16} />
          <Skeleton width={36} height={36} variant="circular" />
        </div>
        <Skeleton width="60%" height={32} />
        <Skeleton width="75%" height={14} />
      </div>
    );
  }

  // Trạng thái Error
  if (error) {
    return (
      <div
        className={`bg-[#FEF2F2] p-5 rounded-[14px] border border-[#FEE2E2] shadow-xs flex flex-col justify-between ${className}`}
      >
        <div className="flex items-center gap-2 text-[#C73A3A] font-semibold text-[14px]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{title}</span>
        </div>
        <div className="text-[13px] text-[#A52D2D] mt-2">
          {error || "Không thể tải số liệu"}
        </div>
      </div>
    );
  }

  // Cấu hình hiển thị Trend
  const trendConfig = {
    positive: {
      textColor: "text-[#168154]",
      bgColor: "bg-[#ECFDF3]",
      Icon: TrendingUp,
    },
    negative: {
      textColor: "text-[#C73A3A]",
      bgColor: "bg-[#FEF2F2]",
      Icon: TrendingDown,
    },
    neutral: {
      textColor: "text-[#57534E]",
      bgColor: "bg-[#F5F5F4]",
      Icon: Minus,
    },
  }[trendType];

  const TrendIcon = trendConfig.Icon;

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`
        bg-white p-5 rounded-[14px] border border-[#E7E5E4] shadow-xs transition-colors duration-150
        flex flex-col justify-between
        ${onClick ? "hover:border-[#B4232C]/40 hover:shadow-sm cursor-pointer active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#B4232C]/30 outline-none" : ""}
        ${className}
      `}
    >
      <div>
        {/* Header thẻ: Tiêu đề & Icon */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[14px] font-medium text-[#78716C] tracking-tight line-clamp-1">
            {title}
          </span>
          {icon && (
            <div className="w-10 h-10 rounded-[10px] bg-[#FFF1F2] text-[#B4232C] flex items-center justify-center shrink-0 shadow-2xs">
              {icon}
            </div>
          )}
        </div>

        {/* Giá trị chính (Số liệu to, tương phản cao) */}
        <div className="text-[28px] sm:text-[32px] font-bold text-[#1C1917] tracking-tight font-serif leading-none py-1 tabular-nums">
          {value}
        </div>
      </div>

      {/* Footer: Trend hoặc Subtitle */}
      {(trend || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-[#F5F5F4] flex items-center justify-between text-[13px] flex-wrap gap-1.5">
          {trend && (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${trendConfig.textColor} ${trendConfig.bgColor}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trend}</span>
            </div>
          )}
          {subtitle && (
            <span className="text-[#78716C] text-[12px]">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
