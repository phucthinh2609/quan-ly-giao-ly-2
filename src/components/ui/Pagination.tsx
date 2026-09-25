import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./IconButton";

export interface PaginationProps {
  /**
   * Trang hiện tại (bắt đầu từ 1)
   */
  currentPage: number;
  /**
   * Tổng số trang
   */
  totalPages: number;
  /**
   * Callback khi người dùng chuyển trang
   */
  onPageChange: (page: number) => void;
  /**
   * Tổng số bản ghi (tùy chọn để hiển thị thống kê)
   */
  totalItems?: number;
  /**
   * Số bản ghi trên mỗi trang (tùy chọn)
   */
  pageSize?: number;
  /**
   * Có hiển thị văn bản tóm tắt bản ghi hay không
   */
  showItemCount?: boolean;
  className?: string;
}

/**
 * Pagination Component (§17 - 03_Component_Library)
 * - Mobile (<640px): Dạng rút gọn chuẩn Wireframe "[←] 1/10 [→]".
 * - Desktop (≥640px): Dạng số trang đầy đủ "[←] [1] [2] [3] ... [10] [→]" kèm tóm tắt bản ghi.
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

  // Tính dải số trang hiển thị trên Desktop với dấu "…"
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
    }

    if (totalPages > maxVisible + 2) {
      if (currentPage > 3) {
        pages.push("…");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("…");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Tính số thứ tự bản ghi hiển thị (VD: 1–10 của 128)
  const renderRangeSummary = () => {
    if (!totalItems || !pageSize) return null;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return (
      <span className="text-[13px] text-[#78716C]">
        Hiển thị <span className="font-semibold text-[#1C1917]">{start}–{end}</span> trong{" "}
        <span className="font-semibold text-[#1C1917]">{totalItems}</span> bản ghi
      </span>
    );
  };

  return (
    <div
      className={`
        flex items-center justify-between gap-3 pt-3 text-[#292524] select-none
        ${className}
      `}
      aria-label="Phân trang"
    >
      {/* Thông tin số lượng bản ghi (Desktop) */}
      <div className="hidden sm:block">
        {showItemCount && renderRangeSummary()}
      </div>

      {/* 1. MOBILE PAGINATION (<640px): Dạng "[←] 1/10 [→]" */}
      <div className="flex sm:hidden items-center justify-between w-full">
        <IconButton
          aria-label="Trang trước"
          variant="outline"
          size="md"
          disabled={!canPrev}
          onClick={handlePrev}
          className="text-[#292524] hover:bg-[#F5F5F4]"
        >
          <ChevronLeft className="w-5 h-5" />
        </IconButton>

        <div className="text-[15px] font-semibold text-[#1C1917] px-3">
          <span>{currentPage}</span>
          <span className="text-[#A8A29E] mx-1">/</span>
          <span>{totalPages}</span>
        </div>

        <IconButton
          aria-label="Trang kế tiếp"
          variant="outline"
          size="md"
          disabled={!canNext}
          onClick={handleNext}
          className="text-[#292524] hover:bg-[#F5F5F4]"
        >
          <ChevronRight className="w-5 h-5" />
        </IconButton>
      </div>

      {/* 2. DESKTOP PAGINATION (≥640px): Dạng đầy đủ có từng số trang */}
      <div className="hidden sm:flex items-center gap-1.5 ml-auto">
        {/* Nút lùi trang */}
        <IconButton
          aria-label="Trang trước"
          variant="ghost"
          size="sm"
          disabled={!canPrev}
          onClick={handlePrev}
          className="text-[#57534E] hover:text-[#1C1917]"
        >
          <ChevronLeft className="w-4 h-4" />
        </IconButton>

        {/* Các nút số trang */}
        {getPageNumbers().map((page, index) => {
          if (page === "…") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-[36px] h-[36px] flex items-center justify-center text-[#A8A29E] font-medium"
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
              className={`
                w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-[8px] text-[14px] font-semibold tabular-nums
                flex items-center justify-center transition-colors duration-150 cursor-pointer
                outline-none focus-visible:ring-2 focus-visible:ring-[#B4232C]/30
                ${
                  isCurrent
                    ? "bg-[#B4232C] text-white shadow-xs font-bold"
                    : "text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917] active:bg-[#E7E5E4]"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Nút tiến trang */}
        <IconButton
          aria-label="Trang kế tiếp"
          variant="ghost"
          size="sm"
          disabled={!canNext}
          onClick={handleNext}
          className="text-[#57534E] hover:text-[#1C1917]"
        >
          <ChevronRight className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
};
