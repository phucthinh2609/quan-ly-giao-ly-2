import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { IconButton } from "./IconButton";

export interface SearchBarProps {
  /**
   * Giá trị tìm kiếm hiện tại (controlled)
   */
  value: string;
  /**
   * Placeholder hiển thị
   */
  placeholder?: string;
  /**
   * Thời gian debounce (ms), mặc định 300ms theo đặc tả §15
   */
  debounceMs?: number;
  /**
   * Callback khi giá trị sau debounce thay đổi
   */
  onChange: (value: string) => void;
  /**
   * Callback khi người dùng nhấn nút Xóa tìm kiếm
   */
  onClear?: () => void;
  /**
   * Kích thước thanh tìm kiếm (sm: 36px, md: 44px, lg: 52px, parent: 56px)
   */
  size?: "sm" | "md" | "lg" | "parent";
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

/**
 * SearchBar Component (§15 - 03_Component_Library)
 * Hỗ trợ debounce mặc định 300ms, nút onClear dọn sạch từ khóa, và touch-target chuẩn ≥ 44px.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder = "Tìm kiếm...",
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

  // Debounce xử lý gọi onChange
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

  // Kích thước chuẩn Design Tokens
  const sizeStyles = {
    sm: "h-[36px] text-[14px] pl-9 pr-9",
    md: "h-[44px] text-[15px] pl-10 pr-10",
    lg: "h-[52px] text-[16px] pl-11 pr-11",
    parent: "h-[56px] text-[18px] pl-12 pr-12 font-medium",
  };

  const iconSizes = {
    sm: "w-4 h-4 left-2.5",
    md: "w-4.5 h-4.5 left-3",
    lg: "w-5 h-5 left-3.5",
    parent: "w-6 h-6 left-4",
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Icon Kính lúp Tìm kiếm */}
      <span
        className={`absolute pointer-events-none text-[#78716C] flex items-center justify-center ${iconSizes[size]}`}
        aria-hidden="true"
      >
        <Search className="w-full h-full" />
      </span>

      {/* Input Field */}
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
        className={`
          w-full rounded-[10px] bg-white text-[#292524] placeholder-[#A8A29E]
          border border-[#E7E5E4] hover:border-[#D6D3D1]
          focus:border-[#B4232C] focus:ring-3 focus:ring-[#B4232C]/20 outline-none
          transition-all duration-150 font-sans
          disabled:bg-[#F5F5F4] disabled:text-[#A8A29E] disabled:cursor-not-allowed
          ${sizeStyles[size]}
        `}
      />

      {/* Nút Xóa từ khóa (onClear) */}
      {Boolean(innerValue) && !disabled && (
        <div className="absolute right-1.5 flex items-center">
          <IconButton
            aria-label="Xóa nội dung tìm kiếm"
            variant="ghost"
            size={size === "parent" ? "md" : "sm"}
            onClick={handleClear}
            className="text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4]"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>
      )}
    </div>
  );
};
