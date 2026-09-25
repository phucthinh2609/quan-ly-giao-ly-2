import React, { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export type InputType = "text" | "number" | "email" | "password" | "date" | "tel" | "url" | "search" | "time";
export type InputSize = "sm" | "md" | "lg" | "parent";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  type?: InputType;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange: (value: string) => void;
  // Optional convenience props
  id?: string;
  name?: string;
  size?: InputSize;
  className?: string;
  autoComplete?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Nhãn cho trình đọc màn hình khi không có label hiển thị */
  ariaLabel?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoFocus?: boolean;
}

// ----------------------------------------------------------------------------
// Class dùng chung cho Input / NumericInput / Select (03 §4.3)
// ----------------------------------------------------------------------------

/** Chiều cao + cỡ chữ theo size. md bám --control (thích ứng theo vai trò). */
export const FIELD_SIZE_CLASSES: Record<InputSize, string> = {
  sm: "h-11 px-3.5 text-base gap-2 [&_svg]:size-4",
  md: "h-(--control) min-h-12 px-4 text-base gap-2.5 [&_svg]:size-5",
  lg: "h-(--control-lg) min-h-13 px-4 text-base gap-2.5 [&_svg]:size-5",
  parent: "h-14 px-5 text-lg gap-3 [&_svg]:size-6",
};

export const FIELD_LABEL_CLASSES: Record<InputSize, string> = {
  sm: "text-sm font-medium text-ink-2 mb-1.5",
  md: "text-sm font-medium text-ink-2 mb-1.5",
  lg: "text-sm font-medium text-ink-2 mb-1.5",
  parent: "text-base font-semibold text-ink mb-2",
};

export function fieldStateClasses({
  hasError,
  disabled,
  readOnly,
}: {
  hasError: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}): string {
  if (disabled) return "bg-surface-2 border-line text-ink-3 cursor-not-allowed opacity-70";
  if (hasError) {
    return "bg-surface border-danger text-ink focus-within:ring-4 focus-within:ring-danger/15";
  }
  if (readOnly) return "bg-surface-2 border-line text-ink-2";
  return "bg-surface border-line-strong text-ink hover:border-ink-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15";
}

/** Nhãn trường nhập liệu: sentence case, dấu * màu danger khi bắt buộc. */
export const FieldLabel: React.FC<{
  htmlFor?: string;
  id?: string;
  size?: InputSize;
  required?: boolean;
  children: React.ReactNode;
}> = ({ htmlFor, id, size = "md", required, children }) => (
  <label htmlFor={htmlFor} id={id} className={cn("flex items-center gap-1", FIELD_LABEL_CLASSES[size])}>
    <span>{children}</span>
    {required && (
      <span className="font-semibold text-danger" aria-hidden="true">
        *
      </span>
    )}
  </label>
);

/** Thông báo lỗi (có icon) hoặc gợi ý bên dưới trường. */
export const FieldMessage: React.FC<{
  id?: string;
  error?: string | null;
  helperText?: React.ReactNode;
  size?: InputSize;
}> = ({ id, error, helperText, size = "md" }) => {
  if (error) {
    return (
      <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>
    );
  }
  if (helperText) {
    return (
      <p id={id} className={cn("mt-1.5 text-ink-3", size === "parent" ? "text-base" : "text-sm")}>
        {helperText}
      </p>
    );
  }
  return null;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      type = "text",
      disabled = false,
      readOnly = false,
      required = false,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onChange,
      id,
      name,
      size = "md",
      className = "",
      autoComplete,
      onBlur,
      onFocus,
      onKeyDown,
      ariaLabel,
      inputMode,
      maxLength,
      autoFocus,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const hasError = Boolean(error);

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
            FIELD_SIZE_CLASSES[size],
            fieldStateClasses({ hasError, disabled, readOnly })
          )}
        >
          {leftIcon && (
            <span
              className={cn("flex shrink-0 items-center justify-center", hasError ? "text-danger" : "text-ink-3")}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
            maxLength={maxLength}
            autoFocus={autoFocus}
            aria-label={label ? undefined : ariaLabel}
            aria-required={required || undefined}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={cn(
              "h-full w-full min-w-0 border-none bg-transparent p-0 outline-none",
              "text-inherit placeholder:text-ink-3 disabled:cursor-not-allowed",
              "[&::-webkit-calendar-picker-indicator]:opacity-70"
            )}
          />

          {rightIcon && (
            <span className="flex shrink-0 items-center justify-center text-ink-3" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        <FieldMessage id={hasError ? errorId : helperId} error={error} helperText={helperText} size={size} />
      </div>
    );
  }
);

Input.displayName = "Input";
