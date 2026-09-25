import React, { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps {
  name?: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  id?: string;
  className?: string;
  onChange: (value: string) => void;
}

/**
 * Radio (03 §4.4): vòng tròn size-5, checked nền primary + chấm on-primary.
 * Cả dòng nhãn là vùng chạm >= 44px.
 */
export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked,
  disabled = false,
  label,
  description,
  id,
  className = "",
  onChange,
}) => {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label
      htmlFor={radioId}
      className={cn(
        "group inline-flex min-h-11 items-start gap-3 py-2.5 select-none",
        !label && !description && "min-w-11 justify-center",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <input
        id={radioId}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => !disabled && onChange(value)}
        className="peer sr-only"
      />

      {/* Vòng tròn hiển thị (sibling ngay sau input để nhận peer-focus-visible) */}
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          "transition-[background-color,border-color,box-shadow] duration-150 ease-out-soft",
          "peer-focus-visible:ring-4 peer-focus-visible:ring-primary/25",
          checked
            ? "border-primary bg-primary"
            : cn("bg-surface", disabled ? "border-line-strong bg-surface-2" : "border-ink-3 group-hover:border-ink-2")
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full bg-on-primary transition-transform duration-150 ease-spring",
            checked ? "scale-100" : "scale-0"
          )}
        />
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
  );
};

export interface RadioGroupProps {
  name: string;
  label?: string;
  value: string;
  options: RadioOption[];
  disabled?: boolean;
  error?: string;
  helperText?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
  onChange: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  value,
  options,
  disabled = false,
  error,
  helperText,
  orientation = "vertical",
  className = "",
  onChange,
}) => {
  const messageId = useId();

  return (
    <fieldset
      className={cn("flex min-w-0 flex-col", className)}
      aria-invalid={Boolean(error)}
      aria-describedby={error || helperText ? messageId : undefined}
    >
      {label && <legend className="mb-1 text-sm font-medium text-ink-2">{label}</legend>}

      <div className={cn("flex", orientation === "horizontal" ? "flex-row flex-wrap gap-x-6" : "flex-col")}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={disabled || opt.disabled}
            label={opt.label}
            description={opt.description}
            onChange={onChange}
          />
        ))}
      </div>

      {error ? (
        <p id={messageId} role="alert" className="mt-1 flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={messageId} className="mt-1 text-sm text-ink-3">
          {helperText}
        </p>
      ) : null}
    </fieldset>
  );
};
