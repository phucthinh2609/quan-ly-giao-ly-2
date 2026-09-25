import React, { useId, useState, useEffect } from "react";
import { cn } from "../../lib/cn";
import { FieldLabel, FieldMessage, fieldStateClasses } from "./Input";

export type NumericInputSize = "sm" | "md" | "lg" | "parent";

export interface NumericInputProps {
  value: number | string | null;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  size?: NumericInputSize;
  className?: string;
  id?: string;
  name?: string;
  onChange: (value: number | null) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Trạng thái hợp lệ (viền success nhạt). Mặc định tự bật khi đã có giá trị và không lỗi.
   * Truyền false để tắt.
   */
  valid?: boolean;
  /** Nhãn cho trình đọc màn hình khi không có label hiển thị (VD ô điểm trong bảng) */
  ariaLabel?: string;
}

// Số liệu: font-mono, căn giữa; lg dành cho nhập điểm nhanh của GLV.
const sizeClasses: Record<NumericInputSize, string> = {
  sm: "h-11 px-3 text-base",
  md: "h-(--control) min-h-12 px-3.5 text-lg",
  lg: "h-(--control-lg) min-h-13 px-4 text-xl font-semibold",
  parent: "h-14 px-5 text-xl font-bold",
};

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      value,
      min = 0,
      max = 10,
      step,
      placeholder = "0.0",
      disabled = false,
      readOnly = false,
      error: externalError,
      helperText,
      label,
      required = false,
      size = "md",
      className = "",
      id,
      name,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      valid,
      ariaLabel,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const messageId = `${inputId}-message`;

    // Giữ chuỗi thô để gõ mượt trên mobile (VD "8.", "8.5")
    const formatValueToString = (val: number | string | null): string => {
      if (val === null || val === undefined || val === "") return "";
      return String(val);
    };

    const [rawText, setRawText] = useState<string>(() => formatValueToString(value));
    const [isFocused, setIsFocused] = useState(false);
    const [rangeError, setRangeError] = useState<string | null>(null);

    // Đồng bộ giá trị bên ngoài khi không đang gõ hoặc khi bị đổi từ ngoài
    useEffect(() => {
      const formatted = formatValueToString(value);
      if (formatted !== rawText && (!isFocused || rawText === "")) {
        setRawText(formatted);
      }
    }, [value, isFocused]);

    const validateRange = (numVal: number | null): string | null => {
      if (numVal === null) return null;
      if (min !== undefined && numVal < min) {
        return `Điểm tối thiểu là ${min}`;
      }
      if (max !== undefined && numVal > max) {
        return `Điểm tối đa là ${max}`;
      }
      return null;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = event.target.value;
      // Cho phép rỗng, chữ số, một dấu chấm hoặc phẩy thập phân
      const sanitized = inputVal.replace(/,/g, ".");
      setRawText(inputVal);

      if (sanitized.trim() === "") {
        setRangeError(null);
        onChange(null);
        return;
      }

      if (/^-?\d*(\.\d*)?$/.test(sanitized)) {
        const parsed = parseFloat(sanitized);
        if (!isNaN(parsed)) {
          const err = validateRange(parsed);
          setRangeError(err);
          // Không tự làm tròn: giữ nguyên giá trị số nhập vào
          onChange(parsed);
        }
      } else {
        setRangeError("Vui lòng chỉ nhập ký tự số");
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (rawText.trim() !== "") {
        const sanitized = rawText.replace(/,/g, ".");
        const parsed = parseFloat(sanitized);
        if (!isNaN(parsed)) {
          setRangeError(validateRange(parsed));
        }
      }
      onBlur?.(e);
    };

    const effectiveError = externalError || rangeError;
    const hasError = Boolean(effectiveError);
    const hasValue = rawText.trim() !== "";
    const isValid = !hasError && !disabled && !readOnly && (valid ?? hasValue);

    return (
      <div className={cn("flex w-full flex-col", className)}>
        {label && (
          <FieldLabel htmlFor={inputId} size={size} required={required}>
            {label}
          </FieldLabel>
        )}

        <div
          className={cn(
            "relative flex w-full items-center rounded-control border transition-[border-color,box-shadow,background-color] duration-150",
            sizeClasses[size],
            fieldStateClasses({ hasError, disabled, readOnly }),
            isValid && "border-success/40"
          )}
        >
          {/* Bàn phím số trên mobile */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="text"
            step={step}
            inputMode="decimal"
            pattern="[0-9]*([.,][0-9]+)?"
            autoComplete="off"
            value={rawText}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-label={label ? undefined : ariaLabel}
            aria-required={required || undefined}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError || helperText ? messageId : undefined}
            onChange={handleInputChange}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            className={cn(
              "h-full w-full min-w-0 border-none bg-transparent p-0 text-center font-mono tabular-nums outline-none",
              "text-inherit placeholder:text-ink-3 disabled:cursor-not-allowed"
            )}
          />
        </div>

        <FieldMessage id={messageId} error={effectiveError} helperText={helperText} size={size} />
      </div>
    );
  }
);

NumericInput.displayName = "NumericInput";
