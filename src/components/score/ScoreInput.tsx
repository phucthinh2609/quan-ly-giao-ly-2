import React, { forwardRef, useState, useEffect } from "react";
import { AlertCircle, Check, AlertTriangle } from "lucide-react";

export type ScoreInputState =
  | "EMPTY"
  | "FOCUS"
  | "VALID"
  | "INVALID"
  | "DISABLED"
  | "SAVED"
  | "DIRTY";

export interface ScoreInputProps {
  value: number | null;
  rawInput?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  isDirty?: boolean;
  isSaved?: boolean;
  error?: string | null;
  id?: string;
  name?: string;
  studentName?: string;
  onChange: (value: number | null, rawText: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  showInlineError?: boolean;
}

/**
 * ScoreInput Component (§22 - 03_Component_Library.md)
 *
 * States: EMPTY, FOCUS, VALID, INVALID, DISABLED, SAVED, DIRTY
 * Validation:
 * - 0 <= Score <= 10 (Thang điểm 10)
 * - Chặn và báo lỗi rõ ràng các case:
 *   + -1 -> "Điểm tối thiểu là 0"
 *   + 11 -> "Điểm tối đa là 10 (thang điểm 10)"
 *   + "abc" -> "Vui lòng nhập số hợp lệ từ 0 đến 10"
 *   + rỗng (khi required) -> "Điểm không được để trống"
 * - Hiển thị lỗi inline ngay dưới input (TUYỆT ĐỐI KHÔNG mở modal per-student)
 * - Touch-target tối thiểu 44x44px, cỡ chữ lớn 18px tối ưu cho Giáo lý viên lớn tuổi
 */
export const ScoreInput = forwardRef<HTMLInputElement, ScoreInputProps>(
  (
    {
      value,
      rawInput,
      min = 0,
      max = 10,
      step = 0.5,
      placeholder = "—",
      disabled = false,
      readOnly = false,
      required = false,
      isDirty = false,
      isSaved = false,
      error: externalError,
      id,
      name,
      studentName,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      className = "",
      showInlineError = true,
    },
    ref
  ) => {
    // String representation of score for typing "8.", "8.5", "abc", etc.
    const initialText =
      rawInput !== undefined
        ? rawInput
        : value !== null && value !== undefined
        ? String(value)
        : "";

    const [text, setText] = useState<string>(initialText);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    // Sync when value or rawInput changes from outside
    useEffect(() => {
      const nextText =
        rawInput !== undefined
          ? rawInput
          : value !== null && value !== undefined
          ? String(value)
          : "";
      if (!isFocused || text === "") {
        setText(nextText);
      }
    }, [value, rawInput, isFocused]);

    // Validation logic for 0 - 10, -1, 11, "abc", empty
    const validateScoreString = (str: string): { parsed: number | null; error: string | null } => {
      const trimmed = str.trim();
      if (trimmed === "") {
        if (required) {
          return { parsed: null, error: "Điểm không được để trống" };
        }
        return { parsed: null, error: null };
      }

      // Convert comma to dot
      const normalized = trimmed.replace(/,/g, ".");

      // Check if it is a valid numeric pattern
      if (!/^-?\d*(\.\d+)?$/.test(normalized) || normalized === "-") {
        return {
          parsed: null,
          error: 'Vui lòng nhập số hợp lệ từ 0 đến 10 (không nhập chữ "' + trimmed + '")',
        };
      }

      const num = parseFloat(normalized);
      if (isNaN(num)) {
        return { parsed: null, error: "Vui lòng nhập số hợp lệ" };
      }

      if (num < min) {
        return { parsed: num, error: `Điểm không được nhỏ hơn ${min} (bạn nhập ${num})` };
      }

      if (num > max) {
        return { parsed: num, error: `Điểm tối đa là ${max} (bạn nhập ${num})` };
      }

      return { parsed: num, error: null };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setText(val);

      const { parsed, error: validationErr } = validateScoreString(val);
      setInternalError(validationErr);
      onChange(parsed, val);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const { error: validationErr } = validateScoreString(text);
      setInternalError(validationErr);
      onBlur?.(e);
    };

    const activeError = externalError !== undefined ? externalError : internalError;
    const hasError = Boolean(activeError);

    // Compute UI state for styling
    let stateStyle = "border-[#D6D3D1] bg-white text-[#1C1917] hover:border-[#A8A29E]";
    if (disabled) {
      stateStyle = "border-[#E7E5E4] bg-[#F5F5F4] text-[#A8A29E] cursor-not-allowed";
    } else if (hasError) {
      stateStyle = "border-[#DC4C4C] bg-[#FEF2F2] text-[#B4232C]";
    } else if (isFocused) {
      stateStyle = "border-[#B4232C] bg-white text-[#1C1917]";
    } else if (isDirty) {
      stateStyle = "border-[#D97706] bg-[#FFFBEB] text-[#92400E]";
    } else if (isSaved) {
      stateStyle = "border-[#168154] bg-[#F0FDF4] text-[#14532D]";
    } else if (value !== null && value !== undefined) {
      stateStyle = "border-[#A8A29E] bg-white text-[#1C1917]";
    }

    return (
      <div className={`flex flex-col items-center sm:items-start ${className}`}>
        <div
          className={`
            relative flex items-center justify-center
            w-[90px] sm:w-[100px] h-[48px] rounded-[10px] border-2 transition-all duration-150
            ${stateStyle}
          `}
        >
          <input
            ref={ref}
            id={id}
            name={name}
            type="text"
            step={step}
            inputMode="decimal"
            enterKeyHint="next"
            pattern="[0-9]*([.,][0-9]+)?"
            autoComplete="off"
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={hasError ? "true" : "false"}
            aria-label={studentName ? `Nhập điểm cho học sinh ${studentName}` : "Nhập điểm từ 0 đến 10"}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            style={{ outline: "none", boxShadow: "none", border: "none" }}
            className="w-full h-full bg-transparent border-0 border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none rounded-[10px] text-center font-bold text-[18px] sm:text-[19px] placeholder:text-[#A8A29E] placeholder:font-normal select-all px-1 cursor-text"
          />

          {/* Indicator icons inside corner */}
          {hasError && (
            <div
              className="absolute right-1.5 top-1.5 text-[#DC4C4C] pointer-events-none"
              title={activeError || "Lỗi điểm không hợp lệ"}
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          )}
          {!hasError && isDirty && (
            <div
              className="absolute right-1.5 top-1.5 text-[#D97706] pointer-events-none"
              title="Có thay đổi chưa lưu"
            >
              <span className="w-2 h-2 rounded-full bg-[#D97706] inline-block animate-pulse" />
            </div>
          )}
          {!hasError && isSaved && !isDirty && (
            <div
              className="absolute right-1.5 top-1.5 text-[#168154] pointer-events-none"
              title="Đã lưu thành công"
            >
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Inline Error Message - NO MODAL */}
        {showInlineError && hasError && activeError && (
          <div
            role="alert"
            className="mt-1 max-w-[220px] text-[12px] font-semibold text-[#B4232C] bg-[#FFF1F2] px-2 py-0.5 rounded border border-[#FECDD3] flex items-center gap-1 shadow-xs"
          >
            <AlertTriangle className="w-3 h-3 flex-shrink-0 text-[#DC4C4C]" />
            <span className="break-words leading-tight">{activeError}</span>
          </div>
        )}
      </div>
    );
  }
);

ScoreInput.displayName = "ScoreInput";
