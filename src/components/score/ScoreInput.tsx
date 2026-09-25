import React, { forwardRef, useEffect, useRef, useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "../../lib/cn";
import { validateScoreText } from "./scoreUtils";

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

function textFrom(rawInput: string | undefined, value: number | null): string {
  if (rawInput !== undefined) return rawInput;
  return value !== null && value !== undefined ? String(value) : "";
}

/**
 * Ô nhập điểm (03 §8): số lớn font-mono, căn giữa, bàn phím số trên mobile.
 * - DIRTY: chấm cảnh báo nhỏ ở góc · SAVED: dấu check ở góc.
 * - INVALID: viền danger + thông báo có icon ngay dưới ô (không mở modal).
 * - Giá trị đổi từ bên ngoài (điền nhanh, khôi phục nháp, nhập Excel) được đồng bộ
 *   kể cả khi ô đang focus.
 */
export const ScoreInput = forwardRef<HTMLInputElement, ScoreInputProps>(
  (
    {
      value,
      rawInput,
      min = 0,
      max = 10,
      step = 0.25,
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
    const externalText = textFrom(rawInput, value);
    const [text, setText] = useState<string>(externalText);
    const [internalError, setInternalError] = useState<string | null>(null);
    // Chuỗi gần nhất đã gửi lên cha — để phân biệt "cha phản hồi lại" với "cha đổi giá trị".
    const lastEmitted = useRef<string>(externalText);

    const validate = (str: string) => validateScoreText(str, { min, max, step, required });

    useEffect(() => {
      if (externalText !== lastEmitted.current) {
        lastEmitted.current = externalText;
        setText(externalText);
        setInternalError(externalText === "" ? null : validate(externalText).error);
      }
    }, [externalText]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setText(next);
      lastEmitted.current = next;
      const { parsed, error } = validate(next);
      setInternalError(error);
      onChange(parsed, next);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setInternalError(validate(text).error);
      onBlur?.(e);
    };

    const activeError = externalError !== undefined ? externalError : internalError;
    const hasError = Boolean(activeError);
    const errorId = id ? `${id}-error` : undefined;
    const showDirty = !hasError && isDirty;
    const showSaved = !hasError && !isDirty && isSaved;

    return (
      <div className={cn("flex min-w-0 flex-col items-end md:items-start", className)}>
        <div
          className={cn(
            "relative flex h-12 w-24 shrink-0 items-center rounded-control border",
            "transition-[border-color,box-shadow,background-color] duration-150 ease-out-soft",
            "focus-within:ring-4",
            disabled
              ? "cursor-not-allowed border-line bg-surface-2 opacity-70"
              : hasError
                ? "border-danger bg-danger-soft/50 focus-within:ring-danger/15"
                : "border-line-strong bg-surface hover:border-ink-3 focus-within:border-primary focus-within:ring-primary/15"
          )}
        >
          <input
            ref={ref}
            id={id}
            name={name}
            type="text"
            inputMode="decimal"
            enterKeyHint="next"
            autoComplete="off"
            spellCheck={false}
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            aria-label={studentName ? `Điểm mới của ${studentName}` : "Nhập điểm từ 0 đến 10"}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            className={cn(
              "size-full min-w-0 rounded-control bg-transparent px-2 text-center font-mono text-xl font-semibold tabular-nums outline-none",
              "placeholder:font-normal placeholder:text-ink-3",
              hasError ? "text-danger" : "text-ink",
              disabled && "cursor-not-allowed"
            )}
          />

          {showDirty && (
            <span
              className="pointer-events-none absolute -top-1 -right-1 size-2.5 rounded-full bg-warning ring-2 ring-surface"
              title="Chưa lưu"
            >
              <span className="sr-only">Chưa lưu</span>
            </span>
          )}
          {showSaved && (
            <span
              className="pointer-events-none absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-success text-on-solid ring-2 ring-surface"
              title="Đã lưu"
            >
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              <span className="sr-only">Đã lưu</span>
            </span>
          )}
        </div>

        {showInlineError && hasError && activeError && (
          <p
            id={errorId}
            aria-live="polite"
            className="mt-1.5 flex max-w-56 items-start gap-1.5 text-sm font-medium leading-snug text-danger"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{activeError}</span>
          </p>
        )}
      </div>
    );
  }
);

ScoreInput.displayName = "ScoreInput";
