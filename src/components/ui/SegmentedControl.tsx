import React, { useRef } from "react";
import { cn } from "../../lib/cn";
import { TONE_SOLID, Tone } from "./tone";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  /** Màu khi được chọn. Không có tone → nền surface nổi. */
  tone?: Tone;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  /** Ẩn nhãn chữ (chỉ còn icon) dưới breakpoint này; vẫn giữ aria-label */
  hideLabelsBelow?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "min-h-9 px-3 text-sm gap-1.5 [&_svg]:size-4",
  md: "min-h-11 px-3.5 text-sm gap-2 [&_svg]:size-[1.125rem]",
  lg: "min-h-13 px-4 text-base gap-2 [&_svg]:size-5",
};

/**
 * Nhóm lựa chọn 1-chạm (03 §4.11): Loại điểm, Kỳ học, trạng thái điểm danh trên tablet.
 * role="radiogroup", phím ←/→/Home/End để di chuyển.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  size = "md",
  fullWidth = false,
  hideLabelsBelow,
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusAndSelect = (index: number) => {
    const enabled = options.map((o, i) => ({ o, i })).filter(({ o }) => !o.disabled);
    if (enabled.length === 0) return;
    const pos = enabled.findIndex(({ i }) => i === index);
    const target = enabled[(pos + enabled.length) % enabled.length];
    refs.current[target.i]?.focus();
    onChange(target.o.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const enabledIdx = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabledIdx.indexOf(index);
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = enabledIdx[(pos + 1) % enabledIdx.length];
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = enabledIdx[(pos - 1 + enabledIdx.length) % enabledIdx.length];
    if (event.key === "Home") next = enabledIdx[0];
    if (event.key === "End") next = enabledIdx[enabledIdx.length - 1];
    if (next !== null && next !== undefined) {
      event.preventDefault();
      focusAndSelect(next);
    }
  };

  const labelHidden =
    hideLabelsBelow === "sm" ? "sr-only sm:not-sr-only" : hideLabelsBelow === "md" ? "sr-only md:not-sr-only" : "";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn(
        "inline-flex items-stretch gap-1 rounded-full bg-surface-2 p-1",
        fullWidth && "flex w-full",
        disabled && "opacity-50",
        className
      )}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            tabIndex={selected ? 0 : -1}
            disabled={isDisabled}
            onClick={() => !selected && onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none",
              "transition-[background-color,color,box-shadow,transform] duration-200 ease-out-soft",
              "focus-visible:outline-3 focus-visible:outline-offset-1",
              fullWidth && "flex-1",
              sizeClasses[size],
              selected
                ? option.tone
                  ? cn(TONE_SOLID[option.tone], "shadow-xs")
                  : "bg-surface text-ink shadow-xs"
                : "text-ink-2 hover:bg-surface-3/70 hover:text-ink",
              isDisabled ? "cursor-not-allowed" : "active:scale-[0.96]"
            )}
          >
            {option.icon && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span className={labelHidden}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
