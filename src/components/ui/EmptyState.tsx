import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  /**
   * Icon trung tâm (mặc định là biểu tượng Inbox rỗng)
   */
  icon?: React.ReactNode;
  /**
   * Tiêu đề trạng thái rỗng
   */
  title: string;
  /**
   * Mô tả chi tiết hoặc hướng dẫn người dùng
   */
  description?: React.ReactNode;
  /**
   * Nút hành động kêu gọi (CTA Button khi phù hợp)
   */
  action?: React.ReactNode;
  /**
   * Kích cỡ khoảng cách và icon
   */
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * EmptyState Component (§18 - 03_Component_Library & Wireframe §13)
 * Chuẩn hiển thị: icon + title + description + action (khi phù hợp).
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: {
      padding: "py-6 px-4",
      iconBox: "w-12 h-12 text-[20px]",
      title: "text-[16px]",
      desc: "text-[13px] max-w-xs",
    },
    md: {
      padding: "py-10 px-6",
      iconBox: "w-16 h-16 text-[28px]",
      title: "text-[18px] sm:text-[20px]",
      desc: "text-[14px] sm:text-[15px] max-w-sm",
    },
    lg: {
      padding: "py-16 px-6",
      iconBox: "w-20 h-20 text-[36px]",
      title: "text-[22px] sm:text-[24px]",
      desc: "text-[15px] sm:text-[16px] max-w-md",
    },
  }[size];

  const defaultIcon = <Inbox className="w-8 h-8 text-[#78716C]" />;

  return (
    <div
      role="status"
      className={`
        flex flex-col items-center justify-center text-center bg-white rounded-[14px] border border-[#E7E5E4]
        ${sizeStyles.padding}
        ${className}
      `}
    >
      {/* Icon trung tâm với nền dịu */}
      <div
        className={`
          flex items-center justify-center rounded-2xl bg-[#F5F5F4] text-[#B4232C] mb-4 shadow-2xs
          ${sizeStyles.iconBox}
        `}
        aria-hidden="true"
      >
        {icon || defaultIcon}
      </div>

      {/* Tiêu đề Serif rõ ràng */}
      <h3 className={`font-bold font-serif text-[#1C1917] tracking-tight ${sizeStyles.title}`}>
        {title}
      </h3>

      {/* Mô tả phụ */}
      {description && (
        <p className={`text-[#57534E] mt-1.5 leading-relaxed ${sizeStyles.desc}`}>
          {description}
        </p>
      )}

      {/* Nút hành động bổ trợ */}
      {action && <div className="mt-5 flex items-center justify-center">{action}</div>}
    </div>
  );
};
