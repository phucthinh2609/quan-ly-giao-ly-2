import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "../../lib/cn";

export interface SearchBarProps {
  /** Giá trị tìm kiếm hiện tại (controlled) */
  value: string;
  /** Placeholder hiển thị */
  placeholder?: string;
  /** Thời gian debounce (ms), mặc định 300ms */
  debounceMs?: number;
  /** Gọi khi giá trị sau debounce thay đổi */
  onChange: (value: string) => void;
  /** Gọi khi người dùng nhấn nút Xóa tìm kiếm */
  onClear?: () => void;
  /** Kích thước: sm 44 · md theo --control · lg 52 · parent 56 */
  size?: "sm" | "md" | "lg" | "parent";
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

const sizeStyles: Record<NonNullable<SearchBarProps["size"]>, { box: string; input: string; icon: string }> = {
  sm: { box: "h-11 pl-3.5 pr-1", input: "text-base", icon: "size-4" },
  md: { box: "h-(--control) min-h-11 pl-4 pr-1", input: "text-base", icon: "size-5" },
  lg: { box: "h-13 pl-4.5 pr-1.5", input: "text-base", icon: "size-5" },
  parent: { box: "h-14 pl-5 pr-1.5", input: "text-lg", icon: "size-6" },
};

/**
 * SearchBar (03 §5): pill bg-surface-2, icon trái, nút xóa, debounce 300ms.
 * Esc xóa nhanh nội dung đang gõ.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder = "Tìm kiếm…",
  debounceMs = 300,
  onChange,
  onClear,
  size = "md",
  disabled = false,
  autoFocus = false,
  className = "",
  id,
  ariaLabel = "Ô tìm kiếm",
}) => {
  const [innerValue, setInnerValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstMount = useRef(true);

  // Đồng bộ giá trị nội bộ khi value từ cha thay đổi
  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  // Debounce gọi onChange
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (innerValue !== value) {
        onChange(innerValue);
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [innerValue, debounceMs, onChange, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
  };

  const handleClear = () => {
    setInnerValue("");
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && innerValue) {
      e.preventDefault();
      handleClear();
    }
  };

  const styles = sizeStyles[size];
  const showClear = Boolean(innerValue) && !disabled;

  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-full border border-transparent bg-surface-2 text-ink",
        "transition-[background-color,border-color,box-shadow] duration-150 ease-out-soft",
        "hover:border-line-strong focus-within:border-primary focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/15",
        disabled && "cursor-not-allowed opacity-60 hover:border-transparent",
        styles.box,
        className
      )}
    >
      <Search className={cn("shrink-0 text-ink-3", styles.icon)} aria-hidden="true" />

      <input
        ref={inputRef}
        id={id}
        type="search"
        role="searchbox"
        aria-label={ariaLabel}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={innerValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        enterKeyHint="search"
        className={cn(
          "h-full w-full min-w-0 appearance-none border-none bg-transparent p-0 outline-none",
          "text-ink placeholder:text-ink-3 disabled:cursor-not-allowed",
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          !showClear && "pr-3",
          styles.input
        )}
      />

      {/* Nút xóa: pseudo-element mở rộng vùng chạm tới >= 44px */}
      {showClear && (
        <IconButton
          aria-label="Xóa nội dung tìm kiếm"
          variant="ghost"
          size={size === "parent" || size === "lg" ? "md" : "sm"}
          onClick={handleClear}
          className="shrink-0 before:absolute before:-inset-1 before:content-[''] hover:bg-surface-3"
        >
          <X />
        </IconButton>
      )}
    </div>
  );
};
