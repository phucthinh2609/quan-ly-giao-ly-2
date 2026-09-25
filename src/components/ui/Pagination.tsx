import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "../../lib/cn";

export interface PaginationProps {
  /** Trang hiện tại (bắt đầu từ 1) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Gọi khi chuyển trang */
  onPageChange: (page: number) => void;
  /** Tổng số bản ghi (tùy chọn, để hiển thị thống kê) */
  totalItems?: number;
  /** Số bản ghi mỗi trang (tùy chọn) */
  pageSize?: number;
  /** Hiển thị dòng tóm tắt số bản ghi */
  showItemCount?: boolean;
  className?: string;
}

/**
 * Pagination (03 §5)
 * - Mobile (< 640px): dạng rút gọn "← 1 / 10 →".
 * - >= 640px: nút pill từng số trang, trang hiện tại nền night, kèm tóm tắt bản ghi.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  showItemCount = true,
  className = "",
}) => {
  if (totalPages <= 0) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handlePrev = () => {
    if (canPrev) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (canNext) onPageChange(currentPage + 1);
  };

  // Dải số trang trên desktop, rút gọn bằng "…"
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push("…");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);

    return pages;
  };

  // VD: 1–10 trong 128
  const renderRangeSummary = () => {
    if (!totalItems || !pageSize) return null;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return (
      <span className="text-sm text-ink-3">
        Hiển thị{" "}
        <span className="font-semibold text-ink tabular-nums">
          {start}–{end}
        </span>{" "}
        trong <span className="font-semibold text-ink tabular-nums">{totalItems}</span> bản ghi
      </span>
    );
  };

  return (
    <nav aria-label="Phân trang" className={cn("flex items-center justify-between gap-3 pt-3 select-none", className)}>
      {/* Tóm tắt (>= sm) */}
      <div className="hidden sm:block">{showItemCount && renderRangeSummary()}</div>

      {/* Mobile: ← 1 / 10 → */}
      <div className="flex w-full items-center justify-between sm:hidden">
        <IconButton aria-label="Trang trước" variant="outline" size="md" disabled={!canPrev} onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>

        <p className="px-3 text-base font-semibold text-ink tabular-nums" aria-live="polite">
          <span className="sr-only">Trang </span>
          <span>{currentPage}</span>
          <span className="mx-1.5 text-ink-3" aria-hidden="true">
            /
          </span>
          <span className="sr-only"> trên </span>
          <span>{totalPages}</span>
        </p>

        <IconButton aria-label="Trang kế tiếp" variant="outline" size="md" disabled={!canNext} onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </div>

      {/* >= sm: số trang dạng pill */}
      <div className="ml-auto hidden items-center gap-1 sm:flex">
        <IconButton aria-label="Trang trước" variant="ghost" size="md" disabled={!canPrev} onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>

        {getPageNumbers().map((page, index) => {
          if (page === "…") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex size-11 items-center justify-center font-medium text-ink-3"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Trang ${page}`}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold tabular-nums",
                "transition-[background-color,color,transform] duration-150 ease-out-soft active:scale-95",
                "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
                isCurrent ? "bg-night text-on-night" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              )}
            >
              {page}
            </button>
          );
        })}

        <IconButton aria-label="Trang kế tiếp" variant="ghost" size="md" disabled={!canNext} onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </div>
    </nav>
  );
};
