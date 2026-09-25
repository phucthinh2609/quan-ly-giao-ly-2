import React, { useEffect, useRef, useId } from "react";
import { AlertCircle, Check, Minus } from "lucide-react";
import { cn } from "../../lib/cn";

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  onChange: (checked: boolean) => void;
  /** Nhãn cho trình đọc màn hình khi không có label hiển thị (VD ô chọn trong bảng) */
  ariaLabel?: string;
}

/**
 * Checkbox (03 §4.4): hộp size-5 bo rounded-xs, checked nền primary.
 * Cả dòng nhãn là vùng chạm >= 44px.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  error,
  id,
  name,
  className = "",
  onChange,
  ariaLabel,
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const errorId = `${checkboxId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ thuộc tính indeterminate trên input thật
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate && !checked);
    }
  }, [indeterminate, checked]);

  const isChecked = checked && !indeterminate;
  const isIndeterminate = indeterminate && !checked;
  const isOn = isChecked || isIndeterminate;
  const hasError = Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <div className={cn("inline-flex flex-col", className)}>
      <label
        htmlFor={checkboxId}
        className={cn(
          "group inline-flex min-h-11 items-start gap-3 py-2.5 select-none",
          !label && !description && "min-w-11 justify-center",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
      >
        <input
          ref={inputRef}
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className="peer sr-only"
        />

        {/* Hộp hiển thị (sibling ngay sau input để nhận peer-focus-visible) */}
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-xs border-2 text-on-primary",
            "transition-[background-color,border-color,box-shadow] duration-150 ease-out-soft",
            "peer-focus-visible:ring-4 peer-focus-visible:ring-primary/25",
            isOn
              ? "border-primary bg-primary"
              : cn("bg-surface", hasError ? "border-danger" : "border-ink-3", !disabled && "group-hover:border-ink-2"),
            disabled && !isOn && "border-line-strong bg-surface-2"
          )}
        >
          {isIndeterminate ? (
            <Minus className="size-3.5" strokeWidth={3} />
          ) : (
            <Check
              className={cn(
                "size-3.5 transition-transform duration-150 ease-spring",
                isChecked ? "scale-100" : "scale-0"
              )}
              strokeWidth={3}
            />
          )}
        </span>

        {(label || description) && (
          <span className="flex min-w-0 flex-col">
            {label && (
              <span className={cn("text-base font-medium leading-snug", disabled ? "text-ink-3" : "text-ink")}>
                {label}
              </span>
            )}
            {description && <span className="mt-0.5 text-sm leading-normal text-ink-3">{description}</span>}
          </span>
        )}
      </label>

      {hasError && (
        <p id={errorId} role="alert" className="-mt-1 ml-8 flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
