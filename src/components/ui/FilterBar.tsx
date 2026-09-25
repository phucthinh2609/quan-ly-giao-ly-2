import React, { useId, useState } from "react";
import { SlidersHorizontal, RotateCcw, Check, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Button } from "./Button";
import { BottomSheet } from "./BottomSheet";
import { Select } from "./Select";
import { cn } from "../../lib/cn";

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
  /** Từ khóa tìm kiếm */
  searchQuery?: string;
  /** Placeholder ô tìm kiếm */
  searchPlaceholder?: string;
  /** Gọi khi từ khóa tìm kiếm thay đổi */
  onSearchChange?: (val: string) => void;
  /** Gọi khi xóa trắng tìm kiếm */
  onSearchClear?: () => void;
  /** Danh sách cấu hình bộ lọc */
  filters?: FilterConfig[];
  /** Số bộ lọc đang áp dụng (nếu không truyền sẽ tự tính) */
  activeFiltersCount?: number;
  /** Xóa toàn bộ bộ lọc về mặc định */
  onClearAll?: () => void;
  /** Hành động phụ (Xuất Excel, Thêm mới...) */
  actions?: React.ReactNode;
  /** Tiêu đề BottomSheet trên mobile */
  mobileFilterTitle?: string;
  className?: string;
}

const isActiveValue = (value: string) => Boolean(value) && value !== "all";

/** Giá trị "không lọc" của một bộ lọc: ưu tiên option "all" nếu có, ngược lại chuỗi rỗng. */
const resetValueOf = (filter: FilterConfig) => (filter.options.some((opt) => opt.value === "all") ? "all" : "");

/** Nhóm chip chọn nhanh trong BottomSheet (1 chạm, không mở thêm lớp chọn). */
const FilterChipGroup: React.FC<{ filter: FilterConfig }> = ({ filter }) => {
  const labelId = useId();
  const hasAllOption = filter.options.some((opt) => !isActiveValue(opt.value));
  const resetValue = resetValueOf(filter);
  const chips: FilterOption[] = hasAllOption ? filter.options : [{ value: resetValue, label: "Tất cả" }, ...filter.options];

  return (
    <div role="group" aria-labelledby={labelId} className="space-y-2.5">
      <p id={labelId} className="text-sm font-semibold text-ink-2">
        {filter.label}
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((opt) => {
          const selected = isActiveValue(opt.value)
            ? filter.value === opt.value
            : !isActiveValue(filter.value);
          return (
            <button
              key={`${filter.id}-${opt.value || "all"}`}
              type="button"
              aria-pressed={selected}
              onClick={() => filter.onChange(selected && isActiveValue(opt.value) ? resetValue : opt.value)}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-base font-medium",
                "transition-[background-color,border-color,color,transform] duration-150 ease-out-soft active:scale-[0.97]",
                "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50",
                selected
                  ? "border-night bg-night text-on-night"
                  : "border-line-strong bg-surface text-ink hover:bg-surface-2"
              )}
            >
              {selected && <Check className="size-4 shrink-0" aria-hidden="true" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * FilterBar (03 §5, 04 §20)
 * - Desktop (>= md): tìm kiếm + bộ lọc dạng Select inline + hành động.
 * - Mobile (< md): tìm kiếm + nút "Bộ lọc (n)" mở BottomSheet với chip chọn nhanh.
 * - Hàng chip bộ lọc đang áp dụng, xóa được từng cái.
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery = "",
  searchPlaceholder = "Tìm kiếm…",
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

  const activeFilters = filters.filter((f) => isActiveValue(f.value));
  const calculatedActiveCount = activeFiltersCount > 0 ? activeFiltersCount : activeFilters.length;

  const handleClearAll = () => {
    if (onClearAll) onClearAll();
    else filters.forEach((f) => isActiveValue(f.value) && f.onChange(resetValueOf(f)));
  };

  const canClear = calculatedActiveCount > 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 shadow-xs sm:p-4 md:flex-row md:items-center md:justify-between">
        {/* Tìm kiếm + nút Bộ lọc (mobile) */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {onSearchChange && (
            <div className="min-w-0 flex-1">
              <SearchBar
                value={searchQuery}
                placeholder={searchPlaceholder}
                onChange={onSearchChange}
                onClear={onSearchClear}
                size="md"
                className="md:min-h-12"
              />
            </div>
          )}

          {filters.length > 0 && (
            <div className={cn("shrink-0 md:hidden", !onSearchChange && "w-full")}>
              <Button
                variant={canClear ? "primary" : "outline"}
                size="md"
                fullWidth={!onSearchChange}
                onClick={() => setIsMobileSheetOpen(true)}
                leftIcon={<SlidersHorizontal />}
                aria-haspopup="dialog"
                aria-expanded={isMobileSheetOpen}
              >
                {canClear ? `Bộ lọc (${calculatedActiveCount})` : "Bộ lọc"}
              </Button>
            </div>
          )}
        </div>

        {/* Bộ lọc inline (desktop) */}
        {filters.length > 0 && (
          <div className="hidden flex-wrap items-center gap-2 md:flex">
            {filters.map((filter) => (
              <div key={filter.id} className="w-44 lg:w-52">
                <Select
                  value={filter.value}
                  options={filter.options}
                  placeholder={filter.placeholder || filter.label}
                  ariaLabel={filter.label}
                  onChange={filter.onChange}
                />
              </div>
            ))}

            {canClear && onClearAll && (
              <Button variant="ghost" size="md" onClick={onClearAll} leftIcon={<RotateCcw />}>
                Đặt lại
              </Button>
            )}
          </div>
        )}

        {/* Hành động phụ */}
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line pt-3 md:border-t-0 md:pt-0">
            {actions}
          </div>
        )}
      </div>

      {/* Chip bộ lọc đang áp dụng */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-sm font-medium text-ink-3">Đang lọc:</span>
          {activeFilters.map((f) => {
            const matchedOption = f.options.find((opt) => opt.value === f.value);
            const valueLabel = matchedOption ? matchedOption.label : f.value;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => f.onChange(resetValueOf(f))}
                aria-label={`Bỏ lọc ${f.label}: ${valueLabel}`}
                className={cn(
                  "group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface-2 pr-2 pl-3.5 text-sm md:min-h-9",
                  "transition-colors duration-150 hover:bg-surface-3",
                  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
                )}
              >
                <span className="text-ink-3">{f.label}:</span>
                <span className="font-semibold text-ink">{valueLabel}</span>
                <span
                  className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full text-ink-3 group-hover:bg-surface group-hover:text-ink"
                  aria-hidden="true"
                >
                  <X className="size-3.5" />
                </span>
              </button>
            );
          })}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex min-h-11 items-center rounded-full px-2 text-sm font-semibold text-primary-ink hover:underline md:min-h-9"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      )}

      {/* Mobile: BottomSheet chứa bộ lọc */}
      <BottomSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        title={mobileFilterTitle}
        description="Chọn điều kiện để thu hẹp danh sách"
        footer={
          <div className="flex w-full items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              disabled={!canClear}
              onClick={handleClearAll}
              leftIcon={<RotateCcw />}
            >
              Đặt lại
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setIsMobileSheetOpen(false)}
              leftIcon={<Check />}
            >
              {canClear ? `Áp dụng (${calculatedActiveCount})` : "Xong"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6 pb-2">
          {filters.map((filter) => (
            <FilterChipGroup key={filter.id} filter={filter} />
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};
