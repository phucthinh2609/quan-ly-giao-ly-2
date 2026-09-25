import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "../../lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  /** Tiêu đề chính của trang */
  title: string;
  /** Mô tả phụ bên dưới tiêu đề */
  description?: React.ReactNode;
  /** Hiển thị nút Quay lại */
  showBackButton?: boolean;
  /** Gọi khi nhấn nút Quay lại */
  onBack?: () => void;
  /** Nhãn truy cập cho nút quay lại (mặc định: "Quay lại trang trước") */
  backAriaLabel?: string;
  /** Đường dẫn breadcrumb */
  breadcrumbs?: BreadcrumbItem[];
  /** Huy hiệu cạnh tiêu đề (VD Badge "Lớp 7A", "Học kỳ I") */
  badge?: React.ReactNode;
  /** Các nút hành động (bên phải từ sm; xuống dòng full-width trên mobile) */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader (03 §5): tiêu đề chính hiển thị của trang (header app ẩn tiêu đề cho đến khi cuộn).
 * Thứ tự: Breadcrumb → [Back] Title + Badge → Description → Actions.
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
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  return (
    <header className={cn("w-full space-y-3 pb-1", className)}>
      {hasBreadcrumbs && breadcrumbs && (
        <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const interactive = !isLast && (crumb.onClick || crumb.href);
              return (
                <li key={`${crumb.label}-${idx}`} className="flex items-center gap-1">
                  {idx > 0 && <ChevronRight className="size-3.5 shrink-0 text-ink-3/70" aria-hidden="true" />}
                  {isLast ? (
                    <span className="font-medium text-ink-2" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : interactive ? (
                    crumb.href && !crumb.onClick ? (
                      <a
                        href={crumb.href}
                        className="rounded-xs transition-colors hover:text-ink hover:underline underline-offset-4"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={crumb.onClick}
                        className="rounded-xs transition-colors hover:text-ink hover:underline underline-offset-4"
                      >
                        {crumb.label}
                      </button>
                    )
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {showBackButton && (
            <IconButton
              aria-label={backAriaLabel}
              variant="ghost"
              size="md"
              onClick={onBack}
              // Trong AppShell (có data-role) Header đã có nút Quay lại → ẩn để không lặp
              className="-mt-1.5 -ml-2.5 shrink-0 text-ink sm:-mt-1 [[data-role]_&]:hidden"
            >
              <ArrowLeft />
            </IconButton>
          )}

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-3xl">
                {title}
              </h1>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>

            {description && <p className="max-w-3xl text-base leading-relaxed text-ink-2">{description}</p>}
          </div>
        </div>

        {actions && (
          <div className="flex w-full flex-wrap items-center gap-2 max-sm:[&>*]:flex-1 sm:w-auto sm:shrink-0 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
