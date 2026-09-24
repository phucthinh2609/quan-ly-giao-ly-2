import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  /**
   * Tiêu đề thông báo lỗi (Mặc định: "Không thể tải dữ liệu")
   */
  title?: string;
  /**
   * Nội dung chi tiết hoặc hướng dẫn khắc phục
   */
  message?: React.ReactNode;
  /**
   * Callback khi nhấn nút Thử lại (onRetry)
   */
  onRetry?: () => void;
  /**
   * Nhãn của nút Thử lại (Mặc định: "Thử lại")
   */
  retryLabel?: string;
  /**
   * Trạng thái đang thực hiện lại (loading)
   */
  retrying?: boolean;
  /**
   * Tùy biến biểu tượng lỗi
   */
  icon?: React.ReactNode;
  /**
   * Kích thước khung hiển thị
   */
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * ErrorState Component (§18 - 03_Component_Library & Wireframe §15)
 * Luôn có nút Retry (onRetry) để hỗ trợ khôi phục trạng thái mạng/dữ liệu bị gián đoạn.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Không thể tải dữ liệu",
  message = "Đã xảy ra sự cố khi kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền và thử lại.",
  onRetry,
  retryLabel = "Thử lại",
  retrying = false,
  icon,
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

  const defaultIcon = <AlertTriangle className="w-8 h-8 text-[#C73A3A]" />;

  return (
    <div
      role="alert"
      className={`
        flex flex-col items-center justify-center text-center bg-[#FEF2F2]/60 rounded-[14px] border border-[#FEE2E2]
        ${sizeStyles.padding}
        ${className}
      `}
    >
      {/* Icon cảnh báo lỗi */}
      <div
        className={`
          flex items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#C73A3A] mb-4 shadow-2xs
          ${sizeStyles.iconBox}
        `}
        aria-hidden="true"
      >
        {icon || defaultIcon}
      </div>

      {/* Tiêu đề lỗi */}
      <h3 className={`font-bold font-serif text-[#1C1917] tracking-tight ${sizeStyles.title}`}>
        {title}
      </h3>

      {/* Mô tả giải thích */}
      {message && (
        <p className={`text-[#57534E] mt-1.5 leading-relaxed ${sizeStyles.desc}`}>
          {message}
        </p>
      )}

      {/* Nút Retry (onRetry) bắt buộc */}
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="primary"
            size="md"
            loading={retrying}
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
