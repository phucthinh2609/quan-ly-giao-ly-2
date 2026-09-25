import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check, X, AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export type SelectSize = "sm" | "md" | "lg" | "parent";

export interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  className?: string;
  id?: string;
  onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  placeholder = "Chọn một mục…",
  disabled = false,
  required = false,
  error,
  helperText,
  size = "md",
  className = "",
  id,
  onChange,
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Responsive mobile detector (< 768px breakpoint)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close desktop dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasError = Boolean(error);

  const sizeClasses: Record<SelectSize, string> = {
    sm: "h-[40px] text-[15px] px-3.5 rounded-[8px]",
    md: "h-[48px] text-[16px] px-4 rounded-[10px]",
    lg: "h-[52px] text-[16px] px-4 rounded-[10px]",
    parent: "h-[56px] text-[18px] px-5 rounded-[12px] font-medium",
  };

  const labelSizeClasses: Record<SelectSize, string> = {
    sm: "text-[13px] mb-1",
    md: "text-[14px] mb-1.5",
    lg: "text-[15px] mb-1.5",
    parent: "text-[16px] mb-2 font-semibold text-[#1C1917]",
  };

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full flex flex-col font-sans ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={`font-medium text-[#292524] flex items-center gap-1 ${labelSizeClasses[size]}`}
        >
          <span>{label}</span>
          {required && <span className="text-[#DC4C4C] font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Select Trigger */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between text-left transition-colors duration-150 outline-none
          border bg-white cursor-pointer select-none
          ${sizeClasses[size]}
          ${
            hasError
              ? "border-[#DC4C4C] text-[#DC4C4C] focus-visible:ring-3 focus-visible:ring-[#DC4C4C]/25"
              : isOpen
              ? "border-[#B4232C] ring-3 ring-[#B4232C]/20"
              : "border-[#D6D3D1] hover:border-[#A8A29E] focus-visible:ring-3 focus-visible:ring-[#B4232C]/20"
          }
          ${disabled ? "bg-[#F5F5F4] border-[#E7E5E4] opacity-70 cursor-not-allowed text-[#A8A29E]" : ""}
        `}
      >
        <span className={`truncate ${!selectedOption ? "text-[#A8A29E]" : "text-[#292524]"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 ml-2 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#B4232C]" : "text-[#78716C]"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Error or Helper text */}
      {hasError ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[13px] font-medium text-[#DC4C4C] flex items-center gap-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-[13px] text-[#78716C]">
          {helperText}
        </p>
      ) : null}

      {/* DESKTOP VIEW: Dropdown Popover */}
      {isOpen && !isMobile && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-[100] max-h-64 overflow-y-auto rounded-[10px] border border-[#E7E5E4] bg-white shadow-lg py-1.5 focus:outline-none"
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-[14px] text-[#78716C] text-center">
              Không có lựa chọn nào
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 text-left text-[15px] transition-colors
                    ${
                      isSelected
                        ? "bg-[#FFF1F2] text-[#B4232C] font-semibold"
                        : "text-[#292524] hover:bg-[#F5F5F4]"
                    }
                    ${opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.description && (
                      <span className="text-[12px] text-[#78716C] font-normal">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#B4232C] shrink-0 ml-2" aria-hidden="true" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* MOBILE VIEW: Touch-friendly BottomSheet Modal */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-[500] flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* BottomSheet Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label || "Chọn một mục"}
            className="relative z-10 w-full max-h-[80vh] bg-white rounded-t-[20px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
          >
            {/* Grab Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-[#E7E5E4] rounded-full" />
            </div>

            {/* BottomSheet Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E7E5E4]">
              <h3 className="text-[17px] font-bold text-[#1C1917]">
                {label || placeholder}
              </h3>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F4] text-[#78716C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BottomSheet List */}
            <div role="listbox" className="overflow-y-auto p-2 pb-8 max-h-[60vh]">
              {options.length === 0 ? (
                <div className="p-6 text-center text-[#78716C]">Không có lựa chọn nào</div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={opt.disabled}
                      onClick={() => !opt.disabled && handleSelect(opt.value)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] my-1 text-left text-[16px]
                        min-h-[50px] transition-colors
                        ${
                          isSelected
                            ? "bg-[#FFF1F2] text-[#B4232C] font-semibold"
                            : "text-[#292524] hover:bg-[#F5F5F4] active:bg-[#E7E5E4]"
                        }
                        ${opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      <div className="flex flex-col">
                        <span className="leading-snug">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[13px] text-[#78716C] mt-0.5">
                            {opt.description}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-[#B4232C] shrink-0 ml-3" aria-hidden="true" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
