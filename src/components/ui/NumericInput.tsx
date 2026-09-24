import React, { useId, useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

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
}

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
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    // Maintain raw string for smooth mobile typing (e.g. typing "8.", "8.5")
    const formatValueToString = (val: number | string | null): string => {
      if (val === null || val === undefined || val === "") return "";
      return String(val);
    };

    const [rawText, setRawText] = useState<string>(() => formatValueToString(value));
    const [isFocused, setIsFocused] = useState(false);
    const [rangeError, setRangeError] = useState<string | null>(null);

    // Sync external value when not actively typing or if changed externally
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
      // Allow empty, digits, single dot or comma for decimal separator
      const sanitized = inputVal.replace(/,/g, ".");
      setRawText(inputVal);

      if (sanitized.trim() === "") {
        setRangeError(null);
        onChange(null);
        return;
      }

      // If valid numeric string format
      if (/^-?\d*(\.\d*)?$/.test(sanitized)) {
        const parsed = parseFloat(sanitized);
        if (!isNaN(parsed)) {
          const err = validateRange(parsed);
          setRangeError(err);
          // KHÔNG tự làm tròn! Giữ nguyên giá trị số nhập vào
          onChange(parsed);
        }
      } else {
        setRangeError("Vui lòng chỉ nhập ký tự số");
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Validate on blur
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

    // Tokens sizing
    const sizeClasses: Record<NumericInputSize, string> = {
      sm: "h-[40px] text-[15px] px-3 rounded-[8px]",
      md: "h-[48px] text-[16px] px-3.5 rounded-[10px]",
      lg: "h-[52px] text-[18px] px-4 rounded-[10px] font-semibold", // GLV quick score
      parent: "h-[56px] text-[20px] px-5 rounded-[12px] font-bold", // Parent large
    };

    const labelSizeClasses: Record<NumericInputSize, string> = {
      sm: "text-[13px] mb-1",
      md: "text-[14px] mb-1.5",
      lg: "text-[15px] mb-1.5",
      parent: "text-[16px] mb-2 font-semibold text-[#1C1917]",
    };

    return (
      <div className={`w-full flex flex-col font-sans ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`font-medium text-[#292524] flex items-center gap-1 ${labelSizeClasses[size]}`}
          >
            <span>{label}</span>
            {required && <span className="text-[#DC4C4C] font-bold" aria-hidden="true">*</span>}
          </label>
        )}

        <div
          className={`
            relative flex items-center w-full transition-all duration-150
            border bg-white
            ${sizeClasses[size]}
            ${
              hasError
                ? "border-[#DC4C4C] text-[#DC4C4C] focus-within:ring-3 focus-within:ring-[#DC4C4C]/25"
                : isFocused
                ? "border-[#B4232C] ring-3 ring-[#B4232C]/20"
                : "border-[#D6D3D1] hover:border-[#A8A29E]"
            }
            ${disabled ? "bg-[#F5F5F4] border-[#E7E5E4] opacity-70 cursor-not-allowed text-[#A8A29E]" : ""}
            ${readOnly && !disabled ? "bg-[#FAFAF9] border-[#E7E5E4] text-[#57534E]" : ""}
          `}
        >
          {/* Numeric input with mobile keyboard optimization */}
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
            aria-invalid={hasError ? "true" : "false"}
            onChange={handleInputChange}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            className="w-full h-full bg-transparent border-none outline-none p-0 text-inherit placeholder:text-[#A8A29E] text-center"
          />

          {hasError && (
            <div className="absolute right-2.5 flex items-center pointer-events-none text-[#DC4C4C]" aria-hidden="true">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Inline Error Message */}
        {hasError ? (
          <p
            role="alert"
            className="mt-1 text-[12px] font-medium text-[#DC4C4C] flex items-center gap-1"
          >
            <span>{effectiveError}</span>
          </p>
        ) : helperText ? (
          <p className="mt-1 text-[12px] text-[#78716C]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

NumericInput.displayName = "NumericInput";
