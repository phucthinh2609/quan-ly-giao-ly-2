import React, { useState } from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { BottomSheet } from "./BottomSheet";
import { Select } from "./Select";

export interface FilterOption {
  value: string;
  label: string;
  description?: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}

export interface FilterBarProps {
  /**
   * Từ khóa tìm kiếm
   */
  searchQuery?: string;
  /**
   * Placeholder ô tìm kiếm
   */
  searchPlaceholder?: string;
  /**
   * Callback khi từ khóa tìm kiếm thay đổi
   */
  onSearchChange?: (val: string) => void;
  /**
   * Callback xóa trắng tìm kiếm
   */
  onSearchClear?: () => void;
  /**
   * Danh sách cấu hình các bộ lọc
   */
  filters?: FilterConfig[];
  /**
   * Số lượng bộ lọc đang hoạt động (active)
   */
  activeFiltersCount?: number;
  /**
   * Callback xóa toàn bộ bộ lọc về mặc định
   */
  onClearAll?: () => void;
  /**
   * Các nút hành động phụ (như Xuất Excel, Thêm mới)
   */
  actions?: React.ReactNode;
  /**
   * Tiêu đề của BottomSheet khi mở trên Mobile
   */
  mobileFilterTitle?: string;
  className?: string;
}

/**
 * FilterBar Component (§15, §20 - 03_Component_Library & Wireframe Responsive Matrix)
 * - Desktop (≥768px): Hiển thị Filter inline cùng thanh tìm kiếm và hành động.
 * - Mobile (<768px): Hiển thị Search + nút "Bộ lọc" mở BottomSheet trượt từ dưới lên.
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery = "",
  searchPlaceholder = "Tìm kiếm...",
  onSearchChange,
  onSearchClear,
  filters = [],
  activeFiltersCount = 0,
  onClearAll,
  actions,
  mobileFilterTitle = "Bộ lọc tìm kiếm",
  className = "",
}) => {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Tính số lượng bộ lọc đang chọn nếu không truyền activeFiltersCount
  const calculatedActiveCount =
    activeFiltersCount > 0
      ? activeFiltersCount
      : filters.filter((f) => f.value && f.value !== "" && f.value !== "all").length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Container chính: Responsive Flex/Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-[12px] border border-[#E7E5E4] shadow-xs">
        {/* Phần 1: Search & Nút Bộ lọc trên Mobile */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {onSearchChange && (
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                placeholder={searchPlaceholder}
                onChange={onSearchChange}
                onClear={onSearchClear}
                size="md"
              />
            </div>
          )}

          {/* Nút Bộ lọc CHỈ xuất hiện trên Mobile (< 768px) khi có bộ lọc */}
          {filters.length > 0 && (
            <div className="block md:hidden shrink-0">
              <Button
                variant={calculatedActiveCount > 0 ? "primary" : "outline"}
                size="md"
                onClick={() => setIsMobileSheetOpen(true)}
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                className="whitespace-nowrap"
              >
                Bộ lọc
                {calculatedActiveCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-white text-[#B4232C]">
                    {calculatedActiveCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Phần 2: Inline Filters trên Desktop (≥ 768px) */}
        {filters.length > 0 && (
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <div key={filter.id} className="min-w-[150px] max-w-[210px]">
                <Select
                  value={filter.value}
                  options={filter.options}
                  placeholder={filter.placeholder || filter.label}
                  onChange={filter.onChange}
                />
              </div>
            ))}

            {calculatedActiveCount > 0 && onClearAll && (
              <Button
                variant="ghost"
                size="md"
                onClick={onClearAll}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-[#78716C] hover:text-[#B4232C]"
              >
                Đặt lại
              </Button>
            )}
          </div>
        )}

        {/* Phần 3: Custom Actions (Xuất Excel, Thêm mới, v.v.) */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-[#E7E5E4]">
            {actions}
          </div>
        )}
      </div>

      {/* Hiển thị tóm tắt các filter đang chọn trên Desktop/Mobile nếu có */}
      {calculatedActiveCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap px-1 text-[13px] text-[#78716C]">
          <span className="font-medium">Đang lọc theo:</span>
          {filters
            .filter((f) => f.value && f.value !== "" && f.value !== "all")
            .map((f) => {
              const matchedOption = f.options.find((opt) => opt.value === f.value);
              return (
                <Badge
                  key={f.id}
                  variant="neutral"
                  size="sm"
                  className="bg-[#F5F5F4] text-[#292524] border border-[#E7E5E4]"
                >
                  <span className="text-[#78716C] font-normal mr-1">{f.label}:</span>
                  <span className="font-semibold">{matchedOption ? matchedOption.label : f.value}</span>
                </Badge>
              );
            })}
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="text-[#B4232C] hover:underline font-medium text-[13px] ml-1 cursor-pointer"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Mobile BottomSheet chứa các Bộ lọc */}
      <BottomSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        title={mobileFilterTitle}
        description="Lựa chọn các điều kiện lọc để thu hẹp danh sách"
        footer={
          <div className="flex items-center gap-3 w-full">
            {onClearAll && (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => {
                  onClearAll();
                  setIsMobileSheetOpen(false);
                }}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Đặt lại
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setIsMobileSheetOpen(false)}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Áp dụng ({calculatedActiveCount})
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#1C1917] block">
                {filter.label}
              </label>
              <Select
                value={filter.value}
                options={filter.options}
                placeholder={filter.placeholder || `Tất cả ${filter.label.toLowerCase()}`}
                onChange={filter.onChange}
              />
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};
