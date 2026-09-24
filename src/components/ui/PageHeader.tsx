import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./IconButton";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  /**
   * Tiêu đề chính của trang
   */
  title: string;
  /**
   * Mô tả phụ bên dưới tiêu đề
   */
  description?: React.ReactNode;
  /**
   * Có hiển thị nút Quay lại (Back button) hay không
   */
  showBackButton?: boolean;
  /**
   * Callback khi nhấn nút Quay lại
   */
  onBack?: () => void;
  /**
   * Accessible label cho nút quay lại (mặc định: "Quay lại trang trước")
   */
  backAriaLabel?: string;
  /**
   * Đường dẫn breadcrumb danh mục
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Huy hiệu bổ trợ cạnh tiêu đề (VD: Badge "Lớp 7A", "Học kỳ I")
   */
  badge?: React.ReactNode;
  /**
   * Khối các nút hành động bên phải (VD: Thêm học sinh, Lưu điểm, Xuất Excel)
   */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader Component (§14 - 03_Component_Library)
 * Bắt buộc tuân thủ đúng thứ tự phân cấp giao diện:
 * Back → Breadcrumb → Title → Description → Actions
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showBackButton = false,
  onBack,
  backAriaLabel = "Quay lại trang trước",
  breadcrumbs,
  badge,
  actions,
  className = "",
}) => {
  return (
    <header className={`w-full space-y-3 pb-4 border-b border-[#E7E5E4] ${className}`}>
      {/* Hàng 1: Back Button & Breadcrumbs */}
      {(showBackButton || (breadcrumbs && breadcrumbs.length > 0)) && (
        <div className="flex items-center gap-2 flex-wrap text-[13px] text-[#78716C]">
          {/* Nút Back (←) */}
          {showBackButton && (
            <IconButton
              aria-label={backAriaLabel}
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </IconButton>
          )}

          {/* Danh sách Breadcrumb */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E] shrink-0" aria-hidden="true" />
                    )}
                    {isLast ? (
                      <span className="font-semibold text-[#1C1917]" aria-current="page">
                        {crumb.label}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={crumb.onClick}
                        className="hover:text-[#B4232C] hover:underline cursor-pointer transition-colors"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>
      )}

      {/* Hàng 2: Title, Description & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Description Container */}
        <div className="space-y-1 min-w-0 flex-1">
          {/* Title + Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-[#1C1917] font-serif tracking-tight leading-tight">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {/* Description */}
          {description && (
            <p className="text-[14px] sm:text-[15px] text-[#57534E] max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Actions Container */}
        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
